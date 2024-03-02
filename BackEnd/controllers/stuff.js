const Book = require('../models/book');

exports.getAllBooks = (req, res, next) => {
    Thing.find() // Méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les Thing à la BDD
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })   // Objet de comparaison : cherche celui dont l'id est = à l'id envoyé dans les parametres de requete URL
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};