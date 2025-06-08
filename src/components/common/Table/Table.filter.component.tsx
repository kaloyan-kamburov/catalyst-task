import { useState, useEffect } from "react";
import type { TableFilterType, TableFilterValue } from "./Table.types";

interface TableFilterProps {
  filter: TableFilterType;
  handleFilterChange: (key: string, value: TableFilterValue) => void;
  value?: TableFilterValue;
}

const TableFilter = ({ filter, handleFilterChange, value }: TableFilterProps) => {
  const [localValue, setLocalValue] = useState<TableFilterValue | undefined>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    switch (filter.type) {
      case "number":
        setLocalValue({ min: undefined, max: undefined });
        handleFilterChange(filter.key, { min: undefined, max: undefined });
        break;
      case "date":
        setLocalValue({ start: undefined, end: undefined });
        handleFilterChange(filter.key, { start: undefined, end: undefined });
        break;
      case "select":
        setLocalValue({ value: undefined });
        handleFilterChange(filter.key, { value: undefined });
        break;
    }
  };

  const handleChange = (newValue: TableFilterValue) => {
    const updatedValue = { ...localValue, ...newValue };
    setLocalValue(updatedValue);
    handleFilterChange(filter.key, updatedValue);
  };

  const renderFlter = () => {
    switch (filter.type) {
      case "number":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                placeholder="Min"
                className="flex-1 min-w-0 px-2 py-1 border border-gray-300 rounded"
                onChange={(e) =>
                  handleChange({
                    min: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                value={localValue?.min ?? ""}
              />
              <input
                type="number"
                placeholder="Max"
                className="flex-1 min-w-0 px-2 py-1 border border-gray-300 rounded"
                onChange={(e) =>
                  handleChange({
                    ...localValue,
                    max: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                value={localValue?.max ?? ""}
              />
            </div>
          </div>
        );

      case "date":
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="date"
              className="flex-1 min-w-0 px-2 py-1 border border-gray-300 rounded dark:color-scheme-dark"
              onChange={(e) =>
                handleChange({
                  ...localValue,
                  start: e.target.value || undefined,
                })
              }
              value={localValue?.start ?? ""}
            />
            <input
              type="date"
              className="flex-1 min-w-0 px-2 py-1 border border-gray-300 rounded"
              onChange={(e) =>
                handleChange({
                  ...localValue,
                  end: e.target.value || undefined,
                })
              }
              value={localValue?.end ?? ""}
            />
          </div>
        );

      case "select":
        return (
          <div className="flex flex-col gap-2">
            <select
              className="w-full px-2 py-1 border border-gray-300 rounded"
              onChange={(e) =>
                handleChange({
                  value: e.target.value || undefined,
                })
              }
              value={localValue?.value ?? ""}
            >
              <option value="">All</option>
              {filter.filterOptions?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <label className="text-sm font-medium mb-1 flex items-center justify-between">
        {filter.label}
        {localValue && Object.values(localValue).some((v) => v !== undefined) && (
          <button
            type="button"
            className="text-sm text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={handleClear}
          >
            <span className="sr-only">Clear filter</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </label>
      {renderFlter()}
    </>
  );
};

export default TableFilter;
