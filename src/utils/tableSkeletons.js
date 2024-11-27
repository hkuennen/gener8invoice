import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

export const generateTableBody = ({
  positions,
  idxRows,
  handlePositionsChange,
  handleRemovePosition
}) => {
  return (
    <>
      {positions.map((row, idx) => (
        <tbody>
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
                  onFocus={(e) => (e.target.value = parseFloat(e.target.value).toFixed(2))}
                  onBlur={(e) => (e.target.value = parseFloat(e.target.value).toFixed(2))}
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
        </tbody>
      ))}
    </>
  );
};
