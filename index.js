const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to database!'))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json);
//routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/products', require('./routes/product'));
app.use('/api/carts', require('./routes/cart'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/checkout', require('./routes/stripe'));

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on!');
});
