import { Outlet } from "react-router-dom";
import Header from "../../components/common/Header/Header.component";
const MainRootPage = () => {
  return (
    <div className="flex flex-col h-full dark:text-white">
      <Header />
      <div className="flex-1 p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default MainRootPage;
