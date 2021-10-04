const express = require("express");
const TransactionsController = require("./controllers/transaction-ctrl");

const app = express();
app.use(express.json());

// TRANSACTIONS
app.get("/transaction", TransactionsController.listTransactions(req, res));
app.post("/transaction", TransactionsController.addTransaction(req, res));

// POINTS
app.put("/spend-points", TransactionsController.spendPoints(req, res));
app.get("/balance", TransactionsController.getBalance(req, res));

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
