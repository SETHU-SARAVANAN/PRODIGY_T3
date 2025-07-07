const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/products', async (req, res) => {
  let products = await Product.find();
  const sort = req.query.sort;
  if (sort === 'price_asc') products = products.sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') products = products.sort((a, b) => b.price - a.price);
  res.send(products);
});

// You can also add a POST route to create initial products if needed
router.post('/products', async (req, res) => {
  const product = await Product.create(req.body);
  res.send(product);
});

module.exports = router;
