/* eslint-disable @typescript-eslint/no-explicit-any */
export type TableColumnType = "string" | "number" | "boolean" | "date";

export interface TableFilterType {
  key: string;
  label: string;
  type: TableColumnType;
  filterable: boolean;
  filterType?: "range" | "dateRange" | "select";
  filterOptions?: string[];
}

export interface TableType {
  url: string;
  columns: {
    key: string;
    label: string;
    type?: TableColumnType;
    align?: string;
    filterable?: boolean;
    filterType?: "range" | "dateRange" | "select";
    filterOptions?: string[];
    render?: (row: { [key: string]: any }) => React.ReactNode;
  }[];
  pageSizeOptions?: number[];
}

export type TableRow = {
  id: string | number;
  [key: string]: string | number;
};

export type TableResponse = {
  data: {
    data: TableRow[];
    totalPages: number;
    totalRecords: number;
  };
};
