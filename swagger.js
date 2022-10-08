const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointFile = [
  './routes/auth.js',
  './routes/cart.js',
  './routes/order.js',
  './routes/product.js',
  './routes/user.js',
];

swaggerAutogen(outputFile, endpointFile);
