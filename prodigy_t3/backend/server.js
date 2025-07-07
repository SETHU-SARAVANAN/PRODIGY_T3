// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

let orders = [];

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

// DB & Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log('Server started on port 5000')))
  .catch(err => console.error(err));

app.post('/api/orders', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });

  const newOrder = {
    _id: Date.now().toString(),
    user: req.session.user.email, // <-- MUST be stored!
    items: req.body.items,
    placedAt: new Date(),
    status: 'Processing'
  };

  orders.push(newOrder);
  res.status(201).json({ message: 'Order placed' });
});


app.get('/api/orders', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Return only this user's orders
  const userOrders = orders.filter(order => order.user === req.session.user.email);
  res.json(userOrders);
});

app.delete('/api/orders/:id', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const orderId = req.params.id;
  const userEmail = req.session.user.email;

  const index = orders.findIndex(order => order._id === orderId && order.user === userEmail);

  if (index === -1) {
    return res.status(404).json({ message: 'Order not found or not owned by user' });
  }

  orders.splice(index, 1); // ✅ delete the order
  res.json({ message: 'Order canceled successfully' });
});

