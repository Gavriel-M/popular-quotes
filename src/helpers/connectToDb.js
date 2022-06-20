const mongoose = require("mongoose");
const chalk = require("chalk");
require("dotenv").config();

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(chalk.black.bgGreen.bold("connected To MongoDb!")))
  .catch((error) =>
    console.log(
      chalk.white.bgRed.bold(`could not connect to MongoDb : ${error}`)
    )
  );
