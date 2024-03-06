const express = require('express');
const mongoose = require('mongoose');
const app = express();
const helmet = require('helmet'); // protege les headers. 

app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );

//importation des routes
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const path = require('path');

const dotenv = require('dotenv'); // sert a lire le dossier env.
dotenv.config();
const IDMONGODB = process.env.IDMONGODB //securité des identifants et mot de passes
const PASSWORD = process.env.PASSWORD
mongoose.connect(`mongodb+srv://${IDMONGODB}:${PASSWORD}@cluster0.yxicz2r.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json()); // remplace le body.parser

app.use((req, res, next) => { //Ajout de headers pour gerer les erreurs CORS et demande d API. Pas d'adresse en parametres = s'applique à toutes les routes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/books', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))); //routage pour l'affichage et avoir l'accés aux image

module.exports = app;