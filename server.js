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

app.listen(process.env.PORT || 3001, () => {
  console.log("Express app running on port", process.env.PORT);
});
