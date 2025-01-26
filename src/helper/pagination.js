const seperateData = (data) => {
  const result = [];
  // console.log(data.length);
  if (!(data.length>0)){
    return result;
  }
  {
    for (let i = 0; i < data.length; i += 10) {
      result.push(data.slice(i, i + 10));
    }
    console.log(data.length);
    return result;
  }
};

export default seperateData;