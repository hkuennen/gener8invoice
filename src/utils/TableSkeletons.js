import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export const generateTableHeader = ({ isFirstPage }) => {
  return (
    <tr className={isFirstPage ? "grey" : "no-bottom-border"}>
      <th className="th_pos">{isFirstPage && "Pos"}</th>
      <th className="th_qty">{isFirstPage && "Qty"}</th>
      <th className="th_item">{isFirstPage && "Item"}</th>
      <th className="th_price">{isFirstPage && "Unit price"}</th>
      <th className="th_amount">{isFirstPage && "Amount"}</th>
    </tr>
  );
}

export const generateTableBody = ({ positions, idxRows, handlePositionsChange, handleRemovePosition }) => {
  return (
    <>
      {positions.map((row, idx) => (
      <tr key={idx+idxRows+1}>
        <td>{idx+idxRows+1}</td>
        <td>
          <input 
            type="number" 
            name="qty" 
            placeholder="#" 
            className="td_qty" 
            value={row.qty} 
            onChange={(e) => handlePositionsChange(e, idx+idxRows)} 
            required 
          />
          </td>
        <td>
          <input 
            type="text" 
            name="item" 
            className="td_item" 
            placeholder="Description of service or product..." 
            value={row.item} 
            onChange={(e) => handlePositionsChange(e, idx+idxRows)} 
            maxLength="55" 
            required 
          />
          </td>
        <td>
          <label>€ </label>
          <input 
            type="number" 
            step="0.01" 
            name="price" 
            className="td_price" 
            placeholder="0.00" 
            value={row.price} 
            onFocus={(e) => e.target.value = parseFloat(e.target.value).toFixed(2)} 
            onBlur={(e) => e.target.value = parseFloat(e.target.value).toFixed(2)} 
            onChange={(e) => handlePositionsChange(e, idx+idxRows)} 
            required 
          />
        </td>
        <td className="td_amount">
          <label>€ </label>
          {parseFloat(row.amount).toFixed(2)}
        </td>
        <td>
          <button 
            className="pointer" 
            onClick={(e) => handleRemovePosition(e, idx+idxRows)}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </td>
      </tr>
      ))}
    </>
  )
}