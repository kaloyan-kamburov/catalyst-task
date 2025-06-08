/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import Table from "../../components/common/Table/Table.component";
import { useState } from "react";
import type { TableMode } from "../../components/common/Table/Table.types";

/*
{
    id: "tx_345678",
    amount: 50.0,
    currency: "USD",
    status: "failed",
    date: "2024-01-14T09:15:00Z",
    description: "Subscription renewal",
    merchant: "StreamFlix",
    customer: {
      name: "Bob Wilson",
      email: "bob@example.com",
    },
    paymentMethod: "credit_card",
    cardLast4: "9012",
    fees: 1.5,
  },
*/

const Home = () => {
  const [mode, setMode] = useState<TableMode>("server");
  return (
    <>
      <div className="flex flex-col gap-4">
        {/* checkbox to toggle between server and client mode */}
        <div className="flex items-center gap-2 mb-[10px]">
          <label
            htmlFor="mode"
            className="flex items-center justify-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              id="mode"
              checked={mode === "server"}
              onChange={() => setMode(mode === "server" ? "client" : "server")}
            />
            <span>Server Mode</span>
          </label>
        </div>
      </div>
      <Table
        mode={mode}
        url="transactions"
        columns={[
          {
            key: "id",
            label: "ID",
            type: "string",
          },
          {
            key: "amount",
            label: "Amount",
            type: "number",
            filterable: true,
          },
          {
            key: "currency",
            label: "Currency",
            type: "string",
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            filterable: true,
            filterOptions: ["pending", "completed", "failed"],
          },
          {
            key: "date",
            label: "Date",
            type: "date",
            filterable: true,
          },
          {
            key: "description",
            label: "Description",
            type: "string",
          },
          {
            key: "customer.name",
            label: "Customer Name",
            render: (row: any) => row.customer?.name,
            type: "string",
          },
          {
            key: "customer.email",
            label: "Customer Email",
            render: (row: any) => row.customer.email,
            type: "string",
          },
          {
            key: "paymentMethod",
            label: "Payment Method",
            type: "string",
          },
          {
            key: "cardLast4",
            label: "Card Last 4",
            type: "string",
          },
          {
            key: "fees",
            label: "Fees",
            type: "number",
          },
          {
            key: "actions",
            label: "Actions",
            type: "string",
            sortable: false,
            render: (row: any) => (
              <Link className="text-blue-500" to={`/transaction/${row.id}`}>
                View
              </Link>
            ),
          },
        ]}
      />
    </>
  );
};

export default Home;
