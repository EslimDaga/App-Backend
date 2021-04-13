const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//Configurar .env a ./config/config.env
require("dotenv").config({
  path : "./config/config.env"
});

//Usar BodyParser
app.use(bodyParser.json());
/* app.use(bodyParser.urlencoded({
  extended: true
})); */


//Configurar solo para el desarrollo
if(process.env.NODE_ENV === "development"){
  app.use(cors({
    origin : process.env.CLIENT_URL
  }));

  app.use(morgan("dev"));
  //Morgan da información sobre cada petición
  //Cors está permitido lidiar con React para localhost al puerto 3000 sin ningun problema
}

//Cargar todas las rutas
const authRouter = require("./routes/auth.route");

//Usar rutas
app.use("/api/",authRouter);

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