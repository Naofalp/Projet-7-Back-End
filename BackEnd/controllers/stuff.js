const Book = require('../models/book');

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

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId; // peut pas faire confiance: le client peut usurper l'iD d'un autre
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

exports.createRating = (req, res, next) => {
    if (0 <= req.body.rating <= 5) {
        const ratingObject = { ...req.body, grade: req.body.rating };
        delete ratingObject._id;
        Book.findOne({ _id: req.params.id }) // Récupération du livre auquel on veut ajouter une note
            .then(book => {
                const newRatings = book.ratings;
                const userIdArray = newRatings.map(rating => rating.userId); // on cherche les user ayant déjà noté le livre

                if (userIdArray.includes(req.auth.userId)) { // On vérifie que l'utilisateur ne donne pas plusieurs notations au même livre
                    res.status(403).json({ message: 'Not authorized' });
                }
                else {
                    newRatings.push(ratingObject); // Ajout de la note et de l'userId
                    const grades = newRatings.map(rating => rating.grade); //tableau des notes
                    const averageGrades = calculateAverage(grades);

                    Book.updateOne({ _id: req.params.id }, { ratings: newRatings, averageRating: averageGrades, _id: req.params.id })
                        .then(() => { res.status(201).json() })
                        .catch(error => { res.status(400).json({ error }) });
                    res.status(200).json(book);
                }
            })
            .catch((error) => {
                res.status(404).json({ error });
            });
    } else {
        res.status(400).json({ message: 'La note doit être comprise entre 1 et 5' });
    }
};

// Fonction pour calculer la moyenne des grades
const calculateAverage = (grades) => {
    if (grades.length === 0) {
        return 0; // Retourne 0 si le tableau est vide pour éviter une division par zéro
    }
    
    const sum = grades.reduce((acc, grade) => acc + grade, 0); // Calcule la somme des notes
    const average = sum / grades.length; // Calcule la moyenne en divisant la somme par le nombre total de notes
    return average;
};

