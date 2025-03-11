import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import "../styles/Dashboard.css";
import { getTotalExpenses } from "../api/expenses";
import { CURRENCY_SYMBOLS } from "../constants";
import { getTotalIncomes } from "../api/income";
import { LineChart } from "./charts/LineChart";
import { BarChart } from "./charts/BarChart";

export const Dashboard = () => {
  const { user } = useAuth();
  const [totalExpense, setTotalExpense] = useState(null);
  const [totalIncome, setTotalIncome] = useState(null);

  useEffect(() => {
    const fetchTotalExpenses = async () => {
      try {
        const data = await getTotalExpenses(user.id);
        setTotalExpense(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    const fetchTotalIncomes = async () => {
      try {
        const data = await getTotalIncomes(user.id);
        setTotalIncome(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchTotalExpenses();
    fetchTotalIncomes();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome {user.fullName}</h1>
      </header>

      <div className="summary">
        <div className="card income">
          <h2>Total Incomes</h2>
          <p>
            {!totalIncome ? "Loading..." : totalIncome}
            {CURRENCY_SYMBOLS.ILS}
          </p>
        </div>

        <div className="card expenses">
          <h2>Total Expenses</h2>
          <p>
            {!totalExpense ? "Loading..." : totalExpense}
            {CURRENCY_SYMBOLS.ILS}
          </p>
        </div>

        <div className="card balance">
          <h2>Balance</h2>
          <p>
            {!totalIncome && !totalExpense
              ? "Loading"
              : (totalIncome - totalExpense).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="charts">
        <LineChart />
        <BarChart />
      </div>
    </div>
  );
};
