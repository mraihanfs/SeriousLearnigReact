export const isEveryValueEmpty = (obj) => Object.values(obj).every(value => value == "");
export const isArrayNull = (obj) =>{
    console.log(obj.length)
    if (obj.length > 0 ){
        return true
    }
    return false
}