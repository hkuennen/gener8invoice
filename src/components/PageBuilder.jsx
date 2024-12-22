import { generateTableHeader, generateTableBody } from "../utils/tableSkeletons";
import {
  MAX_ROWS_PER_FIRST_PAGE_BEFORE_PAGINATION,
  MAX_ROWS_PER_FIRST_PAGE_AFTER_PAGINATION,
  MAX_ROWS_PER_OTHER_PAGES_BEFORE_PAGINATION,
  MAX_ROWS_PER_OTHER_PAGES_AFTER_PAGINATION
} from "../utils/constants";

/**
 * PageBuilder component for rendering invoice pages.
 * Handles the layout and pagination of invoice positions.
 *
 * @param {Object} props - Component properties.
 * @param {Array} props.positionsPerPage - Array of positions for each page.
 * @param {Function} props.handleAddPosition - Function to handle adding a new position.
 * @param {Function} props.handlePositionsChange - Function to handle changes in positions.
 * @param {Function} props.handleRemovePosition - Function to handle removing a position.
 * @param {JSX.Element} props.contactInfo - Contact information component.
 * @param {JSX.Element} props.invoiceSum - Invoice summary component.
 * @param {JSX.Element} props.accountDetails - Account details component.
 */
const PageBuilder = ({
  positionsPerPage,
  handleAddPosition,
  handlePositionsChange,
  handleRemovePosition,
  contactInfo,
  invoiceSum,
  accountDetails
}) => {
  const firstPagePositions = (positions) => (
    <>
      {generateTableHeader({
        isFirstPage: true
      })}
      {generateTableBody({
        positions: positions,
        idxRows: 0,
        handlePositionsChange,
        handleRemovePosition
      })}
    </>
  );

  const firstPageWithPagebreakPositions = (positions) => (
    <>
      {generateTableHeader({
        isFirstPage: true
      })}
      {generateTableBody({
        positions: positions,
        idxRows: 0,
        handlePositionsChange,
        handleRemovePosition
      })}
    </>
  );

  const otherPagesPositions = (positions, index) => (
    <>
      {generateTableHeader({
        isFirstPage: false
      })}
      {generateTableBody({
        positions: positions,
        idxRows:
          index === 1
            ? MAX_ROWS_PER_FIRST_PAGE_AFTER_PAGINATION
            : MAX_ROWS_PER_FIRST_PAGE_AFTER_PAGINATION +
              (index - 1) * MAX_ROWS_PER_OTHER_PAGES_AFTER_PAGINATION,
        handlePositionsChange,
        handleRemovePosition
      })}
    </>
  );

  const addButton = (
    <button className="add pointer" onClick={(e) => handleAddPosition(e)}>
      +
    </button>
  );

  const pagebreak = (
    <div className="page">
      {invoiceSum}
      {accountDetails}
    </div>
  );

  const firstPage = (positions) => (
    <>
      <div className="page">
        {contactInfo}
        <br />
        <table>
          {positions.length <= MAX_ROWS_PER_FIRST_PAGE_BEFORE_PAGINATION
            ? firstPagePositions(positions)
            : firstPageWithPagebreakPositions(positions)}
        </table>
        {positions.length <= MAX_ROWS_PER_FIRST_PAGE_AFTER_PAGINATION &&
          positionsPerPage.length <= 1 &&
          addButton}
        {positions.length <= MAX_ROWS_PER_FIRST_PAGE_BEFORE_PAGINATION && invoiceSum}
        {accountDetails}
      </div>
      {positions.length > MAX_ROWS_PER_FIRST_PAGE_BEFORE_PAGINATION &&
        positions.length <= MAX_ROWS_PER_FIRST_PAGE_AFTER_PAGINATION &&
        positionsPerPage.length <= 1 &&
        pagebreak}
    </>
  );

  const otherPages = (positions, index) => (
    <>
      <div className="page">
        <table>{otherPagesPositions(positions, index)}</table>
        {positions.length <= MAX_ROWS_PER_OTHER_PAGES_AFTER_PAGINATION &&
          index === positionsPerPage.length - 1 &&
          addButton}
        {positions.length <= MAX_ROWS_PER_OTHER_PAGES_BEFORE_PAGINATION &&
          index === positionsPerPage.length - 1 &&
          invoiceSum}
        {accountDetails}
      </div>
      {positions.length > MAX_ROWS_PER_OTHER_PAGES_BEFORE_PAGINATION &&
        positions.length <= MAX_ROWS_PER_OTHER_PAGES_AFTER_PAGINATION &&
        index === positionsPerPage.length - 1 &&
        pagebreak}
    </>
  );

  return (
    <>
      {positionsPerPage.map((page, index) => (
        <div key={index}>{index === 0 ? firstPage(page) : otherPages(page, index)}</div>
      ))}
    </>
  );
};

export default PageBuilder;
