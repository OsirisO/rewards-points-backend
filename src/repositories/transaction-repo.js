const Utils = require("../utils");

const TRANSACTIONS = [];

const addTransaction = (payer, points, timestamp) => {
  // If transaction comes with negative points, substract from the oldest transaction with the provided payer
  if (points < 0) {
    let pointsToSubstract = Math.abs(points); // 200

    for (let i = 0; i < TRANSACTIONS.length && pointsToSubstract > 0; i++) {
      const transaction = TRANSACTIONS[i];

      if (transaction.payer !== payer) {
        continue;
      }

      if (pointsToSubstract >= transaction.points) {
        pointsToSubstract -= transaction.points;
        transaction.points = 0;
      } else {
        transaction.points = transaction.points - pointsToSubstract;
        pointsToSubstract = 0;
      }
    }
  }

  const transaction = {
    payer: payer,
    points: points,
    timestamp: timestamp,
  };

  TRANSACTIONS.push(transaction);
};
const listTransactions = () => {
  return TRANSACTIONS;
};

const spendPoints = (points) => {
  const totalPoints = Utils.getTotalPoints(TRANSACTIONS);
  if (points > totalPoints) {
    return `Not enough points to spend, your current balance is ${totalPoints} points`;
  }

  Utils.sortTransactionsByDate(TRANSACTIONS);

  let pointsToSpend = points;
  let updatedTransactions = [];

  for (let i = 0; i < TRANSACTIONS.length && pointsToSpend > 0; i++) {
    const transaction = TRANSACTIONS[i];

    if (transaction.points < 0) {
      continue;
    }
    if (pointsToSpend >= transaction.points) {
      pointsToSpend -= transaction.points;
      const updatedTransaction = {
        payer: transaction.payer,
        points: transaction.points * -1,
      };
      updatedTransactions.push(updatedTransaction);
      transaction.points = 0;
    } else {
      const updatedTransaction = {
        payer: transaction.payer,
        points: pointsToSpend * -1,
      };
      updatedTransactions.push(updatedTransaction);
      transaction.points = transaction.points - pointsToSpend;
      pointsToSpend = 0;
    }
  }

  return updatedTransactions;
};

const getBalance = () => {
  const balance = {};

  TRANSACTIONS.forEach((transaction) => {
    balance[transaction.payer] = transaction.points;
  });
  console.log(balance);

  return balance;
};

module.exports = {
  addTransaction,
  listTransactions,
  spendPoints,
  getBalance,
};
