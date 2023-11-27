// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv").config();
// const app = express();
// const userRouter = require("./routers/userRouter");
// const userModel = require("./models/userModel");
// const goalRouter = require("./routers/goalRouter");

// app.use(express.json());
// app.use(cors());
// app.use("/api/users", userRouter);
// app.use("/api/goals", goalRouter);

// mongoose.connect("mongodb://localhost:27017/NotePad", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const PORT = process.env.PORT || 8082;
// app.listen(PORT, () => {
//   console.log(`App running on port ${PORT}`);
// });

const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { userRouter, notesRouter } = require("./routers/userRouter.js");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
mongoose.connect(
  "mongodb+srv://next-ecommerce:Nedlog2g1.@cluster0.wh12aw7.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/notes", notesRouter);

// Set up multer storage
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"), // Use path.join to get the absolute path
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Serve uploaded images
const imgPath = path.join(__dirname, "uploads");
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Handle image upload
app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    // Get the filename of the uploaded image
    const filename = req.file.filename;

    // Construct the URL based on the server and file structure
    const imageUrl = `${process.env.PORT}/api/uploads/${filename}`; // Adjust the URL accordingly

    // Send the URL back to the user
    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error uploading image" });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Express app running on port", process.env.PORT);
});
