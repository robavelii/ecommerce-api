const router = require('express').Router();

const {
  create,
  get,
  getALL,
  update,
  remove,
} = require('../controllers/productController');
const { auth } = require('../middlewares/auth');

//routes
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);
router.get('/:id', auth, get);
router.get('/', auth, getALL);

module.exports = router;
