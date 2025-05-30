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
import DialogValidation from "../components/DialogValidation";

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
  VALIDATIONRULE,
} from "../constants/PropertyCss";
import {
  SEMBAKO_UNITS,
  VALIDATION_ERROR_ADD,
  VALIDATION_ERROR_UPDATE,
} from "../constants/DataInput";
import { changeCurrencyForm } from "../helper/convert";
import { useForm } from "react-hook-form";
import { responseBrand, responseProduct } from "../helper/inquiryData";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "../validationSchema/formValidation";
import { ACTIVE } from "../constants/DataConstant";

import LoadingScreen from "../components/LoadingScreen";
import productService from "../services/productService";

const Product = () => {
  const rawDataProduct = responseProduct.read();
  console.log(rawDataProduct);
  
  const dataBrand = responseBrand.read();
  const [dataProduct, setDataProduct] = useState(rawDataProduct);
  const [dataShow, setDataShow] = useState([]);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(0);
  const [valueTab, setValueTab] = useState("0");
  const uploadBulkFile = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [valueAddProduct, setValueAddProduct] = useState({});

  const [valueUpdateProduct, setValueUpdateProduct] = useState({
    id: "",
    productName: "",
    unitOfMeasure: "",
    amount: "",
  });

  const formAdd = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(productSchema),
  });

  const formUpdate = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(productSchema),
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

  const [attrDialogValidation, setAttrDialogValidation] = useState({
    open: false,
    content: {},
    handling: null,
  });

  useEffect(() => {
    setDataShow(seperateData(dataProduct));
    setDataAddBulkProduct(seperateData(valueAddBulkProduct));
  }, [dataProduct, valueAddBulkProduct]);

  const findProductByName = (e) => {
    e.preventDefault();
    const searchQuery = e.target.value.toLowerCase();
    if (!searchQuery) {
      setDataProduct(rawDataProduct);
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
    formAdd.reset();
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

  const setAllDataUpdate = (dataProduct) => {
    formUpdate.setValue("productCode", dataProduct.productCode);
    formUpdate.setValue("productName", dataProduct.productName);
    formUpdate.setValue("productAmount", dataProduct.amount);
    formUpdate.setValue("brandId", dataProduct.brandId);
    formUpdate.setValue("productDescription", dataProduct.description);
    formUpdate.setValue("unitOfMeasure", dataProduct.unitOfMeasure);
    formUpdate.setValue("quantity", dataProduct.quantity);
    formUpdate.setValue("productImages", dataProduct.productImages);
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
    // setValueUpdateProduct(attributeOldData);
    setAllDataUpdate({ ...attributeOldData });
  };

  const handleCloseDialogUpdate = () => {
    const newDataUpdate = {
      openUpdate: false,
      indexProduct: 0,
    };
    setDataUpdate(newDataUpdate);
    formUpdate.reset();
  };

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  // const onHandleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "amount") {
  //     setValueAddProduct({ ...valueAddProduct, [name]: parseFloat(value) });
  //   } else {
  //     setValueAddProduct({ ...valueAddProduct, [name]: value });
  //   }
  // };

  const onHandlingSubmitAddProduct = async (data) => {
    const { productName } = data;
    setIsLoading(true);
    let productCodeLatest = Number.parseInt(
      dataProduct[dataProduct.length - 1].productCode.slice(1)
    );
    const productCode = `${productName.at(0)}${productCodeLatest + 1}`;
    const reqData = {
      ...data,
      productCode,
    };
    console.log(reqData);
    try {
      const resp = await productService.create(reqData);
      console.log("Add Product Successfull", resp);
      setIsLoading(false);
      setAttrDialogValidation({
        open: true,
        content: resp.status.contents["en"],
        handling: () => {
          onHandlingCloseValidation();
          handleCloseModal();
        },
      });
    } catch (err) {
      console.error(
        "Add Product Failed",
        err.response?.data?.responseKey || err.message
      );
      setIsLoading(false);
      setAttrDialogValidation({
        open: true,
        content: err.response.data.status
          ? err.response?.data?.status.contents["en"]
          : VALIDATION_ERROR("Add Product"),
        handling: () => onHandlingCloseValidation(),
      });
    }

    // const oldProduct = [...dataProduct];
    // const id = dataProduct[dataProduct.length - 1].id + 1;
    // PRODUCTS.push({ id, ...data });
    // oldProduct.push({ id, ...data });
    // setDataProduct(oldProduct);
    // handleCloseModal();
    setIsLoading(false);
  };

  const onHandlingCloseValidation = () => {
    setAttrDialogValidation({
      open: false,
      handling: null,
      content: {},
    });
  };

  const onErrorSubmitAddProduct = (error) => {
    console.log("Validation Errors:", error);
    setAttrDialogValidation({
      open: true,
      content: VALIDATION_ERROR_ADD,
      handling: () => onHandlingCloseValidation(),
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
      // console.table(oldData);

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
    if (name === "amount") {
      setValueUpdateProduct({
        ...valueUpdateProduct,
        [name]: parseFloat(value),
      });
    } else {
      setValueUpdateProduct({ ...valueUpdateProduct, [name]: value });
    }
  };

  const onUpdateData = async (data) => {
    console.log(data);
    setIsLoading(true);
    const reqData = {
      ...data,
    };
    console.log(reqData);
    try {
      const resp = await productService.create(reqData);
      console.log("Add Product Successfull", resp);
      setIsLoading(false);
      setAttrDialogValidation({
        open: true,
        content: resp.status.contents["en"],
        handling: () => {
          onHandlingCloseValidation();
          handleCloseDialogUpdate();
        },
      });
    } catch (err) {
      console.error(
        "Add Product Failed",
        err.response?.data?.responseKey || err.message
      );
      setIsLoading(false);
      setAttrDialogValidation({
        open: true,
        content: err.response.data.status
          ? err.response?.data?.status.contents["en"]
          : VALIDATION_ERROR("Update Product"),
        handling: () => onHandlingCloseValidation(),
      });
    }
  };

  const onErrorSubmitUpdateProduct = (error) => {
    console.log("Validation Errors:", error);
    setAttrDialogValidation({
      open: true,
      content: VALIDATION_ERROR_UPDATE,
      handling: () => onHandlingCloseValidation(),
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
            dataShow[page].map((product, index) => {
              if (ACTIVE === product.status)
                return (
                  <tr key={product.id} className="border border-black">
                    <td>{page * 10 + index + 1}</td>
                    <td>{product.productImages}</td>
                    <td>{product.productName}</td>
                    <td>{product.quantity}</td>
                    <td>{product.unitOfMeasure}</td>
                    <td>{changeCurrencyForm(product.amount)}</td>
                    <td>{product.description}</td>
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
                );
            })
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
          className=" bg-slate-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
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
            value={valueTab}
            onChange={handleChange}
            aria-label="basic tabs for add data"
            sx={CSSPROPERTYTAB}
          >
            <Tab label="One Data" value="0" />
            <Tab label="Bulk Data" value="1" />
          </Tabs>
          <TabPanel index="0" value={valueTab} key="0">
            <div className="flex w-full my-3">
              <label className="inline w-1/2 me-3">
                <span className="text-white block">Nama Produk</span>
                <input
                  type="text"
                  name="productName"
                  id="productName"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                      border-transparent focus:border-white-500 focus:bg-white focus:ring
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border w-full"
                  // onChange={onHandleInputChange}
                  {...formAdd.register("productName", {
                    required: "Mohon input harga produk",
                  })}
                />
                <p className={VALIDATIONRULE}>
                  {formAdd.formState.errors.productName?.message}
                </p>
              </label>
              <label className="inline w-1/2">
                <span className="text-white block">Jumlah Produk</span>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring
                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border w-full"
                  // onChange={onHandleInputChange}
                  {...formAdd.register("quantity", {
                    required: "Mohon input harga produk",
                  })}
                />
                <p className={VALIDATIONRULE}>
                  {formAdd.formState.errors.quantity?.message}
                </p>
              </label>
            </div>
            <div className="flex w-full my-3">
              <label className="inline w-1/2 me-3">
                <span className="text-white block">Image Url</span>
                <input
                  type="text"
                  name="productImages"
                  id="productImages"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                      border-transparent focus:border-white-500 focus:bg-white focus:ring
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border w-full"
                  // onChange={onHandleInputChange}
                  {...formAdd.register("productImages", {
                    required: "Mohon input harga produk",
                  })}
                />
                <p className={VALIDATIONRULE}>
                  {formAdd.formState.errors.productImages?.message}
                </p>
              </label>
              <label className="inline w-1/2">
                <span className="text-white block">Harga Produk</span>
                <input
                  type="number"
                  name="productAmount"
                  id="productAmount"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring
                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border w-full"
                  // onChange={onHandleInputChange}
                  {...formAdd.register("productAmount", {
                    required: "Mohon input harga produk",
                  })}
                />
                <p className={VALIDATIONRULE}>
                  {formAdd.formState.errors.productAmount?.message}
                </p>
              </label>
            </div>
            <div className="flex w-full my-3">
              <label className="inline w-1/2 me-3">
                <span className="text-white block">Unit Produk</span>
                <select
                  type="text"
                  name="unitOfMeasure"
                  id="unitOfMeasure"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-full"
                  // onChange={onHandleInputChange}
                  {...formAdd.register("unitOfMeasure")}
                >
                  <option key="null object" value={""}>
                    Mohon memilih unit yang disediakan
                  </option>
                  {SEMBAKO_UNITS.length > 0 &&
                    SEMBAKO_UNITS.map((unit, index) => (
                      <option key={index} value={unit}>
                        {unit}
                      </option>
                    ))}
                </select>
                <p className={VALIDATIONRULE}>
                  {formAdd.formState.errors.unitOfMeasure?.message}
                </p>
              </label>
              <label className="inline w-1/2">
                <span className="text-white block">Brand Produk</span>
                <select
                  type="text"
                  name="brandId"
                  id="brandId"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-full"
                  // onChange={onHandleInputChange}
                  {...formAdd.register("brandId")}
                >
                  <option key="null object" value={""}>
                    Mohon memilih brand yang disediakan
                  </option>
                  {dataBrand.length > 0 &&
                    dataBrand.map((brand, index) => (
                      <option key={index} value={brand.brandId}>
                        {brand.brandName}
                      </option>
                    ))}
                </select>
                <p className={VALIDATIONRULE}>
                  {formAdd.formState.errors.brandId?.message}
                </p>
              </label>
            </div>
            <div className="mt-5">
              <span className="text-white inline-block col-span-2">
                Deskripsi Product
              </span>
              <textarea
                type="text"
                name="productDescription"
                id="productDescription"
                className="my-1 form-input rounded-md text-sans bg-slate-300
                               border-transparent focus:border-white-500 focus:bg-white focus:ring w-full h-24 col-span-2"
                {...formAdd.register("productDescription")}
              />
              <p className={VALIDATIONRULE}>
                {formAdd.formState.errors.productDescription?.message}
              </p>
            </div>

            <button
              className="border mt-2 py-3 px-5 rounded-xl text-sans bg-slate-300"
              onClick={formAdd.handleSubmit(
                onHandlingSubmitAddProduct,
                onErrorSubmitAddProduct
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
                        <td className={WORDINGDATATABLE}>
                          {(index + 1) * (pageModal + 1)}
                        </td>
                        <td className={WORDINGDATATABLE}>
                          {product.productName}
                        </td>
                        <td className={WORDINGDATATABLE}>
                          {product.unitOfMeasure}
                        </td>
                        <td className={WORDINGDATATABLE}>
                          {changeCurrencyForm(product.amount)}
                        </td>
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
            <div className="flex w-full my-3">
              <label className="inline w-1/2 me-3">
                <span className="text-white block">Nama Produk</span>
                <input
                  type="text"
                  name="productName"
                  id="productName"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                      border-transparent focus:border-white-500 focus:bg-white focus:ring
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border w-full"
                  // onChange={onHandleInputChange}
                  {...formUpdate.register("productName", {
                    required: "Mohon input harga produk",
                  })}
                />
                <p className={VALIDATIONRULE}>
                  {formUpdate.formState.errors.productName?.message}
                </p>
              </label>
              <label className="inline w-1/2">
                <span className="text-white block">Jumlah Produk</span>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring
                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border w-full"
                  // onChange={onHandleInputChange}
                  {...formUpdate.register("quantity", {
                    required: "Mohon input harga produk",
                  })}
                />
                <p className={VALIDATIONRULE}>
                  {formUpdate.formState.errors.quantity?.message}
                </p>
              </label>
            </div>
            <div className="flex w-full my-3">
              <label className="inline w-1/2 me-3">
                <span className="text-white block">Image Url</span>
                <input
                  type="text"
                  name="productImages"
                  id="productImages"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                      border-transparent focus:border-white-500 focus:bg-white focus:ring
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border w-full"
                  // onChange={onHandleInputChange}
                  {...formUpdate.register("productImages")}
                />
                <p className={VALIDATIONRULE}>
                  {formUpdate.formState.errors.productImages?.message}
                </p>
              </label>
              <label className="inline w-1/2">
                <span className="text-white block">Harga Produk</span>
                <input
                  type="number"
                  name="productAmount"
                  id="productAmount"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring
                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border w-full"
                  // onChange={onHandleInputChange}
                  {...formUpdate.register("productAmount")}
                />
                <p className={VALIDATIONRULE}>
                  {formUpdate.formState.errors.productAmount?.message}
                </p>
              </label>
            </div>
            <div className="flex w-full my-3">
              <label className="inline w-1/2 me-3">
                <span className="text-white block">Unit Produk</span>
                <select
                  type="text"
                  name="unitOfMeasure"
                  id="unitOfMeasure"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-full"
                  // onChange={onHandleInputChange}
                  {...formUpdate.register("unitOfMeasure")}
                >
                  <option key="null object" value={""}>
                    Mohon memilih unit yang disediakan
                  </option>
                  {SEMBAKO_UNITS.length > 0 &&
                    SEMBAKO_UNITS.map((unit, index) => (
                      <option key={index} value={unit}>
                        {unit}
                      </option>
                    ))}
                </select>
                <p className={VALIDATIONRULE}>
                  {formUpdate.formState.errors.unitOfMeasure?.message}
                </p>
              </label>
              <label className="inline w-1/2">
                <span className="text-white block">Brand Produk</span>
                <select
                  type="text"
                  name="brandId"
                  id="brandId"
                  className="mt-1 block form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-full"
                  // onChange={onHandleInputChange}
                  {...formUpdate.register("brandId")}
                >
                  <option key="null object" value={""}>
                    Mohon memilih brand yang disediakan
                  </option>
                  {dataBrand.length > 0 &&
                    dataBrand.map((brand, index) => (
                      <option key={index} value={brand.brandId}>
                        {brand.brandName}
                      </option>
                    ))}
                </select>
                <p className={VALIDATIONRULE}>
                  {formUpdate.formState.errors.brandId?.message}
                </p>
              </label>
            </div>
            <div className="mt-5">
              <span className="text-white inline-block col-span-2">
                Deskripsi Product
              </span>
              <textarea
                type="text"
                name="productDescription"
                id="productDescription"
                className="my-1 form-input rounded-md text-sans bg-slate-300
                               border-transparent focus:border-white-500 focus:bg-white focus:ring w-full h-24 col-span-2"
                {...formUpdate.register("productDescription")}
              />
              <p className={VALIDATIONRULE}>
                {formUpdate.formState.errors.productDescription?.message}
              </p>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="px-3">
          <button
            onClick={formUpdate.handleSubmit(
              onUpdateData,
              onErrorSubmitUpdateProduct
            )}
            className={UPDATEBUTTON}
          >
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
      <DialogValidation
        open={attrDialogValidation.open}
        content={attrDialogValidation.content}
        handleButton={attrDialogValidation.handling}
      />
      {isLoading && <LoadingScreen />}
    </div>
  );
};

export default Product;
