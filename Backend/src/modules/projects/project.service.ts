import { Project } from "./project.model"
import { ApiError } from "../../utils/ApiError"
import { User } from "../users/user.model";
import { createNotificationService } from "../notifications/notification.service";

export const getMyProjects = async (clientId: string) => {
  const projects = await Project.find({ client: clientId })
    .populate({
      path: "sourceRequest",
      populate: [
        {
          path: "catalogItem",
        },
        {
          path: "category",
        },
      ],
    })
    .populate("designer", "fullName email")
    .sort({ createdAt: -1 });

  return projects;
};

export const getAllProjects = async (
  page: number,
  limit: number,
  status?: string,
  sort: "newest" | "oldest" = "newest",
  dateRange?: string
) => {
  const filter: Record<string, unknown> = {}
  if (status) filter.status = status;

  if (dateRange && dateRange !== "all") {
    const now = new Date();
    let start: Date | undefined;
    let end: Date | undefined;

    if (dateRange === "this_month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    } else if (dateRange === "last_month") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      end = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (dateRange === "this_year") {
      start = new Date(now.getFullYear(), 0, 1)
      end = new Date(now.getFullYear() + 1, 0, 1)
    }

    if (start && end) {
      filter.createdAt = { $gte: start, $lt: end }
    }
  }

  const skip = (page - 1) * limit;
  const sortOrder = sort === "oldest" ? 1 : -1

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("sourceRequest")
      .populate("client", "fullName email")
      .populate("designer", "fullName email")
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit),
    Project.countDocuments(filter),
  ]);

  return {
    projects,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const getProjectById = async (
  id: string,
  requestingUser: { id: string; role: string }
) => {
  const ownerCheck = await Project.findById(id);

  if (!ownerCheck) {
    throw new ApiError(404, "Project not found");
  }

  if (requestingUser.role === "designer") {
    if (
      !ownerCheck.designer ||
      ownerCheck.designer.toString() !== requestingUser.id
    ) {
      throw new ApiError(
        403,
        "You are not assigned to this project"
      );
    }
  }

  if (requestingUser.role === "client") {
    if (
      ownerCheck.client.toString() !== requestingUser.id
    ) {
      throw new ApiError(
        403,
        "You are not allowed to view this project"
      );
    }
  }

  const project = await Project.findById(id)
    .populate({
  path: "sourceRequest",
  populate: [
    {
      path: "catalogItem",
    },
    {
      path: "category",
    },
  ],
})
    .populate("client", "fullName email")
    .populate("designer", "fullName email");

  return project;
};


const PROJECT_STATUS_ORDER = [
  "planning",
  "in_progress",
  "completed",
] as const;

export const updateProjectStatus = async (
  projectId: string,
  status: "planning" | "in_progress" | "completed",
  requestingUser: { id: string; role: string }
) => {
  const project = await Project.findById(projectId).populate(
    "sourceRequest",
    "projectName"
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (requestingUser.role === "designer") {
    const isAssignedDesigner =
      project.designer?.toString() === requestingUser.id;

    if (!isAssignedDesigner) {
      throw new ApiError(
        403,
        "You are not assigned to this project"
      );
    }

    if (project.designerStatus !== "accepted") {
      throw new ApiError(
        403,
        "Accept this assignment before updating its status"
      );
    }
  }

  const currentIndex = PROJECT_STATUS_ORDER.indexOf(
    project.status
  );

  const nextIndex = PROJECT_STATUS_ORDER.indexOf(status);

  if (nextIndex < currentIndex) {
    throw new ApiError(
      400,
      "Project status cannot move backward"
    );
  }

  
  if (project.status === status) {
    return project;
  }

  project.status = status;
  await project.save();

  const statusLabels: Record<
    "planning" | "in_progress" | "completed",
    string
  > = {
    planning: "Planning",
    in_progress: "In Progress",
    completed: "Completed",
  };

  const sourceRequest = project.sourceRequest as {
    projectName?: string;
  };

  const projectName =
    sourceRequest?.projectName || "your project";

  await createNotificationService({
    recipient: project.client,
    type: "PROJECT_STATUS_UPDATED",
    title: "Project Status Updated",
    message: `Your project "${projectName}" is now ${statusLabels[status]}.`,
    project: project._id,
    link: `/client/projects/${project._id}`,
  });

  return project;
};

export const assignDesigner = async (projectId: string, designerId: string) => {
  const existingProject = await Project.findById(projectId);
  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }
  if (existingProject.designerStatus === "accepted") {
    throw new ApiError(400, "This project's designer has already accepted — cannot reassign");
  }

  const designer = await User.findById(designerId);
  if (!designer || designer.role !== "designer") {
    throw new ApiError(400, "Selected user is not a valid designer");
  }
  if (designer.status !== "active") {
    throw new ApiError(400, "Selected designer is not active");
  }

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      designer: designerId,
      designerStatus: "pending",
      designerRejectionReason: null,
    },
    { new: true }
  )
    .populate("sourceRequest")
    .populate("client", "fullName email")
    .populate("designer", "fullName email");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await createNotificationService({
    recipient:designerId,
    type: "DESIGNER_ASSIGNED",
    title:"New Project Assigned",
    message:"You have been assigned to project",
    project:project._id,
    link: `/designer/projects/${project._id}`,
  })
  return project;
}

export const acceptAssignment = async (projectId: string, designerId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  if (!project.designer || project.designer.toString() !== designerId) {
    throw new ApiError(403, "This project is not assigned to you");
  }
  if (project.designerStatus !== "pending") {
    throw new ApiError(400, "No pending assignment to accept");
  }

  project.designerStatus = "accepted";
  await project.save();

  const admin = await User.findOne({
    role: "admin",
  }).select("_id");

  if (admin) {
    await createNotificationService({
      recipient: admin._id,
      type: "DESIGNER_ASSIGNMENT_ACCEPTED",
      title: "Designer Accepted Assignment",
      message: "The assigned designer has accepted the project assignment.",
      project: project._id,
      link: `/admin/projects/${project._id}`,
    });
  }

  return project.populate([
    { path: "sourceRequest" },
    { path: "client", select: "fullName email" },
    { path: "designer", select: "fullName email" },
  ]);
};

export const rejectAssignment = async (
  projectId: string,
  designerId: string,
  reason: string
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  if (!project.designer || project.designer.toString() !== designerId) {
    throw new ApiError(403, "This project is not assigned to you");
  }
  if (project.designerStatus !== "pending") {
    throw new ApiError(400, "No pending assignment to reject");
  }

  project.designerStatus = "rejected";
  project.designerRejectionReason = reason.trim();
  await project.save();

  const admin = await User.findOne({
    role: "admin",
  }).select("_id");

  if (admin) {
    await createNotificationService({
      recipient: admin._id,
      type: "DESIGNER_ASSIGNMENT_REJECTED",
      title: "Designer Rejected Assignment",
      message: "The assigned designer has rejected the project assignment.",
      project: project._id,
      link: `/admin/projects/${project._id}`,
    });
  }

  return project.populate([
    { path: "sourceRequest" },
    { path: "client", select: "fullName email" },
    { path: "designer", select: "fullName email" },
  ]);
};

export const getProjectsByDesigner = async (designerId: string) => {
  const projects = await Project.find({ designer: designerId })
    .populate("sourceRequest")
    .populate("client", "fullName email")
    .sort({ createdAt: -1 });
  return projects;
};