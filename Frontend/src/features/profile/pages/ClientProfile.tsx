import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { User as UserIcon, Camera } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useMyProfile, useUpdateProfile, useUploadProfileImage } from "../hooks/useProfile";
import {
  getApiError,
  notifyClientError,
} from "../../../shared/utils/errors";
 
const inputClass =
  "w-full bg-white border border-border rounded-md text-charcoal text-sm " +
  "px-3 py-2.5 focus:outline-none focus:border-amber transition-colors " +
  "placeholder:text-muted/70";
const disabledInputClass =
  "w-full bg-panel/50 border border-border rounded-md text-charcoal/70 text-sm " +
  "px-3 py-2.5 cursor-not-allowed";
const labelClass = "block text-xs text-muted uppercase tracking-wide font-semibold mb-2";
 
const ClientProfile = () => {
  const { updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  const { data: profile, isLoading, isError } = useMyProfile();
  const { mutateAsync: uploadImage, isPending: isUploadingImage } = useUploadProfileImage();
  const { mutateAsync: saveProfile, isPending: isSaving } = useUpdateProfile();
 
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"fullName" | "phone" | "address", string>>
  >({});
  const [submitError, setSubmitError] = useState("");
 
  // Keep local form state in sync with fresh server data.
  // Adjusting state during render (not in an effect) avoids the extra render
  // pass an effect-based sync would cause: https://react.dev/learn/you-might-not-need-an-effect
  const [syncedProfile, setSyncedProfile] = useState(profile);
  if (profile && profile !== syncedProfile) {
    setSyncedProfile(profile);
    setFullName(profile.fullName ?? "");
    setPhone(profile.phone ?? "");
    setAddress(profile.address ?? "");
  }
 
  const hasChanges =
    !!profile &&
    (fullName !== (profile.fullName ?? "") ||
      phone !== (profile.phone ?? "") ||
      address !== (profile.address ?? ""));
 
  const syncReduxUser = (updated: { fullName: string; phone?: string; address?: string; profileImage?: string }) => {
    updateUser({
      fullName: updated.fullName,
      phone: updated.phone,
      address: updated.address,
      profileImage: updated.profileImage,
    });
  };
 
  const handleImagePick = async (file: File | undefined) => {
    if (!file) return;
    try {
      const url = await uploadImage(file);
      const updated = await saveProfile({ profileImage: url });
      syncReduxUser(updated);
      toast.success("Profile photo updated");
    } catch (err: unknown) {
      notifyClientError(err, "Image upload failed");
    }
  };
 
  const handleSave = async () => {
    setFieldErrors({});
    setSubmitError("");

    try {
      const updated = await saveProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      syncReduxUser(updated);
      toast.success("Profile updated");
    } catch (err: unknown) {
      const details = getApiError(err);
      const backendFieldErrors =
        details.fieldErrors as Partial<
          Record<"fullName" | "phone" | "address", string>
        >;

      if (Object.keys(backendFieldErrors).length > 0) {
        setFieldErrors(backendFieldErrors);
        return;
      }

      if (details.isValidation) {
        setSubmitError(details.message);
        return;
      }

      notifyClientError(err, "Update failed");
    }
  };

  const clearFieldError = (
    field: "fullName" | "phone" | "address"
  ) => {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  };
 
  if (isLoading) return <p className="text-sm text-muted max-w-2xl mx-auto">Loading profile...</p>;
  if (isError || !profile) return <p className="text-sm text-ember max-w-2xl mx-auto">Couldn't load your profile. Try again.</p>;
 
  return (
    <div className="max-w-2xl mx-auto">
      <p className="font-serif font-bold text-3xl text-charcoal mb-2">My Profile</p>
      <p className="text-sm text-muted mb-8">Keep your details up to date — this info is used to speed up new project requests.</p>
 
      <div className="bg-cream border border-border rounded-lg p-6 sm:p-8">
        <div className="flex items-center gap-5 mb-8">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-20 h-20 rounded-full bg-panel border border-border overflow-hidden
                       flex items-center justify-center cursor-pointer group shrink-0"
          >
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.fullName} className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={28} className="text-muted" />
            )}
            <div
              className="absolute inset-0 bg-charcoal/50 flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera size={18} className="text-cream" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleImagePick(e.target.files?.[0])}
            />
          </div>
          <div>
            <p className="font-serif font-bold text-lg text-charcoal">{profile.fullName}</p>
            <p className="text-xs text-muted">
              {isUploadingImage ? "Uploading photo..." : "Click your photo to change it"}
            </p>
          </div>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              className={inputClass}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                clearFieldError("fullName");
              }}
              aria-invalid={Boolean(fieldErrors.fullName)}
            />
            {fieldErrors.fullName && (
              <p role="alert" className="text-xs text-ember mt-1">
                {fieldErrors.fullName}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input className={disabledInputClass} value={profile.email} disabled readOnly />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              className={inputClass}
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                clearFieldError("phone");
              }}
              aria-invalid={Boolean(fieldErrors.phone)}
            />
            {fieldErrors.phone && (
              <p role="alert" className="text-xs text-ember mt-1">
                {fieldErrors.phone}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input
              className={inputClass}
              placeholder="123 Park Avenue, New York, NY 10001"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                clearFieldError("address");
              }}
              aria-invalid={Boolean(fieldErrors.address)}
            />
            {fieldErrors.address && (
              <p role="alert" className="text-xs text-ember mt-1">
                {fieldErrors.address}
              </p>
            )}
          </div>
        </div>

        {submitError && (
          <p role="alert" className="mb-4 text-xs text-ember">
            {submitError}
          </p>
        )}
 
        <div className="flex justify-end pt-4 border-t border-border">
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-clay hover:bg-ember transition-colors text-cream text-xs
                       uppercase tracking-wider font-semibold px-6 py-3 rounded-md disabled:opacity-40"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default ClientProfile;
 