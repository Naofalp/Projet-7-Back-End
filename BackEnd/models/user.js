const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    validate: {
      // Validator vérifie si le password contient au moins une majuscule, un caractère spécial et un chiffre.
      validator: function (value) {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/.test(value);
      },
      //message a rajouter en front pour l'affichage client
      message: 'Votre mot de passe doit contenir au moins une majuscule, un caractère spécial, un chiffre et avoir une longueur minimale de 12 caractères.',
      errorCode: 555 // Code d'erreur personnalisé sinon 400 par defaut.
    }
  }
});


userSchema.plugin(uniqueValidator); // la valeur unique =true , avec l'élément mongoose-unique-validator passé comme plug-in, s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail.

module.exports = mongoose.model('User', userSchema);