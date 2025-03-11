const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getTotalExpenses,
  getAllExpenses,
} = require("../controllers/expense");

router.post("/add-expense/:userId", addExpense);
router.get("/get-expenses/:userId", getExpenses);
router.patch("/update-expense/:userId/:expenseId", updateExpense);
router.delete("/delete-expense/:userId/:expenseId", deleteExpense);
router.get("/get-total-expenses/:userId", getTotalExpenses);
router.get("/get-all-expenses/:userId", getAllExpenses);

module.exports = router;
