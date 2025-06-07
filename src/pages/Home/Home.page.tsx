/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from "../../components/common/Table/Table.component";

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
  return (
    <div className="p-2">
      <Table
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
            type: "range",
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
        ]}
      />
    </div>
  );
};

export default Home;
