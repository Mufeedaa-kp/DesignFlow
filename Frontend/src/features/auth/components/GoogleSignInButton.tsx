import { useEffect, useRef, useState } from "react";
import { getGoogleClientId } from "../utils/googleClientId";
import { loadGoogleIdentity } from "../utils/loadGoogleIdentity";

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
  disabled?: boolean;
  pending?: boolean;
}

const GoogleSignInButton = ({
  onCredential,
  disabled = false,
  pending = false,
}: GoogleSignInButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const clientId = getGoogleClientId();

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!clientId && import.meta.env.DEV) {
      console.warn(
        "VITE_GOOGLE_CLIENT_ID is not configured. Google Sign-In is disabled.",
      );
    }
  }, [clientId]);

  useEffect(() => {
    if (!clientId) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    let cancelled = false;
    setIsReady(false);
    setLoadError("");

    loadGoogleIdentity()
      .then(() => {
        if (cancelled) {
          return;
        }

        if (!window.google?.accounts?.id) {
          setLoadError(
            "Google Sign-In is unavailable right now. Please use email instead.",
          );
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          auto_select: false,
          callback: (response) => {
            if (response.credential) {
              void callbackRef.current(response.credential);
            }
          },
        });

        container.replaceChildren();
        window.google.accounts.id.renderButton(container, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: Math.min(320, container.clientWidth || 320),
        });
        setIsReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(
            "Google Sign-In is unavailable right now. Please use email instead.",
          );
        }
      });

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, [clientId]);

  if (!clientId) {
    return null;
  }

  const isInactive = disabled || pending;

  return (
    <div className="w-full">
      <div
        className={`flex justify-center ${
          isInactive ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <div ref={containerRef} className="flex w-full justify-center" />
      </div>

      {!isReady && !loadError && (
        <p className="mt-2 text-center text-xs text-muted">
          Loading Google Sign-In...
        </p>
      )}

      {pending && (
        <p className="mt-2 text-center text-xs text-muted">
          Signing in with Google...
        </p>
      )}

      {loadError && (
        <p role="alert" className="mt-2 text-center text-xs text-ember">
          {loadError}
        </p>
      )}
    </div>
  );
};

export default GoogleSignInButton;
