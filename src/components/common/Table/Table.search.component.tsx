import { useCallback, useRef, type FC } from "react";
import type { TableSearchType } from "./Table.types";

const TableSearch: FC<TableSearchType> = ({ setSearchText, setPage }) => {
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      if (searchTimeout?.current) {
        clearTimeout(searchTimeout.current);
      }

      searchTimeout.current = setTimeout(() => {
        setSearchText(value);
        setPage(1);
      }, 500);
    },
    [setSearchText, setPage]
  );

  return (
    <div className="relative w-[300px]">
      <input
        type="text"
        placeholder="Search..."
        className="px-3 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full dark:bg-gray-900 dark:text-white"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

export default TableSearch;
