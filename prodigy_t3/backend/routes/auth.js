const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).send('User already exists');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
  res.send({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send('Invalid credentials');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie('token', token, { httpOnly: true }).send({ message: 'Logged in' });
});


router.get('/check-auth', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Not logged in');
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.send('Authenticated');
  } catch {
    res.status(401).send('Invalid');
  }
});

module.exports = router;