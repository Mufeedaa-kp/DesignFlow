import { useParams, Link } from "react-router-dom";
import { useMyClientById } from "../../hooks/useDesignerClients";
import { useMyAssignedProjects} from "../../../projects/hooks/useProjects";
import type {IProjectSourceRequest} from "../../../projects/types/project.types"
import { ROOM_TYPES } from "../../../projectRequests/constants/projectRequest.constants";

const findLabel = (list: readonly { value: string; label: string }[], value?: string) =>
  list.find((i) => i.value === value)?.label ?? value ?? "—";

const getProjectName = (sourceRequest: IProjectSourceRequest | string | undefined, fallbackId: string) => {
  if (!sourceRequest || typeof sourceRequest === "string") return `Project ${fallbackId.slice(-6)}`;
  const { roomType, customRoomType } = sourceRequest.roomInfo ?? {};
  if (roomType === "other" && customRoomType) return customRoomType;
  return roomType ? findLabel(ROOM_TYPES, roomType) : `Project ${fallbackId.slice(-6)}`;
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2.5 border-b border-border last:border-0">
    <span className="text-xs text-muted uppercase tracking-wide">{label}</span>
    <span className="text-sm text-charcoal text-right">{value || "—"}</span>
  </div>
);

const statusStyles: Record<string, string> = {
  planning: "bg-amber/15 text-amber",
  in_progress: "bg-clay/15 text-clay",
  completed: "bg-emerald-500/15 text-emerald-600",
};

const DesignerClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading, isError } = useMyClientById(id);

  // Reuses the designer's assigned-projects list rather than a new endpoint —
  // filters client-side for the projects belonging to this client.
  const { data: assignedProjects, isLoading: projectsLoading } = useMyAssignedProjects();
  const clientProjects = assignedProjects?.filter((p) => {
    const projectClient = typeof p.client === "string" ? p.client : p.client?._id;
    return projectClient === id;
  });

  if (isLoading) return <p className="text-sm text-muted">Loading client...</p>;
  if (isError || !client) return <p className="text-sm text-ember">Couldn't load this client.</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/designer/clients"
        className="text-sm text-muted hover:text-charcoal transition-colors mb-4 inline-block"
      >
        ← Back to Clients
      </Link>

      <p className="font-serif font-bold text-3xl text-charcoal mb-8">{client.fullName}</p>

      <div className="bg-cream border border-border rounded-lg p-8 mb-6">
        <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">Profile</p>
        <Row label="Name" value={client.fullName} />
        <Row label="Email" value={client.email} />
        <Row label="Phone" value={client.phone ?? "—"} />
        <Row
          label="Client Since"
          value={client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "—"}
        />
      </div>

      <div className="bg-cream border border-border rounded-lg p-8">
        <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
          Projects with you {clientProjects ? `(${clientProjects.length})` : ""}
        </p>

        {projectsLoading && <p className="text-sm text-muted">Loading projects...</p>}

        {!projectsLoading && (!clientProjects || clientProjects.length === 0) && (
          <p className="text-sm text-muted">No projects with this client yet.</p>
        )}

        {!projectsLoading && clientProjects && clientProjects.length > 0 && (
          <div className="space-y-2">
            {clientProjects.map((project) => (
              <Link
                key={project._id}
                to={`/designer/projects/${project._id}`}
                className="flex items-center justify-between py-2.5 border-b border-border last:border-0 hover:opacity-80"
              >
                <span className="text-sm text-charcoal">
                  {getProjectName(project.sourceRequest, project._id)}
                </span>
                <span
                  className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${
                    statusStyles[project.status] ?? "bg-panel text-muted"
                  }`}
                >
                  {project.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignerClientDetail;