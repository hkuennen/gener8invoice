const calcArrayForPositionChange = (positions, idx, name, value) => {
  let newArr = [...positions];
  newArr[idx]["pos"] = idx+1
  newArr[idx][name] = value;

  const { qty, price } = newArr[idx];
  if (newArr[idx]["qty"] !== undefined && newArr[idx]["qty"].length !== 0) { newArr[idx]["qty"] = qty };
  if (newArr[idx]["price"] !== undefined && newArr[idx]["price"].length !== 0) { newArr[idx]["price"] = price };

  const q = parseInt(newArr[idx]["qty"]);
  const p = parseFloat(newArr[idx]["price"]).toFixed(2);
  const amount = (isNaN(q) || isNaN((p))) ? 0 : (qty * price);
  newArr[idx]["amount"] = amount;
  
  return newArr;
}

export default calcArrayForPositionChange;