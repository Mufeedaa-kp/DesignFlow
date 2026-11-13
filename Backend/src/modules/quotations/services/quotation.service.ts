import mongoose, { Types } from "mongoose";
import { Quotation } from "../models/quotation.model";
import { Project } from "../../projects/project.model";
import { ApiError } from "../../../utils/ApiError";
import { createNotificationService } from "../../notifications/notification.service";
import { User } from "../../users/user.model";

import {
  generateQuotationPdf,
  type PopulatedQuotation,
} from "../pdf/quotation.pdf";

interface IQuotationItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface ICreateQuotationInput {
  projectId: string;
  items: IQuotationItemInput[];
  discount?: number;
  tax?: number;
  notes?: string;
}

const uploadSignature = async (
  signature: string,
  folder: string
) => {
  const matches = signature.match(
    /^data:image\/(png|jpeg);base64,(.+)$/
  );

  if (!matches) {
    throw new ApiError(
      400,
      "Invalid signature format"
    );
  }

  const buffer = Buffer.from(
    matches[2],
    "base64"
  );

  if (!buffer.length) {
    throw new ApiError(
      400,
      "Invalid signature"
    );
  }

  const { uploadBufferToCloudinary } =
    await import(
      "../../../utils/cloudinary"
    );

  return uploadBufferToCloudinary(
    buffer,
    folder
  );
};

const calculateQuotation = (
  items: IQuotationItemInput[],
  discount = 0,
  tax = 0
) => {
  const calculatedItems = items.map((item) => ({
    description: item.description.trim(),
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: item.quantity * item.unitPrice,
  }));

  const subtotal = calculatedItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const total = subtotal - discount + tax;

  return {
    items: calculatedItems,
    subtotal,
    discount,
    tax,
    total,
  };
};

export const createQuotationService = async (
  designerId: string,
  data: ICreateQuotationInput
) => {
  const project = await Project.findById(
    data.projectId
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (!project.designer) {
    throw new ApiError(
      400,
      "No designer is assigned to this project"
    );
  }

  if (
    project.designer.toString() !== designerId
  ) {
    throw new ApiError(
      403,
      "You are not assigned to this project"
    );
  }

  if (project.designerStatus !== "accepted") {
    throw new ApiError(
      400,
      "Designer assignment must be accepted before creating a quotation"
    );
  }

  const existingQuotation =
    await Quotation.findOne({
      project: project._id,
    });

  if (existingQuotation) {
    throw new ApiError(
      409,
      "A quotation already exists for this project",
      "QUOTATION_EXISTS"
    );
  }

  if (!data.items.length) {
    throw new ApiError(
      400,
      "Quotation must contain at least one item"
    );
  }

  if (
    data.discount !== undefined &&
    data.discount < 0
  ) {
    throw new ApiError(
      400,
      "Discount cannot be negative"
    );
  }

  if (
    data.tax !== undefined &&
    data.tax < 0
  ) {
    throw new ApiError(
      400,
      "Tax cannot be negative"
    );
  }

  const quotationValues = calculateQuotation(
    data.items,
    data.discount ?? 0,
    data.tax ?? 0
  );

  if (quotationValues.total < 0) {
    throw new ApiError(
      400,
      "Quotation total cannot be negative"
    );
  }

  const quotation = await Quotation.create({
    project: project._id,
    client: project.client,
    designer: new Types.ObjectId(designerId),

    ...quotationValues,

    notes: data.notes?.trim(),

    status: "draft",
  });

  return quotation;
};

export const getQuotationByProjectService = async (
  projectId: string,
  userId: string,
  role: "admin" | "designer" | "client"
) => {
  const quotation = await Quotation.findOne({
    project: projectId,
  })
    .populate("client", "fullName email phone address")
    .populate("designer", "fullName email");

  if (!quotation) {
    throw new ApiError(404, "Quotation not found");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  if (
    role === "designer" &&
    quotation.designer._id.toString() !== userObjectId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to view this quotation"
    );
  }

  if (
    role === "client" &&
    quotation.client._id.toString() !== userObjectId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to view this quotation"
    );
  }

  return quotation;
};

export const getDesignerQuotationsService =
  async (designerId: string) => {
    const quotations = await Quotation.find({
      designer: new mongoose.Types.ObjectId(
        designerId
      ),
    })
      .populate(
        "client",
        "fullName email phone address"
      )
      .populate(
        "designer",
        "fullName email"
      )
      .populate(
        "project",
        "status designerStatus createdAt"
      )
      .sort({ createdAt: -1 });

    return quotations;
  };

