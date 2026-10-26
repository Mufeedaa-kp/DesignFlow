import { useSearch } from "../../shared/context/SearchContext";
import SearchField from "../../shared/components/ui/SearchField";

const SearchBar = () => {
  const { searchQuery, setSearchQuery } =
    useSearch();

  return (
    <SearchField
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="Search..."
      ariaLabel="Search current page"
      className="w-full sm:w-56"
    />
  );
};

export default SearchBar;
