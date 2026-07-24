import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { FiFolder, FiDollarSign, FiClock, FiStar } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { month: "Jan", value: 42 }, { month: "Feb", value: 55 }, { month: "Mar", value: 48 },
  { month: "Apr", value: 71 }, { month: "May", value: 63 }, { month: "Jun", value: 82 },
  { month: "Jul", value: 89 },
];

const statusData = [
  { name: "Active", value: 42, color: "#8B5A2B" },
  { name: "Completed", value: 31, color: "#B98B4E" },
  { name: "On Hold", value: 12, color: "#D9C5A8" },
  { name: "Planning", value: 15, color: "#EDE6D8" },
];

const todaysFocus = [
  { title: "3D render — living room", client: "Cliffside Villa", priority: "High" },
  { title: "Client walkthrough prep", client: "Harbor Penthouse", priority: "Medium" },
  { title: "Order Milano dining table", client: "Nordic Family Home", priority: "High" },
];

const upcomingMeetings = [
  { title: "Initial Brief", client: "Sarah Chen", time: "Today, 3:00 PM" },
  { title: "Phase 2 Review", client: "Alex Rivers", time: "Jul 18, 10:00 AM" },
  { title: "Material Selection", client: "Marcus Williams", time: "Jul 20, 2:00 PM" },
];

const priorityStyles: Record<string, string> = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-amber/15 text-clay",
  Low: "bg-green-50 text-green-700",
};

const DesignerDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Active Projects", value: "12", icon: FiFolder },
    { label: "Monthly Revenue", value: "$24,800", icon: FiDollarSign },
    { label: "Pending Tasks", value: "8", icon: FiClock },
    { label: "Client Rating", value: "4.9", icon: FiStar },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-3xl text-charcoal mb-1">
          Good morning, {user?.fullName?.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted">Here's your studio today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <span className="w-9 h-9 rounded-lg bg-panel flex items-center justify-center text-clay mb-4">
              <stat.icon size={16} />
            </span>
            <p className="font-serif font-bold text-2xl text-charcoal mb-1">{stat.value}</p>
            <p className="text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm overflow-x-auto">
          <h2 className="font-serif font-bold text-lg text-charcoal mb-4">Revenue overview</h2>
          <BarChart width={480} height={220} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DECF" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8A7A6A" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8A7A6A" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}k`} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, borderColor: "#E5DECF" }} formatter={(v) => [`$${v}k`, "Revenue"]} />
            <Bar dataKey="value" fill="#8B5A2B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-serif font-bold text-lg text-charcoal mb-4">Project status</h2>
          <div className="flex items-center gap-6">
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
                  <span className="text-muted w-20">{s.name}</span>
                  <span className="text-charcoal font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <h2 className="font-serif font-bold text-lg text-charcoal mb-4">Today's focus</h2>
          <div className="space-y-3">
            {todaysFocus.map((task) => (
              <div key={task.title} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                  <div>
                    <p className="text-sm text-charcoal font-medium">{task.title}</p>
                    <p className="text-xs text-muted">{task.client}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${priorityStyles[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <h2 className="font-serif font-bold text-lg text-charcoal mb-4">Upcoming meetings</h2>
          <div className="space-y-3">
            {upcomingMeetings.map((m) => (
              <div key={m.title} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-panel flex items-center justify-center text-clay text-xs font-semibold shrink-0">
                  {m.time.split(",")[0].slice(0, 3)}
                </span>
                <div>
                  <p className="text-sm text-charcoal font-medium">{m.title} — {m.client}</p>
                  <p className="text-xs text-muted">{m.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DesignerDashboard;