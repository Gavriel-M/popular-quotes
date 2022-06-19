const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 1024,
  },
  keyedBy: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    trim: true,
  },
  language: { type: String, required: false, minLength: 2, maxLength: 64 },
  source: { type: String, required: true, minLength: 2, maxLength: 64 },
  link: { type: String, required: false, minLength: 2, maxLength: 2047 },
  mediaType: { type: String, required: false, minLength: 2, maxLength: 64 },
  createdBy: { type: String, required: true, minLength: 2, maxLength: 128 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [],
});

const Quote = mongoose.model("Quote", quoteSchema);

const findQuoteById = (id) => {
  return Quote.find({ _id: id });
};

const findIfLiked = (id, userName) => {
  return Quote.find({ _id: id , likes: userName});
};

const findQuoteByUser = (userName) => {
  return Quote.find({ createdBy: userName });
};

const updateQuote = (filter, updatedQuote) => {
  return Quote.updateOne(filter, updatedQuote);
};

const findAllQuotes = () => {
  return Quote.find();
};

const deleteQuote = (filter) => {
  return Quote.deleteOne(filter);
};

const latestQuote = () =>{
  return Quote.find().limit(1).sort({_id : -1});
}

const insertQuote = (
  quote,
  keyedBy,
  language,
  source,
  link,
  mediaType,
  createdBy
) => {
  const newQuote = new Quote({
    quote,
    keyedBy,
    language,
    source,
    link,
    mediaType,
    createdBy,
  });
  return newQuote.save();
};

module.exports = {
  Quote,
  deleteQuote,
  insertQuote,
  findQuoteById,
  findQuoteByUser,
  findAllQuotes,
  updateQuote,
  findIfLiked,
  latestQuote,
};
