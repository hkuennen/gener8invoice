import {
  MAX_ROWS_PER_FIRST_PAGE_AFTER_PAGINATION,
  MAX_ROWS_PER_OTHER_PAGES_AFTER_PAGINATION
} from "./constants";

/**
 * Class to manage invoice positions.
 * Provides methods to calculate new positions, subtotal, and paginate positions.
 */
class PositionManager {
  constructor(positions) {
    this.positions = positions;
  }

  /**
   * Calculates a new position based on the given index, name, and value.
   * Updates the position's quantity, price, and amount.
   *
   * @param {Object} param - Parameters for calculating the new position.
   * @param {number} param.idx - Index of the position to update.
   * @param {string} param.name - Name of the field to update.
   * @param {string} param.value - New value for the field.
   * @returns {Array} Updated positions array.
   */
  calcNewPosition({ idx, name, value }) {
    let newPosition = [...this.positions];
    newPosition[idx]["pos"] = idx + 1;
    newPosition[idx][name] = value;

    const { qty, price } = newPosition[idx];
    if (newPosition[idx]["qty"] !== undefined && newPosition[idx]["qty"].length !== 0) {
      newPosition[idx]["qty"] = parseInt(qty).toFixed(0) * 1;
    }
    if (newPosition[idx]["price"] !== undefined && newPosition[idx]["price"].length !== 0) {
      newPosition[idx]["price"] = parseFloat(price).toFixed(2) * 1;
    }

    const q = parseInt(newPosition[idx]["qty"]).toFixed(0);
    const p = parseFloat(newPosition[idx]["price"]).toFixed(2);
    const amount = isNaN(q) || isNaN(p) ? 0 : qty * price;
    newPosition[idx]["amount"] = parseFloat(amount).toFixed(2) * 1;

    return newPosition;
  }

  /**
   * Calculates the subtotal of all positions.
   *
   * @param {Array} positions - Array of positions.
   * @returns {number} Subtotal amount.
   */
  calcSubtotal(positions) {
    const amounts = positions.map((position) => position.amount * 1);
    return amounts.reduce((sum, amount) => sum + amount, 0);
  }

  /**
   * Paginates the positions into pages based on the maximum rows per page.
   *
   * @returns {Array} Array of positions per page.
   */
  paginate() {
    const copyOfPositions = [...this.positions];
    const positionsPerPage = [];
    const maxRowsFirstPage = MAX_ROWS_PER_FIRST_PAGE_AFTER_PAGINATION;
    const maxRowsOtherPages = MAX_ROWS_PER_OTHER_PAGES_AFTER_PAGINATION;

    for (let i = 0; i < copyOfPositions.length; ) {
      let maxRows = positionsPerPage.length === 0 ? maxRowsFirstPage : maxRowsOtherPages;
      const pageRows = copyOfPositions.slice(i, i + maxRows);
      positionsPerPage.push(pageRows);
      i += maxRows;
    }
    return positionsPerPage;
  }
}

export default PositionManager;
