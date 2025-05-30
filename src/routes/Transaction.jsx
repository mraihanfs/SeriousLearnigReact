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
  Divider,
} from "@mui/material";
import TabPanel from "../components/TabPanel";

import { CUSTOMERS, PRODUCTS } from "../constants/DataMock";
import {
  FIELDS_NAME_PRODUCT_OF_TRANSACTION,
  FIELDS_NAME_TRANSACTION,
} from "../constants/FieldName";
import {
  CSSPROPERTYTAB,
  DELETEBUTTON,
  CSSPROPERTYDIALOG,
  UPDATEBUTTON,
  DATANOTFOUND,
  WORDINGDATATABLE,
  ADDBUTTON,
  VALIDATIONRULE,
} from "../constants/PropertyCss";
import {
  changeCurrencyForm,
  changeFormatDate,
  columnToNumber,
} from "../helper/convert";

import DividerHorizontal from "../components/DividerHorizontal";
import {
  calculateTotal,
  calculateTotalPerProduct,
  getDateTimeNow,
  reduceNumber,
} from "../helper/calculation";
import transactionService from "../services/transactionService";
import { responseTransaction } from "../helper/inquiryData";
import { useFieldArray, useForm } from "react-hook-form";
import { VALIDATION_ERROR_ADD } from "../constants/DataInput";
import DialogValidation from "../components/DialogValidation";

// const dataNullCustomer = {
//   customerID: null,
//   name: null,
//   email: null,
//   phone: null,
//   address: null,
//   customerType: null,
// };

const productNull = {
  id: 0,
  productName: "",
  unit: "",
  harga: 0,
  qty: 0,
  total: 0,
};

