const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const events = await db.events.find({});
    const registrations = await db.registrations.find({});
    const winners = await db.winners.find({});

    const todayStr = new Date().toISOString().split('T')[0];

    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => e.date >= todayStr).length;
    const totalRegistrations = registrations.length;
    const totalWinners = winners.length;

    // Registrations today
    const registrationsToday = registrations.filter(r => {
      if (!r.registeredAt) return false;
      const rDate = new Date(r.registeredAt).toISOString().split('T')[0];
      return rDate === todayStr;
    }).length;

    // Registrations per event (for Recharts)
    const eventCounts = {};
    registrations.forEach(r => {
      const eid = String(r.eventId);
      eventCounts[eid] = (eventCounts[eid] || 0) + 1;
    });

    const registrationsByEvent = events.map(e => ({
      eventId: e._id || e.id,
      title: e.title.length > 22 ? e.title.substring(0, 20) + '...' : e.title,
      fullTitle: e.title,
      count: eventCounts[String(e._id || e.id)] || 0,
      maxSeats: e.maxSeats || 0,
      category: e.category
    })).sort((a, b) => b.count - a.count);

    // Registrations by Year of Study
    const yearCounts = {
      '1st Year': 0,
      '2nd Year': 0,
      '3rd Year': 0,
      '4th Year': 0,
      'Other': 0
    };
    registrations.forEach(r => {
      const yr = r.yearOfStudy || 'Other';
      if (yearCounts[yr] !== undefined) {
        yearCounts[yr]++;
      } else {
        yearCounts['Other']++;
      }
    });

    const registrationsByYear = Object.keys(yearCounts).map(year => ({
      name: year,
      value: yearCounts[year]
    }));

    // Category distribution
    const categoryCounts = {};
    events.forEach(e => {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    });

    const categoryDistribution = Object.keys(categoryCounts).map(cat => ({
      category: cat,
      count: categoryCounts[cat]
    }));

    // Recent registrations
    const recentRegistrations = registrations.slice(0, 6);

    return res.json({
      success: true,
      stats: {
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        totalWinners,
        registrationsToday,
        registrationsByEvent,
        registrationsByYear,
        categoryDistribution,
        recentRegistrations
      }
    });
  } catch (err) {
    console.error('Error fetching admin statistics:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin analytics.'
    });
  }
});

module.exports = router;
