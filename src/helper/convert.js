import { OPTIONCURRENCY, OPTIONDATETIME } from "../constants/Option";

export const changeFormatDate = (rawDate) =>{
    const date = new Date(rawDate);

    const formatter = new Intl.DateTimeFormat('id-ID', OPTIONDATETIME)
    const formattedDate = formatter.format(date);
    return formattedDate
}

export const changeCurrencyForm = (rawNumber) => {
    return new Intl.NumberFormat('id-ID', OPTIONCURRENCY).format(rawNumber)
}

export const columnToNumber = (column) => {
    let num = 0 
    for (let i = 0; i<column.length; i++){
        num = num * 26 + (column.charCodeAt(i) - 64)
    }
    return num - 1
}