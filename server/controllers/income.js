const Income = require("../models/income");
const User = require("../models/user");
const { incomeScheme, incomeIdValidation } = require("../lib/validation/income");
const { userIdValidation } = require("../lib/validation/user");
const { z } = require("zod");
const income = require("../models/income");

const addIncome = async (req, res) => {
  try {
    if (req.user._id != req.params.userId) {
      return res.status(403).json({ message: "forbidden" });
    }

    const userId = userIdValidation.parse(req.params.userId);

    const { title, description, amount, tag, currency } = incomeScheme.parse(req.body);

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "user not found" });
    }

    const income = new Income({ title, description, amount, tag, currency });
    await income.save();
    userExists.incomes.push(income);
    await userExists.save();

    return res.status(201).json({ message: "income created", object: income });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};

const getIncomes = async (req, res) => {
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
        console.log(`Fetching income data with params:`, { userId, year, start, end });

    const incomes = await Income.find({ _id: { $in: userExists.incomes } });
    if (year && start && end) {
      incomes = incomes.filter((inc) => {
        const incomeYear = income.createdAt.getFullYear();
        const incomeMonth = income.createdAt.getMonth();
        if (Number(year) === incomeYear && incomeMonth >= start && incomeMonth <= end) {
          return true;
        }
        return false;
      });
    }

    return res.status(200).json(incomes);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};

const updateIncome = async (req, res) => {
  try {
    if (req.user._id != req.params.userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const userId = userIdValidation.parse(req.params.userId);
    const incomeId = incomeIdValidation.parse(req.params.incomeId);

    const { title, description, amount, tag, currency } = incomeScheme.parse(req.body);

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!userExists.incomes.includes(incomeId)) {
      return res.status(404).json({ message: "income not found" });
    }

    const updatedIncome = await Income.findByIdAndUpdate(incomeId, {
      title,
      description,
      amount,
      tag,
      currency,
    });

    if (!updatedIncome) {
      return res.status(404).json({ message: "income not found" });
    }
    await updatedIncome.save();

    return res.status(200).json({ message: "income updated successfully" });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};

const deleteIncome = async (req, res) => {
  try {
    if (req.user._id != req.params.userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const userId = userIdValidation.parse(req.params.userId);
    const incomeId = incomeIdValidation.parse(req.params.incomeId);

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!userExists.incomes.includes(incomeId)) {
      return res.status(404).json({ message: "income not found" });
    }

    const deletedIncome = await Income.findByIdAndDelete(incomeId);
    if (!deletedIncome) {
      return res.status(404).json({ message: "income not found" });
    }

    userExists.incomes = userExists.incomes.filter((id) => id.toString() !== incomeId);
    await userExists.save();

    return res.status(200).json({ message: "income deleted successfully" });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};
const getTotalIncomes = async (req, res) => {
  try {
    if (req.user._id != req.params.userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const userId = userIdValidation.parse(req.params.userId);

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "user not found" });
    }

    const incomes = await Income.find({ _id: { $in: userExists.incomes } });

    const totalIncomes = incomes.reduce((total, income) => {
      return (total += income.amount);
    }, 0);

    return res.status(200).json(totalIncomes);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ messege: error.errors[0].message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
  getTotalIncomes,
};
