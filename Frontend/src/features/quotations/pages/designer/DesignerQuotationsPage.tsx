import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  useDesignerQuotations,
} from "../../hooks/useQuotations";

import { useMyAssignedProjects } from "../../../projects/hooks/useProjects";

import SafeImage from "../../../../shared/components/ui/SafeImage";
import SearchField from "../../../../shared/components/ui/SearchField";

import { getErrorMessage } from "../../../../shared/utils/errors";

import {
  getProjectCategoryName,
  getProjectClientEmail,
  getProjectClientName,
  getProjectImage,
  getProjectName,
  getProjectSource,
} from "../../../projects/utils/projectPresentation";

import {
  canEditQuotation,
  getQuotationProjectId,
  getQuotationRejectionReason,
  quotationStatusLabels,
  quotationStatusStyles,
} from "../../utils/quotationPresentation";

import type { IQuotation } from "../../types/quotation.types";

const formatDate = (date?: string) => {
  if (!date) return "Not specified";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const matchesSearch = (
  search: string,
  values: Array<string | undefined>
) => {
  if (!search) return true;

  return values.some((value) =>
    value?.toLowerCase().includes(search)
  );
};

const DesignerQuotationsPage = () => {
  const location = useLocation();

  const [searchInput, setSearchInput] =
    useState("");

  const quotationOrigin =
    `${location.pathname}${location.search}`;

  const {
    data: projects = [],
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    error: projectsError,
  } = useMyAssignedProjects();

  const {
    data: quotations = [],
    isLoading: isQuotationsLoading,
    isError: isQuotationsError,
    error: quotationsError,
  } = useDesignerQuotations();

  const search = searchInput.trim().toLowerCase();

  const projectsById = new Map(
    projects.map((project) => [
      project._id,
      project,
    ])
  );

  const quotationProjectIds = new Set(
    quotations.map(getQuotationProjectId)
  );

  const awaitingQuotation =
    projects
      .filter(
        (project) =>
          project.designerStatus === "accepted" &&
          !quotationProjectIds.has(project._id)
      )
      .map((project) => {
        const source = getProjectSource(
          project.sourceRequest
        );

        return {
          project,
          projectName: getProjectName(source),
          projectImage: getProjectImage(source),
          category: getProjectCategoryName(source),
          needBy: source?.needBy,
          clientName: getProjectClientName(
            project.client
          ),
        };
      })
      .filter((item) =>
        matchesSearch(search, [
          item.projectName,
          item.clientName,
        ])
      );

  const quotationItems = quotations
    .map((quotation) => {
      const projectId =
        getQuotationProjectId(quotation);

      const project =
        projectsById.get(projectId) ??
        (typeof quotation.project === "object"
          ? quotation.project
          : undefined);

      const source = getProjectSource(
        project?.sourceRequest
      );

      const clientName =
        typeof quotation.client === "object"
          ? getProjectClientName(
              quotation.client
            )
          : getProjectClientName(project?.client);

      const clientEmail =
        typeof quotation.client === "object"
          ? quotation.client.email
          : getProjectClientEmail(
              project?.client
            );

      return {
        quotation,
        projectId,
        projectName: getProjectName(source),
        projectImage: getProjectImage(source),
        clientName,
        clientEmail,
      };
    })
    .filter((item) =>
      matchesSearch(search, [
        item.projectName,
        item.clientName,
        item.clientEmail,
      ])
    )
    .sort(
      (a, b) =>
        new Date(
          b.quotation.updatedAt
        ).getTime() -
        new Date(
          a.quotation.updatedAt
        ).getTime()
    );

  const isLoading =
    isProjectsLoading || isQuotationsLoading;

  const isError =
    isProjectsError || isQuotationsError;

  const total =
    awaitingQuotation.length +
    quotationItems.length;

  if (isLoading) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted">
              Loading quotations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-full bg-cream p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-ember/25 bg-surface p-6">
            <h2 className="font-serif text-xl font-bold text-ember">
              Unable to load quotations
            </h2>

            <p className="mt-2 text-sm text-ember">
              {getErrorMessage(
                projectsError || quotationsError
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-cream p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal">
              Quotations
            </h1>

            <p className="mt-1 text-sm text-muted">
              Create and manage quotations for your
              accepted projects.
            </p>
          </div>

          <div className="text-sm text-muted">
            {total} project{total !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="mb-5">
          <SearchField
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search project or client..."
            ariaLabel="Search quotations"
          />
        </div>

        {total === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <h2 className="font-serif text-lg font-bold text-charcoal">
              No projects found
            </h2>

            <p className="mt-1 text-sm text-muted">
              {search
                ? "No projects match your search."
                : "Accepted projects will appear here when they are ready for a quotation."}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {awaitingQuotation.length > 0 && (
              <section>
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-charcoal">
                      Awaiting Quotation
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                      Accepted projects that still need
                      a quotation.
                    </p>
                  </div>

                  <span className="rounded-full bg-amber/10 px-3 py-1 text-xs font-semibold text-amber">
                    {awaitingQuotation.length}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {awaitingQuotation.map((item) => {
                    const projectId =
                      item.project._id;

                    return (
                      <Link
                        key={projectId}
                        to={`/designer/projects/${projectId}/quotation`}
                        state={{ from: quotationOrigin }}
                        className="group overflow-hidden rounded-xl border border-border bg-surface transition hover:border-amber hover:shadow-sm"
                      >
                        <SafeImage
                          src={item.projectImage}
                          alt={item.projectName}
                          className="h-40 w-full object-cover"
                        />

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate font-serif text-lg font-bold text-charcoal">
                                {item.projectName}
                              </h3>

                              <p className="mt-1 truncate text-xs text-muted">
                                {item.clientName}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-amber/10 px-2.5 py-1 text-[11px] font-medium text-amber">
                              Needs quote
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border/70 pt-3 text-xs">
                            <div>
                              <p className="text-muted">
                                Category
                              </p>

                              <p className="mt-0.5 truncate font-medium text-charcoal">
                                {item.category ||
                                  "Not specified"}
                              </p>
                            </div>

                            <div>
                              <p className="text-muted">
                                Required by
                              </p>

                              <p className="mt-0.5 truncate font-medium text-charcoal">
                                {formatDate(
                                  item.needBy
                                )}
                              </p>
                            </div>
                          </div>

                          <p className="mt-3 text-xs font-medium text-clay group-hover:underline">
                            Create quotation →
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {quotationItems.length > 0 && (
              <section>
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-charcoal">
                      Quotation History
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                      Existing quotations and their
                      current status.
                    </p>
                  </div>

                  <span className="rounded-full bg-panel px-3 py-1 text-xs font-semibold text-muted">
                    {quotationItems.length}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {quotationItems.map(
                    ({
                      quotation,
                      projectId,
                      projectName,
                      projectImage,
                      clientName,
                    }) => (
                      <QuotationCard
                        key={quotation._id}
                        quotation={quotation}
                        projectId={projectId}
                        projectName={projectName}
                        projectImage={projectImage}
                        clientName={clientName}
                        origin={quotationOrigin}
                      />
                    )
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface QuotationCardProps {
  quotation: IQuotation;
  projectId: string;
  projectName: string;
  projectImage?: string;
  clientName: string;
  origin: string;
}

const QuotationCard = ({
  quotation,
  projectId,
  projectName,
  projectImage,
  clientName,
  origin,
}: QuotationCardProps) => {
  const rejectionReason =
    getQuotationRejectionReason(quotation);

  const actionLabel = canEditQuotation(quotation)
    ? "Continue quotation"
    : "View quotation";

  return (
    <Link
      to={`/designer/projects/${projectId}/quotation`}
      state={{ from: origin }}
      className="group overflow-hidden rounded-xl border border-border bg-surface transition hover:border-amber hover:shadow-sm"
    >
      <SafeImage
        src={projectImage}
        alt={projectName}
        className="h-40 w-full object-cover"
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-serif text-lg font-bold text-charcoal">
              {projectName}
            </h3>

            <p className="mt-1 truncate text-xs text-muted">
              {clientName}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              quotationStatusStyles[
                quotation.status
              ]
            }`}
          >
            {quotationStatusLabels[quotation.status]}
          </span>
        </div>

        {rejectionReason && (
          <p className="mt-3 line-clamp-2 rounded-lg bg-ember/5 px-3 py-2 text-xs leading-5 text-ember">
            {rejectionReason}
          </p>
        )}

        <div className="mt-3 flex items-end justify-between gap-3 border-t border-border/70 pt-3">
          <div>
            <p className="text-xs text-muted">
              Total
            </p>

            <p className="mt-0.5 text-sm font-semibold text-charcoal">
              {formatCurrency(quotation.total)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted">
              Updated
            </p>

            <p className="mt-0.5 text-xs font-medium text-charcoal">
              {formatDate(quotation.updatedAt)}
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs font-medium text-clay group-hover:underline">
          {actionLabel} →
        </p>
      </div>
    </Link>
  );
};

export default DesignerQuotationsPage;
