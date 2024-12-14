import React, { useState, useEffect } from "react";

import {
  MdNavigateBefore,
  MdNavigateNext,
  MdSkipNext,
  MdSkipPrevious,
} from "react-icons/md";

import { Modal, Tabs, Tab } from "@mui/material";
import TabPanel from "../components/TabPanel";
// import Modal from "@mui/material/Modal";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";

import { PRODUCTS } from "../constants/DataMock";
import { FIELDS_NAME_PRODUCT } from "../constants/FieldName";
import { CSSPROPERTYTAB } from "../constants/PropertyCss";
import { SEMBAKO_UNITS } from "../constants/DataInput";

const Product = () => {
  const [dataProduct, setDataProduct] = useState(PRODUCTS);
  const [dataShow, setDataShow] = useState([]);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(0);
  const [value, setValue] = useState("0");
  const [valueAddProduct, setValueAddProduct] = useState({
    productName: "",
    unit: "",
    harga: "",
  });

  useEffect(() => {
    const result = [];
    console.log(dataProduct.length)
    {
      for (let i = 0; i < dataProduct.length; i += 10) {
        result.push(dataProduct.slice(i, i + 10));
      }
      setDataShow(result);
    }
    console.log(dataProduct.length)
  }, [dataProduct]);

  const findProductByName = (e) => {
    e.preventDefault();
    const searchQuery = e.target.value.toLowerCase();
    if (!searchQuery) {
      setDataProduct(PRODUCTS);
      setPage(0);
    } else {
      setDataProduct(
        dataProduct.filter(
          (item) =>
            item.productName &&
            item.productName.toLowerCase().includes(searchQuery)
        )
      );
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onHandleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "harga"){
      setValueAddProduct({ ...valueAddProduct, [name]: parseFloat(value) });  
    }else{
      setValueAddProduct({ ...valueAddProduct, [name]: value })
    }
    ;
  };

  const onHandlingSubmitAddProduct = (e) => {
    e.preventDefault();
    console.log(valueAddProduct)
    const id = dataProduct[dataProduct.length-1].id + 1
    setDataProduct((prevData) => [...prevData, {id, ...valueAddProduct}]
    );
    setValueAddProduct({
      productName: "",
      unit: "",
      harga: ""
    });
    console.table(dataProduct);
  };

  return (
    <>
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
              onClick={handleOpenModal}
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
            {dataShow.length > 0 &&
              dataShow[page].map((product, index) => (
                <tr key={product.id} className="border border-black">
                  <td>{page*10+index+1}</td>
                  <td>{product.productName}</td>
                  <td>{product.unit}</td>
                  <td>{product.harga}</td>
                  <td>
                    <button
                      className="rounded-xl bg-yellow-600 text-white  my-1  p-1 hover:cursor-pointer"
                      onClick={handleOpenModal}
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    <button
                      className="rounded-xl bg-red-600 text-white  my-1  p-1 hover:cursor-pointer"
                      onClick={handleOpenModal}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
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
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
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
              aria-label="basic tabs example"
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
                  Download Template
                </button>
                <button
                  className="rounded-xl bg-green-600 text-white font-bold h-12 me-1 ms-2 w-28 hover:cursor-pointer"
                  // onClick={}
                >
                  Download
                </button>
              </header>
              <table className="table-auto bg-white my-3 text-black overflow-y-auto w-full">
                <thead className="border border-black">
                  <tr className="text-xl">
                    {FIELDS_NAME_PRODUCT.map((field, index) => (
                      <th key={index}>{field}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-center border border-black">
                  {/* {dataShow.length > 0 &&
                    dataShow[page].map((product, index) => (
                      <tr key={product.id} className="border border-black">
                        <td>{product.id}</td>
                        <td>{product.productName}</td>
                        <td>{product.unit}</td>
                        <td>{product.harga}</td>
                        <td>
                          <button
                            className="rounded-xl bg-yellow-600 text-white  my-1  p-1 hover:cursor-pointer"
                            onClick={handleOpenModal}
                          >
                            Update
                          </button>
                        </td>
                        <td>
                          <button
                            className="rounded-xl bg-red-600 text-white  my-1  p-1 hover:cursor-pointer"
                            onClick={handleOpenModal}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))} */}
                </tbody>
              </table>
              <button className="border mt-3 py-3 px-5 rounded-xl text-sans bg-slate-300">
                Submit
              </button>
            </TabPanel>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Product;