export const updateQuotationService = async (
  quotationId: string,
  designerId: string,
  data: ICreateQuotationInput
) => {
  const quotation =
    await Quotation.findById(quotationId);

  if (!quotation) {
    throw new ApiError(
      404,
      "Quotation not found"
    );
  }

  if (
    quotation.designer.toString() !==
    designerId
  ) {
    throw new ApiError(
      403,
      "You are not allowed to update this quotation"
    );
  }

if (
  ![
    "draft",
    "admin_rejected",
    "client_rejected",
  ].includes(quotation.status)
) {
  throw new ApiError(
    400,
    "Only draft, admin-rejected, or client-rejected quotations can be edited"
  );
}

  if (!data.items.length) {
    throw new ApiError(
      400,
      "Quotation must contain at least one item"
    );
  }

  const quotationValues = calculateQuotation(
    data.items,
    data.discount ?? 0,
    data.tax ?? 0
  );

  if (quotationValues.total < 0) {
    throw new ApiError(
      400,
      "Quotation total cannot be negative"
    );
  }

  quotation.items = quotationValues.items;
  quotation.subtotal = quotationValues.subtotal;
  quotation.discount = quotationValues.discount;
  quotation.tax = quotationValues.tax;
  quotation.total = quotationValues.total;
  quotation.notes = data.notes?.trim();
  quotation.status = "draft";

  quotation.adminRejectionReason = null;
  quotation.clientRejectionReason = null;

  quotation.designerSignature = undefined;
  quotation.designerSignedAt = undefined;

  quotation.adminSignature = undefined;
  quotation.adminSignedAt = undefined;

  quotation.clientSignature = undefined;
  quotation.clientSignedAt = undefined;

await quotation.save();

  await quotation.save();

  return quotation;
};

export const submitQuotationForApprovalService =
  async (
    quotationId: string,
    designerId: string,
    signature: string
  ) => {
    const quotation =
      await Quotation.findById(quotationId);

    if (!quotation) {
      throw new ApiError(
        404,
        "Quotation not found"
      );
    }

    if (
      quotation.designer.toString() !==
      designerId
    ) {
      throw new ApiError(
        403,
        "You are not allowed to submit this quotation"
      );
    }

    if (
      ![
        "draft",
        "admin_rejected",
        "client_rejected",
      ].includes(quotation.status)
    ) {
      throw new ApiError(
        400,
        "Only draft, admin-rejected, or client-rejected quotations can be submitted"
      );
    }

    if (!signature) {
      throw new ApiError(
        400,
        "Designer signature is required"
      );
    }

    const signatureUrl =
      await uploadSignature(
        signature,
        "designflow/quotations/signatures/designer"
      );

    quotation.designerSignature =
      signatureUrl;

    quotation.designerSignedAt =
      new Date();

    quotation.status =
      "pending_admin_approval";

    await quotation.save();

    const admin = await User.findOne({
      role: "admin",
    }).select("_id");

    if (admin) {
      await createNotificationService({
        recipient: admin._id,
        type: "QUOTATION_SUBMITTED",
        title: "Quotation Submitted",
        message:
          "A designer has submitted a quotation for admin approval.",
        project: quotation.project,
        link: `/admin/projects/${quotation.project}/quotation`,
      });
    }

    return quotation;
  };

export const approveQuotationService =
  async (
    quotationId: string,
    adminSignature: string
  ) => {
    const quotation =
      await Quotation.findById(quotationId);

    if (!quotation) {
      throw new ApiError(
        404,
        "Quotation not found"
      );
    }

    if (
      quotation.status !==
      "pending_admin_approval"
    ) {
      throw new ApiError(
        400,
        "Only quotations awaiting admin approval can be approved"
      );
    }

    if (!adminSignature) {
      throw new ApiError(
        400,
        "Admin signature is required"
      );
    }

    const signatureUrl =
      await uploadSignature(
        adminSignature,
        "designflow/quotations/signatures/admin"
      );

    quotation.adminSignature =
      signatureUrl;

    quotation.adminSignedAt =
      new Date();

    quotation.status = "sent";

    await quotation.save();

    await createNotificationService({
      recipient: quotation.client,
      type: "QUOTATION_APPROVED",
      title: "Quotation Approved",
      message:
        "Your quotation has been approved and is now ready for review.",
      project: quotation.project,
      link: `/client/projects/${quotation.project}/quotation`,
    });

    return quotation;
  };

