const mongoose = require('mongoose');
const config = require('../config');
const store = require('./store');
const { Event, Registration, Winner, Admin } = require('./mongoose');

let activeDb = 'store'; // 'store' or 'mongo'

async function initDb() {
  if (config.MONGODB_URI) {
    try {
      console.log(`[DB] Attempting connection to MongoDB at ${config.MONGODB_URI}...`);
      await mongoose.connect(config.MONGODB_URI, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000
      });
      activeDb = 'mongo';
      console.log('[DB] Connected successfully to MongoDB!');
      return;
    } catch (err) {
      console.warn(`[DB] MongoDB connection failed (${err.message}). Falling back to persistent local storage engine.`);
    }
  } else {
    console.log('[DB] No MONGODB_URI provided. Using persistent local storage engine.');
  }
  activeDb = 'store';
  store.readData(); // ensure file created
  console.log('[DB] Local persistent storage initialized (server/data/clubhub_data.json)');
}

// Wrapper for Mongoose when activeDb is 'mongo'
const mongoEvents = {
  async find(query = {}) {
    const filter = {};
    if (query.category && query.category !== 'All') {
      filter.category = new RegExp(`^${query.category}$`, 'i');
    }
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { venue: { $regex: query.search, $options: 'i' } },
        { category: { $regex: query.search, $options: 'i' } }
      ];
    }
    const todayStr = new Date().toISOString().split('T')[0];
    if (query.status === 'upcoming') {
      filter.date = { $gte: todayStr };
    } else if (query.status === 'past') {
      filter.date = { $lt: todayStr };
    } else if (query.status === 'this-week') {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      filter.date = { $gte: todayStr, $lte: nextWeek.toISOString().split('T')[0] };
    }

    let sortOption = { isFeatured: -1, date: 1 };
    if (query.sort === 'date-asc') sortOption = { date: 1 };
    if (query.sort === 'date-desc') sortOption = { date: -1 };

    const events = await Event.find(filter).sort(sortOption).lean();

    // Attach registration counts
    const eventIds = events.map(e => e._id);
    const counts = await Registration.aggregate([
      { $match: { eventId: { $in: eventIds } } },
      { $group: { _id: '$eventId', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach(c => { countMap[String(c._id)] = c.count; });

    return events.map(e => ({
      ...e,
      id: e._id,
      registrationCount: countMap[String(e._id)] || 0
    }));
  },

  async findById(id) {
    const event = await Event.findById(id).lean();
    if (!event) return null;
    const count = await Registration.countDocuments({ eventId: id });
    return {
      ...event,
      id: event._id,
      registrationCount: count
    };
  },

  async create(data) {
    if (data.isFeatured) {
      await Event.updateMany({}, { isFeatured: false });
    }
    const event = await Event.create(data);
    const obj = event.toObject();
    return { ...obj, id: obj._id, registrationCount: 0 };
  },

  async findByIdAndUpdate(id, updates) {
    if (updates.isFeatured) {
      await Event.updateMany({ _id: { $ne: id } }, { isFeatured: false });
    }
    const event = await Event.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!event) return null;
    const count = await Registration.countDocuments({ eventId: id });
    return { ...event, id: event._id, registrationCount: count };
  },

  async findByIdAndDelete(id) {
    const event = await Event.findByIdAndDelete(id).lean();
    if (!event) return null;
    const regResult = await Registration.deleteMany({ eventId: id });
    return { event: { ...event, id: event._id }, deletedRegistrationsCount: regResult.deletedCount };
  }
};

const mongoRegistrations = {
  async find(query = {}) {
    const filter = {};
    if (query.eventId) filter.eventId = query.eventId;
    if (query.yearOfStudy && query.yearOfStudy !== 'All') filter.yearOfStudy = query.yearOfStudy;
    if (query.search) {
      filter.$or = [
        { fullName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { collegeName: { $regex: query.search, $options: 'i' } },
        { phoneNumber: { $regex: query.search, $options: 'i' } },
        { ticketId: { $regex: query.search, $options: 'i' } }
      ];
    }
    const items = await Registration.find(filter).populate('eventId').sort({ registeredAt: -1 }).lean();
    return items.map(r => ({
      ...r,
      id: r._id,
      event: r.eventId || { title: 'Unknown Event' }
    }));
  },

  async findOne(filter = {}) {
    const res = await Registration.findOne(filter).lean();
    if (!res) return null;
    return { ...res, id: res._id };
  },

  async count(filter = {}) {
    return Registration.countDocuments(filter);
  },

  async create(regData) {
    const event = await Event.findById(regData.eventId).lean();
    const prefix = event ? event.title.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'EV') : 'CH';
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `CH-${prefix}-${randSuffix}`;

    const newReg = await Registration.create({
      ...regData,
      ticketId,
      registeredAt: regData.registeredAt || new Date()
    });

    const obj = newReg.toObject();
    return {
      ...obj,
      id: obj._id,
      event: event || { title: 'Unknown Event' }
    };
  },

  async deleteMany(filter = {}) {
    return Registration.deleteMany(filter);
  }
};

const mongoAdmins = {
  async findOne(filter = {}) {
    const res = await Admin.findOne(filter).lean();
    if (!res) return null;
    return { ...res, id: res._id };
  },
  async create(data) {
    const admin = await Admin.create(data);
    const obj = admin.toObject();
    return { ...obj, id: obj._id };
  }
};

const mongoWinners = {
  async find(query = {}) {
    const filter = {};
    if (query.category && query.category !== 'All') {
      filter.category = new RegExp(`^${query.category}$`, 'i');
    }
    if (query.department && query.department !== 'All') {
      filter.department = new RegExp(`^${query.department}$`, 'i');
    }
    if (query.year && query.year !== 'All') {
      filter.year = query.year;
    }
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { teamName: { $regex: query.search, $options: 'i' } },
        { eventName: { $regex: query.search, $options: 'i' } },
        { prize: { $regex: query.search, $options: 'i' } },
        { department: { $regex: query.search, $options: 'i' } }
      ];
    }
    let q = Winner.find(filter).sort({ position: 1 });
    if (query.limit) {
      q = q.limit(Number(query.limit));
    }
    const items = await q.lean();
    return items.map(w => ({ ...w, id: w._id }));
  },
  async findById(id) {
    const item = await Winner.findById(id).lean();
    if (!item) return null;
    return { ...item, id: item._id };
  },
  async create(data) {
    const item = await Winner.create(data);
    const obj = item.toObject();
    return { ...obj, id: obj._id };
  },
  async findByIdAndUpdate(id, updates) {
    const item = await Winner.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!item) return null;
    return { ...item, id: item._id };
  },
  async findByIdAndDelete(id) {
    const item = await Winner.findByIdAndDelete(id).lean();
    if (!item) return null;
    return { ...item, id: item._id };
  },
  async clearAll() {
    return Winner.deleteMany({});
  }
};

