import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  darkScrollbar,
} from "@mui/material";
import React, { useState, Suspense } from "react";
import { TfiAlignJustify } from "react-icons/tfi";
import CircularProgress from "@mui/material/CircularProgress";

import AccountProfile from "../components/AccountProfile";
import Navbar from "../components/Navbar";
import LoadingScreen from "../components/LoadingScreen";

import transactionService from "../services/transactionService";
import LoadingSection from "../components/LoadingSection";
import { ErrorBoundary } from "react-error-boundary";
import {
  responseBrand,
  responseProduct,
  responseTransaction,
} from "../helper/inquiryData";

const Dashboard = React.lazy(() => import("./Dashboard"));
const Customer = React.lazy(() => import("./Customer"));
const Product = React.lazy(() => import("./Product"));
// const Compare = React.lazy(() => import("./Compare"));
const Transaction = React.lazy(() => import("./Transaction"));
const Brand = React.lazy(() => import("./Brand"));

const Home = () => {
  const [isNavShow, setIsNavShow] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [dataValidastion, setDataValidation] = useState({
    open: false,
    content: {},
    handling: null,
  });

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
      case "transaction":
        return <Transaction />;
      case "brand":
        return <Brand />;
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
        <ErrorBoundary
          FallbackComponent={({ error, resetErrorBoundary }) => {
            return (
              <DialogValidation
                open={true}
                content={error.response?.data?.status.contents["en"]}
                handlingRefresh={resetErrorBoundary}
              ></DialogValidation>
            );
          }}
        >
          <Suspense fallback={<LoadingSection />}>
            <div className=" flex-1 w-full h-full m-1">{renderContent()}</div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

const DialogValidation = ({ open, content, handlingRefresh }) => {
  const [dataDialog, setDataDialog] = useState({
    open,
    content,
  });
  const handleButtonClose = () => {
    setDataDialog({
      open: false,
      content,
    });

    switch (content?.flag) {
      case "TRANSACTION":
        responseTransaction.refresh();
        break;
      case "PRODUCT":
        responseProduct.refresh();
        break;
      default:
        responseBrand.refresh();
        break;
    }
    handlingRefresh()
  };

  return (
    <>
      <Dialog open={dataDialog.open} onClose={handleButtonClose}>
        <DialogTitle>{dataDialog.content.title}</DialogTitle>
        <DialogContent>{dataDialog.content.description}</DialogContent>
        <DialogActions>
          <Button onClick={handleButtonClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
