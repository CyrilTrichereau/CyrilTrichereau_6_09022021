const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const User = require("../models/User.js");
const Password = require("../models/Password.js");

exports.signup = (req, res, next) => {
  if (Password.validate(req.body.password)) {
    const emailEncrypted = CryptoJS.AES.encrypt(
      req.body.email,
      process.env.CRYPTO_JS_KEY
    ).toString();
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: emailEncrypted,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch(() =>
            res.status(400).json({ message: "Entrée incorrecte !" })
          );
      })
      .catch(() => res.status(500).json({ message: "Entrée incorrecte !" }));
  } else {
    res.status(400).json({
      message:
        "Merci de rentrer minimum 8 caractères, avec au moins une lettre majuscule, une lettre minuscule, deux chiffres et sans espaces.",
    });
  }
};

exports.login = (req, res, next) => {
  User.find()
    .then((users) => {
      if (users != [] && users != null && users != 0) {
        let findIt = false;
        for (let user of users) {
          const emailDecryptedRaw = CryptoJS.AES.decrypt(
            user.email,
            process.env.CRYPTO_JS_KEY
          );
          let emailDecrypted = emailDecryptedRaw.toString(CryptoJS.enc.Utf8);
          if (emailDecrypted === req.body.email) {
            findIt = true;
            bcrypt
              .compare(req.body.password, user.password)
              .then((valid) => {
                if (!valid) {
                  // password is incorrect, so increment login attempts before responding
                  user.incLoginAttempts(() => {
                    return res
                      .status(401)
                      .json({ message: "Mot de passe incorrect !" });
                  });
                }

                // reset attempts and lock info
                var updates = {
                  $set: { loginAttempts: 0 },
                  $unset: { lockUntil: 1 },
                };
                user.update(updates);

                res.status(200).json({
                  userId: user._id,
                  token: jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
                    expiresIn: "24h",
                  }),
                });
              })
              .catch(() =>
                res.status(500).json({ message: "Entrée incorrecte !" })
              );
          }
          if (findIt === false) {
            return res.status(401).json({ message: "Entrée incorrecte !" });
          }
        }
      } else {
        return res.status(401).json({ message: "Entrée incorrecte !" });
      }
    })
    .catch(() => res.status(500).json({ message: "Entrée incorrecte !" }));
};

// -----------------------------------------------------------------------------------
