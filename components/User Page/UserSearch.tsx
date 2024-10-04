import React from 'react';
import { UserType } from "@/interfaces/userpage.interfaces";
import { Search, X } from 'lucide-react';

interface UserSearchProps {
  setFilteredUsers: React.Dispatch<React.SetStateAction<UserType[] | undefined>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  applyFilter: () => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ setFilteredUsers, searchTerm, setSearchTerm, applyFilter }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      applyFilter();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    applyFilter();
  };

  return (
    <div className="mb-6 mt-8">
      <div className="relative flex w-full max-w-2xl items-center">
        <div className="relative grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by name or email..."
            className="w-full rounded-l-md border border-gray-300 bg-white px-4 py-2 pl-10 pr-10 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
          />
          <Search className="absolute left-3 top-2.5 size-5 text-gray-400 peer-focus:text-orange-500" />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
        <button
          onClick={applyFilter}
          className="rounded-r-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default UserSearch;