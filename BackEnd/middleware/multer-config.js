const multer = require('multer');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ //méthode configure le chemin et le nom de fichier pour les fichiers entrants.
    destination: (req, file, callback) => {
        const dir = 'images';
        if (!fs.existsSync(dir)) { // si pas de dossier images: en creer un
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // on supprime les espaces pour remplacer par des _
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');