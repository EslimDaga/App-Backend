const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

//Configurar .env a ./config/config.env
require("dotenv").config({
  path : "./config/config.env"
});

const app = express();

//Configurar solo para el desarrollo
if(process.env.NODE_ENV === "development"){
  app.use(cors({
    origin : process.env.CLIENT_URL
  }));

  app.use(morgan("dev"));
  //Morgan da información sobre cada petición
  //Cors está permitido lidiar con React para localhost al puerto 3000 sin ningun problema
}

app.use((req,res,next) => {
  res.status(404).json({
    success : false,
    message : "Page not Founded"
  });
});

const PORT = process.env.PORT;

app.listen(PORT,() => {
  console.log("App running on Port " + PORT);
});