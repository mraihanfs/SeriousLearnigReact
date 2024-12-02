import React from "react";
import { MdHome } from "react-icons/md";
import { MdOutlineStore } from "react-icons/md";
import { MdOutlinePerson } from "react-icons/md";
import { MdOutlineInsertChart } from "react-icons/md";

const Navbar = ({ navShow }) => {
  return (
    <nav
      className={`flex flex-col items-start h-screen border rounded-xl bg-slate-600 text-white pt-3 ps-3 ${
        navShow ? "w-36" : "w-16"
      }`}
    >
      <ul>
        <li className="flex border border-white">
          <MdHome className="text-3xl mx-1" />
          <h2 className={navShow ? "" : "hidden"}>Summary</h2>
        </li>
        <li className="flex mt-3">
          <MdOutlineStore className="text-3xl me-3" />
          <h2 className={navShow ? "" : "hidden"}>Product</h2>
        </li>
        <li className="flex mt-3">
          <MdOutlinePerson className="text-3xl me-3" />
          <h2 className={navShow ? "" : "hidden"}>Customer</h2>
        </li>
        <li className="flex mt-3">
          <MdOutlineInsertChart className="text-3xl me-3" />
          <h2 className={navShow ? "" : "hidden"}>Report</h2>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
