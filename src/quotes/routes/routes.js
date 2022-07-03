const quotesValidation = require("../validation/quote.validation");
const quotesModel = require("../models/quote.model");
const usersModel = require("../../users/models/user.model");
const authMiddleware = require("../../helpers/authMiddleware");
const router = require("express").Router();

const _ = require("lodash");
const chalk = require("chalk");
const { route } = require("../../users/routes/routes");

router.post("/newquote", async (req, res) => {
  try {
    const user = req.user;
    const usersByEmail = await usersModel.selectUserByEmail(user.email);
    if (!usersByEmail[0].creatorAccount) {
      throw "It is required to be a creator account in order to upload quotes";
    }

    const validatedValue = await quotesValidation.quoteSchema.validateAsync(
      { ...req.body, createdBy: user.userName },
      { abortEarly: true }
    );

    const newQuote = await quotesModel.insertQuote(
      validatedValue.quote,
      validatedValue.keyedBy,
      validatedValue.language,
      validatedValue.source,
      validatedValue.link,
      validatedValue.mediaType,
      validatedValue.createdBy
    );
    res.json({ msg: "Quote has been added!", newQuote: newQuote });
  } catch (error) {
    res.status(500).json(error);
  }
});

//*GET all quotes
router.get("/allquotes", async (req, res) => {
  try {
    const quotes = await quotesModel.findAllQuotes();
    return res.status(200).send(quotes);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//*GET self made quotes
router.get("/myquotes", async (req, res) => {
  try {
    let user = req.user;
    const creatorUser = await usersModel.selectUserByUsername(user.userName);
    if(!creatorUser[0].creatorAccount){
      throw "User is not registered as a creator account"
    }
    const userQuotes = await quotesModel.findQuoteByUser(user.userName);
    if (userQuotes.length === 0) {
      throw "User has yet to quote anything";
    }
    return res.json(userQuotes);
  } catch (error) {
    res.status(500).json(error);
  }
});

//*GET a specific quote made by user
router.get("/:quoteid", async (req, res) => {
  try {
    const quoteId = req.params.quoteid;
    const quotes = await quotesModel.findQuoteById(quoteId);
    const quote = _.pick(quotes[0], [
      "quote",
      "keyedBy",
      "language",
      "source",
      "link",
      "mediaType",
      "createdBy",
      "likes",
      "createdAt",
    ]);
    return res.json(quote);
  } catch (error) {
    res.status(500).json(error);
  }
});

//*PUT - Edit a quote
router.put("/:quoteid", async (req, res) => {
  try {
    const user = req.user;
    const quoteId = req.params.quoteid;
    const updatedQuote = req.body;
    
    const filter = {
      _id: quoteId,
      createdBy: user.userName,
    };

    const afterUpdate = await quotesModel.updateQuote(filter, updatedQuote);
    return res.json(afterUpdate);
  } catch (error) {
    res.status(500).json(error);
  }
});

//*DELETE a specific quote
router.delete("/:quoteid", async (req, res) => {
  try{
  const user = req.user;
  const quoteId = req.params.quoteid;
  let deleted = false;
  const filter = {
    _id: quoteId,
    createdBy: user.userName,
  };

  const afterDelete = await quotesModel.deleteQuote(filter);
  if(afterDelete.deletedCount != 0) deleted = true;
  return res.status(200).json({...afterDelete, deleted : deleted});
  } catch(error) {
    res.status(500).json(error);
  }
});

//*POST Handle like
router.post("/like/:quoteId", async (req, res) => {
  try {
    const userName = req.user.userName;
    const quoteId = req.params.quoteId;
    let response = {status : "", likeCount : 0};
    let quote;

    const filter = {
      _id: quoteId,
    };
    const alreadyLiked = await quotesModel.findIfLiked(quoteId, userName);
    if (!alreadyLiked[0]) {
      const afterUpdate = await quotesModel.updateQuote(filter, {
        $push: { likes: userName },
      });
      
      if (afterUpdate.modifiedCount) {
        quote = await quotesModel.findQuoteById(quoteId);
        response = {status : "Liked"};

      }
    } else {
      const afterUpdate = await quotesModel.updateQuote(filter, {
        $pull: { likes: userName },
      });

       if (afterUpdate.modifiedCount) {
        quote = await quotesModel.findQuoteById(quoteId);
        response = {status : "Disliked"};
       }
    }
    response.likeCount = quote[0].likes.length;
    return res.status(200).json(response);


  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
