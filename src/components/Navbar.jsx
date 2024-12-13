import React, { useState } from "react";
import { MdHome } from "react-icons/md";
import { MdOutlineStore } from "react-icons/md";
import { MdOutlinePerson } from "react-icons/md";
import { MdOutlineInsertChart } from "react-icons/md";
import { MdSearch } from "react-icons/md";


const Navbar = ({ navShow, onRenderData }) => {
  const sendData = (data) => {
    onRenderData(data);
  };

  return (
    <nav
      className={`flex flex-col items-start h-full border rounded-xl bg-slate-600 text-white pt-3 ps-3 m-1 ${
        navShow ? "w-48" : "w-16"
      } sticky top-0 left-0 overflow-y-auto`} 
    >
      <ul>
        <li
          className="flex border border-white hover:cursor-pointer"
          key="dashboard"
          onClick={() => sendData("dashboard")}
        >
          <MdHome className="text-3xl mx-1" />
          <h2 className={navShow ? "" : "hidden"}>Home</h2>
        </li>
        <li
          className="flex mt-3 hover:cursor-pointer"
          key="product"
          onClick={() => sendData("product")}
        >
          <MdOutlineStore className="text-3xl mx-1" />
          <h2 className={navShow ? "" : "hidden"}>Product</h2>
        </li>
        <li
          className="flex mt-3 hover:cursor-pointer"
          key="customer"
          onClick={() => sendData("customer")}
        >
          <MdOutlinePerson className="text-3xl mx-1" />
          <h2 className={navShow ? "" : "hidden"}>Customer</h2>
        </li>
        <li
          className="flex mt-3 hover:cursor-pointer"
          key="report"
          onClick={() => sendData("report")}
        >
          <MdOutlineInsertChart className="text-3xl mx-1" />
          <h2 className={navShow ? "" : "hidden"}>Transaction</h2>
        </li>
        {/* <li
          className="flex mt-3 hover:cursor-pointer items-center"
          key="report"
          onClick={() => sendData("report")}
        >
          <MdSearch className="text-3xl mx-1" />
          <h2 className={navShow ? "" : "hidden"}>Compare Market</h2>
        </li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
