import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { axiosInstance } from "../../../shared/queryClient";
import LoaderInner from "../Loaders/LoaderInner.component";
import ErrorInner from "../Errors/ErrorInner.component";
import type { TransactionDetailsType } from "./TransactioDetails.types";
import type { AxiosResponse } from "axios";

interface TransactionDetailsProps {
  id: string;
}

// {"id":"tx_666888","amount":11.49,"currency":"EUR","status":"pending","date":"2024-06-01T12:30:00Z","description":"App subscription","merchant":"NotePro","customer":{"name":"Julia Chen","email":"jchen@example.com"},"paymentMethod":"credit_card","cardLast4":"6677","fees":0.4}

const TransactionDetails: FC<TransactionDetailsProps> = ({ id }) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => {
      const response: AxiosResponse<TransactionDetailsType> = await axiosInstance.get(
        `/transaction/${id}`
      );
      return response.data;
    },
  });

  return isLoading ? (
    <LoaderInner />
  ) : isError ? (
    <ErrorInner onRetry={refetch} errorText={error?.message} />
  ) : (
    <div className="flex flex-col">
      <h1 className="text-bold text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-2">
        Transaction Details
      </h1>
      <table className="table-auto w-full mt-[5px]">
        <tbody>
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="font-bold p-1">ID</td>
            <td>{data?.id}</td>
          </tr>
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="font-bold p-1">Amount</td>
            <td>{data?.amount}</td>
          </tr>
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="font-bold p-1">Currency</td>
            <td>{data?.currency}</td>
          </tr>
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="font-bold p-1">Status</td>
            <td>{data?.status}</td>
          </tr>
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="font-bold p-1">Date</td>
            <td>{new Date(data?.date ?? "").toLocaleDateString()}</td>
          </tr>
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="font-bold p-1">Description</td>
            <td>{data?.description}</td>
          </tr>
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="font-bold p-1">Merchant</td>
            <td>{data?.merchant}</td>
          </tr>
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="font-bold p-1">Customer</td>
            <td>{data?.customer.name}</td>
          </tr>
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="font-bold p-1">Payment Method</td>
            <td>{data?.paymentMethod}</td>
          </tr>
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="font-bold p-1">Card Last 4</td>
            <td>{data?.cardLast4}</td>
          </tr>
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="font-bold p-1">Fees</td>
            <td>{data?.fees}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TransactionDetails;
