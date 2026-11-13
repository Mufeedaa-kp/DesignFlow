import type { PropsWithChildren } from "react";
import AuthLayout from "./AuthLayout";

interface AuthMobileLayoutProps extends PropsWithChildren {
  title?: string;
  heading: string;
  subtitle: string;
}

const AuthMobileLayout = ({ heading, subtitle, children }: AuthMobileLayoutProps) => {
  return (
    <AuthLayout>
      <div className="mb-6 text-center">
        <h2 className="font-serif text-3xl mb-2 text-cream">{heading}</h2>
        <p className="text-sm text-cream/70">{subtitle}</p>
      </div>
      {children}
    </AuthLayout>
  );
};

export default AuthMobileLayout;
