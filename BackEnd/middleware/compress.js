const sharp = require('sharp');
const fs = require('fs');

const compress = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const originalFilePath = req.file.path;
    const originalname = req.file.filename;
    const timestamp = new Date().toISOString();
    const newFileName = `${timestamp}-${originalname}.webp`;

    sharp(req.file.path)
        .webp({ quality: 20 })
        .toFile(`images/${newFileName}`)
        .then(() => {
            fs.unlink(originalFilePath, () => { //suppression de l'original et remplacement par le redimensionné
                req.file.path = newFileName;
                next();
            });
        })
        .catch(error => {
            console.log(error);
            return next();
        });
};

module.exports = compress;