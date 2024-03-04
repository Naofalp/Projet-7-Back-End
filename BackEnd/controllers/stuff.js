const Book = require('../models/book');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

exports.getBestRating = async (req, res, next) => {
    try {
        const topRatedBooks = await Book.find()
            .sort({ averageRating: -1 })
            .limit(3)
        res.status(200).json(topRatedBooks)
    } catch (error) {
        res.status(500).json({ error: 'An error has occurred' })
    }
};

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId; // peut pas faire confiance: le client peut usurper l'iD d'un autre

    if (bookObject.ratings[0].grade === 0) {
        bookObject.ratings = []
    }

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId, //userId fourni par auth
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? { // si un fichier est upload, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant avec req.body.
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) { // si l'id de l'objet modifié est diff de celui de la requete : unauthorized
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) { // s'assure que l'user est bien celui qui gere le thing
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = book.imageUrl.split('/images/')[1]; // on isole le nom du fichier dans l'URL qu'on a attribué
                fs.unlink(`images/${filename}`, () => { //unlink de 'fs' supprime le fichier du systeme de fichier
                    Book.deleteOne({ _id: req.params.id }) //on applique la fonction delete basique pour le supp de la BDD
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.createRating = async (req, res, next) => {
    // Check that the user has not already rated the book
    const existingRating = await Book.findOne({
        _id: req.params.id,
        "ratings.userId": req.body.userId
    })
    if (existingRating) {
        return res.status(400).json({ message: 'User has already rated this book' })
    }

    // Check that the rating is a number between 0..5 included
    if (!(req.body.rating >= 0) && !(req.body.rating <= 5) && (typeof req.body.rating === 'number')) {
        return res.status(500).json({ message: 'Grade is not between 0 and 5 included or is not a number' })
    }

    try {
        // Retrieves the book to rate according to the id of the request
        const book = await Book.findOne({ _id: req.params.id })
        if (!book) {
            return res.status(404).json({ message: 'Book not found' })
        }

        // Add a new rating to the ratings array of the book
        book.ratings.push({ userId: req.body.userId, grade: req.body.rating })

        // Save the book to MongoDB, averageRating will be up to date on save
        await book.save()
        res.status(200).json(book)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'An error has occurred' })
    }
};
