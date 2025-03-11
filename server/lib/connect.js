const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(process.env.DATABASE_URL);
  const database = mongoose.connection;

  database.on("error", (error) => {
    console.log("datanase connection error :", error);
  });

  database.once("open", () => {
    console.log("connected to database");
  });
};
module.exports = connectDB;
