const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://haitn:911225@learnit.326ui.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("MongoDB connected!!!");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.status(200).send("See you Space Cowboy");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
