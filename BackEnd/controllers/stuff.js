const Book = require('../models/book');

exports.getAllBooks = (req, res, next) => {
    Thing.find() // Méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les Thing à la BDD
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
};