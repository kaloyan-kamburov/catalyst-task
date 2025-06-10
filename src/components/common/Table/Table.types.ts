export interface TableColumn {
  key: string;
  label: string;
  type?: "string" | "number" | "date" | "select";
  align?: "text-left" | "text-center" | "text-right";
  render?: (row: TableRowType) => React.ReactNode;
  filterable?: boolean;
  filterType?: "range" | "date" | "select";
  filterOptions?: string[];
  sortable?: boolean;
}

export interface TableRowType {
  id: string | number;
  [key: string]: string | number | boolean | null | undefined;
}

export type TableMode = "server" | "client";

export interface TableType {
  url: string;
  columns: TableColumn[];
  pageSizeOptions?: number[];
  searchable?: boolean;
  minWidth?: number;
  csvExport?: boolean;
  mode?: TableMode;
}

export type TableFilterType = TableColumn & {
  filterable: boolean;
  filterType: "range" | "date" | "select";
};

export type TableFilterValueType = Partial<{
  min: number;
  max: number;
  start: string;
  end: string;
  value: string;
}>;

export type TableResponseType = {
  data: {
    data: TableRowType[];
    totalPages: number;
    totalRecords: number;
  };
};

export type TableSearchType = {
  setSearchText: (value: string) => void;
  setPage: (page: number) => void;
};

export type TableExportType = {
  url: string;
  setLoadingExport: (loading: boolean) => void;
};
