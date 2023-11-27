const expressAsyncHandler = require("express-async-handler");

const { noteModel } = require("./../models/notesModel");
const { protect } = require("../middlewares/protect");

const createNotes = expressAsyncHandler(async (req, res) => {
  await protect();
  try {
    const { uid, title, body } = await req.body;
    const newNote = await noteModel.create({
      uid,
      title,
      body,
    });
    if (newNote) {
      res.status(200).json(newNote);
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});
module.exports = { createNotes };
