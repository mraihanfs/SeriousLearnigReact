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

import { PRODUCTS } from "../constants/DataMock";
import { FIELDS_NAME_PRODUCT } from "../constants/FieldName";
import {
  CSSPROPERTYTAB,
  DELETEBUTTON,
  CANCELBUTTON,
  CSSPROPERTYDIALOG,
  UPDATEBUTTON,
  DATANOTFOUND,
  WORDINGDATATABLE,
} from "../constants/PropertyCss";
import { SEMBAKO_UNITS } from "../constants/DataInput";
import { changeCurrencyForm } from "../helper/convert";

// const dataNullProduct = {
//   id: null,
//   productName: null,
//   unit: null,
//   harga: null,
// };

const Product = () => {
  const [dataProduct, setDataProduct] = useState(PRODUCTS);
  const [dataShow, setDataShow] = useState([]);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(0);
  const [value, setValue] = useState("0");
  const uploadBulkFile = useRef(null);

  const [valueAddProduct, setValueAddProduct] = useState({
    unit: "kg",
  });

  const [valueUpdateProduct, setValueUpdateProduct] = useState({
    id: "",
    productName: "",
    unit: "",
    harga: "",
  });

  const [valueAddBulkProduct, setValueAddBulkProduct] = useState([]);
  const [dataAddBulkProduct, setDataAddBulkProduct] = useState([]);
  const [pageModal, setPageModal] = useState(0);

  const [dataDelete, setDataDelete] = useState({
    openDelete: false,
    idButton: "",
    idProduct: 0,
  });

  const [dataUpdate, setDataUpdate] = useState({
    openUpdate: false,
    indexProduct: 0,
  });

  useEffect(() => {
    setDataShow(seperateData(dataProduct));
    setDataAddBulkProduct(seperateData(valueAddBulkProduct));
    // console.log(valueAddBulkProduct);
  }, [dataProduct, valueAddBulkProduct]);

  const findProductByName = (e) => {
    e.preventDefault();
    const searchQuery = e.target.value.toLowerCase();
    if (!searchQuery) {
      setDataProduct(PRODUCTS);
      setPage(0);
    } else {
      const filteredProduct = dataProduct.filter(
        (item) =>
          item.productName &&
          item.productName.toLowerCase().includes(searchQuery)
      );
      if (filteredProduct.length === 0) {
        setDataProduct([]);
      } else {
        setDataProduct(filteredProduct);
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
    let [_, idProduct] = e.target.id.split(".");
    idProduct = +idProduct;
    const newDataDelete = {
      openDelete: true,
      idButton: e.target.id,
      idProduct: idProduct,
    };
    console.log("Data delete after change: ", newDataDelete);
    setDataDelete(newDataDelete);
  };

  const handleCloseDialogDelete = () => {
    const newDataDelete = {
      openDelete: false,
      idButton: "",
      idProduct: 0,
    };
    setDataDelete(newDataDelete);
  };

  const handleOpenDialogUpdate = (e) => {
    e.preventDefault();
    // console.log("Data delete before change: ", dataDelete);
    console.log(e.target.id);
    let [_, indexProduct] = e.target.id.split(".");
    indexProduct = +indexProduct;
    const attributeOldData = dataProduct[indexProduct];
    const newDataUpdate = {
      openUpdate: true,
      indexProduct: indexProduct,
    };
    console.log("Data Update after change: ", newDataUpdate);
    setDataUpdate(newDataUpdate);
    console.log("Data attribute for edit: ", attributeOldData);
    setValueUpdateProduct(attributeOldData);
  };

  const handleCloseDialogUpdate = () => {
    const newDataUpdate = {
      openUpdate: false,
      indexProduct: 0,
    };
    setDataUpdate(newDataUpdate);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onHandleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "harga") {
      setValueAddProduct({ ...valueAddProduct, [name]: parseFloat(value) });
    } else {
      setValueAddProduct({ ...valueAddProduct, [name]: value });
    }
  };

  const onHandlingSubmitAddProduct = (e) => {
    e.preventDefault();
    console.log(valueAddProduct);
    const id = dataProduct[dataProduct.length - 1].id + 1;
    PRODUCTS.push({ id, ...valueAddProduct });
    console.log(valueAddProduct);
    setDataProduct((prevData) => [...prevData, { id, ...valueAddProduct }]);
    setValueAddProduct({
      unit: "kg",
    });
    console.table(dataProduct);
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
      console.log("Before state update:", valueAddBulkProduct);
      setValueAddBulkProduct(json);
      console.log("After state update (immediate):", valueAddBulkProduct);
    };

    reader.readAsArrayBuffer(file);
    uploadBulkFile.current.value = "";
  };

  const onHandleUploadButton = (e) => {
    document.getElementById("uploadBulkFile").click();
  };

  const onSubmitBulkData = (e) => {
    e.preventDefault();
    const initID = dataProduct[dataProduct.length - 1].id + 1;
    const dataToAdd = valueAddBulkProduct.map((valueProduct, index) => {
      return {
        id: initID + index,
        ...valueProduct,
      };
    });
    console.log(dataToAdd);
    console.log(dataProduct);

    const newDatatoAdd = [...dataProduct].concat(dataToAdd);
    console.log(newDatatoAdd);
    setDataProduct(newDatatoAdd);
    setDataShow(seperateData(newDatatoAdd));
    setValueAddBulkProduct([]);
    setDataAddBulkProduct([]);
    setOpenModal(!openModal);
  };

  const onDeleteData = (e) => {
    e.preventDefault();
    let [idButton, idItem] = e.target.id.split(".");
    idItem = +idItem;
    // console.log(idItem, typeof idItem);
    if (idButton === "ItemAddBulk") {
      const oldData = [...valueAddBulkProduct];

      if (Array.isArray(oldData)) {
        if (idItem >= 0 && idItem < oldData.length) {
          oldData.splice(idItem, 1);
        } else {
          console.error("Invalid index to remove:", idItem);
        }
      } else {
        console.error(
          "valueAddBulkProduct is not an array:",
          valueAddBulkProduct
        );
      }
      setValueAddBulkProduct(oldData);
    } else {
      const oldData = [...dataProduct];
      // console.log("this old data before delete");
      // // console.table(oldData);

      if (Array.isArray(oldData)) {
        if (idItem >= 0 && idItem < oldData.length) {
          oldData.splice(idItem, 1);
          PRODUCTS.splice(idItem, 1);
          // console.log("This old Data after delete:");
          // console.table(oldData);
          // console.log("This product data after delete:");
          // console.table(PRODUCTS);
        } else {
          console.error("Invalid index to remove:", idItem);
        }
      } else {
        console.error("dataProduct is not an array:", dataProduct);
      }
      setDataProduct(oldData);
      if (dataShow[dataShow.length - 1].length === 1) {
        handleButtonPrevious(e);
      }
      setDataDelete({
        openDelete: false,
        idButton: "",
        idProduct: 0,
      });
    }
  };

  const onHandleInputChangeUpdate = (e) => {
    const { name, value } = e.target;
    if (name === "harga") {
      setValueUpdateProduct({
        ...valueUpdateProduct,
        [name]: parseFloat(value),
      });
    } else {
      setValueUpdateProduct({ ...valueUpdateProduct, [name]: value });
    }
  };

  const onUpdateData = (e) => {
    e.preventDefault();
    let indexItem = dataUpdate.indexProduct;
    const tempDataProd = [...dataProduct];
    // console.log("This data product before update:");
    // console.log(dataProduct[indexItem]);
    // console.log("This product data before delete:");
    // console.log(PRODUCTS[indexItem]);

    PRODUCTS.splice(indexItem, 1, valueUpdateProduct);
    tempDataProd.splice(indexItem, 1, valueUpdateProduct);
    // console.log("This data product after update:");
    // console.log(dataProduct[indexItem]);
    // console.log("This product data after delete:");
    // console.log(PRODUCTS[indexItem]);
    setDataProduct(tempDataProd);
    setDataUpdate({
      openUpdate: false,
      indexProduct: 0,
    });
  };

  const onDownloadDataProduct = (e) => {
    e.preventDefault();
    const workbook = XLSX.utils.book_new();
    const now = new Date();
    const nameFile =
      "dataProduct" +
      now.toLocaleDateString() +
      now.toLocaleTimeString() +
      ".xlsx";
    let worksheet;
    if (dataProduct.length > 0) {
      worksheet = XLSX.utils.json_to_sheet(dataProduct);
      XLSX.utils.book_append_sheet(workbook, worksheet, "List Product");
      XLSX.writeFile(workbook, nameFile);
    } else {
      alert("Data produk tidak ada");
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
          placeholder="Search Product"
          onChange={findProductByName}
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
            onClick={onDownloadDataProduct}
          >
            Download
          </button>
        </div>
      </div>
      <table className="table-auto bg-white m-3 text-black overflow-y-auto">
        <thead className="border border-black">
          <tr className="text-xl">
            {FIELDS_NAME_PRODUCT.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center border border-black">
          {dataShow.length > 0 ? (
            dataShow[page].map((product, index) => (
              <tr key={product.id} className="border border-black">
                <td>{page * 10 + index + 1}</td>
                <td>{product.productName}</td>
                <td>{product.unit}</td>
                <td>{changeCurrencyForm(product.harga)}</td>
                <td>
                  <button
                    className={UPDATEBUTTON}
                    id={"updateProduct." + (page * 10 + index)}
                    onClick={handleOpenDialogUpdate}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className={DELETEBUTTON}
                    id={"deleteProduct." + (page * 10 + index)}
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
                No products available.
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
              Add Product Data
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
              <span className="text-white block">Nama Produk</span>
              <input
                type="text"
                name="productName"
                id="productName"
                className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring"
                onChange={onHandleInputChange}
              />
            </label>
            <div className="flex w-full my-3">
              <label className="inline w-1/2 me-3">
                <span className="text-white block">Unit Produk</span>
                <select
                  type="text"
                  name="unit"
                  id="unit"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-full"
                  onChange={onHandleInputChange}
                >
                  {SEMBAKO_UNITS.length > 0 &&
                    SEMBAKO_UNITS.map((unit, index) => (
                      <option key={index} value={unit}>
                        {unit}
                      </option>
                    ))}
                </select>
              </label>
              <label className="inline w-1/2">
                <span className="text-white block">Harga Produk</span>
                <input
                  type="number"
                  name="harga"
                  id="harga"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring
                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border w-full"
                  onChange={onHandleInputChange}
                />
              </label>
            </div>

            <button
              className="border mt-3 py-3 px-5 rounded-xl text-sans bg-slate-300"
              onClick={onHandlingSubmitAddProduct}
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
                  href="/TemplateProduct.xlsx"
                  target="_blank"
                  rel="noreferrer"
                  download="Template Upload Bulk Product"
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
                  <tr className="text-xl">
                    {FIELDS_NAME_PRODUCT.map((field, index) => (
                      <th key={index}>{field}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-center border border-black">
                  {dataAddBulkProduct.length > 0 &&
                    dataAddBulkProduct[pageModal].map((product, index) => (
                      <tr
                        key={(index + 1) * (pageModal + 1)}
                        className="border border-black"
                      >
                        <td className={WORDINGDATATABLE}>{(index + 1) * (pageModal + 1)}</td>
                        <td className={WORDINGDATATABLE}>{product.productName}</td>
                        <td className={WORDINGDATATABLE}>{product.unit}</td>
                        <td className={WORDINGDATATABLE}>{changeCurrencyForm(product.harga)}</td>
                        <td>
                          <button
                            className={DELETEBUTTON}
                            onClick={onDeleteData}
                            id={"ItemAddBulk." + index}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
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
        aria-describedby="alert-dialog-delete-data-product"
        sx={CSSPROPERTYDIALOG}
      >
        <DialogTitle id="alert-dialog-title">
          {"Apakah Anda yakin ingin menghapus produk berikut ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-name-of-product"
            sx={{ color: "white" }}
          >
            {`Produk yang ingin anda hapus adalah ${
              dataProduct.length > 0 &&
              dataProduct[dataDelete.idProduct].productName
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
            <h2 className="text-white text-2xl font-bold font-sans">
              {`Update Product Data ${
                dataProduct.length > 0 &&
                dataProduct[dataUpdate.indexProduct].productName
              }`}
            </h2>
          </header>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <label className="block">
              <span className="text-black block">Nama Produk</span>
              <input
                type="text"
                name="productName"
                id="productName"
                className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring"
                onChange={onHandleInputChangeUpdate}
                value={valueUpdateProduct.productName}
              />
            </label>
            <div className="flex w-full my-3">
              <label className="inline w-1/2 me-3">
                <span className="text-black block">Unit Produk</span>
                <select
                  type="text"
                  name="unit"
                  id="unit"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-full"
                  onChange={onHandleInputChangeUpdate}
                  value={valueUpdateProduct.unit}
                >
                  {SEMBAKO_UNITS.length > 0 &&
                    SEMBAKO_UNITS.map((unit, index) => (
                      <option key={index} value={unit}>
                        {unit}
                      </option>
                    ))}
                </select>
              </label>
              <label className="inline w-1/2">
                <span className="text-black block">Harga Produk</span>
                <input
                  type="number"
                  name="harga"
                  id="harga"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring
                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border w-full"
                  onChange={onHandleInputChangeUpdate}
                  value={valueUpdateProduct.harga}
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

export default Product;
