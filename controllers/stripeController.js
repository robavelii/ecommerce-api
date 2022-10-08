const stripe = require('stripe')(process.env.STRIPE_KEY);

const stripeController = {};

/**
 * @desc Create a new payment
 * @method POST api/payment
 * @access private
 */
stripeController.create = async (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'usd',
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
};
module.exports = stripeController;
