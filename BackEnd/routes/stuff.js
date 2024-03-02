const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const stuffCtrl = require('../controllers/stuff');


router.get('/', auth, stuffCtrl.getAllBooks);

router.get('/:id', auth, stuffCtrl.getOneBook);

module.exports = router;