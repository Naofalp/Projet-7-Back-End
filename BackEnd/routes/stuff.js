const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');


router.get('/', stuffCtrl.getAllBooks);

router.get('/:id', stuffCtrl.getOneBook);

//GET pas besoin d'être auth; '/bestrating'

router.post('/', auth, multer, stuffCtrl.createBook); //Multer APRES auth pour s'assurer 

router.put('/:id', auth, multer, stuffCtrl.modifyBook);

router.delete('/:id', auth, stuffCtrl.deleteBook);

router.post('/:id/rating', auth, stuffCtrl.createRating);



module.exports = router;