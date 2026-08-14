import "dotenv/config";

import { app } from "./app.js";
import connectDB from "./configs/db.config.js";

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.error("UNCAUGHT EXCEPTION! Shutting down...");

  process.exit(1);
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle Unhandled Promise Rejections
    process.on("unhandledRejection", (err) => {
      console.log(`Error: ${err.message}`);
      console.error("UNHANDLED REJECTION! Shutting down...");

      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();