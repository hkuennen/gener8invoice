import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Generates the table header for the invoice positions table.
 *
 * @param {Object} param - Parameters for generating the table header.
 * @param {boolean} param.isFirstPage - Indicates if the table is on the first page.
 * @returns {JSX.Element} Table header element.
 */
export const generateTableHeader = ({ isFirstPage }) => {
  return (
    <thead>
      <tr className={isFirstPage ? "bg-grey" : "no-bottom-border"}>
        <th className="th_pos w-5p">{isFirstPage && "Pos"}</th>
        <th className="th_qty w-13p">{isFirstPage && "Qty"}</th>
        <th className="th_item w-52p">{isFirstPage && "Item"}</th>
        <th className="th_price w-17p">{isFirstPage && "Unit price"}</th>
        <th className="th_amount w-17p">{isFirstPage && "Amount"}</th>
      </tr>
    </thead>
  );
};

/**
 * Generates the table body for the invoice positions table.
 *
 * @param {Object} param - Parameters for generating the table body.
 * @param {Array} param.positions - Array of positions to display in the table.
 * @param {number} param.idxRows - Index of the first row in the table.
 * @param {Function} param.handlePositionsChange - Function to handle changes in positions.
 * @param {Function} param.handleRemovePosition - Function to handle removing a position.
 * @returns {JSX.Element} Table body element.
 */
export const generateTableBody = ({
  positions,
  idxRows,
  handlePositionsChange,
  handleRemovePosition
}) => {
  const formatPrice = (e) => {
    const { value } = e.target;
    e.target.value = parseFloat(value).toFixed(2);
  };
  return (
    <>
      <tbody key={"body"}>
        {positions.map((row, idx) => (
          <tr key={idx + idxRows + 1}>
            <td>{idx + idxRows + 1}</td>
            <td>
              <input
                type="number"
                name="qty"
                placeholder="#"
                className="td_qty w-50p"
                value={row.qty}
                onChange={(e) => handlePositionsChange(e, idx + idxRows)}
                required
              />
            </td>
            <td>
              <input
                type="text"
                name="item"
                className="td_item w-95p"
                placeholder="Description of service or product..."
                value={row.item}
                onChange={(e) => handlePositionsChange(e, idx + idxRows)}
                maxLength="55"
                required
              />
            </td>
            <td>
              <div className="relative">
                <p className="absolute left-1.5 text-slate-500">€ </p>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  className="td_price w-80p"
                  placeholder="0.00"
                  value={row.price}
                  onBlur={(e) => formatPrice(e)}
                  onChange={(e) => handlePositionsChange(e, idx + idxRows)}
                  required
                />
              </div>
            </td>
            <td className="td_amount w-70p">
              <label>€ </label>
              {parseFloat(row.amount).toFixed(2)}
            </td>
            <td>
              <button className="pointer" onClick={(e) => handleRemovePosition(e, idx + idxRows)}>
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
};
