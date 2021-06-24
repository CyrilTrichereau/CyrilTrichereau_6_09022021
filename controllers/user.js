const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User.js");
const Password = require("../models/Password.js");

exports.signup = (req, res, next) => {
  if (Password.validate(req.body.password)) {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    res.status(400).json({ message: "Mot de passe pas assez fort" });
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      // We're defaulting to a  max of 3 attempts, resulting in a 2 hour lock
      (MAX_LOGIN_ATTEMPTS = 5), (LOCK_TIME = 2 * 60 * 60 * 1000);
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // check if the account is currently locked
      if (user.isLocked) {
        // just increment login attempts if account is already locked
        return user.incLoginAttempts((err) => {
          if (err) return cb(err);
          return cb(null, null, reasons.MAX_ATTEMPTS);
        });
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(() => {
              return res
                .status(401)
                .json({ error: "Mot de passe incorrect !" });
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
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// -----------------------------------------------------------------------------------
