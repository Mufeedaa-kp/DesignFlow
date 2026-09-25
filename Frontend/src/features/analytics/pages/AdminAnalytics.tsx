import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAnalyticsOverview } from "../hooks/useAnalytics";

const STATUS_COLORS: Record<string, string> = {
  planning: "#EDE6D8",
  in_progress: "#B98B4E",
  completed: "#8B5A2B",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "#8B5A2B",
  designer: "#B98B4E",
  client: "#D9C5A8",
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AdminAnalytics = () => {
  const { data, isLoading, isError } = useAnalyticsOverview();

  if (isLoading) return <p className="text-sm text-muted">Loading analytics...</p>;
  if (isError || !data) return <p className="text-sm text-ember">Couldn't load analytics.</p>;

  const { funnel, projectsByStatus, usersByRole, requestsPerMonth } = data;

  const trendData = requestsPerMonth.map((r) => ({
    month: MONTH_NAMES[r._id.month - 1],
    count: r.count,
  }));

  const statusChartData = projectsByStatus.map((p) => ({
    name: p._id.replace("_", " "),
    value: p.count,
    color: STATUS_COLORS[p._id] ?? "#D9C5A8",
  }));

  const roleChartData = usersByRole.map((u) => ({
    name: u._id,
    value: u.count,
    color: ROLE_COLORS[u._id] ?? "#D9C5A8",
  }));

  const funnelStats = [
    { label: "Total Requests", value: funnel.totalRequests },
    { label: "Pending", value: funnel.pendingRequests },
    { label: "Approved", value: funnel.approvedRequests },
    { label: "Rejected", value: funnel.rejectedRequests },
    { label: "Approval Rate", value: `${funnel.approvalRate}%` },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <p className="font-serif font-bold text-3xl text-charcoal mb-1">Analytics</p>
      <p className="text-sm text-muted mb-8">Studio performance at a glance.</p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {funnelStats.map((s) => (
          <div key={s.label} className="bg-cream border border-border rounded-xl p-5">
            <p className="font-serif font-bold text-2xl text-charcoal mb-1">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <div className="bg-cream border border-border rounded-xl p-5 min-w-0">
          <p className="font-serif font-bold text-lg text-charcoal mb-4">Requests over time</p>
          {trendData.length === 0 ? (
            <p className="text-sm text-muted">Not enough data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DECF" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8A7A6A" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8A7A6A" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, borderColor: "#E5DECF" }} />
                <Bar dataKey="count" fill="#8B5A2B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-cream border border-border rounded-xl p-5">
          <p className="font-serif font-bold text-lg text-charcoal mb-4">Projects by status</p>
          {statusChartData.length === 0 ? (
            <p className="text-sm text-muted">No projects yet.</p>
          ) : (
<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <PieChart width={140} height={140}>
                <Pie data={statusChartData} dataKey="value" innerRadius={40} outerRadius={65} stroke="none">
                  {statusChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="space-y-2">
                {statusChartData.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-xs capitalize">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-muted w-20">{s.name}</span>
                    <span className="text-charcoal font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-cream border border-border rounded-xl p-5">
        <p className="font-serif font-bold text-lg text-charcoal mb-4">Users by role</p>
        {roleChartData.length === 0 ? (
          <p className="text-sm text-muted">No users yet.</p>
        ) : (
<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <PieChart width={140} height={140}>
              <Pie data={roleChartData} dataKey="value" innerRadius={40} outerRadius={65} stroke="none">
                {roleChartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="space-y-2">
              {roleChartData.map((r) => (
                <div key={r.name} className="flex items-center gap-2 text-xs capitalize">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-muted w-20">{r.name}</span>
                  <span className="text-charcoal font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;