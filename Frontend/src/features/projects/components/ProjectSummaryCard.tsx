import type { ReactNode } from "react";

import SafeImage from "../../../shared/components/ui/SafeImage";

interface ProjectSummaryCardProps {
  image?: string;
  projectName: string;
  clientName: string;
  eyebrow?: string;
  meta?: ReactNode;
  aside?: ReactNode;
}

const ProjectSummaryCard = ({
  image,
  projectName,
  clientName,
  eyebrow = "Project",
  meta,
  aside,
}: ProjectSummaryCardProps) => {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="grid md:grid-cols-[220px_1fr]">
        <SafeImage
          src={image}
          alt={projectName}
          className="h-44 w-full object-cover md:h-full"
        />

        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {eyebrow}
              </p>

              <h2 className="mt-1 truncate font-serif text-2xl font-bold text-charcoal">
                {projectName}
              </h2>

              <p className="mt-1 text-sm text-muted">
                {clientName}
              </p>
            </div>

            {aside && (
              <div className="shrink-0">
                {aside}
              </div>
            )}
          </div>

          {meta && (
            <div className="grid gap-3 border-t border-border/70 pt-4 text-sm sm:grid-cols-2">
              {meta}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectSummaryCard;
