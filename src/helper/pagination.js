const seperateData = (data) => {
  const result = [];
  console.log(data.length);
  {
    for (let i = 0; i < data.length; i += 10) {
      result.push(data.slice(i, i + 10));
    }
    console.log(data.length);
    return result;
  }
};

export default seperateData;