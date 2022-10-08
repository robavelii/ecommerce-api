const router = require('express').Router();

const {
  get,
  getALL,
  getStats,
  update,
  remove,
} = require('../controllers/userController');
const { auth } = require('../middlewares/auth');

//routes
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);
router.get('/:id', auth, get);
router.get('/', auth, getALL);
router.get('/stats', auth, getStats);
module.exports = router;
