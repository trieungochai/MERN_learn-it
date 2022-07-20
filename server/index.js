require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const authRouter = require("./routes/auth.router");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@learnit.326ui.mongodb.net/?retryWrites=true&w=majority`,
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

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
