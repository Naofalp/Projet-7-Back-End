const express = require('express');
const mongoose = require('mongoose');
const app = express(); //remplace body.parser

const userRoutes = require('./routes/user');
const user = require('./models/user');

mongoose.connect('mongodb+srv://utilisateur-test:utilisateur-test@cluster0.yxicz2r.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => { //Ajout de headers pour gerer les erreurs CORS et demande d API. Pas d'adresse en parametres = s'applique à toutes les routes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);

module.exports = app;