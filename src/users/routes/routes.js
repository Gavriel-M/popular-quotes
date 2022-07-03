const bcrypt = require("../helpers/bcrypt");

const { generateAuthToken, checkToken } = require("../helpers/token");
const authMiddleware = require("../../helpers/authMiddleware");
const randomNumber = require("../helpers/randomNumber");
const sendEmail = require("../helpers/sendEmail");

const router = require("express").Router();

const usersValidation = require("../validations/users.validation");
const usersModel = require("../models/user.model");
const quotesModel = require("../../quotes/models/quote.model");

require("dotenv").config();
const _ = require("lodash");

//*POST register attempt
router.post("/register", async (req, res) => {
  try {
    const validatedValue = await usersValidation.registerSchema.validateAsync(
      req.body,
      {
        abortEarly: false,
      }
    );

    let users = await usersModel.selectUserByEmail(validatedValue.email);
    if (users.length === 0) {
      users = await usersModel.selectUserByUsername(validatedValue.userName);
      if (users.length === 0) {
        const hashPassword = await bcrypt.generatePassword(
          validatedValue.password
        );
        const newuser = await usersModel.insertUser(
          validatedValue.firstName,
          validatedValue.lastName,
          validatedValue.userName,
          validatedValue.email,
          hashPassword,
          validatedValue.creatorAccount
        );
        res.json({ msg: "user created" });
      } else {
        throw "User name already in use";
      }
    } else {
      throw "Email already registered";
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});

//*POST log-in attempt
router.post("/login", async (req, res) => {
  try {
    const validatedValue = await usersValidation.loginSchema.validateAsync(
      { ...req.body },
      {
        abortEarly: false,
      }
    );
    const users = await usersModel.selectUserByEmail(validatedValue.email);
    if (users.length > 0) {
      const passwordValidation = await bcrypt.comparePassword(
        validatedValue.password,
        users[0].password
      );
      if (passwordValidation) {
        const token = generateAuthToken(users[0]);
        res.json({ token });
      } else {
        throw "Email or Password are incorrect.";
      }
    } else {
      throw "Email or Password are incorrect.";
    }
  } catch (err) {
    if (err.details) {
      res.status(400).json(err.details[0].path[0]);
    } else {
      res.status(401).json(err);
    }
  }
});

//*POST sends password reset link to account's email
router.post("/resetpassword", async (req, res) => {
  try {
    const validatedValue =
      await usersValidation.validateEmailSchema.validateAsync(
        { ...req.body },
        {
          abortEarly: false,
        }
      );
    const rnum = await randomNumber(100000, 999999);
    const expDate = new Date(Date.now() + 30 * 60000);
    const port = process.env.PORT || 8181;
    const userUpdatedInfo = await usersModel.updateRecoveryParams(
      validatedValue.email,
      rnum,
      expDate
    );
    if (
      userUpdatedInfo.matchedCount === 1 &&
      userUpdatedInfo.modifiedCount === 1
    ) {
      sendEmail(
        validatedValue.email,
        "Po - Quo : Password Recovery!",
        `
      <h3 style="border:4px solid black;border-radius:8px;width: 80%;padding: 24px;background-color: #F0ECE3;text-align:center">Enter this link in order to reset your password : <a href="http://localhost:3000/resetpassword/${validatedValue.email}/${rnum}">Reset password</a></h3>
      `
      );
    }
    res.json({ msg: "Link sent to your email account." });
  } catch (error) {
    res.status(400).json({ error });
  }
});

//*POST Password reset link path - Changes the existing password
router.post("/passwordrecovery/:email/:recoveryNumber", async (req, res) => {
  try {
    
    const info = {...req.params, ...req.body}
    const validatedValue =
      await usersValidation.recoverPasswordSchema.validateAsync(info, {
        abortEarly: false,
      });
    const users = await usersModel.selectUserByEmail(validatedValue.email);
    if (users.length > 0) {
      if (users[0].recoveryNumber == validatedValue.recoveryNumber) {
        const currentDate = new Date();
        const currentTime = currentDate.getTime();
        const tokenExpiryTime = users[0].dateRecoveryNumber.getTime();
        if (currentTime < tokenExpiryTime) {
          const hashPassword = await bcrypt.generatePassword(
            validatedValue.password
          );
          const userUpdatedInfo = await usersModel.updateAfterPasswordReset(
            validatedValue.email,
            hashPassword
          );
          if (
            userUpdatedInfo.matchedCount === 1 &&
            userUpdatedInfo.modifiedCount === 1
          ) {
            return res.status(200).json({ msg: "Password updated" });
          }
        }
      } else {
        throw "Link Expired";
      }
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//*GET the calling user's info
router.get("/userinfo", authMiddleware, async (req, res) => {
  try {
    const users = await usersModel.selectUserByEmail(req.user.email);
    let user = _.pick(users[0], [
      "firstName",
      "lastName",
      "userName",
      "email",
      "creatorAccount", 
      "createdAt"
    ]);

    return res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.put("/edituser", authMiddleware, async (req, res) => {
  try {
    const updatedUserInfo = req.body;
    const lowercaseEmail = req.user.email.toLowerCase();
    const filter = {
      email: lowercaseEmail,
    };

    const afterUpdate = await usersModel.updateUser(filter, updatedUserInfo);

    return res.json(afterUpdate);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//* GET latest quote
router.get("/latestquote", async (req, res) => {
  try{
    const latestQuote = await quotesModel.latestQuote();
    return res.status(200).json(latestQuote);
  } catch(error){
    res.status(500).json(error);

  }
})

//* GET Creator account? 
router.get("/iscreator", authMiddleware, async (req, res) => {
  try {
  const users = await usersModel.selectUserByEmail(req.user.email);
  if(users[0].creatorAccount){
    return res.status(200).json({isCreator : true});
  }
  throw "user is not a creator account";
} catch (error) {
  res.status(501).json({ isCreator: false });
}
});

module.exports = router;
