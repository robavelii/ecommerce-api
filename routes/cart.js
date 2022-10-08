const router = require('express').Router();

const {
  create,
  get,
  getALL,
  update,
  remove,
} = require('../controllers/cartController');
const { auth } = require('../middlewares/auth');

//routes
router.post('/', create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);
router.get('/:userId', auth, get);
router.get('/', auth, getALL);

module.exports = router;
