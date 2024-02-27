const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // Recupere le Password du model User et le Hash 10 fois 
        .then(hash => {
            const user = new User({ 
                email: req.body.email,
                password: hash
            });
            user.save() 
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); 
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) { 
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({ 
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
        .catch(error => res.status(500).json({ error })); 
};