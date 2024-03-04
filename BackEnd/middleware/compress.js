const sharp = require('sharp');
const fs = require('fs').promises;

const compress = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const originalFilePath = req.file.path;
    const originalname = req.file.filename;
    const newFileName = `resized_${originalname}.webp`;
    try {
        await sharp(originalFilePath)
            .webp({ quality: 20 })
            .toFile(`images/${newFileName}`)

        await fs.unlink(originalFilePath); // Supprimer l'image originale

        req.file.path = `images/${newFileName}`; // Remplacer le chemin du fichier par le nouveau chemin
        req.file.filename = newFileName; // remplacer le nom car sinon le front cherche avec l'ancien nom
        req.file.mimetype = "image/webp"
        console.log("Original file path:", req.file.path);
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to compress image', error });
    }
};

module.exports = compress;