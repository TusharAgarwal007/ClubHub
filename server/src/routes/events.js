const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/events - Public list with filters
router.get('/', async (req, res) => {
  try {
    const { search, category, status, sort } = req.query;
    const events = await db.events.find({ search, category, status, sort });

    return res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve events.'
    });
  }
});

// GET /api/events/:id - Public single event
router.get('/:id', async (req, res) => {
  try {
    const event = await db.events.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    return res.json({
      success: true,
      event
    });
  } catch (err) {
    console.error('Error fetching event details:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve event details.'
    });
  }
});

// POST /api/events - Admin create event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      date,
      time,
      venue,
      bannerImage,
      maxSeats,
      isFeatured,
      organizer,
      eligibility
    } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Event title is required.' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Event category is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Event description is required.' });
    }
    if (!date) {
      return res.status(400).json({ success: false, message: 'Event date is required.' });
    }
    if (!time) {
      return res.status(400).json({ success: false, message: 'Event time is required.' });
    }
    if (!venue || !venue.trim()) {
      return res.status(400).json({ success: false, message: 'Event venue is required.' });
    }

    const event = await db.events.create({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      date,
      time,
      venue: venue.trim(),
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
      maxSeats: Number(maxSeats) || 0,
      isFeatured: Boolean(isFeatured),
      organizer: organizer ? organizer.trim() : 'ClubHub Council',
      eligibility: eligibility ? eligibility.trim() : 'Open to all college students'
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      event
    });
  } catch (err) {
    console.error('Error creating event:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create event.'
    });
  }
});

// PUT /api/events/:id - Admin update event
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await db.events.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    const updates = { ...req.body };
    if (updates.title) updates.title = updates.title.trim();
    if (updates.category) updates.category = updates.category.trim();
    if (updates.description) updates.description = updates.description.trim();
    if (updates.venue) updates.venue = updates.venue.trim();
    if (updates.maxSeats !== undefined) updates.maxSeats = Number(updates.maxSeats) || 0;
    if (updates.isFeatured !== undefined) updates.isFeatured = Boolean(updates.isFeatured);

    const updated = await db.events.findByIdAndUpdate(req.params.id, updates);

    return res.json({
      success: true,
      message: 'Event updated successfully!',
      event: updated
    });
  } catch (err) {
    console.error('Error updating event:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update event.'
    });
  }
});

// DELETE /api/events/:id - Admin delete event (cascades registrations)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await db.events.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    const result = await db.events.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: `Event "${existing.title}" and ${result.deletedRegistrationsCount} associated registration(s) deleted successfully.`,
      deletedEvent: result.event,
      deletedRegistrationsCount: result.deletedRegistrationsCount
    });
  } catch (err) {
    console.error('Error deleting event:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete event.'
    });
  }
});

module.exports = router;
