const express = require('express');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://utilisateur-test:utilisateur-test@cluster0.yxicz2r.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => { //Ajout de headers pour gerer les erreurs CORS et demande d API. Pas d'adresse en parametres = s'applique à toutes les routes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

module.exports = app;