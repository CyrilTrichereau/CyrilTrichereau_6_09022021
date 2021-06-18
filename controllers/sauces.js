const Sauce = require("../models/Sauces.js");
const fs = require("fs");
const { findOne } = require("../models/Sauces.js");

// Get all sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Get a sauce with Id
exports.getSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Post a sauce
exports.createSauce = (req, res, next) => {
  console.log(req);
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce.likes = 0;
  sauce.dislikes = 0;
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Sauce enregistré !",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Modify a sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(404).json({ error }));
};

// Erase a sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
          .catch((error) => res.status(404).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Like, unlike or dislike a sauce
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      let sauceUpdated = { ...sauce._doc };
      let index;

      switch (req.body.like) {
        // CASE -1 : DISLIKE
        case -1:
          console.log("dislike");
          // Check for already like and erase in array
          index = sauceUpdated.usersLiked.indexOf(req.body.userId);
          if (index > -1) {
            sauceUpdated.usersLiked.splice(index, 1);
            sauceUpdated.likes--;
          } else {
            console.log("error with array remover or nothing to remove");
          }

          // Check for already dislike or add it
          index = sauceUpdated.usersDisliked.indexOf(req.body.userId);
          if (index > -1) {
            console.log("déjà disliké");
          } else {
            console.log(sauceUpdated.dislikes);
            sauceUpdated.dislikes++;
            console.log(sauceUpdated.dislikes);
            console.log(sauceUpdated.usersDisliked);
            sauceUpdated.usersDisliked.push(req.body.userId);
            console.log(sauceUpdated.usersDisliked);
          }
          break;

        // CASE 0 : UNLIKE
        case 0:
          console.log("unlike");
          // Check for already dislike and erase in array
          index = sauceUpdated.usersDisliked.indexOf(req.body.userId);
          if (index > -1) {
            sauceUpdated.usersDisliked.splice(index, 1);
            sauceUpdated.dislikes--;
          } else {
            console.log("error with array remover or nothing to remove");
          }
          // Check for already like and erase in array
          index = sauceUpdated.usersLiked.indexOf(req.body.userId);
          if (index > -1) {
            sauceUpdated.usersLiked.splice(index, 1);
            sauceUpdated.likes--;
          } else {
            console.log("error with array remover or nothing to remove");
          }

          break;

        // CASE 1 : LIKE
        case 1:
          console.log("like");
          // Check for already dislike and erase in array
          index = sauceUpdated.usersDisliked.indexOf(req.body.userId);
          if (index > -1) {
            sauceUpdated.usersDisliked.splice(index, 1);
            sauceUpdated.dislikes--;
          } else {
            console.log("error with array remover or nothing to remove");
          }
          // Check for already like or add it
          index = sauceUpdated.usersLiked.indexOf(req.body.userId);
          if (index > -1) {
            console.log("déjà liké");
          } else {
            console.log(sauceUpdated.likes);
            sauceUpdated.likes++;
            console.log(sauceUpdated.likes);
            console.log(sauceUpdated.usersLiked);
            sauceUpdated.usersLiked.push(req.body.userId);
            console.log(sauceUpdated.usersLiked);
          }
          break;
      }

      // Update sauce with modified informations
      console.log("j'arrive à l'update");
      console.log(sauceUpdated);
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceUpdated, _id: req.params.id }
      )
        .then(() => {
          console.log("update finie !");
          res.status(201).json({ message: "likage mis à jour !" });
        })
        .catch((error) => res.status(404).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};
