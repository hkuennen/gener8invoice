import { generateTableHeader, generateTableBody } from "../utils/TableSkeletons";

const InvoicePositionsOtherPages = ({
  maxRowsPerPageWithPagebreak,
  positionsPerPage,
  handlePositionsChange,
  handleRemovePosition
}) => {
  const otherPages = positionsPerPage[1] && (
    <>
      {generateTableHeader({
        isFirstPage: false
      })}
      {generateTableBody({
        positions: positionsPerPage[1],
        idxRows: maxRowsPerPageWithPagebreak,
        handlePositionsChange,
        handleRemovePosition
      })}
    </>
  );

  return (
    <>
      <table>
        {otherPages}
      </table>
    </>
  );
}

export default InvoicePositionsOtherPages;