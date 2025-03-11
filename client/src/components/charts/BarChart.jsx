import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import {
  BarChart as RechartLineChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../styles/Chart.css";
import { getExpensesByDate } from "../../api/expenses";
const MONTHS = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export const BarChart = () => {
  const { user } = useAuth();
  const [barData, setBarData] = useState(false);

  useEffect(() => {
    const fetchBarData = async () => {
      try {
        const CurrnetDate = new Date();
        const currentYear = CurrnetDate.getFullYear();
        const currentMonth = CurrnetDate.getMonth();
        const dateOptions = {
          year: currentYear,
          start: currentMonth <= 5 ? 1 : currentMonth,
          end: currentMonth <= 5 ? currentMonth : currentMonth - 5,
        };
        const data = await getExpensesByDate(user.id, dateOptions);
        const formattedData = data.map((item) => {
          const month = MONTHS[new Date(item.createdAt).getMonth()];
          return { month, expense: item.exchangedAmount };
        });
        setBarData(formattedData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchBarData();
  }, []);

  return (
    <div className="chart">
      {" "}
      <ResponsiveContainer>
        <RechartLineChart
          width={500}
          height={300}
          data={barData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="income"
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
          <Bar
            dataKey="expense"
            fill="#82ca9d"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
        </RechartLineChart>
      </ResponsiveContainer>
    </div>
  );
};
