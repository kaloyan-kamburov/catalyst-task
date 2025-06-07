import { useEffect, useState, useRef } from "react";
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

const formatValue = (value: string | number, type: string): string => {
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
}) => {
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  // const [sort, setSort] = useState<{ key: string; order: "asc" | "desc" } | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: TableFilterValue }>({});
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const lastSuccessfulPage = useRef(page);
  const lastSuccessfulPageSize = useRef(pageSize);
  const previousPage = useRef(page);

  const handleFilterChange = (newFilters: { [key: string]: TableFilterValue }) => {
    setFilters(newFilters);
    setPage(1);
  };

  const { data, isLoading, isFetching, isLoadingError, error, refetch } = useQuery<
    TableResponse,
    ApiError
  >({
    queryKey: ["transactions", page, pageSize, filters],
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
      return axiosInstance.get(`${url}?${queryParams.toString()}`);
    },
    meta: {
      showToastOnError: isInitialLoaded,
    } satisfies QueryOptions,
    placeholderData: keepPreviousData,
    gcTime: 0,
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
    <div className="flex flex-col gap-4 flex-1 relative justify-start">
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
          <div className="flex justify-start">
            <TableFilters
              allFilters={columns as TableFilterType[]}
              onFilterChange={handleFilterChange}
              chosenFilters={filters}
            />
          </div>
          <table className="table-auto w-full border border-gray-300 rounded">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th className="p-[5px] border-b border-gray-300" key={column.key}>
                    {column.label}
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
