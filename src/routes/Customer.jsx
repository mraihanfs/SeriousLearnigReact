import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import seperateData from "../helper/pagination";

import {
  MdNavigateBefore,
  MdNavigateNext,
  MdSkipNext,
  MdSkipPrevious,
} from "react-icons/md";

import {
  Modal,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import TabPanel from "../components/TabPanel";

import { CUSTOMERS } from "../constants/DataMock";
import { FIELDS_NAME_CUSTOMER } from "../constants/FieldName";
import {
  CSSPROPERTYTAB,
  DELETEBUTTON,
  CANCELBUTTON,
  CSSPROPERTYDIALOG,
  UPDATEBUTTON,
  DATANOTFOUND,
  WORDINGDATATABLE,
} from "../constants/PropertyCss";
import { CUSTOMER_TYPES } from "../constants/DataInput";

// const dataNullCustomer = {
//   customerID: null,
//   name: null,
//   email: null,
//   phone: null,
//   address: null,
//   customerType: null,
// };

const Customer = () => {
  const [dataCustomer, setDataCustomer] = useState(CUSTOMERS);
  const [dataShow, setDataShow] = useState([]);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(0);
  const [value, setValue] = useState("0");
  const uploadBulkFile = useRef(null);

  const [valueAddCustomer, setValueAddCustomer] = useState({
    customerType: "Restoran",
  });

  const [valueUpdateCustomer, setValueUpdateCustomer] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    customerType: "Restoran",
  });

  const [valueAddBulkCustomer, setValueAddBulkCustomer] = useState([]);
  const [dataAddBulkCustomer, setDataAddBulkCustomer] = useState([]);
  const [pageModal, setPageModal] = useState(0);

  const [dataDelete, setDataDelete] = useState({
    openDelete: false,
    idButton: "",
    idCustomer: 0,
  });

  const [dataUpdate, setDataUpdate] = useState({
    openUpdate: false,
    indexCustomer: 0,
  });

  useEffect(() => {
    setDataShow(seperateData(dataCustomer));
    setDataAddBulkCustomer(seperateData(valueAddBulkCustomer));
    console.log(valueAddBulkCustomer);
  }, [dataCustomer, valueAddBulkCustomer]);

  const findCustomerByName = (e) => {
    e.preventDefault();
    const searchQuery = e.target.value.toLowerCase();
    if (!searchQuery) {
      setDataCustomer(CUSTOMERS);
      setPage(0);
    } else {
      const filteredCustomer = dataCustomer.filter(
        (item) => item.name && item.name.toLowerCase().includes(searchQuery)
      );
      if (filteredCustomer.length === 0) {
        setDataCustomer([]);
      } else {
        setDataCustomer(filteredCustomer);
      }
      setPage(0);
    }
  };

  const handleButtonPrevious = (e) => {
    e.preventDefault();
    if (page !== 0) {
      setPage(page - 1);
    }
    console.log(page);
  };

  const handleButtonPreviousFirst = (e) => {
    e.preventDefault();
    if (page !== 0) {
      setPage(0);
    }
    console.log(page);
  };

  const handleButtonNext = (e) => {
    e.preventDefault();
    if (page !== 10) {
      setPage(page + 1);
    }
    console.log(page);
  };

  const handleButtonNextLast = (e) => {
    e.preventDefault();
    if (page !== 10) {
      setPage(dataShow.length - 1);
    }
    console.log(page);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenDialogDelete = (e) => {
    e.preventDefault();
    // console.log("Data delete before change: ", dataDelete);
    console.log(e.target.id);
    let [_, idCustomer] = e.target.id.split(".");
    idCustomer = +idCustomer;
    const newDataDelete = {
      openDelete: true,
      idButton: e.target.id,
      idCustomer: idCustomer,
    };
    console.log("Data delete after change: ", newDataDelete);
    setDataDelete(newDataDelete);
  };

  const handleCloseDialogDelete = () => {
    const newDataDelete = {
      openDelete: false,
      idButton: "",
      idCustomer: 0,
    };
    setDataDelete(newDataDelete);
  };

  const handleOpenDialogUpdate = (e) => {
    e.preventDefault();
    // console.log("Data delete before change: ", dataDelete);
    console.log(e.target.id);
    let [_, indexCustomer] = e.target.id.split(".");
    indexCustomer = +indexCustomer;
    const attributeOldData = dataCustomer[indexCustomer];
    const newDataUpdate = {
      openUpdate: true,
      indexCustomer: indexCustomer,
    };
    console.log("Data Update after change: ", newDataUpdate);
    setDataUpdate(newDataUpdate);
    console.log("Data attribute for edit: ", attributeOldData);
    setValueUpdateCustomer(attributeOldData);
  };

  const handleCloseDialogUpdate = () => {
    const newDataUpdate = {
      openUpdate: false,
      indexCustomer: 0,
    };
    setDataUpdate(newDataUpdate);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onHandleInputChange = (e) => {
    const { name, value } = e.target;
    setValueAddCustomer({ ...valueAddCustomer, [name]: value });
  };

  const onHandlingSubmitAddCustomer = (e) => {
    e.preventDefault();
    const customerId = dataCustomer[dataCustomer.length - 1].customerId + 1;
    // console.table({customerId, ...valueAddCustomer}),
    CUSTOMERS.push({ customerId, ...valueAddCustomer });
    setDataCustomer((prevData) => [
      ...prevData,
      { customerId, ...valueAddCustomer },
    ]);
    setValueAddCustomer({
      customerType: "Restoran",
    });
    // console.table(dataCustomer);
    handleCloseModal();
  };

  const onHandleUploadFile = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    console.log(file);

    if (!file) return;

    reader.onload = (e) => {
      const data = e.target.result;

      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      console.log(json);
      console.table(json);
      console.log("Before state update:", valueAddBulkCustomer);
      setValueAddBulkCustomer(json);
      console.log("After state update (immediate):", valueAddBulkCustomer);
    };

    reader.readAsArrayBuffer(file);
    uploadBulkFile.current.value = "";
  };

  const onHandleUploadButton = (e) => {
    document.getElementById("uploadBulkFile").click();
  };

  const onSubmitBulkData = (e) => {
    e.preventDefault();
    const initID = dataCustomer[dataCustomer.length - 1].id + 1;
    const dataToAdd = valueAddBulkCustomer.map((valueCustomer, index) => {
      return {
        id: initID + index,
        ...valueCustomer,
      };
    });
    console.log(dataToAdd);
    console.log(dataCustomer);

    const newDatatoAdd = [...dataCustomer].concat(dataToAdd);
    console.log(newDatatoAdd);
    setDataCustomer(newDatatoAdd);
    setDataShow(seperateData(newDatatoAdd));
    setValueAddBulkCustomer([]);
    setDataAddBulkCustomer([]);
    handleCloseModal();
  };

  const onDeleteData = (e) => {
    e.preventDefault();
    let [idButton, idItem] = e.target.id.split(".");
    idItem = +idItem;
    // console.log(idItem, typeof idItem);
    if (idButton === "ItemAddBulk") {
      const oldData = [...valueAddBulkCustomer];

      if (Array.isArray(oldData)) {
        if (idItem >= 0 && idItem < oldData.length) {
          oldData.splice(idItem, 1);
        } else {
          console.error("Invalid index to remove:", idItem);
        }
      } else {
        console.error(
          "valueAddBulkCustomer is not an array:",
          valueAddBulkCustomer
        );
      }
      setValueAddBulkCustomer(oldData);
    } else {
      const oldData = [...dataCustomer];
      // console.log("this old data before delete");
      // // console.table(oldData);

      if (Array.isArray(oldData)) {
        if (idItem >= 0 && idItem < oldData.length) {
          oldData.splice(idItem, 1);
          CUSTOMERS.splice(idItem, 1);

          // console.log("This old Data after delete:");
          // console.table(oldData);
          // console.log("This customers data after delete:");
          // console.table(CUSTOMERS);
        } else {
          console.error("Invalid index to remove:", idItem);
        }
      } else {
        console.error("dataCustomer is not an array:", dataCustomer);
      }
      setDataCustomer(oldData);
      // console.log("Page before update: ", page);
      // console.log("dataShow length: ", dataShow[dataShow.length - 1].length);
      // console.log("Check condition is run ", dataShow[dataShow.length - 1].length === 1)
      if (dataShow[dataShow.length - 1].length === 1) {
        handleButtonPrevious(e);
      }
      console.log("Page after update: ", page);
      setDataDelete({
        openDelete: false,
        idButton: "",
        idCustomer: 0,
      });
    }
  };

  const onHandleInputChangeUpdate = (e) => {
    const { name, value } = e.target;

    setValueUpdateCustomer({ ...valueUpdateCustomer, [name]: value });
  };

  const onUpdateData = (e) => {
    e.preventDefault();
    let indexItem = dataUpdate.indexCustomer;
    const tempDataCust = [...dataCustomer];
    // console.log("This data Customer before update:");
    // console.log(dataCustomer[indexItem]);
    // console.log("This Customer data before delete:");
    // console.log(CUSTOMERS[indexItem]);

    CUSTOMERS.splice(indexItem, 1, valueUpdateCustomer);
    tempDataCust.splice(indexItem, 1, valueUpdateCustomer);
    // console.log("This data Customer after update:");
    // console.log(dataCustomer[indexItem]);
    // console.log("This Customer data after delete:");
    // console.log(CUSTOMERS[indexItem]);
    setDataCustomer(tempDataCust);
    setDataUpdate({
      openUpdate: false,
      indexCustomer: 0,
    });
  };

  const onDownloadDataCustomer = (e) => {
    e.preventDefault();
    const workbook = XLSX.utils.book_new();
    const now = new Date();
    const nameFile =
      "dataCustomer" +
      now.toLocaleDateString() +
      now.toLocaleTimeString() +
      ".xlsx";
    let worksheet;
    if (dataCustomer.length > 0) {
      worksheet = XLSX.utils.json_to_sheet(dataCustomer);
      XLSX.utils.book_append_sheet(workbook, worksheet, "List Customer");
      XLSX.writeFile(workbook, nameFile);
    } else {
      alert("Data pelanggan tidak ada");
    }
  };

  return (
    <div className="flex flex-col bg-slate-600 h-full border rounded-xl">
      <div className="flex justify-between w-full sticky top-0 bg-slate-600">
        <input
          type="text"
          name="search"
          id=""
          className="h-12 m-5 w-72 rounded-lg"
          placeholder="Search Customer"
          onChange={findCustomerByName}
        />
        <div className="">
          <button
            className="rounded-xl bg-green-600 text-white font-bold h-12 my-5 me-5 ms-2 w-32 hover:cursor-pointer"
            onClick={handleOpenModal}
          >
            + Add
          </button>
          <button
            className="rounded-xl bg-green-600 text-white font-bold h-12 my-5 me-5 ms-2 w-32 hover:cursor-pointer"
            onClick={onDownloadDataCustomer}
          >
            Download
          </button>
        </div>
      </div>

      <table className="table-auto bg-white m-3 text-black overflow-y-auto">
        <thead className="border border-black">
          <tr className="text-xl">
            {FIELDS_NAME_CUSTOMER.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center border border-black">
          {dataShow.length > 0 ? (
            dataShow[page].map((customer, index) => (
              <tr key={customer.id} className="border border-black">
                <td>{page * 10 + index + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td>{customer.customerType}</td>
                <td>
                  <button
                    className={UPDATEBUTTON}
                    id={"updateCustomer." + (page * 10 + index)}
                    onClick={handleOpenDialogUpdate}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className={DELETEBUTTON}
                    id={"deleteCustomer." + (page * 10 + index)}
                    onClick={handleOpenDialogDelete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={DATANOTFOUND}>
                No Customer available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex text-white justify-end m-3">
        <div className="flex border border-white text-3xl items-center rounded-lg">
          <MdSkipPrevious
            className="border-r"
            onClick={handleButtonPreviousFirst}
          />
          <MdNavigateBefore
            className="border-r"
            onClick={handleButtonPrevious}
          />
          <h1 className="border-r text-2xl p-1">
            {page + 1}/{dataShow.length}
          </h1>
          <MdNavigateNext className="border-r" onClick={handleButtonNext} />
          <MdSkipNext className="border-r" onClick={handleButtonNextLast} />
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-Add-Data"
        aria-describedby="modal-modal-add-data-by-one-and-bulk"
      >
        <div
          className=" bg-slate-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          border rounded-xl p-3 shadow-lg min-h-[425px] w-3/6"
        >
          <header className="flex justify-between mb-2 items-center">
            <h2 className="text-white text-2xl font-bold font-sans">
              Add Customer Data
            </h2>
            <button
              onClick={handleCloseModal}
              className="text-red-500 text-2xl font-bold font-sans"
            >
              &times;
            </button>
          </header>
          <hr />
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs for add data"
            sx={CSSPROPERTYTAB}
          >
            <Tab label="One Data" value="0" />
            <Tab label="Bulk Data" value="1" />
          </Tabs>
          <TabPanel index="0" value={value} key="0">
            <label className="block">
              <span className="text-white block">Nama Customer</span>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring"
                onChange={onHandleInputChange}
              />
            </label>
            <label className="block">
              <span className="text-white block">Alamat Pelanggan</span>
              <input
                type="text"
                name="address"
                id="address"
                className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring"
                onChange={onHandleInputChange}
              />
            </label>

            <label className="block">
              <span className="text-white block">E-mail Pelanggan</span>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring"
                onChange={onHandleInputChange}
              />
            </label>
            <div className="flex w-full my-3">
              <label className="inline w-1/2 me-3">
                <span className="text-white block">Jenis Pelanggan</span>
                <select
                  type="text"
                  name="customerType"
                  id="customerType"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-full"
                  onChange={onHandleInputChange}
                >
                  {CUSTOMER_TYPES.length > 0 &&
                    CUSTOMER_TYPES.map((customerType, index) => (
                      <option key={index} value={customerType}>
                        {customerType}
                      </option>
                    ))}
                </select>
              </label>
              <label className="inline w-1/2">
                <span className="text-white block">No. HP Pelanggan</span>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring"
                  onChange={onHandleInputChange}
                />
              </label>
            </div>

            <button
              className="border mt-3 py-3 px-5 rounded-xl text-sans bg-slate-300"
              onClick={onHandlingSubmitAddCustomer}
            >
              Submit
            </button>
          </TabPanel>
          <TabPanel index="1" value={value} key="0">
            <header className="flex justify-end">
              <button
                className="rounded-xl bg-green-600 text-white text-xs font-semibold h-12 me-1 ms-2 w-20 hover:cursor-pointer"
                // onClick={}
              >
                <a
                  href="/TemplateCustomer.xlsx"
                  target="_blank"
                  rel="noreferrer"
                  download="Template Upload Bulk Customer"
                >
                  Download Template
                </a>
              </button>
              <input
                className="hidden"
                type="file"
                name="uploadBulkFile"
                id="uploadBulkFile"
                onChange={onHandleUploadFile}
                ref={uploadBulkFile}
              />
              <button
                className="rounded-xl bg-green-600 text-white font-bold h-12 me-1 ms-2 w-28 hover:cursor-pointer"
                onClick={onHandleUploadButton}
              >
                Upload
              </button>
            </header>
            <div className="overflow-x-auto w-full">
              <table className="table-auto w-full bg-white my-3 text-black border border-black">
                <thead className="border border-black">
                  <tr className="text-lg">
                    {FIELDS_NAME_CUSTOMER.map((field, index) => (
                      <th
                        key={index}
                        className="px-4 py-2 border border-black whitespace-nowrap"
                      >
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-center border border-black max-w-fit">
                  {dataAddBulkCustomer.length > 0 ? (
                    dataAddBulkCustomer[pageModal].map((customer, index) => (
                      <tr
                        key={(index + 1) * (pageModal + 1)}
                        className="border border-black odd:bg-white even:bg-gray-300"
                      >
                        <td className={WORDINGDATATABLE}>
                          {page * 10 + index + 1}
                        </td>
                        <td className={WORDINGDATATABLE}>{customer.name}</td>
                        <td className={WORDINGDATATABLE}>{customer.email}</td>
                        <td className={WORDINGDATATABLE}>{customer.phone}</td>
                        <td className={WORDINGDATATABLE}>{customer.address}</td>
                        <td className={WORDINGDATATABLE}>
                          {customer.customerType}
                        </td>
                        <td className={WORDINGDATATABLE}>
                          <button
                            className={DELETEBUTTON}
                            onClick={onDeleteData}
                            id={"ItemAddBulk." + index}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-3 text-center text-gray-500"
                      >
                        Data Customer belum di upload
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button
              className="border mt-3 py-3 px-5 rounded-xl text-sans bg-slate-300"
              onClick={onSubmitBulkData}
            >
              Submit
            </button>
          </TabPanel>
        </div>
      </Modal>
      <Dialog
        open={dataDelete.openDelete}
        onClose={handleCloseDialogDelete}
        aria-labelledby="alert-dialog-delete"
        aria-describedby="alert-dialog-delete-data-customer"
        sx={CSSPROPERTYDIALOG}
      >
        <DialogTitle id="alert-dialog-title">
          {"Apakah Anda yakin ingin menghapus pelanggan berikut ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-name-of-customer"
            sx={{ color: "white" }}
          >
            {`Customer yang ingin anda hapus adalah ${
              dataCustomer.length > 0 &&
              dataCustomer[dataDelete.idCustomer].name
            }`}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="px-3">
          <button
            onClick={onDeleteData}
            id={dataDelete.idButton}
            className={DELETEBUTTON}
          >
            Delete
          </button>
          <button
            onClick={handleCloseDialogDelete}
            autoFocus
            className={CANCELBUTTON}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={dataUpdate.openUpdate}
        onClose={handleCloseDialogUpdate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={CSSPROPERTYDIALOG}
      >
        <DialogTitle id="alert-dialog-title">
          <header className="flex justify-between mb-2 items-center">
            <h2 className="text-black text-2xl font-bold font-sans">
              {`Update Customer Data ${
                dataCustomer.length > 0 &&
                dataCustomer[dataUpdate.indexCustomer].name
              }`}
            </h2>
          </header>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className="text-black"
          >
            <label className="block">
              <span className="text-black block">Nama Customer</span>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring"
                onChange={onHandleInputChangeUpdate}
                value={valueUpdateCustomer.name}
              />
            </label>
            <label className="block">
              <span className="text-black block">Alamat Pelanggan</span>
              <input
                type="text"
                name="address"
                id="address"
                className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring"
                onChange={onHandleInputChangeUpdate}
                value={valueUpdateCustomer.address}
              />
            </label>
            <label className="block">
              <span className="text-black block">E-mail Pelanggan</span>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring"
                onChange={onHandleInputChangeUpdate}
                value={valueUpdateCustomer.email}
              />
            </label>
            <div className="flex w-full my-3">
              <label className="inline w-1/2 me-3">
                <span className="text-black block">Jenis Pelanggan</span>
                <select
                  type="text"
                  name="customerType"
                  id="customerType"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-full"
                  onChange={onHandleInputChangeUpdate}
                  value={valueUpdateCustomer.customerType}
                >
                  {CUSTOMER_TYPES.length > 0 &&
                    CUSTOMER_TYPES.map((unit, index) => (
                      <option key={index} value={unit}>
                        {unit}
                      </option>
                    ))}
                </select>
              </label>
              <label className="inline w-1/2">
                <span className="text-black block">No. HP Pelanggan</span>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring"
                  onChange={onHandleInputChangeUpdate}
                  value={valueUpdateCustomer.phone}
                />
              </label>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="px-3">
          <button onClick={onUpdateData} className={UPDATEBUTTON}>
            Update
          </button>
          <button
            onClick={handleCloseDialogUpdate}
            autoFocus
            className={CANCELBUTTON}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Customer;
