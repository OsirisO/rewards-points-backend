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
  // substract from the oldest transaction with the provided payer

  const transactions = TransactionsRepository.getTransactions();
  let pointsToSubstract = Math.abs(points);

  for (let i = 0; i < transactions.length && pointsToSubstract > 0; i++) {
    const transaction = transactions[i];

    if (transaction.payer !== payer) {
      continue;
    }

    if (pointsToSubstract >= transaction.points) {
      pointsToSubstract -= transaction.points;
      TransactionsRepository.updatePoints(transaction.id, 0);
    } else {
      TransactionsRepository.updatePoints(
        transaction.id,
        transaction.points - pointsToSubstract
      );
      pointsToSubstract = 0;
    }
  }

  // Not sure if negative transactions should be saved
  TransactionsRepository.addTransaction(payer, points, timestamp);

  if (pointsToSubstract > 0) {
    return res.send(
      `There were ${pointsToSubstract} points that were not 
      substracted because there was not enought balance from payer`
    );
  }

  return res.send();
};

const listTransactions = (req, res) => {
  const transactions = TransactionsRepository.getTransactions();
  res.json(transactions);
};

const spendPoints = (req, res) => {
  const points = req.body.points;

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

  let pointsToSpend = points;
  let updatedTransactions = [];

  for (let i = 0; i < transactions.length && pointsToSpend > 0; i++) {
    const transaction = transactions[i];

    if (transaction.points < 0) {
      continue;
    }
    if (pointsToSpend >= transaction.points) {
      pointsToSpend -= transaction.points;
      updatedTransactions.push({
        payer: transaction.payer,
        points: transaction.points * -1,
      });
      TransactionsRepository.updatePoints(transaction.id, 0);
    } else {
      updatedTransactions.push({
        payer: transaction.payer,
        points: pointsToSpend * -1,
      });
      TransactionsRepository.updatePoints(
        transaction.id,
        transaction.points - pointsToSpend
      );
      pointsToSpend = 0;
    }
  }

  res.json(updatedTransactions);
};

const getBalance = (req, res) => {
  const balancePerPayer = {};
  const transactions = TransactionsRepository.getTransactions();
  transactions.forEach(
    (transaction) => (balancePerPayer[transaction.payer] = 0)
  );

  transactions.forEach((transaction) => {
    if (transaction.points > 0) {
      balancePerPayer[transaction.payer] += transaction.points;
    }
  });

  res.json(balancePerPayer);
};

module.exports = {
  addTransaction,
  listTransactions,
  spendPoints,
  getBalance,
};
