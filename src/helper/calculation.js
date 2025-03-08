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

export const getDateTimeNow = () => {
    const now = new Date();
    const gm7Date = now.toISOString().split('.')[0]+'Z';
    return gm7Date;
}