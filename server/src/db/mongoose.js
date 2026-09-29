const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  department: { type: String, default: 'All Departments' },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  bannerImage: { type: String, default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80' },
  maxSeats: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  organizer: { type: String, default: 'ClubHub Council' },
  eligibility: { type: String, default: 'Open to all college students' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const RegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  collegeName: { type: String, required: true, trim: true },
  studentDepartment: { type: String, default: 'Computer Science' },
  yearOfStudy: { type: String, required: true },
  phoneNumber: { type: String, required: true, trim: true },
  ticketId: { type: String, required: true, unique: true },
  registeredAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const WinnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  teamName: { type: String, trim: true, default: '' },
  position: { type: Number, required: true },
  eventName: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  department: { type: String, default: 'Computer Science' },
  year: { type: String, default: '3rd Year' },
  prize: { type: String, required: true, trim: true },
  photo: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Administrator' },
  role: { type: String, default: 'admin' }
}, {
  timestamps: true
});

const EventModel = mongoose.models.Event || mongoose.model('Event', EventSchema);
const RegistrationModel = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
const WinnerModel = mongoose.models.Winner || mongoose.model('Winner', WinnerSchema);
const AdminModel = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

module.exports = {
  Event: EventModel,
  Registration: RegistrationModel,
  Winner: WinnerModel,
  Admin: AdminModel
};
