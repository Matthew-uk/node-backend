// Import necessary modules
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const {
  userRouter,
  notesRouter,
  depositRouter,
  withdrawRouter,
} = require("./routers/userRouter.js");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// Create an Express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware to parse JSON in request bodies
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Define routes for user and notes
app.use("/api/users", userRouter);
app.use("/api/notes", notesRouter);
app.use("/api/deposit", depositRouter);
app.use("/api/withdraw", withdrawRouter);

// Serve uploaded images statically
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Initialize Firebase Admin SDK
const admin = require("firebase-admin");
const serviceAccount = require("./firebase.json"); // Replace with your Firebase service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "next-ecommerce-404013.appspot.com", // Replace with your Firebase Storage bucket name
});

const bucket = admin.storage().bucket();

// Set up multer storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define a route for image upload
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    // Get the file buffer and file name
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    // Create a reference to the Firebase Storage file
    const file = bucket.file(`uploads/${fileName}`);

    // Create a writable stream and upload the file
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      resumable: false,
    });

    stream.on("error", (err) => {
      console.error("Error uploading to Firebase Storage:", err);
      res.status(500).json({ success: false, error: "Error uploading image" });
    });

    stream.on("finish", async () => {
      // Fetch the uploaded file metadata to get the correct size
      const [metadata] = await file.getMetadata();

      // Construct the Firebase Storage URL
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

      const expirationTimeInMilliseconds = 5 * 365 * 24 * 60 * 60 * 1000; // 2 years in milliseconds

      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + expirationTimeInMilliseconds,
      });

      // Send the URL and file size back to the user
      res.json({
        success: true,
        message: "Image uploaded successfully",
        imageUrl,
        fileSize: metadata.size,
        signedUrl,
      });
    });

    // Write the file buffer to the stream
    stream.end(fileBuffer);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, error: "Error uploading image" });
  }
});

// Start the Express app on the specified port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Express app running on port", PORT);
});
