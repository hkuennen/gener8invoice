import './Positions.css';

const Positions = () => {

  return (
    <table>
      <tr class="grey">
        <th>Pos</th>
        <th>Qty</th>
        <th>Item</th>
        <th>Unit price</th>
        <th>Amount</th>
      </tr>
      <tr>
        <td>1</td>
        <td>1</td>
        <td>Position of service or product...</td>
        <td>100 €</td>
        <td>100 €</td>
      </tr>
      <tr>
        <td>2</td>
        <td>1</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
      <br />
      <tr class="grey">
        <td>Subtotal</td>
        <td></td>
        <td></td>
        <td></td>
        <td id="subtotal">100 €</td>
      </tr>
      <br />
      <tr>
        <td>19% Tax</td>
        <td></td>
        <td></td>
        <td></td>
        <td>19 €</td>
      </tr>
      <br />
      <tr class="bold">
        <td>Total</td>
        <td></td>
        <td></td>
        <td></td>
        <td id="total">119 €</td>
      </tr>
    </table>
  );
}

export default Positions;