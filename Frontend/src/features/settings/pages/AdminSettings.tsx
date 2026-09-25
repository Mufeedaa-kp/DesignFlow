import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../../services/api";
import { useAuth } from "../../auth/hooks/useAuth";
import { useStudioSettings, useUpdateStudioSettings } from "../hooks/useSettings";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

const AdminSettings = () => {
  const { user,login,token } = useAuth();
  const { data: settings, isLoading: settingsLoading } = useStudioSettings();
  const updateSettingsMutation = useUpdateStudioSettings();

  const [accountForm, setAccountForm] = useState({
    fullName: user?.fullName ?? "",
    phone: "",
  });

  const [studioForm, setStudioForm] = useState({
    businessName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    businessHours: "",
  });
  const [studioFormInitialized, setStudioFormInitialized] = useState(false);

  // Populate the studio form oance, the first time settings finish loading.
  // (Setting state during render like this is intentional here — it's the
  // React-recommended pattern for "initialize local state from data once it
  // arrives," and the studioFormInitialized guard ensures it only fires once.)
  if (settings && !studioFormInitialized) {
    setStudioForm({
      businessName: settings.businessName ?? "",
      contactEmail: settings.contactEmail ?? "",
      contactPhone: settings.contactPhone ?? "",
      address: settings.address ?? "",
      businessHours: settings.businessHours ?? "",
    });
    setStudioFormInitialized(true);
  }

const updateAccountMutation = useMutation({
  mutationFn: async () => {
    const res = await api.patch(`/users/${user?.id}`, accountForm);
    return res.data.data;
  },
  onSuccess: (updatedUser) => {
    if (user && token) {
      login(
        { ...user, fullName: updatedUser.fullName },
        token
      );
    }
    toast.success("Account updated");
  },
  onError: (err) =>
    toast.error(isAxiosError(err) ? err.response?.data?.message || "Update failed" : "Update failed"),
});

  const handleStudioSave = () => {
    updateSettingsMutation.mutate(studioForm, {
      onSuccess: () => toast.success("Studio info updated"),
      onError: (err) =>
        toast.error(isAxiosError(err) ? err.response?.data?.message || "Update failed" : "Update failed"),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <p className="font-serif font-bold text-3xl text-charcoal mb-1">Settings</p>
        <p className="text-sm text-muted">Manage your account and studio information.</p>
      </div>

      <div className="bg-cream border border-border rounded-lg p-6 space-y-4">
        <p className="text-xs text-muted uppercase tracking-wide font-semibold">My Account</p>

        <div>
          <label className="text-xs text-muted uppercase tracking-wide">Full Name</label>
          <input
            value={accountForm.fullName}
            onChange={(e) => setAccountForm((f) => ({ ...f, fullName: e.target.value }))}
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-transparent mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-muted uppercase tracking-wide">Phone</label>
          <input
            value={accountForm.phone}
            onChange={(e) => setAccountForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-transparent mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-muted uppercase tracking-wide">Email</label>
          <input
            value={user?.email ?? ""}
            disabled
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-panel text-muted mt-1"
          />
        </div>

        <button
          onClick={() => updateAccountMutation.mutate()}
          disabled={updateAccountMutation.isPending}
          className="bg-clay hover:bg-ember transition-colors text-cream text-xs
                     uppercase tracking-wider font-semibold px-5 py-2.5 rounded-md disabled:opacity-60"
        >
          {updateAccountMutation.isPending ? "Saving..." : "Save Account"}
        </button>
      </div>

      <div className="bg-cream border border-border rounded-lg p-6 space-y-4">
        <p className="text-xs text-muted uppercase tracking-wide font-semibold">Studio Info</p>

        {settingsLoading ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : (
          <>
            <div>
              <label className="text-xs text-muted uppercase tracking-wide">Business Name</label>
              <input
                value={studioForm.businessName}
                onChange={(e) => setStudioForm((f) => ({ ...f, businessName: e.target.value }))}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-transparent mt-1"
              />
            </div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <label className="text-xs text-muted uppercase tracking-wide">Contact Email</label>
                <input
                  value={studioForm.contactEmail}
                  onChange={(e) => setStudioForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-transparent mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted uppercase tracking-wide">Contact Phone</label>
                <input
                  value={studioForm.contactPhone}
                  onChange={(e) => setStudioForm((f) => ({ ...f, contactPhone: e.target.value }))}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-transparent mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted uppercase tracking-wide">Address</label>
              <input
                value={studioForm.address}
                onChange={(e) => setStudioForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-transparent mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-muted uppercase tracking-wide">Business Hours</label>
              <input
                value={studioForm.businessHours}
                onChange={(e) => setStudioForm((f) => ({ ...f, businessHours: e.target.value }))}
                placeholder="Mon-Fri, 9am - 6pm"
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-transparent mt-1"
              />
            </div>

            <button
              onClick={handleStudioSave}
              disabled={updateSettingsMutation.isPending}
              className="bg-clay hover:bg-ember transition-colors text-cream text-xs
                         uppercase tracking-wider font-semibold px-5 py-2.5 rounded-md disabled:opacity-60"
            >
              {updateSettingsMutation.isPending ? "Saving..." : "Save Studio Info"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;