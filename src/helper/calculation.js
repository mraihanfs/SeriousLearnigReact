export const calculateTotalPerProduct = (qty, price) => {
  return qty * price;
};

export const calculateTotal = (listProduct, key) => {
  let total = 0;
  listProduct.map((product) => {
    if (typeof product[key] === "number") {
      total += product[key];
    }
  });
//   console.log(total);

  return total;
};

export const getDateTimeNow = () => {
  const now = new Date();
  const gm7Date = now.toISOString().split(".")[0] + "Z";
  return gm7Date;
};

export const reduceNumber = (sum, decrement) => {
  console.log(sum - decrement);
  return sum - decrement;
};
