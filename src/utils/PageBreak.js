const calcArrayForPageBreak = (positions, maxRowsPerPage, maxRowsPerPageWithPagebreak) => {
  let newArr = [...positions];
  let arr = [];
  if (newArr.length <= maxRowsPerPage) {
    for (let i = 0; i < newArr.length; i += maxRowsPerPage) {
      const row = newArr.slice(i, i + maxRowsPerPage);
      arr.push(row);
    }
  } else if (newArr.length > maxRowsPerPage) {
    for (let i = 0; i < newArr.length; i += maxRowsPerPageWithPagebreak) {
      const row = newArr.slice(i, i + maxRowsPerPageWithPagebreak);
      arr.push(row);
    }
  }
  return arr;
}

export default calcArrayForPageBreak;