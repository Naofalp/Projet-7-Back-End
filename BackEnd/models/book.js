const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [{
    userId: { type: String },
    grade: { type: Number },
  }],
  averageRating: { type: Number, default: 0 }
});

//calcul de la note moyenne
bookSchema.pre('save', function (next) {
  const ratings = this.ratings.map((rating) => rating.grade)
  if (ratings.length === 0) {
    this.averageRating = 0
  } else {
    const sumOfRatings = ratings.reduce((acc, curr) => acc + curr, 0)
    this.averageRating = Math.ceil(sumOfRatings / ratings.length)
  }
  next()
})

module.exports = mongoose.model('Book', bookSchema);

/*
Book = le nom du modéle.
La base de données MongoDB est fractionnée en collections : 
le nom de la collection est défini par défaut sur le pluriel du nom du modèle. Ici, ce sera Books */