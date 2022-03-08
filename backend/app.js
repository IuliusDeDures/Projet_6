const express = require("express");
const app = express();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

// configuration du limiteur de requête
const limiteur = rateLimit({
    windowMs: 15 * 60 * 1000, // période 15 minutes
    max: 100, // limite à 100 requête pour 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
});

require("dotenv").config();

// connection à la base de donnée Mongo DB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(bodyParser.json());

// Utilisation de helmet pour sécuriser le site contre certaines vulnirabilités connues
app.use(helmet());

// Utilisation de mongo sanitize pour lutter contre les injections
app.use(mongoSanitize({ replaceWith: "_" }));

// application du middleware de limitation de debit à toutes les requêtes 
app.use(limiteur);

// middleware pour confiqurer les headers des requêtes
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
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    next();
});

// middleware pour la gestion d'image de manière statique
app.use("/images", express.static(path.join(__dirname, "images")));

// middleware pour les routes sauces
app.use("/api/sauces", sauceRoutes);

// middleware pour les routes users
app.use("/api/auth", userRoutes);

module.exports = app;