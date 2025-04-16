const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

const generateTransactions = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/the_hill_waterfall", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const transactions = [
      {
        amt_in_out: "IN",
        amount: 5000,
        description: "Salary Credit",
        identification: "TXN001",
        method: "UPI",
      },
      {
        amt_in_out: "OUT",
        amount: 1500,
        description: "Grocery Shopping",
        identification: "TXN002",
        method: "CARD",
      },
      {
        amt_in_out: "IN",
        amount: 2000,
        description: "Freelance Payment",
        identification: "TXN003",
        method: "NET BANKING",
      },
      {
        amt_in_out: "OUT",
        amount: 800,
        description: "Electricity Bill",
        identification: "TXN004",
        method: "CASH",
      },
    ];

    await Transaction.insertMany(transactions);
    console.log("Dummy transactions added successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error inserting transactions:", err);
    mongoose.connection.close();
  }
};

generateTransactions();
