const getTotalPoints = (transactions) => {
  let totalPoints = 0;
  transactions.forEach((transaction) => (totalPoints += transaction.points));
  return totalPoints;
};

const sortTransactionsByDate = (transactions) => {
  transactions.sort((a, b) => {
    const date1 = Date.parse(a.timestamp);
    const date2 = Date.parse(b.timestamp);

    return date1 - date2;
  });
};

module.exports = {
  getTotalPoints,
  sortTransactionsByDate,
};
