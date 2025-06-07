const express = require("express");
const cors = require("cors");
const { mockTransactions } = require("./mockData");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data

// depending on the page and page size, return
app.get("/transactions", (req, res) => {
  setTimeout(() => {
    const randomizedTransactions = [...mockTransactions].sort(() => Math.random() - 0.5);
    res.json({
      data: randomizedTransactions,
      totalPages: 5,
      totalRecords: 14,
    });
  }, 500);

  //return error
  // res.status(500).json({
  //   message: "Server error occured!",
  // });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
