const express = require("express");
require("./db/mongoose.js");
const userRouter = require("./router/user");
const cors = require("cors");
const PdfRouter = require("./router/PdfRouter");


const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(PdfRouter);

app.listen(port, () => {
  console.log("Server Running on Port ", port);
});
