const TransactionsRepository = require("../repositories/transaction-repo");
const Utils = require("../utils");

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

  if (points >= 0) {
    // If transaction has positive points, simply save it
    TransactionsRepository.addTransaction(payer, points, timestamp);
    return res.send();
  }

  // If transaction comes with negative points,
  // substract from the oldest transaction with the matching payer

  const transactions = TransactionsRepository.getTransactions();

  let remainingPoints = Math.abs(points);

  for (let i = 0; i < transactions.length && remainingPoints > 0; i++) {
    const transaction = transactions[i];
    let pointsToSubstract = Math.min(transaction.points, remainingPoints);

    // When payer don't match or transaction points are negative or zero, skip it
    if (transaction.payer !== payer || transaction.points <= 0) {
      continue;
    }

    // Update points in existing transaction
    const updatedPoints = transaction.points - pointsToSubstract;
    TransactionsRepository.updatePoints(transaction.id, updatedPoints);
    remainingPoints -= pointsToSubstract;
  }

  // Not sure if negative transactions should be saved
  TransactionsRepository.addTransaction(payer, points, timestamp);

  // Edge case for when incoming transaction comes with negative points and there were not
  // enough points in existing transactions for the given payer
  if (remainingPoints > 0) {
    return res.send(
      `There were ${remainingPoints} points that were not 
      substracted because there was not enough balance from payer`
    );
  }

  return res.send();
};

const listTransactions = (req, res) => {
  const transactions = TransactionsRepository.getTransactions();
  res.json(transactions);
};

const spendPoints = (req, res) => {
  let points = req.body.points;

  if (!points) {
    return res.status(400).send("Missing required field 'points'.");
  }

  const transactions = TransactionsRepository.getTransactions();

  const totalPoints = Utils.getTotalPoints(transactions);
  if (points > totalPoints) {
    return res
      .status(400)
      .send(
        `Not enough points to spend, your current balance is ${totalPoints} points`
      );
  }

  // The response will be an array of all spent points from each transaction
  const response = [];

  for (let i = 0; i < transactions.length && points > 0; i++) {
    const transaction = transactions[i];

    // If transaction points are negative, skip it
    if (transaction.points < 0) {
      continue;
    }

    // The amount of points to substract from this transaction
    // should be the minimum number between points
    // and the transaction points; and update incoming points
    const pointsToSubstract = Math.min(points, transaction.points);
    points -= pointsToSubstract;

    // Update the transaction to remove the points
    const updatedPoints = transaction.points - pointsToSubstract;
    TransactionsRepository.updatePoints(transaction.id, updatedPoints);

    // Add the substracted points to the response array
    response.push({
      payer: transaction.payer,
      points: pointsToSubstract * -1,
    });

    // Update the payer balance
    TransactionsRepository.updateBalance(
      transaction.payer,
      pointsToSubstract * -1
    );
  }

  res.json(response);
};

const getBalance = (req, res) => {
  const balancePerPayer = TransactionsRepository.getBalance();
  res.json(balancePerPayer);
};

module.exports = {
  addTransaction,
  listTransactions,
  spendPoints,
  getBalance,
};
