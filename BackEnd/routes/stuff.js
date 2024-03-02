const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');


router.get('/', stuffCtrl.getAllBooks);

router.get('/:id', stuffCtrl.getOneBook);

//GET pas besoin d'être auth; '/bestrating'

router.post('/', auth, multer, stuffCtrl.createBook);

router.put('/:id', auth, stuffCtrl.modifyBook);

router.delete('/:id', auth, stuffCtrl.deleteBook);

//POST '/:id/rating' 



module.exports = router;