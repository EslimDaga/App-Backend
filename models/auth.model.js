const mongoose = require("mongoose");
const crypto = require("crypto");

//Esquema de Usuario
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true,
      required: true
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: String,
    role: {
      type: String,
      default: "Normal"
      //Nosotros tenemos mas tipos (normal, admin, ....)
    },
    resetPasswordLink: {
      data: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

//Contraseña virtual
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

//Metodos
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  //Encriptar contraseña
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  }
};

module.exports = mongoose.model("User", userSchema);