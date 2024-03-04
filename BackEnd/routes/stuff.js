const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');


router.get('/', stuffCtrl.getAllBooks);

router.get('/bestrating', stuffCtrl.getBestRating); //bestRating renvoi un ObjectId invalide si APRES getOneBook

router.get('/:id', stuffCtrl.getOneBook);

router.post('/', auth, multer, stuffCtrl.createBook); //Multer APRES auth pour s'assurer 

router.post('/:id/rating', auth, stuffCtrl.createRating);

router.put('/:id', auth, multer, stuffCtrl.modifyBook);

router.delete('/:id', auth, stuffCtrl.deleteBook);




module.exports = router;