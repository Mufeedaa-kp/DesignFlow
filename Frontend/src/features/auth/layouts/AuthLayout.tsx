import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-3xl bg-surface rounded-xl overflow-hidden flex shadow-sm border border-border">
        <div className="hidden md:flex md:w-[45%] bg-panel flex-col justify-between p-10">
          <p className="font-serif font-bold text-lg text-charcoal">DesignFlow</p>
          <div>
            <p className="text-[10px] tracking-[2px] text-amber uppercase font-semibold mb-2">
              Curated spaces
            </p>
            <p className="font-serif font-bold text-3xl text-charcoal leading-tight">
              Design your<br />
              <span className="text-amber">dream space.</span>
            </p>
          </div>
        </div>

        <div className="w-full md:w-[55%] flex items-center justify-center p-8 md:p-12 bg-cream/40">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;