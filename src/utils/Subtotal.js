const calcSubtotal = (positions) => {
  const amounts = positions.map((position) => position.amount * 1);
  return amounts.reduce((sum, amount) => sum + amount, 0);
}

export default calcSubtotal;