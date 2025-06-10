import type { FC } from "react";
import toast from "react-hot-toast";

import type { TableExportType } from "./Table.types";
import { axiosInstance } from "../../../shared/queryClient";

const TableExport: FC<TableExportType> = ({ url, setLoadingExport }) => {
  const handleExport = async () => {
    setLoadingExport(true);
    try {
      const exportUrl = `${url}?export=true`;
      const response = await axiosInstance.get(exportUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const urlObj = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateTime = new Date().toLocaleDateString().replace(/_/, "-");
      link.href = urlObj;
      link.setAttribute("download", `export_${dateTime}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlObj);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error("Error while exporting to CSV");
    } finally {
      setLoadingExport(false);
    }
  };

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer min-w-[140px] text-center"
      onClick={handleExport}
    >
      Export to CSV
    </button>
  );
};

export default TableExport;
