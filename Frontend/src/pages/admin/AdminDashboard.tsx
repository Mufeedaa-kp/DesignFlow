import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { FiUsers, FiAward, FiFolder, FiTrendingUp } from "react-icons/fi";
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const growthData = [
  { month: "Jan", value: 12 }, { month: "Feb", value: 18 }, { month: "Mar", value: 22 },
  { month: "Apr", value: 28 }, { month: "May", value: 24 }, { month: "Jun", value: 31 },
  { month: "Jul", value: 36 },
];

const revenueData = [
  { month: "Jan", value: 32 }, { month: "Feb", value: 48 }, { month: "Mar", value: 41 },
  { month: "Apr", value: 68 }, { month: "May", value: 58 }, { month: "Jun", value: 79 },
  { month: "Jul", value: 89 },
];

const activity = [
  { text: "New designer application — Sofia Delgado", time: "5 min ago", dot: "bg-amber" },
  { text: "Project completed — Casa Blanca Villa", time: "1 hour ago", dot: "bg-amber" },
  { text: "New client registration — James Thornton", time: "3 hours ago", dot: "bg-amber" },
  { text: "Quotation dispute — Meridian Penthouse", time: "1 day ago", dot: "bg-red-500" },
  { text: "Platform revenue hit monthly target ($89K)", time: "2 days ago", dot: "bg-green-600" },
];

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Total Users", value: "2,847", trend: "+124 this month", icon: FiUsers },
    { label: "Active Designers", value: "118", trend: "+14 this month", icon: FiAward },
    { label: "Total Projects", value: "1,204", trend: "+87 this month", icon: FiFolder },
    { label: "Platform Revenue", value: "$892K", trend: "+23%", icon: FiTrendingUp },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-3xl text-charcoal mb-1">Admin Dashboard</h1>
        <p className="text-sm text-muted">
          Welcome back, {user?.fullName?.split(" ")[0]}. Here's the platform overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <span className="w-9 h-9 rounded-lg bg-panel flex items-center justify-center text-clay">
                <stat.icon size={16} />
              </span>
              <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-full font-semibold">
                {stat.trend}
              </span>
            </div>
            <p className="font-serif font-bold text-2xl text-charcoal mb-1">{stat.value}</p>
            <p className="text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm overflow-x-auto">
          <h2 className="font-serif font-bold text-lg text-charcoal mb-4">Monthly growth</h2>
          <AreaChart width={480} height={220} data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DECF" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8A7A6A" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8A7A6A" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, borderColor: "#E5DECF" }} />
            <Area type="monotone" dataKey="value" stroke="#8B5A2B" fill="#8B5A2B" fillOpacity={0.12} strokeWidth={2} />
          </AreaChart>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm overflow-x-auto">
          <h2 className="font-serif font-bold text-lg text-charcoal mb-4">Revenue analytics</h2>
          <BarChart width={480} height={220} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DECF" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8A7A6A" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8A7A6A" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}k`} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, borderColor: "#E5DECF" }} formatter={(v) => [`$${v}k`, "Revenue"]} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {revenueData.map((entry, i) => (
                <Cell key={entry.month} fill={i === revenueData.length - 1 ? "#8B5A2B" : "#D9C5A8"} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>

      <div>
        <h2 className="font-serif font-bold text-xl text-charcoal mb-4">Recent platform activity</h2>
        <div className="bg-white rounded-xl border border-border shadow-sm divide-y divide-border">
          {activity.map((item) => (
            <div key={item.text} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                <p className="text-sm text-charcoal">{item.text}</p>
              </div>
              <p className="text-xs text-muted">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;