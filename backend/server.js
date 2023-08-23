const express = require("express");
const app = express();
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error");
const path = require("path");

//handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception`);
  process.exit(1);
});

//dotenv config
dotenv.config({path: "backend/config/config.env"});

//mongo db connection
connectDB();

app.use(express.json());
app.use(cookieParser());

//routes
//user routes
app.use("/api/v1", require("./routes/userRoutes"));

// --------------------------deployment------------------------------
const __dirname1 = path.resolve();
console.log(__dirname1);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// --------------------------deployment------------------------------

//middleware for errors
app.use(errorMiddleware);

const port = process.env.PORT || 4000;

//listen port
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode on port ${process.env.PORT}`
  );
});

//unhanlded promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
