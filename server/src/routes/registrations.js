const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Email validation helper
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// 10-digit phone validation helper
function isValidPhone(phone) {
  const clean = String(phone).replace(/\D/g, '');
  return clean.length >= 10 && clean.length <= 15;
}

// POST /api/registrations - Public registration
router.post('/', async (req, res) => {
  try {
    const { fullName, email, collegeName, yearOfStudy, phoneNumber, eventId } = req.body;

    // Validate inputs
    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Event ID is required.' });
    }
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });
    }
    if (!collegeName || !collegeName.trim()) {
      return res.status(400).json({ success: false, message: 'College name is required.' });
    }
    if (!yearOfStudy || !yearOfStudy.trim()) {
      return res.status(400).json({ success: false, message: 'Year of study is required.' });
    }
    if (!phoneNumber || !isValidPhone(phoneNumber)) {
      return res.status(400).json({ success: false, message: 'A valid phone number (at least 10 digits) is required.' });
    }

    // Check if event exists
    const event = await db.events.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Selected event not found.' });
    }

    // Check if event date has passed
    const todayStr = new Date().toISOString().split('T')[0];
    if (event.date < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Registrations are closed because this event has already concluded.'
      });
    }

    // Check capacity
    if (event.maxSeats && event.maxSeats > 0) {
      const currentCount = await db.registrations.count({ eventId });
      if (currentCount >= event.maxSeats) {
        return res.status(400).json({
          success: false,
          message: 'Sorry! This event has reached its maximum seat capacity.'
        });
      }
    }

    // Check duplicate registration
    const existing = await db.registrations.findOne({
      eventId,
      email: email.trim().toLowerCase()
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `You are already registered for "${event.title}" with this email address (${email.trim().toLowerCase()}). Check your existing ticket: ${existing.ticketId}`,
        existingTicketId: existing.ticketId
      });
    }

    // Create registration
    const registration = await db.registrations.create({
      eventId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      collegeName: collegeName.trim(),
      yearOfStudy: yearOfStudy.trim(),
      phoneNumber: String(phoneNumber).replace(/\D/g, '')
    });

    return res.status(201).json({
      success: true,
      message: 'Registration confirmed successfully!',
      registration
    });
  } catch (err) {
    console.error('Error processing registration:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete registration. Please try again.'
    });
  }
});

// GET /api/registrations - Admin list with search, filter & pagination
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, eventId, yearOfStudy } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);

    const allRegistrations = await db.registrations.find({ search, eventId, yearOfStudy });
    const totalCount = allRegistrations.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;

    const startIndex = (page - 1) * limit;
    const paginatedItems = allRegistrations.slice(startIndex, startIndex + limit);

    return res.json({
      success: true,
      registrations: paginatedItems,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages
      }
    });
  } catch (err) {
    console.error('Error fetching registrations:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve registrations.'
    });
  }
});

// GET /api/registrations/export - Admin CSV Export
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const { search, eventId, yearOfStudy } = req.query;
    const registrations = await db.registrations.find({ search, eventId, yearOfStudy });

    // Format as CSV
    const csvHeaders = ['Ticket ID', 'Student Name', 'Email', 'College Name', 'Year of Study', 'Phone Number', 'Event Title', 'Registration Date'];
    const rows = registrations.map(r => {
      const eventTitle = (r.event && r.event.title) ? r.event.title.replace(/"/g, '""') : 'N/A';
      const cleanName = (r.fullName || '').replace(/"/g, '""');
      const cleanCollege = (r.collegeName || '').replace(/"/g, '""');
      const cleanDate = r.registeredAt ? new Date(r.registeredAt).toLocaleString() : '';

      return `"${r.ticketId || ''}","${cleanName}","${r.email || ''}","${cleanCollege}","${r.yearOfStudy || ''}","${r.phoneNumber || ''}","${eventTitle}","${cleanDate}"`;
    });

    const csvContent = [csvHeaders.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=clubhub_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csvContent);
  } catch (err) {
    console.error('Error exporting registrations to CSV:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to export registrations.'
    });
  }
});

module.exports = router;
