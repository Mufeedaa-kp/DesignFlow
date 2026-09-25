import { createContext, useContext } from "react";

export interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const SearchContext = createContext<SearchContextType | null>(null);

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
  return ctx;
};