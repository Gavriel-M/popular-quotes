const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose
  .connect(
    "mongodb+srv://Admin:Gav12345@cluster0.y02x6.mongodb.net/Quote-Project?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log(chalk.black.bgGreen.bold("connected To MongoDb!")))
  .catch((error) =>
    console.log(
      chalk.white.bgRed.bold(`could not connect to MongoDb : ${error}`)
    )
  );
