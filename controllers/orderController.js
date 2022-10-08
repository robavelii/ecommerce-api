const { success, error, validation } = require('../../helpers/responseApi');
const { validationResult } = require('express-validator');

const Order = require('../models/Order');

const orderController = {};

/**
 * @desc Create a new order
 * @method POST api/order
 * @access public
 */
orderController.create = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(
      success(
        'Order created successfully!',
        {
          savedOrder,
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
 * @desc    Get user orders
 * @method  GET api/order/:userId
 * @access  public
 */
orderController.get = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    const orders = await Order.find({ userId: req.params.userId });
    if (!orders)
      return res.status(404).json(error('Orders not found'), res.statusCode);
    res.status(200).json(
      success(
        'Orders found success',
        {
          orders,
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
 * @desc    Get all orders
 * @method  GET api/order
 * @access  public
 */
orderController.getALL = async (req, res) => {
  if (req.user.role !== 'Admin')
    return res.status(401).json({ msg: 'Unauthorized' });
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    const orders = await Order.find();
    res.status(200).json(
      success(
        'Orders fetched successfully',
        {
          orders,
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
 * @desc    Get monthly income
 * @method  GET api/order/income
 * @access  public
 */
orderController.getIncome = async (req, res) => {
  if (req.user.role !== 'Admin')
    return res.status(401).json({ msg: 'Unauthorized' });
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount',
        },
      },
      {
        $group: {
          _id: 'month',
          total: { $sum: '$sales' },
        },
      },
    ]);
    res.status(200).json(
      success(
        'Income fetched successfully',
        {
          income,
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
 * @desc    Update an order
 * @method  PUT api/order/:id
 * @access  public
 */
orderController.update = async (req, res) => {
  if (req.user.role !== 'Admin')
    return res.status(401).json({ msg: 'Unauthorized' });
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(
      success(
        'Order updated successfully',
        {
          updatedOrder,
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
 * @desc    Delete an order
 * @method  DELETE api/order/:id
 * @access  public
 */
orderController.remove = async (req, res) => {
  if (req.user.role !== 'Admin')
    return res.status(401).json({ msg: 'Unauthorized' });
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json(success('Order deleted successfully', res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};

module.exports = orderController;
