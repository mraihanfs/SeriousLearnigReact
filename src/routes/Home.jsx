import React, { useState, Suspense } from "react";
import { TfiAlignJustify } from "react-icons/tfi";
import { MdHome } from "react-icons/md";
import { MdOutlineStore } from "react-icons/md";
import { MdOutlinePerson } from "react-icons/md";
import { MdOutlineInsertChart } from "react-icons/md";

import AccountProfile from "../components/AccountProfile";
import Navbar from "../components/Navbar";

const Dashboard = React.lazy(() => import("./Dashboard"));
// const Customer = React.lazy(() => import("./Customer"));
// const Product = React.lazy(() => import("./Product"));
// const Compare = React.lazy(() => import("./Compare"));
// const Bill = React.lazy(() => import("./Bill"));

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
      // case "customer":
      //   return <Customer />;
      // case "product":
      //   return <Product />;
      // case "bill":
      //   return <Bill />;
      // case "compare":
      //   return <Compare />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
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
      <div className="flex flex-1 overflow-hidden">
        <Navbar navShow={isNavShow} onRenderData={changeRenderContent} />
        <Suspense
          className="flex-1 w-full h-full"
          fallback={<div>Loading...</div>}
        >
          <div className="m-3">{renderContent()}</div>
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
