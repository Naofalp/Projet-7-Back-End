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

        // Supprimer l'image originale
        await fs.unlink(originalFilePath);
        // Remplacer le chemin du fichier par le nouveau chemin
        req.file.path = `images/${newFileName}`;
        req.file.filename = newFileName;
        req.file.mimetype = "image/webp"
        console.log("Original file path:", req.file.path);
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to compress image', error });
    }
};

module.exports = compress;