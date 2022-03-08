const express = require('express');
const app = express();
const helmet = require('helmet');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
var sixtyDaysInSeconds = 5184000;

require('dotenv').config()

// connection à la base de donnée Mongo DB
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(bodyParser.json());

// middleware pour confiqurer les headers des requêtes
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );

    next();
});

// Utilisation de helmet pour sécurisation du site :

app.use(helmet.xssFilter()); // contre attaques cross-site scripting et injections intersites
app.use(helmet.frameguard({ action: 'deny' })); // contre attaques clickjacking
app.use(helmet.hsts({ maxAge: sixtyDaysInSeconds })); // pour chiffrer les transmission contre les attaques homme du milieu (MITM)
app.use(helmet.contentSecurityPolicy()); // contre attaques cross-site scripting et injections intersites
app.use(helmet.hidePoweredBy()); // contre les attaques spécifiquement ciblées sur Express
app.use(helmet.noSniff()); // protège les navigateur du reniflage du code MINE (contre attaques cross-site scripting)


// middleware pour la gestion d'image de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// middleware pour les routes sauces
app.use('/api/sauces', sauceRoutes);

// middleware pour les routes users
app.use('/api/auth', userRoutes);

module.exports = app;