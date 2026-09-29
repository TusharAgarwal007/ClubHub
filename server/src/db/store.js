const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = (process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME)
  ? path.join('/tmp', 'clubhub_data')
  : path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'clubhub_data.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      events: [],
      registrations: [],
      admins: [],
      winners: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function readData() {
  ensureDataFile();
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (!parsed.winners) parsed.winners = [];

    // Automatic migration for removed categories and hackathon scrubbing
    let modified = false;
    if (parsed.events) {
      parsed.events.forEach(e => {
        if (e.category === 'Hackathon' || e.category === 'Tech') {
          e.category = 'Competition';
          modified = true;
        } else if (e.category === 'Social') {
          e.category = 'Seminar';
          modified = true;
        }

        if (e.title && e.title.includes('HackVerse')) {
          e.title = 'CodeSprint 2026: 36-Hour National Flagship Coding Competition';
          e.description = 'Join over 500 elite student developers, designers, and innovators for our premier annual coding competition. Build groundbreaking algorithmic, AI, and web solutions, pitch to top tech leaders, and compete for a ₹2,50,000 prize pool!';
          modified = true;
        }

        if (!e.department) {
          e.department = 'Computer Science';
          modified = true;
        }
      });
    }

    if (parsed.registrations) {
      parsed.registrations.forEach(r => {
        if (!r.studentDepartment) {
          r.studentDepartment = 'Computer Science';
          modified = true;
        }
      });
    }

    if (modified) {
      writeData(parsed);
    }

    return parsed;
  } catch (err) {
    console.error('Error reading data file:', err);
    return { events: [], registrations: [], admins: [], winners: [] };
  }
}

function writeData(data) {
  ensureDataFile();
  const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DATA_FILE);
}

const eventsRepo = {
  async find(query = {}) {
    const data = readData();
    let items = [...data.events];

    if (query.search) {
      const q = query.search.toLowerCase();
      items = items.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.venue && e.venue.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q)) ||
        (e.department && e.department.toLowerCase().includes(q))
      );
    }

    if (query.category && query.category !== 'All') {
      items = items.filter(e => e.category.toLowerCase() === query.category.toLowerCase());
    }

    if (query.department && query.department !== 'All') {
      items = items.filter(e => e.department && e.department.toLowerCase() === query.department.toLowerCase());
    }

    const todayStr = new Date().toISOString().split('T')[0];

    if (query.status === 'upcoming') {
      items = items.filter(e => e.date >= todayStr);
    } else if (query.status === 'past') {
      items = items.filter(e => e.date < todayStr);
    } else if (query.status === 'this-week') {
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];
      items = items.filter(e => e.date >= todayStr && e.date <= nextWeekStr);
    }

    if (query.sort === 'date-asc') {
      items.sort((a, b) => a.date.localeCompare(b.date));
    } else if (query.sort === 'date-desc') {
      items.sort((a, b) => b.date.localeCompare(a.date));
    } else if (query.sort === 'popular') {
      const regCounts = {};
      data.registrations.forEach(r => {
        regCounts[r.eventId] = (regCounts[r.eventId] || 0) + 1;
      });
      items.sort((a, b) => (regCounts[b._id] || 0) - (regCounts[a._id] || 0));
    } else {
      // Default: featured first, then date ascending
      items.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.date.localeCompare(b.date);
      });
    }

    // Attach registration count to each event
    const regCounts = {};
    data.registrations.forEach(r => {
      regCounts[r.eventId] = (regCounts[r.eventId] || 0) + 1;
    });

    return items.map(e => ({
      ...e,
      registrationCount: regCounts[e._id] || 0
    }));
  },

  async findById(id) {
    const data = readData();
    const event = data.events.find(e => String(e._id) === String(id));
    if (!event) return null;

    const count = data.registrations.filter(r => String(r.eventId) === String(id)).length;
    return {
      ...event,
      registrationCount: count
    };
  },

  async create(eventData) {
    const data = readData();
    const newId = crypto.randomUUID();

    if (eventData.isFeatured) {
      data.events.forEach(e => { e.isFeatured = false; });
    }

    const newEvent = {
      _id: newId,
      id: newId,
      title: eventData.title.trim(),
      category: eventData.category,
      department: eventData.department || 'All Departments',
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      venue: eventData.venue,
      bannerImage: eventData.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
      maxSeats: Number(eventData.maxSeats) || 0,
      isFeatured: Boolean(eventData.isFeatured),
      organizer: eventData.organizer || 'ClubHub Council',
      eligibility: eventData.eligibility || 'Open to all college students',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.events.push(newEvent);
    writeData(data);
    return { ...newEvent, registrationCount: 0 };
  },

  async findByIdAndUpdate(id, updates) {
    const data = readData();
    const index = data.events.findIndex(e => String(e._id) === String(id));
    if (index === -1) return null;

    if (updates.isFeatured) {
      data.events.forEach(e => {
        if (String(e._id) !== String(id)) {
          e.isFeatured = false;
        }
      });
    }

    const updatedEvent = {
      ...data.events[index],
      ...updates,
      _id: data.events[index]._id,
      id: data.events[index]._id,
      maxSeats: updates.maxSeats !== undefined ? Number(updates.maxSeats) : data.events[index].maxSeats,
      isFeatured: updates.isFeatured !== undefined ? Boolean(updates.isFeatured) : data.events[index].isFeatured,
      updatedAt: new Date().toISOString()
    };

    data.events[index] = updatedEvent;
    writeData(data);

    const count = data.registrations.filter(r => String(r.eventId) === String(id)).length;
    return { ...updatedEvent, registrationCount: count };
  },

  async findByIdAndDelete(id) {
    const data = readData();
    const index = data.events.findIndex(e => String(e._id) === String(id));
    if (index === -1) return null;

    const [deletedEvent] = data.events.splice(index, 1);
    const beforeCount = data.registrations.length;
    data.registrations = data.registrations.filter(r => String(r.eventId) !== String(id));
    const deletedRegistrationsCount = beforeCount - data.registrations.length;

    writeData(data);
    return { event: deletedEvent, deletedRegistrationsCount };
  },

  async clearAll() {
    const data = readData();
    data.events = [];
    writeData(data);
  }
};

