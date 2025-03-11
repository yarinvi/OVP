const Expense = require("../models/expense");
const User = require("../models/user");
const { expenseScheme, expenseIdValidation } = require("../lib/validation/expense");
const { userIdValidation } = require("../lib/validation/user");
const { z } = require("zod");

const BASE_CURRENCY = "ILS";

const addExpense = async (req, res) => {
  try {
    if (req.user._id != req.params.userId) {
      return res.status(403).json({ message: "forbidden" });
    }

    const userId = userIdValidation.parse(req.params.userId);

    const { title, description, amount, tag, currency } = expenseScheme.parse(req.body);

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "user not found" });
    }

    let exchangedAmount;

    if (currency !== BASE_CURRENCY) {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${currency}/ILS/${amount}`
      );
      if (!response.ok) {
        return res.status(400).json({ message: "an error accrued while fetching rate" });
      }
      const data = await response.json();
      exchangedAmount = data.conversion_result;
    }

    const expense = new Expense({
      title,
      description,
      amount,
      tag,
      currency,
      exchangedAmount,
    });
    await expense.save();
    userExists.expenses.push(expense);
    await userExists.save();

    return res.status(201).json({ message: "expense created", object: expense });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};

const getExpenses = async (req, res) => {
  try {
    if (req.user._id != req.params.userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const userId = userIdValidation.parse(req.params.userId);

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "user not found" });
    }

    const { year, start, end } = req.query;

    let expenses = await Expense.find({ _id: { $in: userExists.expenses } });

    if (year && start && end) {
      expenses = expenses.filter((expense) => {
        const expenseYear = expense.createdAt.getFullYear();
        const expenseMonth = expense.createdAt.getMonth();
        if (
          Number(year) === expenseYear &&
          expenseMonth >= start &&
          expenseMonth <= end
        ) {
          return true;
        }
        return false;
      });
    }

    return res.status(200).json(expenses);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};

const updateExpense = async (req, res) => {
  try {
    if (req.user._id != req.params.userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const userId = userIdValidation.parse(req.params.userId);
    const expenseId = expenseIdValidation.parse(req.params.expenseId);

    const { title, description, amount, tag, currency, exchangedAmount } =
      expenseScheme.parse(req.body);

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!userExists.expenses.includes(expenseId)) {
      return res.status(404).json({ message: "expense not found" });
    }

    let tempExchangedAmount;

    if (
      currency !== BASE_CURRENCY &&
      currency !== userExists.currency &&
      amount !== exchangedAmount
    ) {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${currency}/ILS/${amount}`
      );
      if (!response.ok) {
        return res.status(400).json({ message: "an error accrued while fetching rate" });
      }
      const data = await response.json();
      tempExchangedAmount = data.conversion_result;
    }

    const updatedExpense = await Expense.findByIdAndUpdate(expenseId, {
      title,
      description,
      amount,
      tag,
      currency,
      exchangedAmount: tempExchangedAmount,
    });

    if (!updatedExpense) {
      return res.status(404).json({ message: "expense not found" });
    }
    await updatedExpense.save();

    return res.status(200).json({
      message: "expense updated successfully",
      object: updatedExpense,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    if (req.user._id != req.params.userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const userId = userIdValidation.parse(req.params.userId);
    const expenseId = expenseIdValidation.parse(req.params.expenseId);

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!userExists.expenses.some((id) => id.toString() === expenseId)) {
      return res.status(404).json({ message: "expense not found" });
    }

    const deletedExpense = await Expense.findByIdAndDelete(expenseId);
    if (!deletedExpense) {
      return res.status(404).json({ message: "expense not found" });
    }

    userExists.expenses = userExists.expenses.filter((id) => id.toString() !== expenseId);
    await userExists.save();

    return res.status(200).json({
      message: "expense deleted successfully",
      deletedExpense,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};

const getTotalExpenses = async (req, res) => {
  try {
    if (req.user._id != req.params.userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const userId = userIdValidation.parse(req.params.userId);

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "user not found" });
    }

    const expenses = await Expense.find({ _id: { $in: userExists.expenses } });

    const totalExpenses = expenses.reduce((total, expense) => {
      if (expense.currency != "ILS") return (total += expense.exchangedAmount);
      return (total += expense.amount);
    }, 0);

    return res.status(200).json(totalExpenses);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    if (req.user._id != req.params.userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const userId = userIdValidation.parse(req.params.userId);

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "user not found" });
    }

    const expenses = await Expense.find({ _id: { $in: userExists.expenses } });
    return res.status(200).json(expenses);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getTotalExpenses,
  getAllExpenses,
};
