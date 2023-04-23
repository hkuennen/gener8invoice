import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const InvoicePositions = ({positions, subtotal, handlePositionsChange, handleAddPosition, handleRemovePosition}) => {
  return (
    <>
      <table>
        <tr className="grey">
          <th>Pos</th>
          <th id="th_qty">Qty</th>
          <th id="th_item">Item</th>
          <th id="th_price">Unit price</th>
          <th id="th_amount">Amount</th>
        </tr>
        {positions.map((row, idx) => (
        <tr key={idx+1}>
          <td>{idx+1}</td>
          <td><input type="number" name="qty" placeholder="1" className="td_qty" value={row.qty} onChange={(e) => handlePositionsChange(e, idx)} required /></td>
          <td><input type="textarea" name="item" className="td_item" placeholder="Description of service or product..." value={row.item} onChange={(e) => handlePositionsChange(e, idx)} required /></td>
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
        <button id="add" onClick={(e) => handleAddPosition(e)}>+</button>
        <br />
        <tr className="grey">
          <td>Subtotal</td>
          <td></td>
          <td></td>
          <td></td>
          <td id="subtotal">€ {isNaN(subtotal) ? (0).toFixed(2) : parseFloat(subtotal).toFixed(2)}</td>
        </tr>
        <br />
        <tr>
          <td>19% Tax</td>
          <td></td>
          <td></td>
          <td></td>
          <td>€ {isNaN(subtotal) ? (0).toFixed(2) : (subtotal * 0.19).toFixed(2)}</td>
        </tr>
        <br />
        <tr className="bold">
          <td>Total</td>
          <td></td>
          <td></td>
          <td></td>
          <td id="total">€ {isNaN(subtotal) ? (0).toFixed(2) : (subtotal * 1.19).toFixed(2)}</td>
        </tr>
      </table>
    </>
  );
}

export default InvoicePositions;