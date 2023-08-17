import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const InvoicePositions = ({positions, maxRowsPerPage, array, handlePositionsChange, handleRemovePosition}) => {
  return (
    <>
      <table>
        <tr className="grey">
          <th className="th_pos">Pos</th>
          <th className="th_qty">Qty</th>
          <th className="th_item">Item</th>
          <th className="th_price">Unit price</th>
          <th className="th_amount">Amount</th>
        </tr>
        {positions.length < maxRowsPerPage+1 ?
        <>
          {positions.map((row, idx) => (
          <tr key={idx+1}>
            <td>{idx+1}</td>
            <td><input type="number" name="qty" placeholder="1" className="td_qty" value={row.qty} onChange={(e) => handlePositionsChange(e, idx)} required /></td>
            <td><input type="textarea" name="item" className="td_item h-5 rounded" placeholder="Description of service or product..." value={row.item} onChange={(e) => handlePositionsChange(e, idx)} maxLength="55" required /></td>
            <td>
              <label>€ </label>
              <input type="number" step="0.01" name="price" className="td_price" placeholder="0.00" value={row.price} onFocus={(e) => e.target.value = parseFloat(e.target.value).toFixed(2)} onBlur={(e) => e.target.value = parseFloat(e.target.value).toFixed(2)} onChange={(e) => handlePositionsChange(e, idx)} required />
            </td>
            <td className="td_amount">
              <label>€ </label>
              {parseFloat(row.amount).toFixed(2)}
            </td>
            <td>
              <button id="delete" onClick={(e) => handleRemovePosition(e, idx)}><FontAwesomeIcon icon={faTrashCan} /></button>
            </td>
          </tr>
          ))}
        </>
        :
        <>
          {array[0].map((row, idx) => (
          <tr key={idx+1}>
            <td>{idx+1}</td>
            <td><input type="number" name="qty" placeholder="1" className="td_qty" value={row.qty} onChange={(e) => handlePositionsChange(e, idx)} required /></td>
            <td><input type="textarea" name="item" className="td_item" placeholder="Description of service or product..." value={row.item} onChange={(e) => handlePositionsChange(e, idx)} maxLength="55" required /></td>
            <td>
              <label>€ </label>
              <input type="number" step="0.01" name="price" className="td_price" placeholder="0.00" value={row.price} onFocus={(e) => e.target.value = parseFloat(e.target.value).toFixed(2)} onBlur={(e) => e.target.value = parseFloat(e.target.value).toFixed(2)} onChange={(e) => handlePositionsChange(e, idx)} required />
            </td>
            <td className="td_amount">
              <label>€ </label>
              {parseFloat(row.amount).toFixed(2)}
            </td>
            <td>
              <button id="delete" onClick={(e) => handleRemovePosition(e, idx)}><FontAwesomeIcon icon={faTrashCan} /></button>
            </td>
          </tr>
          ))}
        </>
        }
      </table>
    </>
  );
}

export default InvoicePositions;