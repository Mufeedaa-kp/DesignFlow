import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-[100svh] flex items-center justify-center bg-cream px-4 py-8 sm:px-6">
      <div className="w-full max-w-[460px] rounded-3xl bg-[var(--color-brown-dark)] p-6 sm:p-8 shadow-[0_40px_80px_-60px_rgba(107,68,32,0.9)] border border-border/60">
        <div className="mb-6 text-center">
          <p className="font-serif font-semibold text-2xl">
            <span className="text-cream">Design</span>
            <span className="text-amber">Flow</span>
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;