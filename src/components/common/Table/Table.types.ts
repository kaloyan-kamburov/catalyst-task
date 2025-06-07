export interface TableType {
  url: string;
  columns: Array<{
    key: string;
    label: string;
    type?: string;
    align?: string;
    render?: (row: {
      [key: string]: number | string;
    }) => React.ReactNode | string | number;
    filterable?: boolean;
    sortable?: boolean;
  }>;
  pageSizeOptions?: number[];
  hideErrorToast?: boolean;
  hideSuccessToast?: boolean;
}

export type TableColumnType = {
  key: string;
  label: string;
  type: "string" | "number" | "date" | "boolean" | "select";
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "center" | "right";
  filterOptions?: string[];
  render?: (value: unknown) => React.ReactNode;
};

export type TableFilterType = {
  key: string;
  label: string;
  type: "range" | "select" | "date";
  filterable: boolean;
  filterOptions?: string[];
};

export type TableFilterValue = {
  [key: string]: string | number | undefined;
};

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
