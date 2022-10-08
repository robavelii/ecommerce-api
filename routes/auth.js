const router = require('express').Router();

const { register, login } = require('../controllers/authController');

const { registerValidation } = require('../middlewares/auth');

//routes
router.post('/register', registerValidation, register);
router.post('/login', login);

module.exports = router;
