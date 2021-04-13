const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

//Configurar .env a ./config/config.env
require("dotenv").config({
  path : "./config/config.env"
});

const app = express();

const PORT = process.env.PORT;

app.listen(PORT,() => {
  console.log("App running on Port " + PORT);
});