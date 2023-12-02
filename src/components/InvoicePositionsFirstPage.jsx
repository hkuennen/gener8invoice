import { generateTableHeader, generateTableBody } from "../utils/TableSkeletons";

const InvoicePositionsFirstPage = ({positions, maxRowsPerPage, array, handlePositionsChange, handleRemovePosition}) => {
  const firstPage = (
    <>
      {generateTableHeader(true)}
      {generateTableBody(positions, 0, handlePositionsChange, handleRemovePosition)}
    </>
    );
  const firstPageWithPagebreak = array[0] ? (
    <>
      {generateTableHeader(true)}
      {generateTableBody(array[0], 0, handlePositionsChange, handleRemovePosition)}
    </>
    ) : 
    undefined;

  return (
    <>
      <table>
        {positions.length < maxRowsPerPage+1 ?
          firstPage
        :
          firstPageWithPagebreak
        }
      </table>
    </>
  );
}

export default InvoicePositionsFirstPage;