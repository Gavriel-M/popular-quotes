const jwt = require("jsonwebtoken");
const config = require("config");

function generateAuthToken(user) {
  const token = jwt.sign(
    { _id: user._id, userName: user.userName, email: user.email },
    config.get("jwtKey"),
    { expiresIn: "4h" }
  );
  return token;
}

function checkToken(userToken) {
  try {
    const userData = jwt.verify(userToken, config.get("jwtKey"));
    return userData;
  } catch (error) {
    return false;
  }
}

module.exports = { checkToken, generateAuthToken };
