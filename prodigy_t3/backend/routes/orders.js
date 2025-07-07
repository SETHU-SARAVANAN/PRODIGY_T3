const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Not authenticated');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

router.post('/orders', authMiddleware, async (req, res) => {
  const { items } = req.body;
  const order = await Order.create({ userId: req.userId, items });
  res.send(order);
});

router.get('/orders', authMiddleware, async (req, res) => {
  const orders = await Order.find({ userId: req.userId });
  res.send(orders);
});

module.exports = router;
