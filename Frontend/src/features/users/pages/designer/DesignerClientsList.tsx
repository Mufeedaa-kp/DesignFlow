import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyClients } from "../../hooks/useDesignerClients";
import { useSearch } from "../../../../shared/context/SearchContext";

const DesignerClientsList = () => {
  const [page, setPage] = useState(1);
  const { searchQuery } = useSearch();
  const { data, isLoading, isError } = useMyClients(page, searchQuery || undefined);

  const clients = data?.users ?? [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="font-serif font-bold text-3xl text-charcoal">My Clients</p>
        <p className="text-sm text-muted mt-1">Clients on your assigned projects.</p>
      </div>

      {isLoading && <p className="text-sm text-muted">Loading clients...</p>}
      {isError && <p className="text-sm text-ember">Couldn't load clients.</p>}

      {!isLoading && !isError && (
        <>
          <div className="hidden md:block overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-left border-collapse min-w-175">
              <thead>
                <tr className="border-b border-border bg-panel/30">
                  <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold">Name</th>
                  <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold">Email</th>
                  <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold">Phone</th>
                  <th className="px-4 py-3 text-xs text-muted uppercase tracking-wide font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id} className="border-b border-border last:border-0 bg-cream">
                    <td className="px-4 py-3 text-sm font-medium text-charcoal whitespace-nowrap">{client.fullName}</td>
                    <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">{client.email}</td>
                    <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">{client.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        to={`/designer/clients/${client._id}`}
                        className="text-xs px-3 py-1.5 rounded-md bg-panel text-charcoal hover:bg-border transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {clients.map((client) => (
              <div key={client._id} className="bg-cream border border-border rounded-lg p-4">
                <p className="text-sm font-medium text-charcoal">{client.fullName}</p>
                <p className="text-xs text-muted break-all">{client.email}</p>
                <p className="text-xs text-muted mt-1">{client.phone ?? "—"}</p>
                <Link
                  to={`/designer/clients/${client._id}`}
                  className="mt-3 block text-center text-xs px-3 py-2 rounded-md bg-panel text-charcoal hover:bg-border transition-colors"
                >
                  View
                </Link>
              </div>
            ))}
          </div>

          {clients.length === 0 && (
            <div className="border border-border rounded-lg p-12 text-center mt-4">
              <p className="text-sm text-muted">No clients yet.</p>
            </div>
          )}

          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="text-sm text-muted hover:text-charcoal disabled:opacity-40 transition-colors">
                ← Previous
              </button>
              <p className="text-xs text-muted">Page {data.pagination.page} of {data.pagination.totalPages}</p>
              <button onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="text-sm text-muted hover:text-charcoal disabled:opacity-40 transition-colors">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DesignerClientsList;