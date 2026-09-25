import { Response } from "express";

import {
  acceptQuotationService,
  approveQuotationService,
  createQuotationService,
  getDesignerQuotationsService,
  getQuotationByProjectService,
  rejectQuotationByClientService,
  rejectQuotationService,
  submitQuotationForApprovalService,
  updateQuotationService,
  downloadQuotationService
} from "../services/quotation.service";

import { ApiResponse } from "../../../utils/ApiResponse";
import { ApiError } from "../../../utils/ApiError";
import { AuthRequest } from "../../../middlewares/auth.middleware";

const getUserId = (req: AuthRequest) => {
  if (!req.user?.id) {
    throw new ApiError(
      401,
      "Authentication required"
    )
  }
  return req.user.id;
}

const getParamId = (
  value: string | string[] | undefined
): string => {
  if (!value || Array.isArray(value)) {
    throw new ApiError(
      400,
      "Invalid quotation ID"
    )
  }
  return value;
}

export const createQuotation = async (
  req: AuthRequest,
  res: Response
) => {
  const designerId = getUserId(req);

  const quotation =
    await createQuotationService(
      designerId,
      req.body
    );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Quotation created successfully",
        quotation
      )
    );
};

export const getQuotationByProject = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = getUserId(req);

  const role = req.user?.role;

  if (
    role !== "admin" &&
    role !== "designer" &&
    role !== "client"
  ) {
    throw new ApiError(
      403,
      "You are not allowed to view this quotation"
    );
  }

  const quotation =
    await getQuotationByProjectService(
      getParamId(req.params.projectId),
      userId,
      role
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Quotation fetched successfully",
        quotation
      )
    );
};


export const getDesignerQuotations = async (
  req: AuthRequest,
  res: Response
) => {
  const designerId = getUserId(req);

  const quotations =
    await getDesignerQuotationsService(
      designerId
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Designer quotations fetched successfully",
        quotations
      )
    );
};

export const updateQuotation = async (
  req: AuthRequest,
  res: Response
) => {
  const designerId = getUserId(req);

  const quotation =
    await updateQuotationService(
      getParamId(req.params.id),
      designerId,
      req.body
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Quotation updated successfully",
        quotation
      )
    );
};

export const submitQuotationForApproval =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const designerId = getUserId(req);

    const quotation =
      await submitQuotationForApprovalService(
        getParamId(req.params.id),
        designerId,
        req.body.signature
      );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Quotation submitted for admin approval",
          quotation
        )
      );
  };

export const approveQuotation = async (
  req: AuthRequest,
  res: Response
) => {
  const quotation =
    await approveQuotationService(
      getParamId(req.params.id),
      req.body.signature
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Quotation approved and sent to client",
        quotation
      )
    );
};

export const rejectQuotation = async (
  req: AuthRequest,
  res: Response
) => {
  const quotation =
    await rejectQuotationService(
      getParamId(req.params.id),
      req.body.rejectionReason
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Quotation rejected ",
        quotation
      )
    );
};

export const acceptQuotation = async (
  req: AuthRequest,
  res: Response
) => {
  const clientId = getUserId(req);

  const quotation =
    await acceptQuotationService(
      getParamId(req.params.id),
      clientId,
      req.body.signature
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Quotation accepted",
        quotation
      )
    );
};

export const rejectQuotationByClient =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    const clientId = getUserId(req);

    const quotation =
      await rejectQuotationByClientService(
        getParamId(req.params.id),
        clientId,
        req.body.rejectionReason
      );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Quotation rejected ",
          quotation
        )
      );
  };

  export const downloadQuotation = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = getUserId(req);

  const role = req.user?.role;

  if (
    role !== "admin" &&
    role !== "designer" &&
    role !== "client"
  ) {
    throw new ApiError(
      403,
      "You are not allowed to download this quotation"
    );
  }

  const pdf = await downloadQuotationService(
    getParamId(req.params.id),
    userId,
    role
  );

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="quotation-${req.params.id}.pdf"`
  );

  return res.status(200).send(pdf);
};