const Transaction = () => {
  const rawDataTransaction = responseTransaction.read();
  // console.log(rawDataTransaction);
  const [dataTransaction, setDataTransaction] = useState(rawDataTransaction);
  const [dataShow, setDataShow] = useState([]);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(0);
  const [valueTab, setValueTab] = useState("0");
  const uploadBulkFile = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    getValues,
    setValue,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    // defaultValues: {
    //   // productToBuy: [{ product: "", qty: 0, total: 0 }],
    // },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productToBuy",
  });

  const [valueAddTransaction, setValueAddTransaction] = useState({
    transactionType: "Restoran",
  });

  const [valueUpdateTransaction, setValueUpdateTransaction] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    transactionType: "Restoran",
  });

  const [valueAddBulkTransaction, setValueAddBulkTransaction] = useState([]);
  const [dataAddBulkTransaction, setDataAddBulkTransaction] = useState([]);
  const [pageModal, setPageModal] = useState(0);

  const [dataDelete, setDataDelete] = useState({
    openDelete: false,
    idButton: "",
    idTransaction: 0,
  });

  const [dataView, setDataView] = useState({
    openView: false,
    indexTransaction: 0,
  });

  const [customerSelected, setCustomerSelected] = useState({
    customerId: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    customerType: "",
  });

  const [sum, setSum] = useState(0);

  const [listProduct, setListProduct] = useState([]);

  const dataCustomer = watch("customer", "");
  const dataProductToBuy = watch("productToBuy");

  const [attrDialogValidation, setAttrDialogValidation] = useState({
    open: false,
    content: {},
    handling: null,
  });

  useEffect(() => {
    setDataShow(seperateData(dataTransaction));
    setDataAddBulkTransaction(seperateData(valueAddBulkTransaction));
  }, [dataTransaction, valueAddBulkTransaction]);

  const findTransactionByName = (e) => {
    e.preventDefault();
    const searchQuery = e.target.value.toLowerCase();
    if (!searchQuery) {
      setDataTransaction(rawDataTransaction);
      setPage(0);
    } else {
      const filteredTransaction = dataTransaction.filter(
        (item) => item.name && item.name.toLowerCase().includes(searchQuery)
      );
      if (filteredTransaction.length === 0) {
        setDataTransaction([]);
      } else {
        setDataTransaction(filteredTransaction);
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
    if (page !== dataShow.length - 1) {
      setPage(page + 1);
    }
    console.log(page);
  };

  const handleButtonNextLast = (e) => {
    e.preventDefault();
    if (page !== dataShow.length - 1) {
      setPage(dataShow.length - 1);
    }
    console.log(page);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    reset();
  };

  const emptyAddTransaction = () => {
    setCustomerSelected({
      customerId: null,
      name: "",
      email: "",
      phone: "",
      address: "",
      customerType: "",
    });
    setListProduct([]);
    setSum(0);
  };

  const handleOpenDialogDelete = (e) => {
    e.preventDefault();
    // console.log("Data delete before change: ", dataDelete);
    console.log(e.target.id);
    let [_, idTransaction] = e.target.id.split(".");
    idTransaction = +idTransaction;
    const newDataDelete = {
      openDelete: true,
      idButton: e.target.id,
      idTransaction: idTransaction,
    };
    console.log("Data delete after change: ", newDataDelete);
    setDataDelete(newDataDelete);
  };

  const handleCloseDialogDelete = () => {
    const newDataDelete = {
      openDelete: false,
      idButton: "",
      idTransaction: 0,
    };
    setDataDelete(newDataDelete);
  };

  const handleOpenDialogDetail = (e) => {
    e.preventDefault();
    // console.log("Data delete before change: ", dataDelete);
    console.log(e.target.id);
    let [_, indexTransaction] = e.target.id.split(".");
    indexTransaction = +indexTransaction;
    const attributeOldData = dataTransaction[indexTransaction];
    const newDataView = {
      openView: true,
      indexTransaction: indexTransaction,
    };
    console.log("Data Update after change: ", newDataView);
    setDataView(newDataView);
    console.log("Data attribute for edit: ", attributeOldData);
    setValueUpdateTransaction(attributeOldData);
  };

  const handleCloseDialogDetail = () => {
    const newDataView = {
      openView: false,
      indexTransaction: 0,
    };
    setDataView(newDataView);
  };

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  const onHandleInputChange = (e) => {
    const { name, value } = e.target;
    setValueAddTransaction({ ...valueAddTransaction, [name]: value });
  };

  const onHandlingSubmitAddTransaction = (data) => {
    // console.log(JSON.parse(getValues("productToBuy.0.product")).unit);
    console.log(data);
    const parseCustomer = JSON.parse(data.customer);
    console.table(parseCustomer);
    const products = data.productToBuy;
    console.log(products);
    products.forEach((product) => {
      console.log(product);
    });
    // const oldData = [...dataTransaction];
    // const transactionId =
    //   dataTransaction[dataTransaction.length - 1].transactionID + 1;
    // const timestamp = getDateTimeNow();
    // const newDataTransaction = {
    //   transactionId: transactionId,
    //   ...customerSelected,
    //   productToBuy: listProduct,
    //   sum,
    //   timestamp,
    // };
    // // console.log(newDataTransaction),
    // rawDataTransaction.push(newDataTransaction);
    // oldData.push(newDataTransaction);
    // setDataTransaction(oldData);
    // console.table(dataTransaction);
    // emptyAddTransaction();
    // handleCloseModal();
  };

  const onHandlingCloseErrorValidation = () => {
    setAttrDialogValidation({
      open: false,
      content: {},
      handling: null,
    });
  };

  const onErrorSubmitAddTransction = (error) => {
    console.log("Validation Errors:", error);
    setAttrDialogValidation({
      open: true,
      content: VALIDATION_ERROR_ADD,
      handling: () => onHandlingCloseErrorValidation(),
    });
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
      console.log("Before state update:", valueAddBulkTransaction);
      setValueAddBulkTransaction(json);
      console.log("After state update (immediate):", valueAddBulkTransaction);
    };

    reader.readAsArrayBuffer(file);
    uploadBulkFile.current.value = "";
  };
  const onHandleCustomer = (index) => {};
  const onHandleUploadButton = (e) => {
    document.getElementById("uploadBulkFile").click();
  };

  const onSubmitBulkData = (e) => {
    e.preventDefault();
    const initID = dataTransaction[dataTransaction.length - 1].id + 1;
    const dataToAdd = valueAddBulkTransaction.map((valueTransaction, index) => {
      return {
        id: initID + index,
        ...valueTransaction,
      };
    });
    console.log(dataToAdd);
    console.log(dataTransaction);

    const newDatatoAdd = [...dataTransaction].concat(dataToAdd);
    console.log(newDatatoAdd);
    setDataTransaction(newDatatoAdd);
    setValueAddBulkTransaction([]);
    setDataAddBulkTransaction([]);
    handleCloseModal();
  };

  const onDeleteData = (e) => {
    e.preventDefault();
    let [idButton, idItem] = e.target.id.split(".");
    idItem = +idItem;
    // console.log(idItem, typeof idItem);
    if (idButton === "ItemAddBulk") {
      const oldData = [...valueAddBulkTransaction];

      if (Array.isArray(oldData)) {
        if (idItem >= 0 && idItem < oldData.length) {
          oldData.splice(idItem, 1);
        } else {
          console.error("Invalid index to remove:", idItem);
        }
      } else {
        console.error(
          "valueAddBulkCustomer is not an array:",
          valueAddBulkTransaction
        );
      }
      setValueAddBulkTransaction(oldData);
    } else {
      const oldData = [...dataTransaction];
      // console.log("this old data before delete");
      // // console.table(oldData);

      if (Array.isArray(oldData)) {
        if (idItem >= 0 && idItem < oldData.length) {
          oldData.splice(idItem, 1);
          rawDataTransaction.splice(idItem, 1);

          // console.log("This old Data after delete:");
          // console.table(oldData);
          // console.log("This customers data after delete:");
          // console.table(CUSTOMERS);
        } else {
          console.error("Invalid index to remove:", idItem);
        }
      } else {
        console.error("dataCustomer is not an array:", dataTransaction);
      }
      setDataTransaction(oldData);
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
        idTransaction: 0,
      });
    }
  };

  const onHandleInputChangeUpdate = (e) => {
    const { name, value } = e.target;

    setValueUpdateTransaction({ ...valueUpdateTransaction, [name]: value });
  };

  const onUpdateData = (e) => {
    e.preventDefault();
    let indexItem = dataView.indexTransaction;
    const tempDataCust = [...dataTransaction];
    // console.log("This data Customer before update:");
    // console.log(dataCustomer[indexItem]);
    // console.log("This Customer data before delete:");
    // console.log(CUSTOMERS[indexItem]);

    rawDataTransaction.splice(indexItem, 1, valueUpdateTransaction);
    tempDataCust.splice(indexItem, 1, valueUpdateTransaction);
    // console.log("This data Customer after update:");
    // console.log(dataCustomer[indexItem]);
    // console.log("This Customer data after delete:");
    // console.log(CUSTOMERS[indexItem]);
    setDataTransaction(tempDataCust);
    handleCloseDialogDetail();
  };

  const onDownloadDataTransaction = (index) => {
    console.log(index);

    const now = new Date();
    let workbook, sheetName, sheet;

    const startColCust = columnToNumber("D");
    const startRowCust = 1;
    console.log(startColCust);

    const colDate = columnToNumber("I");
    console.log(colDate);

    const rowDate = 1;

    const startColTrans = columnToNumber("B");
    const startRowTrans = 7;

    const colTotal = columnToNumber("F");

    let sumOfRow = startRowTrans;

    const nameFile =
      "dataTransaction" +
      now.toLocaleDateString() +
      now.toLocaleTimeString() +
      dataTransaction[index].name +
      dataTransaction[index].transactionID +
      ".xlsx";

    fetch("/TemplateDownloadTransaction.xlsx")
      .then((response) => response.arrayBuffer()) // Read file as binary buffer
      .then((arrayBuffer) => {
        workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });

        sheetName = workbook.SheetNames[0];
        sheet = workbook.Sheets[sheetName];

        // Insert Header excel
        sheet[XLSX.utils.encode_cell({ c: startColCust, r: startRowCust })] = {
          v: `: ${dataTransaction[index].name}`,
          t: "s",
        };
        sheet[
          XLSX.utils.encode_cell({ c: startColCust, r: startRowCust + 1 })
        ] = { v: `: ${dataTransaction[index].address}`, t: "s" };
        sheet[
          XLSX.utils.encode_cell({ c: startColCust, r: startRowCust + 2 })
        ] = { v: `: ${dataTransaction[index].email}`, t: "s" };
        sheet[
          XLSX.utils.encode_cell({ c: startColCust, r: startRowCust + 3 })
        ] = { v: `: ${dataTransaction[index].phone}`, t: "s" };
        sheet[XLSX.utils.encode_cell({ c: colDate, r: rowDate })] = {
          v: `: ${changeFormatDate(dataTransaction[index].timestamp)}`,
          t: "s",
        };

        // Insert data transaction

        dataTransaction[index].productToBuy.map((product, index) => {
          sheet[
            XLSX.utils.encode_cell({
              c: startColTrans,
              r: startRowTrans + index,
            })
          ] = { v: index + 1, t: "s" };
          sheet[
            XLSX.utils.encode_cell({
              c: startColTrans + 1,
              r: startRowTrans + index,
            })
          ] = { v: product.productName, t: "s" };
          sheet[
            XLSX.utils.encode_cell({
              c: startColTrans + 2,
              r: startRowTrans + index,
            })
          ] = { v: product.unit, t: "s" };
          sheet[
            XLSX.utils.encode_cell({
              c: startColTrans + 3,
              r: startRowTrans + index,
            })
          ] = { v: product.qty, t: "s" };
          sheet[
            XLSX.utils.encode_cell({
              c: startColTrans + 4,
              r: startRowTrans + index,
            })
          ] = { v: changeCurrencyForm(product.price), t: "s" };
          sheet[
            XLSX.utils.encode_cell({
              c: startColTrans + 5,
              r: startRowTrans + index,
            })
          ] = { v: changeCurrencyForm(product.total), t: "s" };
          sumOfRow += 1;
        });
        console.log(`Last row is ${sumOfRow}`);
        sheet[XLSX.utils.encode_cell({ c: colTotal, r: sumOfRow })] = {
          v: "Total Transaksi",
          t: "s",
        };
        sheet[XLSX.utils.encode_cell({ c: colTotal + 1, r: sumOfRow })] = {
          v: `: ${changeCurrencyForm(dataTransaction[index].sum)}`,
          t: "s",
        };

        sheet["!ref"] = `A1:I99999`;

        workbook.Sheets[sheetName] = sheet;

        XLSX.writeFile(workbook, nameFile);

        console.log("Data berhasil di export");
      })
      .catch((error) => console.error("Error loading Excel file:", error));
  };

  const onHandleDataCustomer = (e) => {
    console.log(getValues());
    const value = e.target.value;

    if (value != "") {
      setCustomerSelected(JSON.parse(value));
    } else {
      setCustomerSelected({
        customerId: null,
        name: "",
        email: "",
        phone: "",
        address: "",
        customerType: "",
      });
    }
  };

  const onHandleDataProduct = (e) => {
    console.log(getValues(`productToBuy.0.product`));
    const value = JSON.parse(e.target.value);
    console.log(value);
    const { indexList, ...dataProduct } = value;
    const oldListProduct = [...listProduct];
    console.log("this data before update");
    console.table(oldListProduct);
    console.table(indexList);
    console.table(dataProduct);
    if (dataProduct.productName != "") {
      oldListProduct[indexList] = {
        ...oldListProduct[indexList],
        ...dataProduct,
      };
      console.log("Data product before conditional");
      console.table(oldListProduct[indexList]);
      if (oldListProduct[indexList].qty != 0) {
        const total = calculateTotalPerProduct(
          oldListProduct[indexList].qty,
          oldListProduct[indexList].harga
        );
        oldListProduct[indexList] = {
          ...oldListProduct[indexList],
          total: total,
        };
      }
      console.log("This data after update with conditional");
      console.table(oldListProduct[indexList]);
    } else {
      oldListProduct[indexList] = productNull;
    }
    setListProduct(oldListProduct);
    const sumFunction = calculateTotal(listProduct, "total");
    // console.log(sum)
    setSum(sumFunction);
  };

  const onHandleQtyProduct = (index, value) => {
    const oldListProduct = [...listProduct];
    console.table(oldListProduct);
    oldListProduct[index].qty = value;
    oldListProduct[index].total = calculateTotalPerProduct(
      value,
      oldListProduct[index].harga
    );
    console.log(
      `Pembelian dengan harga ${oldListProduct[index].harga} dan total unit ${oldListProduct[index].qty} menjadi total ${oldListProduct[index].total}`
    );
    setListProduct(oldListProduct);
    const sumFunction = calculateTotal(listProduct, "total");
    // console.log(sum)
    setSum(sumFunction);
  };

  const onHandlingAddProduct = () => {
    setListProduct((prevList) => [...prevList, productNull]);
    console.log(listProduct.length);
  };

  const onHandlingDeleteProduct = () => {
    const oldData = [...listProduct];
    oldData.pop();
    setListProduct(oldData);
  };

  const getDataFormArray = (index, key) => {
    if (key) {
      return JSON.parse(getValues(`productToBuy.${index}.product`))[key];
    }
    return getValues(`productToBuy.${index}.product`);
  };

  return (
    <div className="flex flex-col bg-slate-600 h-full border rounded-xl">
      <div className="flex justify-between w-full sticky top-0 bg-slate-600">
        <input
          type="text"
          name="search"
          id=""
          className="h-12 m-5 w-72 rounded-lg"
          placeholder="Search Transaction"
          onChange={findTransactionByName}
        />
        <div className="">
          <button className={ADDBUTTON} onClick={handleOpenModal}>
            + Add
          </button>
        </div>
      </div>

      <table className="table-auto bg-white m-3 text-black overflow-y-auto">
        <thead className="border border-black">
          <tr className="text-xl">
            {FIELDS_NAME_TRANSACTION.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center border border-black">
          {dataShow.length > 0 ? (
            dataShow[page].map((transaction, index) => (
              <tr key={transaction.id} className="border border-black">
                <td>{page * 10 + index + 1}</td>
                <td>{changeFormatDate(transaction.timestamp)}</td>
                <td>{transaction.name}</td>
                <td>{changeCurrencyForm(transaction.sum)}</td>

                <td>
                  <button
                    className={UPDATEBUTTON}
                    id={"viewTransaction." + (page * 10 + index)}
                    onClick={handleOpenDialogDetail}
                  >
                    Show
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={DATANOTFOUND}>
                No Transaction available.
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
          border  p-3 shadow-lg min-h-[425px] w-2/3 overflow-y-scroll h-3/4"
        >
          <header className="flex justify-between mb-2 items-center">
            <h2 className="text-white text-2xl font-bold font-sans">
              Add Transaction Data
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
            value={valueTab}
            onChange={handleChange}
            aria-label="basic tabs for add data"
            sx={CSSPROPERTYTAB}
          >
            <Tab label="One Data" value="0" />
            <Tab label="Bulk Data" value="1" />
          </Tabs>
          <TabPanel index="0" value={valueTab} key="0">
            <h1 className="text-xl text-white font-sans font-semibold my-3">
              Data Pelanggan
            </h1>
            <DividerHorizontal />
            <div className="grid grid-cols-2 grid-flow-row gap-3">
              <div className="grid grid-cols-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white w-1/4">Nama</span>
                  <select
                    type="text"
                    name="customerName"
                    id="customerName"
                    className="ms-1 form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-3/4"
                    // onChange={(console.log(getValues()))}
                    {...register("customer", {
                      required: "Mohon pilih pelanggan terlebih dahulu",
                    })}
                  >
                    <option key="value-kosong" value={""}>
                      Mohon pilih salah satu pelanggan berikut
                    </option>
                    {CUSTOMERS.length > 0 &&
                      CUSTOMERS.map((customer, index) => (
                        <option
                          key={`customer-${index + 1}`}
                          value={JSON.stringify(customer)}
                        >
                          {customer.name}
                        </option>
                      ))}
                  </select>
                </div>
                <p className={VALIDATIONRULE}>{errors.customer?.message}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white w-1/4">e-mail</span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="ms-1 form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-3/4
                  overflow-x-auto"
                  value={dataCustomer ? JSON.parse(dataCustomer)?.email : ""}
                  readOnly
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white w-1/4">Jenis</span>
                <input
                  type="text"
                  name="custType"
                  id="custType"
                  className="ms-1 form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-3/4"
                  value={
                    dataCustomer ? JSON.parse(dataCustomer)?.customerType : ""
                  }
                  readOnly
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-white w-1/4">No. HP</span>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="ms-1 form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-3/4"
                  value={dataCustomer ? JSON.parse(dataCustomer)?.phone : ""}
                  readOnly
                />
              </div>
              <span className="text-white inline-block col-span-2">
                Alamat Pelanggan
              </span>
              <textarea
                type="text"
                name="address"
                id="address"
                className="my-1 form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-full h-24 col-span-2"
                value={dataCustomer ? JSON.parse(dataCustomer)?.address : ""}
                readOnly
              />
            </div>
            <h1 className="text-xl text-white font-sans font-semibold my-3">
              Data Product
            </h1>
            <DividerHorizontal />
            <table className="table-auto w-full bg-white my-3 text-black border border-black overflow-auto">
              <thead className="border border-black">
                <tr className="text-lg">
                  {FIELDS_NAME_PRODUCT_OF_TRANSACTION.map((field, index) => (
                    <th key={index} className="px-3 text">
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-center border border-black">
                {fields?.length > 0 ? (
                  <>
                    {fields.map((barang, indexList) => {
                      // console.log(
                      //   dataProductToBuy?.[indexList]?.product,
                      //   `On index list ${indexList}`
                      // );
                      const selectedProduct = dataProductToBuy?.[indexList]
                        ?.product
                        ? JSON.parse(dataProductToBuy?.[indexList]?.product)
                        : null;
                      return (
                        <tr key={barang.id}>
                          <td>{indexList + 1}</td>
                          <td>
                            <select
                              type="text"
                              name="productName"
                              id="productName"
                              className="ms-1 form-input rounded-md text-sans bg-slate-300
                    border-transparent focus:border-white-500 focus:bg-white focus:ring w-3/4 text-black"
                              onChange={onHandleDataProduct}
                              // Todo List make sure ketika di close modal nya masih ada
                              {...register(
                                `productToBuy.${indexList}.product`,
                                {
                                  required:
                                    "Mohon pilih produk terlebih dahulu",
                                  onChange: () => {
                                    setValue(
                                      `productToBuy.${indexList}.id`,
                                      selectedProduct?.id
                                    ),
                                      setValue(
                                        `productToBuy.${indexList}.productName`,
                                        selectedProduct?.productName
                                      );
                                    setValue(
                                      `productToBuy.${indexList}.unit`,
                                      selectedProduct?.unit
                                    );
                                    setValue(
                                      `productToBuy.${indexList}.harga`,
                                      selectedProduct?.harga
                                    );
                                    if (dataProductToBuy[indexList].qty && selectedProduct) {
                                      const harga = selectedProduct?.harga;
                                      let total =
                                        harga *
                                        dataProductToBuy[indexList]?.qty;
                                      setValue(
                                        `productToBuy.${indexList}.total`,
                                        total
                                      );
                                      const calculate = calculateTotal(
                                        dataProductToBuy,
                                        "total"
                                      );
                                      setSum(calculate);
                                    }
                                  },
                                }
                              )}
                            >
                              <option key="value-kosong" value={""}></option>
                              {PRODUCTS.length > 0 &&
                                PRODUCTS.map((product, indexProduct) => (
                                  <option
                                    key={`product-${indexProduct + 1}`}
                                    value={JSON.stringify({
                                      ...product,
                                    })}
                                  >
                                    {product.productName}
                                  </option>
                                ))}
                            </select>
                            <p className={VALIDATIONRULE}>
                              {
                                errors?.productToBuy?.[indexList]?.product
                                  ?.message
                              }
                            </p>
                          </td>
                          <td>{selectedProduct?.unit || ""}</td>
                          <td>
                            {selectedProduct?.harga &&
                              changeCurrencyForm(selectedProduct?.harga)}
                          </td>
                          <td>
                            <input
                              type="number"
                              className="w-1/2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              placeholder="0"
                              {...register(`productToBuy.${indexList}.qty`, {
                                required:
                                  "Mohon isi jumlah quantitas yang dibeli pelanggan",
                                min: {
                                  value: 0,
                                  message:
                                    "Mohon isi jumlah quantitas yang dibeli pelanggan lebih dari 1",
                                },
                                onChange: () => {
                                  const harga = selectedProduct?.harga;
                                  let total =
                                    harga * dataProductToBuy[indexList]?.qty;
                                  setValue(
                                    `productToBuy.${indexList}.total`,
                                    total
                                  );
                                  const calculate = calculateTotal(
                                    dataProductToBuy,
                                    "total"
                                  );
                                  setSum(calculate);
                                },
                              })}
                            />
                            <p className={VALIDATIONRULE + " text-left"}>
                              {errors?.productToBuy?.[indexList]?.qty?.message}
                            </p>
                          </td>
                          <td className="px-5">
                            {dataProductToBuy[indexList]?.total &&
                            typeof dataProductToBuy[indexList]?.total ==
                              "number"
                              ? changeCurrencyForm(
                                  dataProductToBuy[indexList].total
                                )
                              : ""}
                          </td>

                          <td>
                            <button
                              className="rounded-xl bg-red-600 p-1 hover:bg-red-300 text-white font-bold h-12 my-5 me-5 ms-2 w-32 hover:cursor-pointer"
                              onClick={() => {
                                remove(indexList);
                                setSum(
                                  reduceNumber(
                                    sum,
                                    dataProductToBuy[indexList].total
                                  )
                                );
                              }}
                            >
                              &times; Hapus
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={5} className="text-right font-bold pe-3">
                        Total Transaksi
                      </td>
                      <td className="text-center font-bold">
                        {typeof sum == "number" && changeCurrencyForm(sum)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-xl">
                      Belum ada data product, Mohon tambahkan dengan klik
                      <b>+ Tambahkan</b>
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan="7">
                    <button className={ADDBUTTON} onClick={() => append()}>
                      + Tambahkan
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              className="border mt-3 py-3 px-5 rounded-xl text-sans bg-slate-300"
              onClick={handleSubmit(
                onHandlingSubmitAddTransaction,
                onErrorSubmitAddTransction
              )}
            >
              Submit
            </button>
          </TabPanel>
          <TabPanel index="1" value={valueTab} key="0">
            <header className="flex justify-end">
              <button
                className="rounded-xl bg-green-600 text-white text-xs font-semibold h-12 me-1 ms-2 w-20 hover:cursor-pointer"
                // onClick={}
              >
                <a
                  href="/TemplateTransaction.xlsx"
                  target="_blank"
                  rel="noreferrer"
                  download="Template Upload Bulk Transaction"
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
                    {FIELDS_NAME_TRANSACTION.map((field, index) => (
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
                  {dataAddBulkTransaction.length > 0 ? (
                    dataAddBulkTransaction[pageModal].map(
                      (transaction, index) => (
                        <tr
                          key={(index + 1) * (pageModal + 1)}
                          className="border border-black odd:bg-white even:bg-gray-300"
                        >
                          <td className={WORDINGDATATABLE}>
                            {page * 10 + index + 1}
                          </td>
                          <td className={WORDINGDATATABLE}>
                            {transaction.name}
                          </td>
                          <td className={WORDINGDATATABLE}>
                            {transaction.email}
                          </td>
                          <td className={WORDINGDATATABLE}>
                            {transaction.phone}
                          </td>
                          <td className={WORDINGDATATABLE}>
                            {transaction.address}
                          </td>
                          <td className={WORDINGDATATABLE}>
                            {transaction.transactionType}
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
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-3 text-center text-gray-500"
                      >
                        Data Transaction belum di upload
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
        open={dataView.openView}
        onClose={handleCloseDialogDetail}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={CSSPROPERTYDIALOG}
      >
        <DialogTitle id="alert-dialog-title">
          <header className="flex justify-between mb-2 items-center">
            <h2 className="text-black text-2xl font-bold font-sans">
              {`Transaction Data ${
                dataTransaction?.length > 0 &&
                dataTransaction[dataView.indexTransaction].transactionID
              }`}
            </h2>
            <button
              onClick={handleCloseDialogDetail}
              className="text-red-500 text-2xl font-bold font-sans"
            >
              &times;
            </button>
          </header>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="">
            <table>
              <tr>
                <td>
                  <span className="text-black block">Nama Customer</span>
                </td>
                <td>
                  <span className="text-black block">
                    : {dataTransaction[dataView.indexTransaction]?.name}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text-black block">Alamat Pelanggan</span>
                </td>
                <td>
                  <span className="text-black block">
                    : {dataTransaction[dataView.indexTransaction]?.address}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text-black block">e-mail Pelanggan</span>
                </td>
                <td>
                  <span className="text-black block">
                    : {dataTransaction[dataView.indexTransaction]?.email}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="text-black block">
                    Nomor Telepon Pelanggan
                  </span>
                </td>
                <td>
                  <span className="text-black block">
                    : {dataTransaction[dataView.indexTransaction]?.phone}
                  </span>
                </td>
              </tr>
            </table>
            <table className="table-auto bg-white my-5 text-black overflow-y-auto">
              <thead className="border border-black">
                <tr className="text-base font-sans">
                  {FIELDS_NAME_PRODUCT_OF_TRANSACTION.map((column, index) => (
                    <th key={index} className="px-3 text">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-center border border-black">
                {dataTransaction[dataView.indexTransaction]?.productToBuy
                  .length > 0 ? (
                  <>
                    {dataTransaction[
                      dataView.indexTransaction
                    ].productToBuy?.map((product, index) => (
                      <tr key={index} className="border border-black">
                        <td className="px-3">{index + 1}</td>
                        <td className="px-3">{product.productName}</td>
                        <td className="text-center px-3">{product.unit}</td>
                        <td className="px-3">
                          {changeCurrencyForm(product.harga)}
                        </td>
                        <td className="text-center px-3">{product.qty}</td>
                        <td className="px-3">
                          {changeCurrencyForm(product.total)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={5} className="text-right font-bold pe-3">
                        {" "}
                        Total Transaksi
                      </td>
                      <td className="text-center font-bold">
                        {changeCurrencyForm(
                          dataTransaction[dataView.indexTransaction]?.sum
                        )}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="6" className={DATANOTFOUND}>
                      Produk tidak ada di Transaksi ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              className="rounded-xl bg-green-600 text-white font-bold h-10 w-32 hover:cursor-pointer text"
              onClick={() =>
                onDownloadDataTransaction(dataView.indexTransaction)
              }
            >
              Download
            </button>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <DialogValidation
        open={attrDialogValidation.open}
        content={attrDialogValidation.content}
        handleButton={attrDialogValidation.handling}
      />
    </div>
  );
};

export default Transaction;
