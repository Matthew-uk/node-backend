const Mongoose = require("mongoose");

const noteModelSchema = Mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});
const noteModel = Mongoose.model("Notes", noteModelSchema);

module.exports = { noteModel };
