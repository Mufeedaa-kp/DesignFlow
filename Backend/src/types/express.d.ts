declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: "admin" | "designer" | "client";
      };
    }
  }
}

export {};