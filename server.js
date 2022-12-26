const mongoose = require("mongoose");

const app = require("./app");

const { DB_HOST } = process.env;

const { PORT = 3000 } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => app.listen(PORT))
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
