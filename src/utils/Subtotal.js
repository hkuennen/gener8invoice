const calcSubtotal = (positions) => {
  const amounts = positions.map((position) => position.amount);
  return amounts.reduce((sum, amount) => sum + amount, 0);
}

export default calcSubtotal;