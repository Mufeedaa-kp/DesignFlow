const GOOGLE_IDENTITY_SCRIPT = "https://accounts.google.com/gsi/client";

let loadPromise: Promise<void> | null = null;

export const loadGoogleIdentity = (): Promise<void> => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    const handleLoad = () => resolve();
    const handleError = () => {
      loadPromise = null;
      reject(new Error("Unable to load Google Sign-In."));
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_IDENTITY_SCRIPT}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SCRIPT;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener(
      "error",
      () => {
        script.remove();
        handleError();
      },
      { once: true },
    );
    document.head.appendChild(script);
  });

  return loadPromise;
};
