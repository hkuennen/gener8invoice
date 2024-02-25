const calcNewPosition = (positions, idx, name, value) => {
  let newPosition = [...positions];
  newPosition[idx]["pos"] = idx + 1
  newPosition[idx][name] = value;

  const { qty, price } = newPosition[idx];
  if (newPosition[idx]["qty"] !== undefined && newPosition[idx]["qty"].length !== 0) { newPosition[idx]["qty"] = qty };
  if (newPosition[idx]["price"] !== undefined && newPosition[idx]["price"].length !== 0) { newPosition[idx]["price"] = price };

  const q = parseInt(newPosition[idx]["qty"]);
  const p = parseFloat(newPosition[idx]["price"]).toFixed(2);
  const amount = (isNaN(q) || isNaN((p))) ? 0 : (qty * price);
  newPosition[idx]["amount"] = amount;
  
  return newPosition;
}

export default calcNewPosition;