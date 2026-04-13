// utils/calculateExpectedTotal.js
function calculateExpectedTotal(student) {
  let total = student.feeStructure.totalAmount;

  if (!student.isHosteller) {
    total -= student.feeStructure.hostelFee || 0;
  }

  if (student.year !== 1) {
    total -= student.feeStructure.breakdown.cautionMoney || 0;
  }

  return total;
}

module.exports = calculateExpectedTotal;