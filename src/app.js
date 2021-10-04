const express = require("express");
const TransactionsController = require("./controllers/transaction-ctrl");

const app = express();
app.use(express.json());

// TRANSACTIONS
app.get("/transaction", TransactionsController.listTransactions);
app.post("/transaction", TransactionsController.addTransaction);

// POINTS
app.put("/spend-points", TransactionsController.spendPoints);
app.get("/balance", TransactionsController.getBalance);

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
