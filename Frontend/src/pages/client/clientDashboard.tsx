import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";

const ClientDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-3xl text-charcoal mb-1">
          Welcome back, {user?.fullName?.split(" ")[0]}!
        </h1>
        <p className="text-sm text-muted">
          Track your requests and see how your projects are coming along.
        </p>
        <button className="mt-4 bg-clay hover:bg-ember transition-colors text-cream
                           text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-md">
          + Submit a request
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pending Requests", value: "1" },
          { label: "Active Projects", value: "2" },
          { label: "Upcoming Meetings", value: "1" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <p className="font-serif font-bold text-3xl text-charcoal mb-1">{stat.value}</p>
            <p className="text-xs text-muted uppercase tracking-wide font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* My projects */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-bold text-xl text-charcoal">My projects</h2>
          <a href="#" className="text-xs text-amber underline underline-offset-2 font-medium">
            View all
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { title: "Living Room Refresh", designer: "Tom Alder", status: "In Progress", progress: 62 },
            { title: "Home Office Setup", designer: "Nina Cole", status: "Planning", progress: 15 },
          ].map((project) => (
            <div key={project.title} className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="h-32 bg-linear-to-br from-olive/15 to-clay/15" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-charcoal">{project.title}</p>
                  <span className="text-[10px] bg-amber/15 text-clay px-2 py-0.5 rounded-full uppercase tracking-wide font-semibold">
                    {project.status}
                  </span>
                </div>
                <p className="text-xs text-muted mb-3">Designer: {project.designer}</p>
                <div className="flex items-center justify-between text-xs text-muted mb-1">
                  <span>Progress</span>
                  <span className="text-charcoal font-medium">{project.progress}%</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-clay rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending request status */}
      <div>
        <h2 className="font-serif font-bold text-xl text-charcoal mb-4">Pending requests</h2>
        <div className="bg-white rounded-xl border border-border shadow-sm px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal">Guest Bedroom Refresh</p>
            <p className="text-xs text-muted">Submitted 1 day ago</p>
          </div>
          <span className="text-[10px] bg-amber/15 text-clay px-2 py-0.5 rounded-full uppercase tracking-wide font-semibold">
            Pending
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;