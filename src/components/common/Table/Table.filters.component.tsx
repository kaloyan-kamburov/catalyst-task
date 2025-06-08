import { useState, useEffect } from "react";
import type { TableFilterType, TableFilterValue } from "./Table.types";
import TableFilter from "./Table.filter.component";

interface TableFiltersProps {
  allFilters: TableFilterType[];
  onFilterChange?: (filters: { [key: string]: TableFilterValue }) => void;
  chosenFilters: { [key: string]: TableFilterValue };
}

const TableFilters = ({
  allFilters = [],
  onFilterChange,
  chosenFilters,
}: TableFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<typeof chosenFilters>(chosenFilters);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update local filters when chosen filters change from parent
  useEffect(() => {
    setLocalFilters(chosenFilters);
  }, [chosenFilters]);

  const hasActiveFilters = (filterObj: typeof chosenFilters): boolean => {
    return Object.values(filterObj).some((value) => {
      if (!value) return false;
      return Object.values(value).some((v) => v !== undefined);
    });
  };

  const validateFilters = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    allFilters.forEach((filter) => {
      if (!filter.filterable) return;

      const value = localFilters[filter.key];
      if (!value) return;

      switch (filter.type) {
        case "number": {
          const rangeFilter = value as { min?: number; max?: number } | undefined;
          const min = rangeFilter?.min;
          const max = rangeFilter?.max;
          if (min !== undefined && max !== undefined) {
            if (max < min) {
              newErrors[filter.key] = "Maximum value cannot be less than minimum value";
            }
          }
          break;
        }
        case "date": {
          const dateRangeFilter = value as { start?: string; end?: string } | undefined;
          const start = dateRangeFilter?.start;
          const end = dateRangeFilter?.end;

          if (start !== undefined && end !== undefined) {
            if (start > end) {
              newErrors[filter.key] = "Date from cannot be greater than date to";
            }
          }
          break;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFilterChange = (key: string, value: TableFilterValue) => {
    const newFilters = {
      ...localFilters,
      [key]: value
        ? {
            ...(localFilters[key] || {}),
            ...value,
          }
        : undefined,
    };

    setLocalFilters(newFilters as { [key: string]: TableFilterValue });

    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFilters()) {
      // Always notify parent of filter changes, even when clearing
      onFilterChange?.(localFilters);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-center px-[10px] py-2 border border-gray-300 relative rounded cursor-pointer disabled:opacity-50 disabled:cursor-default mr-auto ${
          isOpen ? "bg-gray-100 dark:bg-gray-700" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filters
        {hasActiveFilters(chosenFilters) && (
          <div className="text-white rounded-full bg-blue-500 w-[20px] h-[20px] text-[12px] absolute -top-2 -right-2 flex items-center justify-center">
            {
              Object.keys(chosenFilters).filter((key) => {
                const value = chosenFilters[key];
                return value && Object.values(value).some((v) => v !== undefined);
              }).length
            }
          </div>
        )}
      </button>
      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap flex-col justify-start gap-4 mt-2 p-4 border border-gray-300 rounded"
        >
          <div className="flex flex-wrap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {allFilters
              .filter((filter) => filter.filterable)
              .map((filter) => (
                <div
                  key={filter.key}
                  className="flex flex-col border border-gray-300 p-2"
                >
                  <TableFilter
                    filter={filter}
                    handleFilterChange={handleFilterChange}
                    value={localFilters[filter.key] as TableFilterValue}
                  />
                  {errors[filter.key] && (
                    <div className="text-red-500 text-xs mt-1">{errors[filter.key]}</div>
                  )}
                </div>
              ))}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default"
              disabled={Object.keys(errors).length > 0}
            >
              Apply Filters
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TableFilters;
