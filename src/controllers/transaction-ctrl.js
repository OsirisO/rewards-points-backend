const TransactionsRepository = require("../repositories/transaction-repo");

const addTransaction = (req, res) => {
  const payer = req.body.payer;
  const points = req.body.points;
  const timestamp = req.body.timestamp;

  if (!payer) {
    return res.status(400).send("Missing required field 'payer'.");
  }

  if (!points) {
    return res.status(400).send("Missing required field 'points'.");
  }

  if (!timestamp) {
    return res.status(400).send("Missing required field 'timestamp.");
  }

  // Add new transaction to transactions
  TransactionsRepository.addTransaction(payer, points, timestamp);
  res.send();
};

const listTransactions = (req, res) => {
  const transactions = TransactionsRepository.listTransactions();
  res.json(transactions);
};

const spendPoints = (req, res) => {
  const points = req.body.points;

  if (!points) {
    return res.status(400).send("Missing required field 'points'.");
  }

  const updatedTransactions = TransactionsRepository.spendPoints(points);

  res.json(updatedTransactions);
};

const getBalance = (req, res) => {
  const balance = TransactionsRepository.getBalance();
  res.json(balance);
};

module.exports = {
  addTransaction,
  listTransactions,
  spendPoints,
  getBalance,
};
