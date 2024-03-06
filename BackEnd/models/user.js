const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//mot de passe à 12 caractere sinon pas autorié. respecter RGPD au moins un caratere special etc. 

userSchema.plugin(uniqueValidator); // la valeur unique =true , avec l'élément mongoose-unique-validator passé comme plug-in, s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail.

module.exports = mongoose.model('User', userSchema);