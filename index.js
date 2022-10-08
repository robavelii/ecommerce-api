const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express'),
  swaggerDocument = require('./swagger-output.json');

dotenv.config();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to database!'))
  .catch((err) => {
    console.log(err);
  });

//routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/products', require('./routes/product'));
app.use('/api/carts', require('./routes/cart'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/checkout', require('./routes/stripe'));

//swagger route
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Run the server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server burning on port ${PORT} 🔥`));
