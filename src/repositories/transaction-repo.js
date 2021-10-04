const Utils = require("../utils");

const TRANSACTIONS = [];

const addTransaction = (payer, points, timestamp) => {
  const transaction = {
    id: new Date().getTime(),
    payer: payer,
    points: points,
    initialPoints: points,
    timestamp: timestamp,
  };

  TRANSACTIONS.push(transaction);
};

const getTransactions = () => {
  Utils.sortTransactionsByDate(TRANSACTIONS);
  return TRANSACTIONS;
};

const updatePoints = (transactionId, updatedPoints) => {
  for (let i = 0; i < TRANSACTIONS.length; i++) {
    if (TRANSACTIONS[i].id === transactionId) {
      TRANSACTIONS[i].points = updatedPoints;
    }
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updatePoints,
};
