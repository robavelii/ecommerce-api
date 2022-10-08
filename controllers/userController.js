const { success, error, validation } = require('../../helpers/responseApi');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const bcrypt = require('bcrypt-js');

const userController = {};

/**
 * @desc    Get a user
 * @method  GET api/user/:userId
 * @access  public
 */
userController.get = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json(error('User not found'), res.statusCode);
    res.status(200).json(
      success(
        'User found',
        {
          user,
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
 * @desc    Get all users
 * @method  GET api/user
 * @access  public
 */
userController.getALL = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(
      success(
        'Users found success',
        {
          users,
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
 * @desc    Get user stats
 * @method  GET api/user/stats
 * @access  public
 */
userController.getStats = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: 'month',
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(
      success(
        'User stats fetched successfully',
        {
          data,
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
 * @desc    Update a user
 * @method  PUT api/user/:id
 * @access  public
 */
userController.update = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  const data = req.body;
  const password = await req.body.password;
  const hash = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, hash);
  if (data.password) {
    data.password = hashedPassword;
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: data,
      },
      { new: true }
    );
    res.status(200).json(
      success(
        'User updated successfully',
        {
          updatedUser,
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
 * @desc    Delete a user
 * @method  DELETE api/user/:id
 * @access  public
 */
userController.remove = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json(success('User deleted successfully', res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};

module.exports = userController;
