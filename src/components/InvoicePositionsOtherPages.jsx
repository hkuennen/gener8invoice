import { generateTableHeader, generateTableBody } from "../utils/TableSkeletons";

const InvoicePositionsOtherPages = ({maxRowsPerPageWithPagebreak, array, handlePositionsChange, handleRemovePosition}) => {
  const otherPages = array[1] ? (
    <>
      {generateTableHeader({
        isFirstPage: false
      })}
      {generateTableBody({
        positions: array[1],
        idxRows: maxRowsPerPageWithPagebreak,
        handlePositionsChange,
        handleRemovePosition
      })}
    </>
  ) : 
    undefined;

  return (
    <>
      <table>
        {otherPages}
      </table>
    </>
  );
}

export default InvoicePositionsOtherPages;