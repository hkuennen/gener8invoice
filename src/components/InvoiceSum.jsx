const InvoiceSum = ({ subtotal, tax, handleTaxChange }) => {
  return (
    <>
      <table>
        <tr className="grey">
          <th className="th_pos"></th>
          <th className="th_qty"></th>
          <th className="th_item"></th>
          <th className="th_price"></th>
          <th className="th_amount"></th>
        </tr>
        <tr className="grey">
          <td>Subtotal</td>
          <td></td>
          <td></td>
          <td></td>
          <td id="subtotal">€ {isNaN(subtotal) ? (0).toFixed(2) : parseFloat(subtotal).toFixed(2)}</td>
        </tr>
        <br />
        <tr>
          <td>Tax</td>
          <td><select name="tax" onChange={(e) => handleTaxChange(e)}>
            <option value="0.19">19 %</option>
            <option value="0.07">7 %</option>
            </select></td>
          <td></td>
          <td></td>
          <td>€ {isNaN(subtotal) ? (0).toFixed(2) : (subtotal * parseFloat(tax)).toFixed(2)}</td>
        </tr>
        <br />
        <tr className="bold">
          <td>Total</td>
          <td></td>
          <td></td>
          <td></td>
          <td id="total">€ {isNaN(subtotal) ? (0).toFixed(2) : (subtotal * (1 + parseFloat(tax))).toFixed(2)}</td>
        </tr>
      </table>
    </>
  );
}

export default InvoiceSum;