export interface TableColumn {
  key: string;
  label: string;
  type?: "string" | "number" | "date" | "select";
  align?: "text-left" | "text-center" | "text-right";
  render?: (row: TableRow) => React.ReactNode;
  filterable?: boolean;
  filterType?: "range" | "date" | "select";
  filterOptions?: string[];
  /** Whether the column is sortable. Defaults to true. Set to false to disable sorting. */
  sortable?: boolean;
}

export interface TableType {
  url: string;
  columns: TableColumn[];
  pageSizeOptions?: number[];
  /** Whether to enable search functionality. Defaults to true. */
  searchable?: boolean;
}

export type TableFilterType = TableColumn & {
  filterable: boolean;
  filterType: "range" | "date" | "select";
};

export type TableFilterValue = Partial<{
  min: number;
  max: number;
  start: string;
  end: string;
  value: string;
}>;

export interface TableRow {
  id: string | number;
  [key: string]: string | number | undefined;
}

export interface TableResponse {
  data: {
    data: TableRow[];
    totalPages: number;
    totalRecords: number;
  };
}
