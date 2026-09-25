import { useAuth } from "../../auth/hooks/useAuth";
import { useMyAssignedProjects } from "../../projects/hooks/useProjects";
import { FiFolder, FiClock, FiCheckCircle } from "react-icons/fi";
import { PieChart, Pie, Cell } from "recharts";



const STATUS_COLORS: Record<string, string> = {
  planning: "#EDE6D8",
  in_progress: "#B98B4E",
  completed: "#8B5A2B",
}

const DesignerDashboard = () => {
  const { user } = useAuth();
  const { data: projects, isLoading } = useMyAssignedProjects();

  const total = projects?.length ?? 0;
  const planning = projects?.filter((p) => p.status === "planning").length ?? 0;
  const inProgress = projects?.filter((p) => p.status === "in_progress").length ?? 0;
  const completed = projects?.filter((p) => p.status === "completed").length ?? 0;

  const stats = [
    { label: "Total Assigned", value: String(total), icon: FiFolder },
    { label: "In Progress", value: String(inProgress), icon: FiClock },
    { label: "Completed", value: String(completed), icon: FiCheckCircle },
  ];

  const statusData = [
    { name: "Planning", value: planning, color: STATUS_COLORS.planning },
    { name: "In Progress", value: inProgress, color: STATUS_COLORS.in_progress },
    { name: "Completed", value: completed, color: STATUS_COLORS.completed },
  ].filter((s) => s.value > 0);

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-3xl text-charcoal mb-1">
          Good morning, {user?.fullName?.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted">Here's your studio today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <span className="w-9 h-9 rounded-lg bg-panel flex items-center justify-center text-clay mb-4">
              <stat.icon size={16} />
            </span>
            <p className="font-serif font-bold text-2xl text-charcoal mb-1">
              {isLoading ? "…" : stat.value}
            </p>
            <p className="text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border p-5 shadow-sm mb-8">
        <h2 className="font-serif font-bold text-lg text-charcoal mb-4">Your project status</h2>

        {isLoading && <p className="text-sm text-muted">Loading...</p>}
        {!isLoading && total === 0 && (
          <p className="text-sm text-muted">No projects assigned to you yet.</p>
        )}

        {!isLoading && total > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <PieChart width={140} height={140}>
              <Pie data={statusData} dataKey="value" innerRadius={40} outerRadius={65} stroke="none">
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="space-y-2">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted w-24">{s.name}</span>
                  <span className="text-charcoal font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </>
  );
};

export default DesignerDashboard;