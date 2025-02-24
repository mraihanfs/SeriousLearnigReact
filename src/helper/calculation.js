export const calculateTotalPerProduct = (qty, price) => {
    return qty*price
}

export const calculateTotal = (listProduct, key) => {
    let total = 0;
    listProduct.map((product) => {
        total += product[key]
    })
    return total
}
