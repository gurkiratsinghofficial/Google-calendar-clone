const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
let cors = require("cors");

//Connect to database
dotenv.config();
mongoose.connect(process.env.DB_CONNECT, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>console.log('Server started'));

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Import all the routes here
 */
require("./routes/UserRoutes")(app); //Route for users
require("./routes/EventRoutes")(app); //Route for events
app.use(
  "/images",
  express.static(path.join(__dirname, "uploads/profilePhoto"))
); //static router for serving images

app.listen(process.env.PORT);
