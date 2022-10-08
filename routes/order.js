const router = require('express').Router();

const {
  create,
  get,
  getALL,
  getIncome,
  update,
  remove,
} = require('../controllers/orderController');
const { auth } = require('../middlewares/auth');

//routes
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);
router.get('/:userId', auth, get);
router.get('/income', auth, getIncome);
router.get('/', auth, getALL);

module.exports = router;
