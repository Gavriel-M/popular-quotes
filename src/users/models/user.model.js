const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128,
  },
  userName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  creatorAccount: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  recoveryNumber: { type: String },
  dateRecoveryNumber: { type: Date },
});

const User = mongoose.model("User", UserSchema);

const selectUserByEmail = (email) => {
  return User.find({ email });
};

const selectUserByUsername = (userName) => {
  return User.find({ userName });
};

const updateUser = (filter, updatedUser) => {
  return User.updateOne(filter, updatedUser);
};

const updateAfterPasswordReset = (email, password) => {
  return User.updateOne(
    { email },
    { password, recoveryNumber: null, dateRecoveryNumber: null }
  );
};

const updateRecoveryParams = (email, recoveryNumber, dateRecoveryNumber) => {
  return User.updateOne({ email }, { recoveryNumber, dateRecoveryNumber });
};

const insertUser = (
  firstName,
  lastName,
  userName,
  email,
  password,
  creatorAccount
) => {
  let user = new User({
    firstName,
    lastName,
    userName,
    email,
    password,
    creatorAccount,
  });
  return user.save();
};
module.exports = {
  User,
  selectUserByEmail,
  selectUserByUsername,
  insertUser,
  updateRecoveryParams,
  updateAfterPasswordReset,
  updateUser,
};
