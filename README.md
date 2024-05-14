Projet 7 : Création du back-end d'un site de notation du livre 

Réalisé avec Node.JS, Express et MONGODB.

Grâce aux routes de l'API, l'utilisateur peut rajouter  ou supprimer un livre, renseigner ses informations ou les modifier.
Il peut egalement interferer avec les publications des autres en notant les livres, ce qui alimentera la rubriques "les mieux notés".

Pour lancer la partie Front-End du site : 
- se rendre dans le terminal Frontend et rentrer la commande npm run start.

Pour lancer le serveur du site : 
- Creer un fichier .env dans le fichier backend qui possedera ces informations :

    IDMONGODB = utilisateur-test
  
    PASSWORD = utilisateur-test

    //const token
    TokenKey = 'RANDOM_TOKEN_SECRET'
  
- Se rendre dans le terminal Backend et rentrer la commande nodemon server.
