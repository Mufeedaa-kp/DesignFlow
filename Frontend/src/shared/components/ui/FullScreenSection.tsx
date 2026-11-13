import type { PropsWithChildren } from "react";

interface FullScreenSectionProps extends PropsWithChildren {
  className?: string;
  contentClassName?: string;
  id?: string;
}

const FullScreenSection = ({
  children,
  className = "",
  contentClassName = "",
  id,
}: FullScreenSectionProps) => (
  <section id={id} className={`section-fullscreen ${className}`}>
    <div className={`section-fullscreen-content ${contentClassName}`}>
      {children}
    </div>
  </section>
);

export default FullScreenSection;