const registrationsRepo = {
  async find(query = {}) {
    const data = readData();
    let items = [...data.registrations];

    if (query.eventId) {
      items = items.filter(r => String(r.eventId) === String(query.eventId));
    }

    if (query.yearOfStudy && query.yearOfStudy !== 'All') {
      items = items.filter(r => r.yearOfStudy === query.yearOfStudy);
    }

    if (query.department && query.department !== 'All') {
      items = items.filter(r => r.studentDepartment === query.department);
    }

    if (query.search) {
      const q = query.search.toLowerCase();
      items = items.filter(r =>
        (r.fullName && r.fullName.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.collegeName && r.collegeName.toLowerCase().includes(q)) ||
        (r.studentDepartment && r.studentDepartment.toLowerCase().includes(q)) ||
        (r.phoneNumber && r.phoneNumber.includes(q)) ||
        (r.ticketId && r.ticketId.toLowerCase().includes(q))
      );
    }

    items.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

    const eventMap = {};
    data.events.forEach(e => { eventMap[String(e._id)] = e; });

    return items.map(r => ({
      ...r,
      event: eventMap[String(r.eventId)] || { title: 'Unknown Event', date: '', venue: '', department: 'All Departments' }
    }));
  },

  async findOne(filter = {}) {
    const data = readData();
    return data.registrations.find(r => {
      let match = true;
      if (filter.eventId && String(r.eventId) !== String(filter.eventId)) match = false;
      if (filter.email && r.email.toLowerCase() !== filter.email.toLowerCase()) match = false;
      return match;
    }) || null;
  },

  async count(filter = {}) {
    const data = readData();
    if (filter.eventId) {
      return data.registrations.filter(r => String(r.eventId) === String(filter.eventId)).length;
    }
    return data.registrations.length;
  },

  async create(regData) {
    const data = readData();
    const newId = crypto.randomUUID();
    const event = data.events.find(e => String(e._id) === String(regData.eventId));

    const prefix = event ? event.title.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'EV') : 'CH';
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `CH-${prefix}-${randSuffix}`;

    const newReg = {
      _id: newId,
      id: newId,
      eventId: regData.eventId,
      fullName: regData.fullName.trim(),
      email: regData.email.trim().toLowerCase(),
      collegeName: regData.collegeName.trim(),
      studentDepartment: regData.studentDepartment || 'Computer Science',
      yearOfStudy: regData.yearOfStudy,
      phoneNumber: regData.phoneNumber.trim(),
      ticketId,
      registeredAt: regData.registeredAt || new Date().toISOString()
    };

    data.registrations.push(newReg);
    writeData(data);

    return {
      ...newReg,
      event: event || { title: 'Unknown Event' }
    };
  },

  async deleteMany(filter = {}) {
    const data = readData();
    if (filter.eventId) {
      const before = data.registrations.length;
      data.registrations = data.registrations.filter(r => String(r.eventId) !== String(filter.eventId));
      writeData(data);
      return { deletedCount: before - data.registrations.length };
    }
    return { deletedCount: 0 };
  },

  async clearAll() {
    const data = readData();
    data.registrations = [];
    writeData(data);
  }
};

