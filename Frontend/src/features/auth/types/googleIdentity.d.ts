export {};

declare global {
  interface GoogleCredentialResponse {
    credential?: string;
  }

  interface GoogleIdConfiguration {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
  }

  interface GoogleButtonConfiguration {
    type?: "standard";
    theme?: "outline" | "filled_blue" | "filled_black";
    size?: "large" | "medium" | "small";
    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
    shape?: "rectangular" | "pill" | "circle" | "square";
    logo_alignment?: "left" | "center";
    width?: number;
  }

  interface GoogleAccountsId {
    initialize: (config: GoogleIdConfiguration) => void;
    renderButton: (
      parent: HTMLElement,
      options: GoogleButtonConfiguration,
    ) => void;
  }

  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId;
      };
    };
  }
}
