import { useState } from "react";
import { Link } from "react-router-dom";
import { useAllUsers, useCreateUser, useDeleteUser, useUpdateUserStatus } from "../../hooks/useUsers";
import { ROLES, USER_STATUSES } from "../../constants/user.constants";
import type { IUserResponse } from "../../schema/user.schema";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useSearch } from "../../../../shared/context/SearchContext";




const findLabel = (list: readonly { value: string; label: string }[], value?: string) =>
  list.find((i) => i.value === value)?.label ?? value ?? "—";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-600",
  inactive: "bg-panel text-muted",
  blocked: "bg-ember/15 text-ember",
};

const roleFilters = ["all", "admin", "designer", "client"] as const;

const emptyForm = { fullName: "", email: "", password: "", role: "designer" as "admin" | "designer", phone: "" };

const AdminUsersList = () => {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<(typeof roleFilters)[number]>("all");
  const { data, isLoading, isError } = useAllUsers(page, roleFilter === "all" ? undefined : roleFilter);
  const createMutation = useCreateUser();
  const deleteMutation = useDeleteUser();
  const updateStatusMutation = useUpdateUserStatus();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [actingOnId, setActingOnId] = useState<string | null>(null);

  const users = data?.users ?? [];

  const { searchQuery } = useSearch();

const filteredUsers = users.filter((u) => {
  const q = searchQuery.toLowerCase();
  return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
});

  const handleRoleChange = (r: (typeof roleFilters)[number]) => {
    setRoleFilter(r);
    setPage(1);
  };

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(form);
      toast.success("User created");
      setForm(emptyForm);
      setShowForm(false);
    } catch (err: unknown) {
      toast.error(isAxiosError(err) ? err.response?.data?.message || "Failed to create user" : "Failed to create user");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setActingOnId(id);
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      toast.success("Status updated");
    } catch (err: unknown) {
      toast.error(isAxiosError(err) ? err.response?.data?.message || "Failed to update status" : "Failed to update status");
    } finally {
      setActingOnId(null);
    }
  };

  const handleBlock = async (user: IUserResponse) => {
    if (!window.confirm(`Block ${user.fullName}? They won't be able to log in.`)) return;
    handleStatusChange(user._id, "blocked");
  };

  const handleDelete = async (user: IUserResponse) => {
    if (!window.confirm(`Deactivate ${user.fullName}? They'll be marked inactive, not deleted.`)) return;
    setActingOnId(user._id);
    try {
      await deleteMutation.mutateAsync(user._id);
      toast.success("User deactivated");
    } catch (err: unknown) {
      toast.error(isAxiosError(err) ? err.response?.data?.message || "Failed to deactivate user" : "Failed to deactivate user");
    } finally {
      setActingOnId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="font-serif font-bold text-3xl text-charcoal">Users</p>
          <p className="text-sm text-muted mt-1">Manage admins, designers, and clients.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-clay hover:bg-ember transition-colors text-cream text-xs
                     uppercase tracking-wider font-semibold px-5 py-2.5 rounded-md w-fit"
        >
          {showForm ? "Cancel" : "+ Create User"}
        </button>
      </div>

      {showForm && (
        <div className="bg-cream border border-border rounded-lg p-6 mb-8 space-y-4">
          <p className="text-xs text-muted uppercase tracking-wide font-semibold">New Admin or Designer</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className="border border-border rounded-md px-3 py-2 text-sm bg-transparent"
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="border border-border rounded-md px-3 py-2 text-sm bg-transparent"
            />
            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="border border-border rounded-md px-3 py-2 text-sm bg-transparent"
            />
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "admin" | "designer" }))}
              className="border border-border rounded-md px-3 py-2 text-sm bg-transparent"
            >
              <option value="designer">Designer</option>
              <option value="admin">Admin</option>
            </select>
            <input
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="border border-border rounded-md px-3 py-2 text-sm bg-transparent sm:col-span-2"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={createMutation.isPending}
            className="bg-clay hover:bg-ember transition-colors text-cream text-xs
                       uppercase tracking-wider font-semibold px-5 py-2.5 rounded-md disabled:opacity-60"
          >
            {createMutation.isPending ? "Creating..." : "Create User"}
          </button>
        </div>
      )}

      <div className="flex items-center gap-6 border-b border-border mb-6 overflow-x-auto">
        {roleFilters.map((r) => (
          <button
            key={r}
            onClick={() => handleRoleChange(r)}
            className={`text-xs font-semibold uppercase tracking-wide pb-3 border-b-2 transition-colors whitespace-nowrap ${
              roleFilter === r ? "border-clay text-charcoal" : "border-transparent text-muted hover:text-charcoal"
            }`}
          >
            {r === "all" ? "All" : findLabel(ROLES, r)}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted">Loading users...</p>}
      {isError && <p className="text-sm text-ember">Couldn't load users.</p>}

      {!isLoading && !isError && (
        <>
          {/* Desktop / tablet table view */}
<div className="hidden md:block overflow-x-auto border border-border rounded-lg">
  <table className="w-full text-left border-collapse min-w-175">
    <thead>
      <tr className="border-b border-border bg-panel/30">
        <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold text-balance">Name</th>
        <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold text-balance">Email</th>
        <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold text-balance">Role</th>
        <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold text-center">Status</th>
        <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredUsers.map((user) => (
        <tr key={user._id} className="border-b border-border last:border-0 bg-cream">
          <td className="px-4 py-3 text-sm font-medium text-charcoal whitespace-nowrap text-balance">{user.fullName}</td>
          <td className="px-4 py-3 text-sm text-muted whitespace-nowrap text-balance">{user.email}</td>
          <td className="px-4 py-3 text-sm text-charcoal whitespace-nowrap text-balance">{findLabel(ROLES, user.role)}</td>
          <td className="px-4 py-3">
            <div className="flex justify-center">
              <select
                value={user.status}
                onChange={(e) => handleStatusChange(user._id, e.target.value)}
                disabled={actingOnId === user._id}
                className={`text-xs font-semibold uppercase tracking-wide text-center px-3 py-1.5 rounded-full
                            border-none cursor-pointer disabled:opacity-60 appearance-none
                            focus:outline-none focus:ring-2 focus:ring-amber/40 transition-all  ${
                  statusStyles[user.status] ?? "bg-panel text-muted"
                }`}
                style={{ textAlignLast: "center" }}
              >
                {USER_STATUSES.map((s) => (
                  <option key={s.value} value={s.value} className="text-charcoal bg-white">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center justify-center gap-2 whitespace-nowrap">
              <Link
                to={`/admin/users/${user._id}`}
                className="text-xs px-3 py-1.5 rounded-md bg-panel text-charcoal hover:bg-border transition-colors"
              >
                View
              </Link>
              <button
                onClick={() => handleBlock(user)}
                disabled={actingOnId === user._id || user.status === "blocked"}
                className="text-xs px-3 py-1.5 rounded-md bg-amber/15 text-amber hover:bg-amber/25
                           transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber/15"
              >
                Block
              </button>
              <button
                onClick={() => handleDelete(user)}
                disabled={actingOnId === user._id || user.status === "inactive"}
                className="text-xs px-3 py-1.5 rounded-md bg-ember/15 text-ember hover:bg-ember/25
                           transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ember/15"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Mobile stacked card view */}
<div className="md:hidden space-y-3">
  {filteredUsers.map((user) => (
    <div key={user._id} className="bg-cream border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-charcoal">{user.fullName}</p>
          <p className="text-xs text-muted break-all">{user.email}</p>
          <p className="text-xs text-muted mt-1">{findLabel(ROLES, user.role)}</p>
        </div>
        <select
          value={user.status}
          onChange={(e) => handleStatusChange(user._id, e.target.value)}
          disabled={actingOnId === user._id}
          className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1.5 rounded-full
                      border-none cursor-pointer disabled:opacity-60 shrink-0 ${
            statusStyles[user.status] ?? "bg-panel text-muted"
          }`}
        >
          {USER_STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="text-charcoal bg-white">
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Link
          to={`/admin/users/${user._id}`}
          className="flex-1 text-center text-xs px-3 py-2 rounded-md bg-panel text-charcoal hover:bg-border transition-colors"
        >
          View
        </Link>
        <button
          onClick={() => handleBlock(user)}
          disabled={actingOnId === user._id || user.status === "blocked"}
          className="flex-1 text-xs px-3 py-2 rounded-md bg-amber/15 text-amber hover:bg-amber/25
                     transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber/15"
        >
          Block
        </button>
        <button
          onClick={() => handleDelete(user)}
          disabled={actingOnId === user._id || user.status === "inactive"}
          className="flex-1 text-xs px-3 py-2 rounded-md bg-ember/15 text-ember hover:bg-ember/25
                     transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ember/15"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

          {filteredUsers.length === 0 && (
            <div className="border border-border rounded-lg p-12 text-center mt-4">
              <p className="text-sm text-muted">No users match this filter.</p>
            </div>
          )}

          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-sm text-muted hover:text-charcoal disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <p className="text-xs text-muted">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </p>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="text-sm text-muted hover:text-charcoal disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUsersList;