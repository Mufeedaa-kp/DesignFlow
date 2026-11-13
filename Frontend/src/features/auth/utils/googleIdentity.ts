import { loadGoogleIdentity } from "./loadGoogleIdentity";

type CredentialHandler = (credential: string) => void;
type CredentialHandlerGetter = () => CredentialHandler;

const handlerGetters = new Set<CredentialHandlerGetter>();

let initializedClientId: string | null = null;
let initializationPromise: Promise<void> | null = null;

const handleCredential = (response: GoogleCredentialResponse) => {
  const credential = response.credential;

  if (!credential) {
    return;
  }

  const handlers = new Set<CredentialHandler>();

  handlerGetters.forEach((getHandler) => {
    handlers.add(getHandler());
  });

  handlers.forEach((handler) => {
    handler(credential);
  });
};

export const registerGoogleCredentialHandler = (
  getHandler: CredentialHandlerGetter
) => {
  handlerGetters.add(getHandler);

  return () => {
    handlerGetters.delete(getHandler);
  };
};

export const initializeGoogleIdentity = (clientId: string): Promise<void> => {
  if (!clientId) {
    return Promise.reject(new Error("Google Client ID is not configured."));
  }

  if (initializedClientId === clientId) {
    return initializationPromise ?? Promise.resolve();
  }

  if (initializationPromise) {
    return initializationPromise.then(() =>
      initializeGoogleIdentity(clientId)
    );
  }

  initializedClientId = clientId;

  initializationPromise = loadGoogleIdentity()
    .then(() => {
      if (!window.google?.accounts?.id) {
        throw new Error("Google Sign-In is unavailable right now.");
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        auto_select: false,
        callback: handleCredential,
      });
    })
    .then(() => {
      initializationPromise = null;
    })
    .catch((error: unknown) => {
      initializedClientId = null;
      initializationPromise = null;
      throw error;
    });

  return initializationPromise;
};
