import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Table from "./Table.component";
import type { TableColumn } from "./Table.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("react-hot-toast", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("../../../shared/queryClient", () => ({
  axiosInstance: {
    get: jest.fn(() =>
      Promise.resolve({
        data: {
          data: [
            { id: 1, name: "Alice", age: 30 },
            { id: 2, name: "Bob", age: 25 },
            { id: 3, name: "Charlie", age: 35 },
          ],
          totalPages: 1,
          totalRecords: 3,
        },
      })
    ),
  },
}));

jest.mock("../Loaders/LoaderInner.component", () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));

jest.mock("../Errors/ErrorInner.component", () => ({
  __esModule: true,
  default: () => <div data-testid="error">Error occurred</div>,
}));

jest.mock("./Table.filters.component", () => ({
  __esModule: true,
  default: () => <div data-testid="table-filters">Filters</div>,
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const mockColumns: TableColumn[] = [
  {
    key: "name",
    label: "Name",
    type: "string",
    sortable: true,
  },
  {
    key: "age",
    label: "Age",
    type: "number",
    sortable: true,
  },
];

const renderWithQuery = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("Table component", () => {
  beforeEach(() => {
    queryClient.clear();
  });

  describe("Client mode", () => {
    it("renders table with data", async () => {
      renderWithQuery(<Table columns={mockColumns} url="/api/test" mode="client" />);

      expect(screen.getByTestId("loader")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
        expect(screen.getByText("Charlie")).toBeInTheDocument();
      });
    });

    it("sorts table data when column header is clicked", async () => {
      renderWithQuery(<Table columns={mockColumns} url="/api/test" mode="client" />);

      await waitFor(() => {
        expect(screen.getByText("Age")).toBeInTheDocument();
      });

      const ageHeader = screen.getByText("Age");
      fireEvent.click(ageHeader);

      await waitFor(() => {
        const rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveTextContent("Bob");
      });

      fireEvent.click(ageHeader);
      await waitFor(() => {
        const rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveTextContent("Charlie");
      });
    });

    it("filters table data using global search input", async () => {
      renderWithQuery(
        <Table columns={mockColumns} url="/api/test" mode="client" searchable />
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: "Bob" } });

      await waitFor(() => {
        expect(screen.getByText("Bob")).toBeInTheDocument();
        expect(screen.queryByText("Alice")).not.toBeInTheDocument();
        expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
      });
    });
  });

  describe("Server mode", () => {
    it("renders server-side data", async () => {
      renderWithQuery(<Table columns={mockColumns} url="/api/test" mode="server" />);

      expect(screen.getByTestId("loader")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Alice")).toBeInTheDocument();
      });
    });
  });
});
