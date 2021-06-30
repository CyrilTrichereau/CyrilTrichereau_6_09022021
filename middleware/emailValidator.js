const validator = require("email-validator")

module.exports = (req, res, next) => {
  try {
      const resultValidator = validator.validate(req.body.email);
      if (resultValidator) {
        next()
      } else {
        res.status(403).json({ message: "Entrée incorrecte !" });
      }
  } catch (error) {
    res.status(403).json({ message: "Entrée incorrecte !" });
  }
};
