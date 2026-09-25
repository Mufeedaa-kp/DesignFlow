import { ProjectRequest } from "../projectRequests/projectRequest.model";
import { Project } from "../projects/project.model";
import { User } from "../users/user.model";

export const getAnalyticsOverview = async () => {
  const [
    totalRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    projectsByStatus,
    usersByRole,
    requestsPerMonth,
  ] = await Promise.all([
    ProjectRequest.countDocuments({}),
    ProjectRequest.countDocuments({ status: "pending" }),
    ProjectRequest.countDocuments({ status: "approved" }),
    ProjectRequest.countDocuments({ status: "rejected" }),
    Project.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    User.aggregate([
      { $match: { status: { $ne: "inactive" } } },
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]),
    ProjectRequest.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]),
  ]);

  const approvalRate = totalRequests > 0 ? Math.round((approvedRequests / totalRequests) * 100) : 0;

  return {
    funnel: { totalRequests, pendingRequests, approvedRequests, rejectedRequests, approvalRate },
    projectsByStatus,
    usersByRole,
    requestsPerMonth,
  };
};