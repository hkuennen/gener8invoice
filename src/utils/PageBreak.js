const calcPositionsPerPage = (positions, maxRowsPerPage, maxRowsPerPageWithPagebreak) => {
  let copyOfPositions = [...positions];
  let listOfPositionsPerPage = [];
  if (copyOfPositions.length <= maxRowsPerPage) {
    for (let i = 0; i < copyOfPositions.length; i += maxRowsPerPage) {
      const row = copyOfPositions.slice(i, i + maxRowsPerPage);
      listOfPositionsPerPage.push(row);
    }
  } else if (copyOfPositions.length > maxRowsPerPage) {
    for (let i = 0; i < copyOfPositions.length; i += maxRowsPerPageWithPagebreak) {
      const row = copyOfPositions.slice(i, i + maxRowsPerPageWithPagebreak);
      listOfPositionsPerPage.push(row);
    }
  }
  return listOfPositionsPerPage;
}

export default calcPositionsPerPage;