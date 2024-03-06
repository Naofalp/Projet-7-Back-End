// middleware qui va vérifier que l’utilisateur est bien connecté et transmettre les informations 
//de connexion aux différentes méthodes qui vont gérer les requêtes

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv'); // sert a lire le dossier env.
dotenv.config();
const TokenKey = process.env.TokenKey
 
module.exports = (req, res, next) => {
   try {
        //extraire l'userId du token chiffré
       const token = req.headers.authorization.split(' ')[1]; //diviser la string en un tableau pour n'avoir que le token qui est en deuxième
       const decodedToken = jwt.verify(token, TokenKey); //fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée.
       const userId = decodedToken.userId; // recup userId qu'on avait mis dans le token dans le controller
       console.log(token);
       //Rajouter l'id à la requete afin que les différentes routes puissent l’exploiter.
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};