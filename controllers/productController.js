const { success, error, validation } = require('../helpers/responseApi');
const { validationResult } = require('express-validator');

const Product = require('../models/Product');

const productController = {};

/**
 * @desc Create a new product
 * @method POST api/product
 * @access public
 */
productController.create = async (req, res) => {
  if (req.user.role !== 'Admin')
    return res.status(401).json({ msg: 'Unauthorized' });
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(
      success(
        'Product created successfully!',
        {
          savedProduct,
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
 * @desc    Get a product
 * @method  GET api/product/:userId
 * @access  public
 */
productController.get = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json(error('Product not found'), res.statusCode);
    res.status(200).json(
      success(
        'Product fetched successfully',
        {
          product,
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
 * @desc    Get all products
 * @method  GET api/product
 * @access  public
 */
productController.getALL = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categroies: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(
      success(
        'Products fetched successfully',
        {
          products,
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
 * @desc    Update a product
 * @method  PUT api/product/:id
 * @access  public
 */
productController.update = async (req, res) => {
  if (req.user.role !== 'Admin')
    return res.status(401).json({ msg: 'Unauthorized' });
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(
      success(
        'Product update success',
        {
          updatedProduct,
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
 * @desc    Delete a product
 * @method  DELETE api/product/:id
 * @access  public
 */
productController.remove = async (req, res) => {
  if (req.user.role !== 'Admin')
    return res.status(401).json({ msg: 'Unauthorized' });
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    await Product.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json(success('Product deleted successfully', res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};

module.exports = productController;
