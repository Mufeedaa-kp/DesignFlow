export interface DesignerProjectBackLink {
  label: string;
  to: string;
}

const DESIGNER_PROJECTS_PATH = "/designer/projects";
const DESIGNER_QUOTATIONS_PATH = "/designer/quotations";
const DESIGNER_MOODBOARDS_PATH = "/designer/moodboards";

const getPathname = (value: string) => {
  return value.split(/[?#]/, 1)[0];
};

const isDesignerOrigin = (value: string) => {
  const pathname = getPathname(value);

  return (
    pathname === DESIGNER_PROJECTS_PATH ||
    pathname === DESIGNER_QUOTATIONS_PATH ||
    pathname === DESIGNER_MOODBOARDS_PATH ||
    pathname.startsWith(`${DESIGNER_MOODBOARDS_PATH}/`)
  );
};

export const getDesignerOrigin = (
  state: unknown
) => {
  if (
    !state ||
    typeof state !== "object" ||
    !("from" in state)
  ) {
    return undefined;
  }

  const from = (state as { from?: unknown }).from;

  if (
    typeof from !== "string" ||
    !from.startsWith("/designer/") ||
    !isDesignerOrigin(from)
  ) {
    return undefined;
  }

  return from;
};

export const getDesignerQuotationOrigin = (
  state: unknown
) => {
  const from = getDesignerOrigin(state);

  if (
    !from ||
    getPathname(from) !== DESIGNER_QUOTATIONS_PATH
  ) {
    return undefined;
  }

  return from;
};

export const getDesignerProjectBackLink = (
  state: unknown
): DesignerProjectBackLink => {
  const from = getDesignerOrigin(state);

  if (!from) {
    return {
      label: "Back to Projects",
      to: DESIGNER_PROJECTS_PATH,
    };
  }

  const pathname = getPathname(from);

  if (pathname === DESIGNER_QUOTATIONS_PATH) {
    return {
      label: "Back to Quotations",
      to: from,
    };
  }

  if (
    pathname === DESIGNER_MOODBOARDS_PATH ||
    pathname.startsWith(`${DESIGNER_MOODBOARDS_PATH}/`)
  ) {
    return {
      label: "Back to Moodboards",
      to: from,
    };
  }

  return {
    label: "Back to Projects",
    to: from,
  };
};
