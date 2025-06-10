import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import {
  axiosInstance,
  type ApiError,
  type QueryOptions,
} from "../../../shared/queryClient";
import type {
  TableFilterType,
  TableType,
  TableFilterValueType,
  TableResponseType,
  TableRowType,
} from "./Table.types";
import LoaderInner from "../Loaders/LoaderInner.component";
import ErrorInner from "../Errors/ErrorInner.component";
import TableFilters from "./Table.filters.component";
import TableSearch from "./Table.search.component";
import TableExport from "./Table.export.component";
import { formatValue } from "./Table.utils";

const Table: React.FC<TableType> = ({
  url,
  columns,
  pageSizeOptions = [10, 20, 50, 100],
  searchable = true,
  minWidth = 1400,
  mode = "server",
  csvExport = true,
}) => {
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [sort, setSort] = useState<{ key: string; order: "asc" | "desc" } | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: TableFilterValueType }>({});
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [loadingExport, setLoadingExport] = useState(false);
  const [clientData, setClientData] = useState<TableRowType[]>([]);

  const lastSuccessfulPage = useRef(page);
  const lastSuccessfulPageSize = useRef(pageSize);
  const previousPage = useRef(page);

  const filterClientData = useCallback(
    (data: TableRowType[]) => {
      let filteredData = [...data];

      if (Object.keys(filters).length > 0) {
        filteredData = filteredData.filter((row) => {
          return Object.entries(filters).every(([key, filter]) => {
            if (!filter) return true;
            const value = row[key];
            const column = columns.find((col) => col.key === key);

            if (!column) return true;

            switch (column.type) {
              case "number": {
                const numValue = Number(value);
                if (filter.min !== undefined && numValue < filter.min) return false;
                if (filter.max !== undefined && numValue > filter.max) return false;
                return true;
              }
              case "date": {
                const dateValue = value ? new Date(String(value)).getTime() : 0;
                if (filter.start && new Date(filter.start).getTime() > dateValue)
                  return false;
                if (filter.end && new Date(filter.end).getTime() < dateValue)
                  return false;
                return true;
              }
              case "select":
                return !filter.value || value === filter.value;
              default:
                return true;
            }
          });
        });
      }

      if (searchText) {
        const searchLower = searchText.toLowerCase();
        filteredData = filteredData.filter((row) => {
          return columns.some((column) => {
            if (column.type === "string" || !column.type) {
              const value = row[column.key];
              return value && String(value).toLowerCase().includes(searchLower);
            }
            return false;
          });
        });
      }

      // Apply sort
      if (sort) {
        filteredData.sort((a, b) => {
          const aValue = a[sort.key];
          const bValue = b[sort.key];
          const column = columns.find((col) => col.key === sort.key);

          let comparison = 0;
          switch (column?.type) {
            case "number":
              comparison = Number(aValue) - Number(bValue);
              break;
            case "date":
              comparison =
                aValue && bValue
                  ? new Date(String(aValue)).getTime() -
                    new Date(String(bValue)).getTime()
                  : 0;
              break;
            default:
              comparison = String(aValue).localeCompare(String(bValue));
          }

          return sort.order === "asc" ? comparison : -comparison;
        });
      }

      return filteredData;
    },
    [filters, searchText, sort, columns]
  );

  const processedData = useMemo(() => {
    if (mode === "client" && clientData.length > 0) {
      const filteredData = filterClientData(clientData);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      return {
        data: filteredData.slice(start, end),
        totalRecords: filteredData.length,
        totalPages: Math.ceil(filteredData.length / pageSize),
      };
    }
    return null;
  }, [mode, clientData, filterClientData, page, pageSize]);

  const handleFilterChange = (newFilters: { [key: string]: TableFilterValueType }) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev?.key === key) {
        return prev.order === "asc" ? { key, order: "desc" } : null;
      }
      return { key, order: "asc" };
    });
  };

  const { data, isLoading, isFetching, isLoadingError, error, refetch } = useQuery<
    TableResponseType,
    ApiError
  >({
    queryKey: [
      "transactions",
      mode === "server" ? page : undefined,
      mode === "server" ? pageSize : undefined,
      mode === "server" ? filters : undefined,
      mode === "server" ? sort : undefined,
      mode === "server" ? searchText : undefined,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (mode === "server") {
        queryParams.append("page", page.toString());
        queryParams.append("pageSize", pageSize.toString());

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            if (value.min !== undefined)
              queryParams.append(`${key}_min`, value.min.toString());
            if (value.max !== undefined)
              queryParams.append(`${key}_max`, value.max.toString());
            if (value.start !== undefined)
              queryParams.append(`${key}_start`, `${value.start}`);
            if (value.end !== undefined) queryParams.append(`${key}_end`, `${value.end}`);
            if (value.value !== undefined) queryParams.append(key, `${value.value}`);
          }
        });

        if (sort) {
          queryParams.append("sort", sort.order === "desc" ? `-${sort.key}` : sort.key);
        }

        if (searchable && searchText) {
          queryParams.append("search", searchText);
        }
      }

      const response = await axiosInstance.get(
        `${url}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
      );

      if (mode === "client" && !clientData.length) {
        setClientData(response.data.data);
      }

      return response;
    },
    meta: {
      showToastOnError: isInitialLoaded,
    } satisfies QueryOptions,
    gcTime: 0,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (mode === "server" && data?.data) {
      setTotalPages(data.data.totalPages);
      setTotalRecords(data.data.totalRecords);
      setIsInitialLoaded(true);

      lastSuccessfulPage.current = page;
      lastSuccessfulPageSize.current = pageSize;
    } else if (mode === "client" && processedData) {
      setTotalPages(processedData.totalPages);
      setTotalRecords(processedData.totalRecords);
      setIsInitialLoaded(true);
    }
  }, [data, page, pageSize, mode, processedData]);

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
      previousPage.current = 1;
      setPage(1);
      setPageSize(newSize);
    }
  };

  const apiError = error as ApiError | null;
  const displayData =
    mode === "client" && processedData ? processedData.data : data?.data?.data;

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
          {(isFetching || loadingExport) && <LoaderInner />}
          <div className="flex justify-between items-start gap-4">
            <TableFilters
              allFilters={columns as TableFilterType[]}
              onFilterChange={handleFilterChange}
              chosenFilters={filters}
            />
            <div className="flex items-center gap-4">
              {searchable && (
                <TableSearch setSearchText={setSearchText} setPage={setPage} />
              )}
              {csvExport && <TableExport url={url} setLoadingExport={setLoadingExport} />}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table
              className={`table-auto w-full border border-gray-300 rounded min-w-[${minWidth}px]`}
            >
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      className={`p-[5px] border-b border-gray-300 ${
                        column.sortable !== false
                          ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          : ""
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
                {displayData?.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
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

          <ol className="flex items-center justify-end gap-2">
            <li className="flex items-center justify-center pr-[15px]">
              <select
                className="w-20 h-8 border border-gray-300 rounded cursor-pointer disabled:opacity-50 disabled:cursor-default px-[5px] dark:bg-gray-900 dark:text-white"
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