// Unified DB object that delegates based on activeDb
const db = {
  init: initDb,
  get isMongo() { return activeDb === 'mongo'; },
  events: {
    find: (q) => (activeDb === 'mongo' ? mongoEvents.find(q) : store.events.find(q)),
    findById: (id) => (activeDb === 'mongo' ? mongoEvents.findById(id) : store.events.findById(id)),
    create: (d) => (activeDb === 'mongo' ? mongoEvents.create(d) : store.events.create(d)),
    findByIdAndUpdate: (id, u) => (activeDb === 'mongo' ? mongoEvents.findByIdAndUpdate(id, u) : store.events.findByIdAndUpdate(id, u)),
    findByIdAndDelete: (id) => (activeDb === 'mongo' ? mongoEvents.findByIdAndDelete(id) : store.events.findByIdAndDelete(id)),
    clearAll: () => (activeDb === 'mongo' ? Event.deleteMany({}) : store.events.clearAll())
  },
  registrations: {
    find: (q) => (activeDb === 'mongo' ? mongoRegistrations.find(q) : store.registrations.find(q)),
    findOne: (f) => (activeDb === 'mongo' ? mongoRegistrations.findOne(f) : store.registrations.findOne(f)),
    count: (f) => (activeDb === 'mongo' ? mongoRegistrations.count(f) : store.registrations.count(f)),
    create: (d) => (activeDb === 'mongo' ? mongoRegistrations.create(d) : store.registrations.create(d)),
    deleteMany: (f) => (activeDb === 'mongo' ? mongoRegistrations.deleteMany(f) : store.registrations.deleteMany(f)),
    clearAll: () => (activeDb === 'mongo' ? Registration.deleteMany({}) : store.registrations.clearAll())
  },
  winners: {
    find: (q) => (activeDb === 'mongo' ? mongoWinners.find(q) : store.winners.find(q)),
    findById: (id) => (activeDb === 'mongo' ? mongoWinners.findById(id) : store.winners.findById(id)),
    create: (d) => (activeDb === 'mongo' ? mongoWinners.create(d) : store.winners.create(d)),
    findByIdAndUpdate: (id, u) => (activeDb === 'mongo' ? mongoWinners.findByIdAndUpdate(id, u) : store.winners.findByIdAndUpdate(id, u)),
    findByIdAndDelete: (id) => (activeDb === 'mongo' ? mongoWinners.findByIdAndDelete(id) : store.winners.findByIdAndDelete(id)),
    clearAll: () => (activeDb === 'mongo' ? mongoWinners.clearAll() : store.winners.clearAll())
  },
  admins: {
    findOne: (f) => (activeDb === 'mongo' ? mongoAdmins.findOne(f) : store.admins.findOne(f)),
    create: (d) => (activeDb === 'mongo' ? mongoAdmins.create(d) : store.admins.create(d)),
    clearAll: () => (activeDb === 'mongo' ? Admin.deleteMany({}) : store.admins.clearAll())
  }
};

module.exports = db;
