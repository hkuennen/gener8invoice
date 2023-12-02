import { generateTableHeader, generateTableBody } from "../utils/TableSkeletons";

const InvoicePositionsOtherPages = ({maxRowsPerPageWithPagebreak, array, handlePositionsChange, handleRemovePosition}) => {
  const otherPages = array[1] ? (
    <>
      {generateTableHeader(false)}
      {generateTableBody(array[1], maxRowsPerPageWithPagebreak, handlePositionsChange, handleRemovePosition)}
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