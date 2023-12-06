import { RangeType } from '~/prices/schemas/price.schemas';
const calBill = (number: number, range: RangeType[]) => {
  const total = range.reduce((totalCal, currentValue) => {
    if (number >= currentValue.range) {
      number = number - currentValue.range;
      return totalCal + currentValue.range * currentValue.unitPrice;
    }
    if (number < currentValue.range && number > 0) {
      return totalCal + number * currentValue.unitPrice;
    }
  }, 0);
  return total;
};
export { calBill };
