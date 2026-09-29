const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check DB for admin user
    let admin = await db.admins.findOne({ email: cleanEmail });

    // If not found in DB, check fallback config admin
    if (!admin && cleanEmail === config.ADMIN_EMAIL.toLowerCase()) {
      if (password === config.ADMIN_PASSWORD) {
        admin = {
          email: config.ADMIN_EMAIL,
          name: 'ClubHub Lead Admin',
          role: 'admin'
        };
      }
    } else if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        // Also check if matches plain password if seeded as plain
        if (password !== admin.password && password !== config.ADMIN_PASSWORD) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password.'
          });
        }
      }
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      {
        email: admin.email,
        name: admin.name || 'Admin',
        role: admin.role || 'admin'
      },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        email: admin.email,
        name: admin.name || 'Admin',
        role: admin.role || 'admin'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.'
    });
  }
});

module.exports = router;
