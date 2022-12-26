const express = require("express");
const logger = require("morgan");
const cors = require("cors");
// connected DB
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const DB_HOST =
  "mongodb+srv://Vas:MlrKfr9bD6UmNSUe@cluster0.epi5ilu.mongodb.net/db_contacts?retryWrites=true&w=majority";
mongoose
  .connect(DB_HOST)
  .then(() => console.log("Database connection success"))
  .catch((error) => console.log(error.message));

// connected DB to project

const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  res.status(status).json({ message: err.message });
});

module.exports = app;
