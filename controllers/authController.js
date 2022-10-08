const { success, error, validation } = require('../../helpers/responseApi');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt-js');
const jwt = require('jsonwebtoken');
//const { randomString } = require('../helpers/common');

const authController = {};

/**
 * @desc Register user
 * @method POST api/auth/register
 * @pubic
 */
authController.register = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json(validation(errors.array()));
  const { username, email, password, role } = req.body;
  try {
    //check the user email

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user)
      return res
        .status(422)
        .json(validation({ msg: 'Email already registered' }));

    let newUser = new User({
      username,
      email: email.toLowerCase().replace(/\s+/, ''),
      role,
      password,
    });

    // hash the password
    const hash = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, hash);

    // save the user
    await newUser.save();

    // send the response
    res.status(201).json(
      success(
        'Register success, please activate your account.',
        {
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
          },
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server Error', res.statusCode));
  }
};
authController.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // check the email and if user exists
    if (!user) return res.status(422).json(validation('Incorrect Email'));

    // check the password
    let checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(422).json(validation('Incorrect Password'));

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: '2d' }
    );

    // send the response
    res
      .status(200)
      .json(success('Login successful', { accessToken }, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};

module.exports = authController;
