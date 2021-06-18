const express = require("express");
const router = express.Router();

const saucesCtrl = require("../controllers/sauces.js");
const auth = require("../middleware/auth.js");
const multer = require("../middleware/multer-config.js");

// OK ----------------------------------------------
// Get all sauces
router.get("/api/sauces", auth, saucesCtrl.getAllSauces);

// OK ----------------------------------------------
// Get a sauce with Id
router.get("/api/sauces/:id", auth, saucesCtrl.getSauce);

// OK ----------------------------------------------
// Post a sauce
router.post("/api/sauces", auth, multer, saucesCtrl.createSauce);

// Modify a sauce
router.put("/api/sauces/:id", auth, multer, saucesCtrl.modifySauce);

// OK ----------------------------------------------
// Erase a sauce
router.delete("/api/sauces/:id", auth, saucesCtrl.deleteSauce);

// Like, unlike or dislike a sauce
router.post("/api/sauces/:id/like", auth, saucesCtrl.likeSauce);

module.exports = router;
