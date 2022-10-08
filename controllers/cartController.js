const { success, error, validation } = require('../../helpers/responseApi');
const { validationResult } = require('express-validator');

const Cart = require('../models/Cart');

const cartController = {};

/**
 * @desc Create a new cart
 * @method POST api/cart
 * @access public
 */
cartController.create = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(201).json(
      success(
        'Cart created successfully!',
        {
          savedCart,
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};
/**
 * @desc    Get a cart
 * @method  GET api/cart/:userId
 * @access  public
 */
cartController.get = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart)
      return res.status(404).json(error('Cart not found'), res.statusCode);
    res.status(200).json(
      success(
        'Cart found success',
        {
          cart,
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};

/**
 * @desc    Get all carts
 * @method  GET api/cart
 * @access  public
 */
cartController.getALL = async (req, res) => {
  if (req.user.role !== 'Admin')
    return res.status(401).json({ msg: 'Unauthorized' });
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    const carts = await Cart.find();
    res.status(200).json(
      success(
        'Carts found success',
        {
          carts,
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};

/**
 * @desc    Update a cart
 * @method  PUT api/cart/:id
 * @access  public
 */
cartController.update = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(
      success(
        'Cart update success',
        {
          updatedCart,
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};

/**
 * @desc    Delete a cart
 * @method  DELETE api/cart/:id
 * @access  public
 */
cartController.remove = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json(success('Cart delete success', res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};

module.exports = cartController;