const winnersRepo = {
  async find(query = {}) {
    const data = readData();
    let items = [...(data.winners || [])];

    if (query.search) {
      const q = query.search.toLowerCase();
      items = items.filter(w =>
        (w.name && w.name.toLowerCase().includes(q)) ||
        (w.teamName && w.teamName.toLowerCase().includes(q)) ||
        (w.eventName && w.eventName.toLowerCase().includes(q)) ||
        (w.prize && w.prize.toLowerCase().includes(q)) ||
        (w.department && w.department.toLowerCase().includes(q))
      );
    }

    if (query.category && query.category !== 'All') {
      items = items.filter(w => w.category && w.category.toLowerCase() === query.category.toLowerCase());
    }

    if (query.department && query.department !== 'All') {
      items = items.filter(w => w.department && w.department.toLowerCase() === query.department.toLowerCase());
    }

    if (query.year && query.year !== 'All') {
      items = items.filter(w => w.year === query.year);
    }

    // Sort by createdAt or position
    items.sort((a, b) => (a.position - b.position));

    if (query.limit) {
      items = items.slice(0, Number(query.limit));
    }

    return items;
  },

  async findById(id) {
    const data = readData();
    return (data.winners || []).find(w => String(w._id) === String(id) || String(w.id) === String(id)) || null;
  },

  async create(winnerData) {
    const data = readData();
    if (!data.winners) data.winners = [];
    const newId = crypto.randomUUID();

    const newWinner = {
      _id: newId,
      id: newId,
      name: winnerData.name.trim(),
      teamName: winnerData.teamName ? winnerData.teamName.trim() : '',
      position: Number(winnerData.position) || 1,
      eventName: winnerData.eventName ? winnerData.eventName.trim() : '',
      category: winnerData.category || 'Competition',
      department: winnerData.department || 'Computer Science',
      year: winnerData.year || '3rd Year',
      prize: winnerData.prize ? winnerData.prize.trim() : '',
      photo: winnerData.photo || '',
      createdAt: new Date().toISOString()
    };

    data.winners.push(newWinner);
    writeData(data);
    return newWinner;
  },

  async findByIdAndUpdate(id, updates) {
    const data = readData();
    if (!data.winners) data.winners = [];
    const index = data.winners.findIndex(w => String(w._id) === String(id) || String(w.id) === String(id));
    if (index === -1) return null;

    const updated = {
      ...data.winners[index],
      ...updates,
      _id: data.winners[index]._id,
      id: data.winners[index]._id,
      position: updates.position !== undefined ? Number(updates.position) : data.winners[index].position,
      updatedAt: new Date().toISOString()
    };

    data.winners[index] = updated;
    writeData(data);
    return updated;
  },

  async findByIdAndDelete(id) {
    const data = readData();
    if (!data.winners) data.winners = [];
    const index = data.winners.findIndex(w => String(w._id) === String(id) || String(w.id) === String(id));
    if (index === -1) return null;

    const [deleted] = data.winners.splice(index, 1);
    writeData(data);
    return deleted;
  },

  async clearAll() {
    const data = readData();
    data.winners = [];
    writeData(data);
  }
};

const adminsRepo = {
  async findOne(filter = {}) {
    const data = readData();
    return data.admins.find(a => {
      if (filter.email && a.email.toLowerCase() === filter.email.toLowerCase()) return true;
      return false;
    }) || null;
  },

  async create(adminData) {
    const data = readData();
    const newId = crypto.randomUUID();
    const newAdmin = {
      _id: newId,
      id: newId,
      email: adminData.email.toLowerCase().trim(),
      password: adminData.password,
      name: adminData.name || 'Admin',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    data.admins.push(newAdmin);
    writeData(data);
    return newAdmin;
  },

  async clearAll() {
    const data = readData();
    data.admins = [];
    writeData(data);
  }
};

module.exports = {
  events: eventsRepo,
  registrations: registrationsRepo,
  winners: winnersRepo,
  admins: adminsRepo,
  readData,
  writeData
};
