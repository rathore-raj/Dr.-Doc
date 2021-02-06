const mongoose = require("mongoose");
const db = mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((data) => {
    console.log("Connected To Database");
  })
  .catch((error) => {
    console.log("error:", error);
  });
