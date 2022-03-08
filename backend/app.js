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

/* utilisation de Helmet pour securiser l'appli contre les attaques de type ClickJacking,les attaques de type MITM(attaque homme du milieu) 
les attaques de type cross-site scripting et autres injections intersites,les attaques spécifiquement ciblées (Express) et autres... */
app.use(helmet.xssFilter());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.hsts({ maxAge: sixtyDaysInSeconds }));
app.use(helmet.contentSecurityPolicy());
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());



// middleware pour la gestion d'image de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// middleware pour les routes sauces
app.use('/api/sauces', sauceRoutes);

// middleware pour les routes users
app.use('/api/auth', userRoutes);

module.exports = app;