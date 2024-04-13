const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

dotenv.config({path:"./config.env"});
app.use(express.json());
app.use(cors());

const notesRouter = require("./routes/notesRouter");
app.use("/api/notes", notesRouter)

const port = process.env.PORT || 5501;
app.listen(port, () => {
  console.log(`App is listening on ${port} ✔`);
});

const DBLink = process.env.DB.replace("<password>", process.env.DB_Pass);
mongoose.connect(DBLink).then(()=>{
  console.log("connected to db ✔");
});