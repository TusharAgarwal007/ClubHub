const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { CATEGORIES, DEPARTMENTS } = require('../constants');

const router = express.Router();

// GET /api/winners - Public list with optional filters
router.get('/', async (req, res) => {
  try {
    const { search, category, department, year, limit } = req.query;
    const winners = await db.winners.find({ search, category, department, year, limit });

    return res.json({
      success: true,
      count: winners.length,
      winners
    });
  } catch (err) {
    console.error('Error fetching winners:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve winners.'
    });
  }
});

// GET /api/winners/:id - Public single winner
router.get('/:id', async (req, res) => {
  try {
    const winner = await db.winners.findById(req.params.id);
    if (!winner) {
      return res.status(404).json({
        success: false,
        message: 'Winner not found.'
      });
    }

    return res.json({
      success: true,
      winner
    });
  } catch (err) {
    console.error('Error fetching winner:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve winner details.'
    });
  }
});

// POST /api/winners - Admin create winner
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      teamName,
      position,
      eventName,
      category,
      department,
      year,
      prize,
      photo
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Winner name is required.'
      });
    }

    if (!eventName || !eventName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Event name is required.'
      });
    }

    if (!prize || !prize.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Prize/Award title is required.'
      });
    }

    const pos = Number(position);
    if (isNaN(pos) || pos < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid position (1, 2, 3, etc.) is required.'
      });
    }

    const finalCategory = (category && CATEGORIES.includes(category)) ? category : 'Competition';
    const finalDept = (department && DEPARTMENTS.includes(department)) ? department : 'Computer Science';

    const newWinner = await db.winners.create({
      name: name.trim(),
      teamName: teamName ? teamName.trim() : '',
      position: pos,
      eventName: eventName.trim(),
      category: finalCategory,
      department: finalDept,
      year: year || '3rd Year',
      prize: prize.trim(),
      photo: photo || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Winner created successfully.',
      winner: newWinner
    });
  } catch (err) {
    console.error('Error creating winner:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create winner.'
    });
  }
});

// PUT /api/winners/:id - Admin update winner
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.winners.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Winner not found.'
      });
    }

    const updates = { ...req.body };
    if (updates.position !== undefined) {
      updates.position = Number(updates.position);
    }
    if (updates.category && !CATEGORIES.includes(updates.category)) {
      updates.category = 'Competition';
    }

    const updated = await db.winners.findByIdAndUpdate(id, updates);

    return res.json({
      success: true,
      message: 'Winner updated successfully.',
      winner: updated
    });
  } catch (err) {
    console.error('Error updating winner:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update winner.'
    });
  }
});

// DELETE /api/winners/:id - Admin delete winner
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.winners.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Winner not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Winner removed successfully.'
    });
  } catch (err) {
    console.error('Error deleting winner:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete winner.'
    });
  }
});

module.exports = router;
