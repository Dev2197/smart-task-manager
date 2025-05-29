require("dotenv").config();
const express = require("express");
const cors = require("cors");
const openaiService = require("./openaiService");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Task parsing endpoint
app.post("/api/parse", async (req, res) => {
  const { taskText } = req.body;

  if (!taskText) {
    return res.status(400).json({
      success: false,
      error: "Task text is required",
    });
  }

  try {
    const result = await openaiService.parseTask(taskText);
    res.json(result);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
