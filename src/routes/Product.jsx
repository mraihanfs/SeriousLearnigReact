import React, { useState, useEffect } from "react";

import {
  MdNavigateBefore,
  MdNavigateNext,
  MdSkipNext,
  MdSkipPrevious,
} from "react-icons/md";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { PRODUCTS } from "../constants/DataMock";
import { FIELDS_NAME_PRODUCT } from "../constants/FieldName";

const Product = () => {
  const [dataProduct, setDataProduct] = useState(PRODUCTS);
  const [dataShow, setDataShow] = useState([]);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(0);

  useEffect(() => {
    const result = [];
    for (let i = 0; i < dataProduct.length; i += 10) {
      result.push(dataProduct.slice(i, i + 10));
    }
    setDataShow(result);
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
          <button
            className="rounded-xl bg-green-600 text-white h-12 m-5 w-32 hover:cursor-pointer"
            onClick={handleOpenModal}
          >
            + Add
          </button>
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
          <div className=" bg-slate-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h2>Modal Content</h2>
            <p>This is a simple modal.</p>
            <button onClick={handleCloseModal}>Close Modal</button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Product;
