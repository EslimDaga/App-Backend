const User = require("../models/auth.model");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const fetch = require("node-fetch");
const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken");
//Controlador de errores personalizado para obtener errores útiles de los errores de la base de datos
const { errorHandler } = require("../helpers/dbErrorHandling");
//Usaré para enviar correo sendgrind, también puedes usar nodemailer
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAIL_KEY)

exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  //Validación para req.body crearemos una validación personalizada en segundos
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      error: firstError
    });
  } else {
    User.findOne({
      email
    }).exec((err, user) => {
      //Si existe el usuario
      if (user) {
        return res.status(400).json({
          error: "Email is taken"
        });
      }
    });

    const token = jwt.sign(
      {
        name,
        email,
        password
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "15m"
      }
    );

    //Envío de datos por correo electrónico
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account Activation Link",
      html: `
        <h1>Please use the following to activate your account</h1>
        <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
        <hr />
        <p>This email may containe sensetive information</p>
        <p>${process.env.CLIENT_URL}</p>
      `
    }

    sgMail.send(emailData).then(sent => {
      return res.json({
        message: "Email has been sent to " + email
      });
    }).catch(err => {
      return res.status(400).json({
        error: errorHandler(err)
      });
    });
  }
};

//Activación y guardado en la base de datos
exports.activationController = (req, res) => {
  const { token } = req.body;
  if (token) {
    //Verifique que el token sea válido o no esté vencido
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({
            error: "Expired Token. Signup again"
          });
        } else {
          //Si es valida guardar en la base de datos
          //Obtener el nombre de la contraseña de correo electrónico del token
          const { name, email, password } = jwt.decode(token);

          const user = new User({
            name,
            email,
            password
          });

          user.save((err, user) => {
            if (err) {
              return res.status(401).json({
                error: errorHandler(err)
              });
            } else {
              return res.json({
                success: true,
                message: "Signup success",
                user
              });
            }
          });
        }
      }
    );
  } else {
    return res.json({
      message: "Error happening please try again"
    });
  }
};
