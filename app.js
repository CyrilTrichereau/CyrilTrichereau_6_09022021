const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const sauceRoutes = require("./routes/sauces.js");
const userRoutes = require("./routes/user.js");

// Connect to mongoose data base
mongoose
  .connect(
    "mongodb+srv://masterUser:rAaimTKg9xIGBvaB@cluster0.axbxb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion success to MongoDB !"))
  .catch(() => console.log("Connexion failed to MongoDB !"));

// Init express
const app = express();

// Headers for CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Body Parser
app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;

