const seperateData = (data) => {
  const result = [];
  if (!(data.length>0)){
    return result;
  }
  {
    for (let i = 0; i < data.length; i += 10) {
      result.push(data.slice(i, i + 10));
    }
    return result;
  }
};

export default seperateData;