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

import { FIELDS_NAME_BRAND, FIELDS_NAME_PRODUCT } from "../constants/FieldName";
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
  VALIDATION_ERROR,
  VALIDATION_ERROR_ADD,
  VALIDATION_ERROR_UPDATE,
} from "../constants/DataInput";
import { changeCurrencyForm } from "../helper/convert";
import { useForm } from "react-hook-form";
import { responseBrand } from "../helper/inquiryData";
import { CLIENTIDBRANDFETCH } from "../constants/DataConstant";
import brandService from "../services/brandService";
import LoadingScreen from "../components/LoadingScreen";
import { yupResolver } from "@hookform/resolvers/yup";
import { brandSchema } from "../validationSchema/formValidation";

const Brand = () => {
  let rawDataBrand = responseBrand.read();
  const [dataBrand, setDataBrand] = useState(rawDataBrand);
  const [dataShow, setDataShow] = useState([]);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(0);
  const [valueTab, setValueTab] = useState("0");
  const uploadBulkFile = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [valueAddBrand, setValueAddBrand] = useState({});

  const [valueUpdateBrand, setValueUpdateBrand] = useState({
    id: "",
    brandName: "",
    unitOfMeasure: "",
    amount: "",
  });

  const formAdd = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(brandSchema),
  });

  const formUpdate = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(brandSchema),
  });

  const [valueAddBulkBrand, setValueAddBulkBrand] = useState([]);
  const [dataAddBulkBrand, setDataAddBulkBrand] = useState([]);
  const [pageModal, setPageModal] = useState(0);

  const [dataDelete, setDataDelete] = useState({
    openDelete: false,
    idButton: "",
    idBrand: 0,
  });

  const [dataUpdate, setDataUpdate] = useState({
    openUpdate: false,
    indexBrand: 0,
  });

  const [attrDialogValidation, setAttrDialogValidation] = useState({
    open: false,
    content: {},
    handling: null,
  });

  useEffect(() => {
    setDataShow(seperateData(dataBrand));
    setDataAddBulkBrand(seperateData(valueAddBulkBrand));
  }, [dataBrand, valueAddBulkBrand]);

  const handleRefreshData = async () => {
    const newDataBrand = await brandService.inquiry();
    rawDataBrand = newDataBrand.listBrand;
    setDataBrand(rawDataBrand); // Update state with new data
  };
  const findBrandByName = (e) => {
    e.preventDefault();
    const searchQuery = e.target.value.toLowerCase();
    if (!searchQuery) {
      setDataBrand(rawDataBrand);
      setPage(0);
    } else {
      const filteredBrand = dataBrand.filter(
        (item) =>
          item.brandName && item.brandName.toLowerCase().includes(searchQuery)
      );
      if (filteredBrand.length === 0) {
        setDataBrand([]);
      } else {
        setDataBrand(filteredBrand);
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
    let [_, idBrand] = e.target.id.split(".");
    idBrand = +idBrand;
    const newDataDelete = {
      openDelete: true,
      idButton: e.target.id,
      idBrand: idBrand,
    };
    console.log("Data delete after change: ", newDataDelete);
    setDataDelete(newDataDelete);
  };

  const handleCloseDialogDelete = () => {
    const newDataDelete = {
      openDelete: false,
      idButton: "",
      idBrand: 0,
    };
    setDataDelete(newDataDelete);
  };

  const setAllDataUpdate = (dataBrand) => {
    formUpdate.setValue("brandId", dataBrand.brandId);
    formUpdate.setValue("brandName", dataBrand.brandName);
    formUpdate.setValue("websiteUrl", dataBrand.websiteUrl);
    formUpdate.setValue("description", dataBrand.description);
  };

  const handleOpenDialogUpdate = (e) => {
    e.preventDefault();
    // console.log("Data delete before change: ", dataDelete);
    console.log(e.target.id);
    let [_, indexBrand] = e.target.id.split(".");
    indexBrand = +indexBrand;
    const attributeOldData = dataBrand[indexBrand];
    const newDataUpdate = {
      openUpdate: true,
      indexBrand: indexBrand,
    };
    console.log("Data Update after change: ", newDataUpdate);
    setDataUpdate(newDataUpdate);
    console.log("Data attribute for edit: ", attributeOldData);
    // setValueUpdateBrand(attributeOldData);
    setAllDataUpdate({ ...attributeOldData });
  };

  const handleCloseDialogUpdate = () => {
    const newDataUpdate = {
      openUpdate: false,
      indexBrand: 0,
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
  //     setValueAddBrand({ ...valueAddBrand, [name]: parseFloat(value) });
  //   } else {
  //     setValueAddBrand({ ...valueAddBrand, [name]: value });
  //   }
  // };

  const onHandlingSubmitAddBrand = async (data) => {
    setIsLoading(true);
    const { websiteUrl } = data;
    const parseUrl = websiteUrl
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .replace(/\/$/, "");
    const logoUrl = `cdn.brandfetch.io/${parseUrl}/w/512/h/134/logo`;
    const reqData = {
      ...data,
      logoUrl,
    };
    try {
      const resp = await brandService.create(reqData);
      console.log("Add Brand Successfull", resp);
      setIsLoading(false);
      setAttrDialogValidation({
        open: true,
        content: resp.status.contents["en"],
        handling: () => {
          onHandlingCloseErrorValidation();
          handleCloseModal();
        },
      });

      await handleRefreshData();
    } catch (err) {
      console.error(
        "Add Brand Failed",
        err.response?.data?.responseKey || err.message || err
      );
      setIsLoading(false);
      setAttrDialogValidation({
        open: true,
        content: err.response.data.status
          ? err.response?.data?.status.contents["en"]
          : VALIDATION_ERROR("Add Brand"),
        handling: () => onHandlingCloseErrorValidation(),
      });
    }

    // console.log(reqData)
    // console.log(data);
    // const oldBrand = [...dataBrand];
    // const id = dataBrand[dataBrand.length - 1].id + 1;
    // BRANDS.push({ id, ...data });
    // oldBrand.push({ id, ...data });
    // setDataBrand(oldBrand);
  };

  const onHandlingCloseErrorValidation = () => {
    setAttrDialogValidation({
      open: false,
      content: {},
      handling: null,
    });
  };

  const onErrorSubmitAddBrand = (error) => {
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
      console.log("Before state update:", valueAddBulkBrand);
      setValueAddBulkBrand(json);
      console.log("After state update (immediate):", valueAddBulkBrand);
    };

    reader.readAsArrayBuffer(file);
    uploadBulkFile.current.value = "";
  };

  const onHandleUploadButton = (e) => {
    document.getElementById("uploadBulkFile").click();
  };

  const onSubmitBulkData = (e) => {
    e.preventDefault();
    const initID = dataBrand[dataBrand.length - 1].id + 1;
    const dataToAdd = valueAddBulkBrand.map((valueBrand, index) => {
      return {
        id: initID + index,
        ...valueBrand,
      };
    });
    console.log(dataToAdd);
    console.log(dataBrand);

    const newDatatoAdd = [...dataBrand].concat(dataToAdd);
    console.log(newDatatoAdd);
    setDataBrand(newDatatoAdd);
    setDataShow(seperateData(newDatatoAdd));
    setValueAddBulkBrand([]);
    setDataAddBulkBrand([]);
    setOpenModal(!openModal);
  };

  const handleResetDataDelete = () => {
    setDataDelete({
      openDelete: false,
      idButton: "",
      idBrand: 0,
    });
  };

  const onDeleteData = async (e) => {
    e.preventDefault();
    let [idButton, indexItem] = e.target.id.split(".");
    indexItem = +indexItem;
    // console.log(indexItem, typeof indexItem);
    if (idButton === "ItemAddBulk") {
      const oldData = [...valueAddBulkBrand];

      if (Array.isArray(oldData)) {
        if (indexItem >= 0 && indexItem < oldData.length) {
          oldData.splice(indexItem, 1);
        } else {
          console.error("Invalid index to remove:", indexItem);
        }
      } else {
        console.error("valueAddBulkBrand is not an array:", valueAddBulkBrand);
      }
      setValueAddBulkBrand(oldData);
    } else {
      setIsLoading(true);
      const brandId = dataBrand[indexItem].brandId;
      const reqData = {
        brand_id: brandId,
      };
      console.log(reqData);
      try {
        const resp = await brandService.delete(reqData);
        console.log("Delete Brand Successfull", resp);
        setIsLoading(false);
        setAttrDialogValidation({
          open: true,
          content: resp.status.contents["en"],
          handling: () => {
            onHandlingCloseErrorValidation();
            handleResetDataDelete();
          },
        });

        await handleRefreshData();
      } catch (err) {
        console.error(
          "Delete Brand Failed",
          err.response?.data?.responseKey || err.message || err.response
        );
        setIsLoading(false);
        setAttrDialogValidation({
          open: true,
          content: err.response.data.status
            ? err.response?.data?.status.contents["en"]
            : VALIDATION_ERROR("Delete Brand"),
          handling: () => {
            onHandlingCloseErrorValidation();
            handleResetDataDelete();
          },
        });
      }

      // console.log("this old data before delete");
      // console.table(oldData);

      // if (Array.isArray(oldData)) {
      //   if (idItem >= 0 && idItem < oldData.length) {
      //     oldData.splice(idItem, 1);
      //     BRANDS.splice(idItem, 1);
      //     // console.log("This old Data after delete:");
      //     // console.table(oldData);
      //     // console.log("This product data after delete:");
      //     // console.table(BRANDS);
      //   } else {
      //     console.error("Invalid index to remove:", idItem);
      //   }
      // } else {
      //   console.error("dataBrand is not an array:", dataBrand);
      // }
      // setDataBrand(oldData);
      if (dataShow[dataShow.length - 1].length === 1) {
        handleButtonPrevious(e);
      }
    }
  };

  const onHandleInputChangeUpdate = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      setValueUpdateBrand({
        ...valueUpdateBrand,
        [name]: parseFloat(value),
      });
    } else {
      setValueUpdateBrand({ ...valueUpdateBrand, [name]: value });
    }
  };

  const handleResetDataUpdate = () => {
    setDataUpdate({
      openUpdate: false,
      indexBrand: 0,
    });
  };

  const onUpdateData = async (data) => {
    setIsLoading(true)
    console.log(data);
    try {
      const resp = await brandService.update({...data});
      console.log("Update Brand Successfull", resp);
      setIsLoading(false);
      setAttrDialogValidation({
        open: true,
        content: resp.status.contents["en"],
        handling: () => {
          onHandlingCloseErrorValidation();
          handleResetDataUpdate();
        },
      });

      await handleRefreshData();
    } catch (err) {
      console.error(
        "Update Brand Failed",
        err.response?.data?.responseKey || err.message || err.response
      );
      setIsLoading(false);
      setAttrDialogValidation({
        open: true,
        content: err.response.data.status
          ? err.response?.data?.status.contents["en"]
          : VALIDATION_ERROR("Update Brand"),
        handling: () => {
          onHandlingCloseErrorValidation();
          handleResetDataUpdate();
        },
      });
    }
  };

  const onErrorSubmitUpdateBrand = (error) => {
    console.log("Validation Errors:", error);
    setAttrDialogValidation({
      open: true,
      content: VALIDATION_ERROR_UPDATE,
      handling: () => onHandlingCloseErrorValidation(),
    });
  };

  const onDownloadDataBrand = (e) => {
    e.preventDefault();
    const workbook = XLSX.utils.book_new();
    const now = new Date();
    const nameFile =
      "dataBrand" +
      now.toLocaleDateString() +
      now.toLocaleTimeString() +
      ".xlsx";
    let worksheet;
    if (dataBrand.length > 0) {
      worksheet = XLSX.utils.json_to_sheet(dataBrand);
      XLSX.utils.book_append_sheet(workbook, worksheet, "List Brand");
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
          placeholder="Search Brand"
          onChange={findBrandByName}
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
            onClick={onDownloadDataBrand}
          >
            Download
          </button>
        </div>
      </div>
      <table className="table-auto bg-white m-3 text-black overflow-y-auto">
        <thead className="border border-black">
          <tr className="text-xl">
            {FIELDS_NAME_BRAND.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center border border-black">
          {dataShow.length > 0 ? (
            dataShow[page].map((brand, index) => {
              if (brand.status === "ACTIVE")
                return (
                  <tr key={brand.id} className="border border-black">
                    <td>{page * 10 + index + 1}</td>
                    <td>
                      <img
                        src={`https://${brand.logoUrl}?c=${CLIENTIDBRANDFETCH}`}
                        alt="Logos by Brandfetch"
                        width={`50px`}
                        className="mx-auto"
                      />
                    </td>
                    <td>
                      <a
                        href={brand.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sans ms-1 text-blue-600 hover:underline"
                      >
                        {brand.brandName}
                      </a>
                    </td>
                    <td>{brand.description}</td>
                    <td>
                      <button
                        className={UPDATEBUTTON}
                        id={"updateBrand." + (page * 10 + index)}
                        onClick={handleOpenDialogUpdate}
                      >
                        Update
                      </button>
                    </td>
                    <td>
                      <button
                        className={DELETEBUTTON}
                        id={"deleteBrand." + (page * 10 + index)}
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
                No brand available.
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
          border rounded-xl p-3 shadow-lg min-h-[425px] w-3/6 z-20"
        >
          <header className="flex justify-between mb-2 items-center">
            <h2 className="text-white text-2xl font-bold font-sans">
              Add Brand Data
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
            <div className="flex flex-col w-full my-3">
              <div className="flex">
                <label className="inline w-1/2 me-3">
                  <span className="text-white block">Nama Brand</span>
                  <input
                    type="text"
                    name="brandName"
                    id="brandName"
                    className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                      border-transparent focus:border-white-500 focus:bg-white focus:ring"
                    onChange={onHandleInputChangeUpdate}
                    {...formAdd.register("brandName", {
                      required: "Nama Brand tidak boleh kosong",
                    })}
                  />
                  <p className={VALIDATIONRULE}>
                    {formAdd.formState.errors.brandName?.message}
                  </p>
                </label>
                <label className="inline w-1/2">
                  <span className="text-white block">URL Brand</span>
                  <input
                    type="text"
                    name="websiteUrl"
                    id="websiteUrl"
                    className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring"
                    onChange={onHandleInputChangeUpdate}
                    {...formAdd.register("websiteUrl", {
                      required: "Website URL tidak boleh kosong",
                    })}
                  />
                  <p className={VALIDATIONRULE}>
                    {formAdd.formState.errors.websiteUrl?.message}
                  </p>
                </label>
              </div>
              <div className="mt-5">
                <span className="text-white inline-block col-span-2">
                  Deskripsi Brand
                </span>
                <textarea
                  type="text"
                  name="address"
                  id="address"
                  className="my-1 form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-full h-24 col-span-2"
                  {...formAdd.register("description", {
                    required: "Deskripsi tidak boleh kosong",
                  })}
                />
                <p className={VALIDATIONRULE}>
                  {formAdd.formState.errors.description?.message}
                </p>
              </div>
            </div>
            <button
              className="border mt-2 py-3 px-5 rounded-xl text-sans bg-slate-300"
              onClick={formAdd.handleSubmit(
                onHandlingSubmitAddBrand,
                onErrorSubmitAddBrand
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
                  href="/TemplateBrand.xlsx"
                  target="_blank"
                  rel="noreferrer"
                  download="Template Upload Bulk Brand"
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
                  {dataAddBulkBrand.length > 0 &&
                    dataAddBulkBrand[pageModal].map((product, index) => (
                      <tr
                        key={(index + 1) * (pageModal + 1)}
                        className="border border-black"
                      >
                        <td className={WORDINGDATATABLE}>
                          {(index + 1) * (pageModal + 1)}
                        </td>
                        <td className={WORDINGDATATABLE}>
                          {product.brandName}
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
          {"Apakah Anda yakin ingin menghapus brand berikut ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-name-of-product"
            sx={{ color: "white" }}
          >
            {`Brand yang ingin anda hapus adalah ${
              dataBrand?.length > 0 && dataBrand[dataDelete.idBrand]?.brandName
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
              {`Update Brand Data ${
                dataBrand.length > 0 &&
                dataBrand[dataUpdate.indexBrand].brandName
              }`}
            </h2>
          </header>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="flex flex-col w-full my-3">
              <div className="flex">
                <label className="inline w-1/2 me-3">
                  <span className="text-white block">Nama Brand</span>
                  <input
                    type="text"
                    name="brandName"
                    id="brandName"
                    className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                      border-transparent focus:border-white-500 focus:bg-white focus:ring"
                    onChange={onHandleInputChangeUpdate}
                    {...formUpdate.register("brandName")}
                  />
                  <p className={VALIDATIONRULE}>
                    {formUpdate.formState.errors.brandName?.message}
                  </p>
                </label>
                <label className="inline w-1/2">
                  <span className="text-white block">URL Brand</span>
                  <input
                    type="text"
                    name="websiteUrl"
                    id="websiteUrl"
                    className="mt-1 block w-full form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring"
                    onChange={onHandleInputChangeUpdate}
                    {...formUpdate.register("websiteUrl")}
                  />
                  <p className={VALIDATIONRULE}>
                    {formUpdate.formState.errors.websiteUrl?.message}
                  </p>
                </label>
              </div>
              <div className="mt-5">
                <span className="text-white inline-block col-span-2">
                  Deskripsi Brand
                </span>
                <textarea
                  type="text"
                  name="description"
                  id="description"
                  className="my-1 form-input rounded-md text-sans bg-slate-300
                  border-transparent focus:border-white-500 focus:bg-white focus:ring w-full h-24 col-span-2"
                  {...formUpdate.register("description")}
                />
                <p className={VALIDATIONRULE}>
                  {formUpdate.formState.errors.description?.message}
                </p>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="px-3">
          <button
            onClick={formUpdate.handleSubmit(
              onUpdateData,
              onErrorSubmitUpdateBrand
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

export default Brand;
