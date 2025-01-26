import React, { useState, Suspense } from "react";
import { TfiAlignJustify } from "react-icons/tfi";
import CircularProgress from "@mui/material/CircularProgress";

import AccountProfile from "../components/AccountProfile";
import Navbar from "../components/Navbar";

const Dashboard = React.lazy(() => import("./Dashboard"));
const Customer = React.lazy(() => import("./Customer"));
const Product = React.lazy(() => import("./Product"));
// const Compare = React.lazy(() => import("./Compare"));
// const Transaction = React.lazy(() => import("./Transaction"));

const Home = () => {
  const [isNavShow, setIsNavShow] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const changeRenderContent = (data) => {
    // console.log(data);
    setCurrentPage(data);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "customer":
        return <Customer />;
      case "product":
        return <Product />;
      // case "transaction":
      //   return <Transaction />;
      // case "compare":
      //   return <Compare />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-screen">
      <header className="flex p-3 bg-slate-600 border rounded-xl text-white justify-between">
        <div className="flex items-center">
          <TfiAlignJustify
            className="me-3 text-lg inline hover:cursor-pointer"
            onClick={() => setIsNavShow(!isNavShow)}
          />
          <h1 className="text-sans text-2xl text-opacity-100 font-bold">
            Kiosk Apps
          </h1>
        </div>
        <div className="relative flex flex-col">
          <AccountProfile />
        </div>
      </header>
      <div className="flex flex-1">
        <Navbar navShow={isNavShow} onRenderData={changeRenderContent} />
        <Suspense
          fallback={
            <div className="h-screen w-screen flex flex-col items-center justify-center">
              <CircularProgress />
            </div>
          }
        >
          <div className=" flex-1 w-full h-full m-1">{renderContent()}</div>
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
