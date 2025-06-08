import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainRootPage from "../pages/MainRoot/MainRoot.page";
import ErrorGlobal from "../components/common/Errors/ErrorGlobal.component";

const HomePage = lazy(() => import("../pages/Home/Home.page"));
const TransactionPage = lazy(() => import("../pages/Transaction/Transaction.page"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainRootPage />,
    errorElement: <ErrorGlobal />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        index: true,
      },
      {
        path: "/transaction/:id",
        element: <TransactionPage />,
      },
    ],
  },
]);

export default router;
