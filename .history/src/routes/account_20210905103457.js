var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'src/public/uploads/' });
const accountController = require('../app/controllers/accountController');
const authMiddlewares = require('../app/middlewares/AuthMiddlewares');


router.delete('/:id', accountController.accountDelete);

module.exports = router;
