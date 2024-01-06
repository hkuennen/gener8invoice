import { generateTableHeader, generateTableBody } from "../utils/TableSkeletons";

const InvoicePositionsFirstPage = ({positions, maxRowsPerPage, array, handlePositionsChange, handleRemovePosition}) => {
  const firstPage = (
    <>
      {generateTableHeader({
        isFirstPage: true
      })}
      {generateTableBody({
        positions,
        idxRows: 0,
        handlePositionsChange,
        handleRemovePosition
      })}
    </>
    );
  const firstPageWithPagebreak = array[0] && (
    <>
      {generateTableHeader({
        isFirstPage: true
      })}
      {generateTableBody({
        positions: array[0],
        idxRows: 0,
        handlePositionsChange,
        handleRemovePosition
      })}
    </>
    );

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