export const isDuplicateKeyError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const possibleError = error as { code?: unknown };
  return possibleError.code === 11000 || possibleError.code === 11001;
};
