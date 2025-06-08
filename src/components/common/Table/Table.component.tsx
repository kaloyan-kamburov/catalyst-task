import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  axiosInstance,
  type ApiError,
  type QueryOptions,
} from "../../../shared/queryClient";
import type {
  TableFilterType,
  TableType,
  TableFilterValue,
  TableResponse,
} from "./Table.types";
import LoaderInner from "../Loaders/LoaderInner.component";
import ErrorInner from "../Errors/ErrorInner.component";
import TableFilters from "./Table.filters.component";

const formatValue = (value: string | number | undefined, type: string): string => {
  if (value === undefined) return "";
  if (type === "number" && typeof value === "number") {
    return value.toFixed(2);
  }
  if (type === "date" && typeof value === "string") {
    return new Date(value).toLocaleDateString();
  }
  return `${value}`;
};

const Table: React.FC<TableType> = ({
  url,
  columns,
  pageSizeOptions = [10, 20, 50, 100],
  searchable = true,
  minWidth = 1400,
}) => {
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [sort, setSort] = useState<{ key: string; order: "asc" | "desc" } | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: TableFilterValue }>({});
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const lastSuccessfulPage = useRef(page);
  const lastSuccessfulPageSize = useRef(pageSize);
  const previousPage = useRef(page);

  const handleFilterChange = (newFilters: { [key: string]: TableFilterValue }) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev?.key === key) {
        // Toggle order if same column
        return prev.order === "asc" ? { key, order: "desc" } : null; // Remove sort if already desc
      }
      // New column sort always starts with asc
      return { key, order: "asc" };
    });
  };

  const handleSearch = useCallback(
    (value: string) => {
      if (searchTimeout?.current) {
        clearTimeout(searchTimeout.current);
      }

      searchTimeout.current = setTimeout(() => {
        setSearchTerm(value);
        setPage(1);
      }, 500);
    },
    [setSearchTerm, setPage]
  );

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const { data, isLoading, isFetching, isLoadingError, error, refetch } = useQuery<
    TableResponse,
    ApiError
  >({
    queryKey: ["transactions", page, pageSize, filters, sort, searchTerm],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value) {
            if (value.min !== undefined) acc[`${key}_min`] = value.min.toString();
            if (value.max !== undefined) acc[`${key}_max`] = value.max.toString();
            if (value.start !== undefined) acc[`${key}_start`] = `${value.start}`;
            if (value.end !== undefined) acc[`${key}_end`] = `${value.end}`;
            if (value.value !== undefined) acc[key] = `${value.value}`;
          }
          return acc;
        }, {} as Record<string, string>),
      });

      // Add sort parameter if sorting is active
      if (sort) {
        queryParams.append("sort", sort.order === "desc" ? `-${sort.key}` : sort.key);
      }

      // Add search parameter if search is active
      if (searchable && searchTerm) {
        queryParams.append("search", searchTerm);
      }

      return axiosInstance.get(`${url}?${queryParams.toString()}`);
    },
    meta: {
      showToastOnError: isInitialLoaded,
    } satisfies QueryOptions,
    gcTime: 0,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.data) {
      setTotalPages(data.data.totalPages);
      setTotalRecords(data.data.totalRecords);
      setIsInitialLoaded(true);

      lastSuccessfulPage.current = page;
      lastSuccessfulPageSize.current = pageSize;
    }
  }, [data, page, pageSize]);

  useEffect(() => {
    if (error && isInitialLoaded) {
      setPage(previousPage.current);
    }
  }, [error, isInitialLoaded]);

  const handlePageChange = (newPage: number) => {
    if (!isLoadingError) {
      previousPage.current = page;
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (!isLoadingError) {
      previousPage.current = 1; // When changing page size, we always go to page 1
      setPage(1);
      setPageSize(newSize);
    }
  };

  const apiError = error as ApiError | null;

  return (
    <div className="flex flex-col gap-4 flex-1 relative justify-start h-full">
      {isLoading ? (
        <LoaderInner />
      ) : isLoadingError && !isInitialLoaded ? (
        <ErrorInner
          errorText={apiError?.message || "Something went wrong"}
          onRetry={refetch}
        />
      ) : (
        <>
          {isFetching && <LoaderInner />}
          <div className="flex justify-between items-start">
            <TableFilters
              allFilters={columns as TableFilterType[]}
              onFilterChange={handleFilterChange}
              chosenFilters={filters}
            />
          </div>
          {searchable && (
            <div className="relative w-full max-w-[500px]">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
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
          )}
          <div className="overflow-x-auto">
            <table
              className={`table-auto w-full border border-gray-300 rounded min-w-[${minWidth}px]`}
            >
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      className={`p-[5px] border-b border-gray-300 ${
                        column.sortable !== false ? "cursor-pointer hover:bg-gray-50" : ""
                      }`}
                      key={column.key}
                      onClick={() => column.sortable !== false && handleSort(column.key)}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {column.label}
                        {column.sortable !== false && (
                          <div className="flex flex-col">
                            {sort?.key === column.key ? (
                              <svg
                                width="12"
                                height="12"
                                xmlns="http://www.w3.org/2000/svg"
                                fillRule="evenodd"
                                clipRule="evenodd"
                                className={`transition-transform ${
                                  sort.order === "desc" ? "rotate-180" : ""
                                } text-blue-500`}
                              >
                                <path
                                  d="M11 2.206l-6.235 7.528-.765-.645 7.521-9 7.479 9-.764.646-6.236-7.53v21.884h-1v-21.883z"
                                  fill="currentColor"
                                  transform="scale(0.5)"
                                />
                              </svg>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.data?.data?.map((row) => (
                  <tr key={row.id} className="border-b border-gray-300 hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        className={`${column.align || "text-center"} px-[5px]`}
                        key={column.key}
                      >
                        {column.render?.(row) ||
                          formatValue(row[column.key], column.type || "string")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ol className="flex justify-end text-xs font-medium space-x-1">
            <li className="flex items-center justify-center pr-[15px]">
              <select
                className="w-20 h-8 border border-gray-300 rounded cursor-pointer disabled:opacity-50 disabled:cursor-default px-[5px]"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                disabled={isLoadingError}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </li>
            <li className="flex items-center justify-center">
              {page} / {totalPages} of {totalRecords}
            </li>
            <li>
              <button
                className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded cursor-pointer disabled:opacity-50 disabled:cursor-default"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isLoadingError}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
            <li>
              <button
                className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded cursor-pointer disabled:opacity-50 disabled:cursor-default"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || isLoadingError}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </ol>
        </>
      )}
    </div>
  );
};

export default Table;
