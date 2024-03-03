const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  rating: [{
    userId: { type: String },
    grade: { type: Number },
  }],
  averageRating: { type: Number }
});

module.exports = mongoose.model('Book', bookSchema);

/*
Book = le nom du modéle.
La base de données MongoDB est fractionnée en collections : 
le nom de la collection est défini par défaut sur le pluriel du nom du modèle. Ici, ce sera Books */