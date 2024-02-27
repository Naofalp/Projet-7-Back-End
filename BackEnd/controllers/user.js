const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // Recupere le Password du model User et le Hash 10 fois 
        .then(hash => {
            const user = new User({ //Création de l'user qui va servir à stocker et comparer dans login
                email: req.body.email,
                password: hash
            });
            user.save() //Enregistrement de User dans la BDD
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); //Si erreur de fonctionnement
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // Vérifie e-mail user rentré correspond à existant de la bdd
        .then(user => {
            if (!user) { //Si l'email correspond pas 401 unautorized
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password) // si email correspond : compare le mdp avec le hash enregistré dans la bdd
                .then(valid => {
                    if (!valid) { // si correspond pas 
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({ //Si correspond alors renvoi une réponse 200 contenant l'ID utilisateur et un token. 
                        userId: user._id,
                        token: jwt.sign( //fonction sign de JWT pour creer un nveau token
                            { userId: user._id }, //ID de l'utilisateur en tant que payload 
                            'RANDOM_TOKEN_SECRET', //clé secrète pour chiffrer un token
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); // SI erreur de fonctionnement
};