if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

require("./helpers/connectToDb");

const express = require("express");
const app = express();

const path = require('path');

const chalk = require("chalk");
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 8181;

const userRouter = require("./users/routes/routes");
const quoteRouter = require("./quotes/routes/routes");
const authMiddleware = require("./helpers/authMiddleware");

app.use(morgan(chalk.cyan(":method :url :status :response-time ms")));

app.use(cors());

app.use(express.json());
app.use(express.static(path.join(_dirname + "public")));

app.use("/api/users", userRouter);
app.use("/api/quotes", authMiddleware, quoteRouter);


app.listen(PORT, () =>
  console.log(
    chalk.blueBright.bold(`server run on : http://:localhost:${PORT}`)
  )
);
