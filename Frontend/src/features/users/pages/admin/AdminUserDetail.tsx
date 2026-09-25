import { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useUserById, useUpdateUserProfile, useUpdateUserStatus } from "../../hooks/useUsers";
import { ROLES, USER_STATUSES } from "../../constants/user.constants";

const findLabel = (list: readonly { value: string; label: string }[], value?: string) =>
  list.find((i) => i.value === value)?.label ?? value ?? "—";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-600",
  inactive: "bg-panel text-muted",
  blocked: "bg-ember/15 text-ember",
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2.5 border-b border-border last:border-0">
    <span className="text-xs text-muted uppercase tracking-wide">{label}</span>
    <span className="text-sm text-charcoal text-right">{value || "—"}</span>
  </div>
);

const inputClass =
  "w-full bg-white border border-border rounded-md text-charcoal text-sm " +
  "px-3 py-2.5 focus:outline-none focus:border-amber transition-colors";
const labelClass = "block text-xs text-muted uppercase tracking-wide font-semibold mb-2";

const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { data: user, isLoading, isError } = useUserById(id);
  const updateProfile = useUpdateUserProfile();
  const updateStatus = useUpdateUserStatus();

  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "true");
  const [form, setForm] = useState({ fullName: "", phone: "" });

  if (isLoading) return <p className="text-sm text-muted">Loading user...</p>;
  if (isError || !user) return <p className="text-sm text-ember">Couldn't load this user.</p>;

  const startEdit = () => {
    setForm({ fullName: user.fullName, phone: user.phone ?? "" });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ id: user._id, values: form });
      toast.success("User updated");
      setIsEditing(false);
    } catch (err: unknown) {
      toast.error(isAxiosError(err) ? err.response?.data?.message || "Update failed" : "Update failed");
    }
  };

  const handleStatusChange = (status: string) => {
    updateStatus.mutate(
      { id: user._id, status },
      {
        onSuccess: () => toast.success("Status updated"),
        onError: () => toast.error("Couldn't update status"),
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/admin/users" className="text-sm text-muted hover:text-charcoal transition-colors mb-4 inline-block">
        ← Back to Users
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <p className="font-serif font-bold text-2xl sm:text-3xl text-charcoal">
          {isEditing ? "Edit User" : user.fullName}
        </p>
<div className="relative w-fit">
  <select
    value={user.status}
    onChange={(e) => handleStatusChange(e.target.value)}
    disabled={updateStatus.isPending}
    className={`appearance-none text-xs font-semibold uppercase tracking-wide
                pl-5 pr-10 py-2 rounded-full border-none cursor-pointer
                focus:outline-none disabled:opacity-60 [text-align-last:center]
                ${statusStyles[user.status] ?? "bg-panel text-muted"}`}
  >
    {USER_STATUSES.map((s) => (
      <option key={s.value} value={s.value}>{s.label}</option>
    ))}
  </select>
  <svg
    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
</div>a
      </div>

      <div className="bg-cream border border-border rounded-lg p-6 sm:p-8">
        {!isEditing ? (
          <>
            <Row label="Full Name" value={user.fullName} />
            <Row label="Email" value={user.email} />
            <Row label="Phone" value={user.phone ?? ""} />
            <Row label="Role" value={findLabel(ROLES, user.role)} />
            <Row label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />

            <button
              onClick={startEdit}
              className="mt-6 bg-clay hover:bg-ember transition-colors text-cream text-xs
                         uppercase tracking-wider font-semibold px-6 py-3 rounded-md"
            >
              Edit
            </button>
          </>
        ) : (
          <>
            <div className="mb-5">
              <label className={labelClass}>Full Name</label>
              <input
                className={inputClass}
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              />
            </div>
            <div className="mb-6">
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={updateProfile.isPending || !form.fullName.trim()}
                className="bg-clay hover:bg-ember transition-colors text-cream text-xs
                           uppercase tracking-wider font-semibold px-6 py-3 rounded-md disabled:opacity-60"
              >
                {updateProfile.isPending ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded-md
                           border border-border text-charcoal hover:bg-panel transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetail;