import React, { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import Divider from "./Divider";


const AccountProfile = () => {
  const [isDropdownShow, setIsDropdownShow] = useState(false);

  return (
    <>
      <MdAccountCircle
        className="text-3xl justify-self-end hover:cursor-pointer"
        onClick={() => setIsDropdownShow(!isDropdownShow)}
      />
      <div
        className={`absolute mt-12 right-0 bg-slate-600 text-white rounded ${
          isDropdownShow ? "" : "hidden"
        }`}
      >
        <ul className="p-1 text-lg font-semibold">
          <li>
            <button className="">Settings</button>
          </li>
          <Divider />
          <li>
            <button className="">Logout</button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AccountProfile;
