const { checkToken } = require("../users/helpers/token");
const chalk = require("chalk");

async function authMiddleware(req, res, next) {
  try {
    const userToken = req.header("token");
    if (!userToken) {
      throw "Token is missing";
    }
    const userData = await checkToken(userToken);
    if (!userData) {
      throw "Invalid Token - cannot get user data";
    }
    req.user = userData;
    next();
  } catch (error) {
    console.log(chalk.red.bold(error));
    return res.status(503).send(error);
  }
}

module.exports = authMiddleware;
