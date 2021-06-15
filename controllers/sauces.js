const Sauce = require("../models/Sauces.js");
const fs = require("fs");

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
  console.log("trouvé 0");
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log("trouvé 1");
  switch (req.body.like){
  case -1 :
    console.log("dislike");
    sauce.dislikes++
    sauce.usersDisliked.push(req.body.userId)
    sauce.usersLiked.findOne(req.body.userId)
    .then (() => {
      console.log("trouvé");
      res.status(200).json({ message: "Like modifié !" })
    })
  break  

  case 0 :
    console.log("no say");
  break  
  
  case 1 :
    console.log("like");
    sauce.likes++
    sauce.usersLiked.push(req.body.userId)
    sauce.usersusersDisliked.findOne(req.body.userId)
    .then (() => {
      console.log("trouvé");
      res.status(200).json({ message: "Like modifié !" })
    })
  break  
  }
})
}
