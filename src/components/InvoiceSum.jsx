const InvoiceSum = ({ subtotal, tax, handleTaxChange }) => {
  return (
    <>
      <table className="space-left">
        <thead>
          <tr className="bg-grey">
            <th className="w-17p"></th>
            <th></th>
            <th className="w-30p"></th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-grey">
            <td>Subtotal</td>
            <td></td>
            <td id="subtotal">
              € {isNaN(subtotal) ? (0).toFixed(2) : parseFloat(subtotal).toFixed(2)}
            </td>
          </tr>
          <tr className="distancer" />
          <tr>
            <td>Tax</td>
            <td>
              <select name="tax" onChange={(e) => handleTaxChange(e)}>
                <option value="0.19">19 %</option>
                <option value="0.07">7 %</option>
              </select>
            </td>
            <td>€ {isNaN(subtotal) ? (0).toFixed(2) : (subtotal * parseFloat(tax)).toFixed(2)}</td>
          </tr>
          <tr className="distancer" />
          <tr>
            <td>Total</td>
            <td></td>
            <td id="total">
              € {isNaN(subtotal) ? (0).toFixed(2) : (subtotal * (1 + parseFloat(tax))).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default InvoiceSum;
