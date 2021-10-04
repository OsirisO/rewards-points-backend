const express = require("express");
const TransactionsController = require("./controllers/transaction-ctrl");

const app = express();

app.use(express.json());

// TRANSACTIONS
app.get("/transaction", function (req, res) {
  TransactionsController.listTransactions(req, res);
});

app.post("/transaction", function (req, res) {
  TransactionsController.addTransaction(req, res);
});

// POINTS
app.put("/spend-points", function (req, res) {
  TransactionsController.spendPoints(req, res);
});

app.get("/balance", function (req, res) {
  TransactionsController.getBalance(req, res);
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
