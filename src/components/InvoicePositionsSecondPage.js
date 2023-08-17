import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const InvoicePositionsSecondPage = ({array, maxRowsPerPageWithPagebreak, handlePositionsChange, handleRemovePosition}) => {
  return(
    <>
      <table>
        <tr id="no-bottom-border">
          <th className="th_pos"></th>
          <th className="th_qty"></th>
          <th className="th_item"></th>
          <th className="th_price"></th>
          <th className="th_amount"></th>
        </tr>
        {array[1] && array[1].map((row, idx) => (
        <tr key={idx+maxRowsPerPageWithPagebreak+1}>
          <td>{idx+maxRowsPerPageWithPagebreak+1}</td>
          <td><input type="number" name="qty" placeholder="1" className="td_qty" value={row.qty} onChange={(e) => handlePositionsChange(e, idx+maxRowsPerPageWithPagebreak)} required /></td>
          <td><input type="textarea" name="item" className="td_item" placeholder="Description of service or product..." value={row.item} onChange={(e) => handlePositionsChange(e, idx+maxRowsPerPageWithPagebreak)} maxLength="55" required /></td>
          <td>
            <label>€ </label>
            <input type="number" step="0.01" name="price" className="td_price" placeholder="0.00" value={row.price} onFocus={(e) => e.target.value = parseFloat(e.target.value).toFixed(2)} onBlur={(e) => e.target.value = parseFloat(e.target.value).toFixed(2)} onChange={(e) => handlePositionsChange(e, idx+maxRowsPerPageWithPagebreak)} required />
          </td>
          <td className="td_amount">
            <label>€ </label>
            {parseFloat(row.amount).toFixed(2)}
          </td>
          <td>
            <button className="pointer" onClick={(e) => handleRemovePosition(e, idx+maxRowsPerPageWithPagebreak)}><FontAwesomeIcon icon={faTrashCan} /></button>
          </td>
        </tr>
        ))}
      </table>
    </>
  )
}

export default InvoicePositionsSecondPage;