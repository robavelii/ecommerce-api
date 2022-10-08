const router = require('express').Router();

const { create } = require('../controllers/stripeController');

//routes
router.post('/', create);

module.exports = router;
