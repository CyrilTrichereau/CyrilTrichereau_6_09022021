const Sauce = require("../models/Sauces.js");
const fs = require("fs");
//const { findOne } = require("../models/Sauces.js");

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
        message: "Sauce enregistrée !",
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

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauceObject.imageUrl == null) {
      } else {
              const filename = sauce.imageUrl.split("/images/")[1];
             fs.unlink(`images/${filename}`, () => {});
      }
    })
    .catch((error) => res.status(404).json({ error }));

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(404).json({ error }));
};

// Erase a sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
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
          // Check for already like and erase in array
          index = sauceUpdated.usersLiked.indexOf(req.body.userId);
          if (index > -1) {
            sauceUpdated.usersLiked.splice(index, 1);
            sauceUpdated.likes--;
          }

          // Check for already dislike or add it
          index = sauceUpdated.usersDisliked.indexOf(req.body.userId);
          if (index > -1) {
            console.log("Already dislike");
          } else {
            sauceUpdated.dislikes++;
            sauceUpdated.usersDisliked.push(req.body.userId);
          }
          break;

        // CASE 0 : UNLIKE
        case 0:
          // Check for already dislike and erase in array
          index = sauceUpdated.usersDisliked.indexOf(req.body.userId);
          if (index > -1) {
            sauceUpdated.usersDisliked.splice(index, 1);
            sauceUpdated.dislikes--;
          }
          // Check for already like and erase in array
          index = sauceUpdated.usersLiked.indexOf(req.body.userId);
          if (index > -1) {
            sauceUpdated.usersLiked.splice(index, 1);
            sauceUpdated.likes--;
          }
          break;

        // CASE 1 : LIKE
        case 1:
          // Check for already dislike and erase in array
          index = sauceUpdated.usersDisliked.indexOf(req.body.userId);
          if (index > -1) {
            sauceUpdated.usersDisliked.splice(index, 1);
            sauceUpdated.dislikes--;
          }
          // Check for already like or add it
          index = sauceUpdated.usersLiked.indexOf(req.body.userId);
          if (index > -1) {
            console.log("déjà liké");
          } else {
            sauceUpdated.likes++;
            sauceUpdated.usersLiked.push(req.body.userId);
          }
          break;
      }

      // Update sauce with modified informations
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceUpdated, _id: req.params.id }
      )
        .then(() => {
          res.status(201).json({ message: "Sauce modifiée !" });
        })
        .catch((error) => res.status(404).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
