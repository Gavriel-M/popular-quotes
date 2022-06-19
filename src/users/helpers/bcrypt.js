const bcrypt = require("bcryptjs");

function generatePassword(password) {
  return bcrypt.hash(password, 10);
}

function comparePassword(password, encryptedVersion) {
  return bcrypt.compare(password, encryptedVersion);
}

module.exports = { generatePassword, comparePassword };
