var express = require("express");
require("dotenv").config();
var app = express();
// app.use(logger);
const ApiRoutes = require("./routes");

const { render } = require("ejs");
var request = null;

app.set("view engine", "ejs");

app.get("/", function (re, res) {
  res.render("home", {});
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static("public"));
app.use("/api", ApiRoutes);

app.listen(process.env.PORT, function () {
  console.log("Example app listening on port " + process.env.PORT + "!");
});
