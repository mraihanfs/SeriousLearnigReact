import React, { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import Divider from "./DividerHorizontal";
import { useNavigate } from "react-router-dom";
import DialogValidation from "../components/DialogValidation";
import authServices from "../services/authService";
import LoadingScreen from "../components/LoadingScreen";


const AccountProfile = () => {
  const [isDropdownShow, setIsDropdownShow] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [content, setContent] = useState({});
  const [handle, setHandle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const goToLoginPage = () => navigate("/");

  const closeDialogOnSuccessLogout = () => {
    setOpenDialog(false);
    setContent({});
  };

  const handleLogoutSuccess = () => {
    closeDialogOnSuccessLogout();
    setHandle(null);
    goToLoginPage();
  };

  const logout = async () => {
    try {
      setIsLoading(true)
      const resp = await authServices.logout();
      console.log("Logout Successfull", resp);
      setIsLoading(false)
      setOpenDialog(true);
      setContent(resp.data.content["ID"]);
      setHandle(() => handleLogoutSuccess);
    } catch (err) {
      console.error(
        "Logout Failed",
        err.response?.data?.responseKey || err.message
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      <MdAccountCircle
        className="text-3xl justify-self-end hover:cursor-pointer"
        onClick={() => setIsDropdownShow(!isDropdownShow)}
      />
      <div
        className={`absolute mt-12 right-0 bg-slate-600 text-white rounded border border-black shadow-lg z-10 ${
          isDropdownShow ? "" : "hidden"
        }`}
      >
        <ul className="p-1 text-lg font-semibold">
          <li>
            <button className="">Settings</button>
          </li>
          <Divider />
          <li>
            <button onClick={logout} className="">
              Logout
            </button>
          </li>
        </ul>
      </div>
      <DialogValidation
        open={openDialog}
        content={content}
        handleButton={handle}
      />
    </>
  );
};

export default AccountProfile;