export const rejectQuotationService =
  async (
    quotationId: string,
    rejectionReason: string
  ) => {
    const quotation =
      await Quotation.findById(quotationId);

    if (!quotation) {
      throw new ApiError(
        404,
        "Quotation not found"
      );
    }

    if (
      quotation.status !==
      "pending_admin_approval"
    ) {
      throw new ApiError(
        400,
        "Only quotations awaiting admin approval can be rejected"
      );
    }

    const reason = rejectionReason.trim();

    if (!reason) {
      throw new ApiError(
        400,
        "Rejection reason is required"
      );
    }

   quotation.status = "admin_rejected";
quotation.adminRejectionReason = reason;

await quotation.save();

await createNotificationService({
  recipient: quotation.designer,
  type: "QUOTATION_ADMIN_REJECTED",
  title: "Quotation Rejected",
  message: `Your quotation has been rejected by the admin. Reason: ${reason}`,
  project: quotation.project,
  link: `/designer/projects/${quotation.project}/quotation`,
});

return quotation;
  };

export const acceptQuotationService =
  async (
    quotationId: string,
    clientId: string,
    clientSignature: string
  ) => {
    const quotation =
      await Quotation.findById(quotationId);

    if (!quotation) {
      throw new ApiError(
        404,
        "Quotation not found"
      );
    }

    if (
      quotation.client.toString() !==
      clientId
    ) {
      throw new ApiError(
        403,
        "You are not allowed to accept this quotation"
      );
    }

    if (quotation.status !== "sent") {
      throw new ApiError(
        400,
        "Only quotations sent to the client can be accepted"
      );
    }

    if (!clientSignature) {
      throw new ApiError(
        400,
        "Client signature is required"
      );
    }

    const signatureUrl =
      await uploadSignature(
        clientSignature,
        "designflow/quotations/signatures/client"
      );

    quotation.clientSignature =
      signatureUrl;

    quotation.clientSignedAt =
      new Date();

    quotation.status =
      "client_accepted";

    await quotation.save();

    await createNotificationService({
      recipient: quotation.designer,
      type: "QUOTATION_ACCEPTED",
      title: "Quotation Accepted",
      message:
        "The client has accepted your quotation.",
      project: quotation.project,
      link: `/designer/projects/${quotation.project}/quotation`,
    });

    return quotation;
  };


export const rejectQuotationByClientService =
  async (
    quotationId: string,
    clientId: string,
    rejectionReason: string
  ) => {
    const quotation =
      await Quotation.findById(quotationId);

    if (!quotation) {
      throw new ApiError(
        404,
        "Quotation not found"
      );
    }

    if (
      quotation.client.toString() !==
      clientId
    ) {
      throw new ApiError(
        403,
        "You are not allowed to reject this quotation"
      );
    }

    if (quotation.status !== "sent") {
      throw new ApiError(
        400,
        "Only quotations sent to the client can be rejected"
      );
    }

    const reason = rejectionReason.trim();

    if (!reason) {
      throw new ApiError(
        400,
        "Rejection reason is required"
      );
    }

   quotation.status =
  "client_rejected";

quotation.clientRejectionReason =
  reason;

await quotation.save();

await createNotificationService({
  recipient: quotation.designer,
  type: "QUOTATION_REJECTED",
  title: "Quotation Rejected",
  message: `The client has rejected your quotation. Reason: ${reason}`,
  project: quotation.project,
  link: `/designer/projects/${quotation.project}/quotation`,
});

return quotation;
  };


export const downloadQuotationService = async (
  quotationId: string,
  userId: string,
  role: "admin" | "designer" | "client"
) => {
  const quotation = await Quotation.findById(
    quotationId
  )
    .populate(
      "client",
      "fullName email phone address"
    )
    .populate(
      "designer",
      "fullName email"
    )
    .populate(
      "project",
      "projectName"
    );

  if (!quotation) {
    throw new ApiError(
      404,
      "Quotation not found"
    );
  }

  if (quotation.status !== "client_accepted") {
    throw new ApiError(
      400,
      "Quotation can only be downloaded after client approval"
    );
  }

  const userObjectId = new mongoose.Types.ObjectId(
    userId
  );

  if (
    role === "client" &&
    quotation.client._id.toString() !==
      userObjectId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to download this quotation"
    );
  }

  if (
    role === "designer" &&
    quotation.designer._id.toString() !==
      userObjectId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to download this quotation"
    );
  }

  const populatedQuotation =
    quotation.toObject() as unknown as PopulatedQuotation;

  const pdf = await generateQuotationPdf(
    populatedQuotation
  );

  return pdf;
};

