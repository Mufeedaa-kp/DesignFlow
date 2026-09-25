import { useState } from "react";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { SearchContext } from "./SearchContext";

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()
  const [prevPath, setPrevPath] = useState(location.pathname)

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setSearchQuery("")
  }

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}s
    </SearchContext.Provider>
  )
}