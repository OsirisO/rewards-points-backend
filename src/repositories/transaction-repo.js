const Utils = require("../utils");

const TRANSACTIONS = [];
const BALANCES = {};

const addTransaction = (payer, points, timestamp) => {
  const transaction = {
    id: new Date().getTime(),
    payer: payer,
    points: points,
    initialPoints: points,
    timestamp: timestamp,
  };

  // Add or substract points to the users' balance
  updateBalance(payer, points);

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

const updateBalance = (payer, points) => {
  if (!BALANCES.hasOwnProperty(payer)) {
    BALANCES[payer] = 0;
  }

  BALANCES[payer] += points;

  if (BALANCES[payer] < 0) {
    // Negative balances are not allowed
    BALANCES[payer] = 0;
  }

  return;
};

const getBalance = () => {
  return BALANCES;
};

module.exports = {
  addTransaction,
  getTransactions,
  updatePoints,
  updateBalance,
  getBalance,
};
