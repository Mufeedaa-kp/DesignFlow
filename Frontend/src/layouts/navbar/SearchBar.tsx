import { Search } from "lucide-react";
import { useSearch } from "../../shared/context/SearchContext";

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  return (
    <div className="relative hidden sm:block">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-white border border-border rounded-md text-sm text-charcoal pl-9 pr-3 py-2 w-56 focus:outline-none focus:border-amber transition-colors placeholder:text-muted/70"
      />
    </div>
  );
};

export default SearchBar;