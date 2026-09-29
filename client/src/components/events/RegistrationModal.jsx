import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../../api/client';
import Modal from '../common/Modal';
import { DEPARTMENTS } from '../../constants';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react';

export default function RegistrationModal({ isOpen, onClose, event, onRegisteredSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    collegeName: '',
    studentDepartment: 'Computer Science',
    yearOfStudy: '1st Year',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successTicket, setSuccessTicket] = useState(null);

  if (!event) return null;

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.collegeName.trim()) {
      errs.collegeName = 'College name is required.';
    }

    const phoneClean = formData.phoneNumber.replace(/\D/g, '');
    if (!formData.phoneNumber.trim() || phoneClean.length < 10) {
      errs.phoneNumber = 'Please enter a valid 10-digit mobile number.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');

    try {
      const response = await api.registerForEvent({
        eventId: event._id || event.id,
        ...formData
      });

      if (response.success && response.registration) {
        setSuccessTicket(response.registration);
        
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas not supported
        }

        if (onRegisteredSuccess) {
          onRegisteredSuccess(response.registration);
        }
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSuccessTicket(null);
    setFormData({
      fullName: '',
      email: '',
      collegeName: '',
      studentDepartment: 'Computer Science',
      yearOfStudy: '1st Year',
      phoneNumber: ''
    });
    setErrors({});
    setServerError('');
    onClose();
  };

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={successTicket ? "Registration Confirmed!" : `Register for ${event.title}`}
      maxWidth="max-w-xl"
    >
      {successTicket ? (
        /* Success Screen with Ticket Card */
        <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              You're All Set! 🎉
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Your registration for <strong className="text-slate-900 dark:text-slate-200">{event.title}</strong> is verified.
            </p>
          </div>

          {/* Ticket pass mockup */}
          <div className="relative rounded-2xl border-2 border-dashed border-brand-300 dark:border-brand-800 bg-gradient-to-br from-brand-50/60 to-accent-50/40 dark:from-slate-800/80 dark:to-slate-900 p-5 text-left shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-brand-200 dark:border-brand-900/60">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                  Official Entry Pass
                </span>
              </div>
              <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-brand-200 dark:border-brand-900">
                {successTicket.ticketId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Attendee Name</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{successTicket.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Year & College</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate block">
                  {successTicket.yearOfStudy}, {successTicket.collegeName}
                </span>
                {successTicket.studentDepartment && (
                  <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold block truncate">
                    Dept: {successTicket.studentDepartment}
                  </span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Date & Time</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{formattedDate}</span>
                <span className="text-slate-500 block text-[11px]">{event.time}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Venue</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{event.venue}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-brand-200 dark:border-brand-900/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Show this ticket at campus registration desk</span>
              <span className="text-brand-600 dark:text-brand-400 font-bold">ClubHub Verified ✓</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleModalClose}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 transition-all"
            >
              Done & Explore More Events
            </button>
          </div>
        </div>
      ) : (
        /* Form view */
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Quick Event Summary Strip */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <img
              src={event.bannerImage}
              alt=""
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 text-sm">
                {event.title}
              </span>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-500" />
                  {formattedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 truncate max-w-[150px]">
                  <MapPin className="w-3 h-3 text-accent-500" />
                  {event.venue}
                </span>
              </div>
            </div>
          </div>

          {/* Server error alert */}
          {serverError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{serverError}</div>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-950 border ${
                errors.fullName ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-300 dark:border-slate-700'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
            />
            {errors.fullName && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.fullName}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@college.edu"
                className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-950 border ${
                  errors.email ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="10-digit mobile"
                maxLength={14}
                className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-950 border ${
                  errors.phoneNumber ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
              />
              {errors.phoneNumber && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.phoneNumber}</p>}
            </div>
          </div>

          {/* College Name & Year of Study */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                College / University <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="e.g. Stanford / IIT / NSUT"
                className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-950 border ${
                  errors.collegeName ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
              />
              {errors.collegeName && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.collegeName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Year of Study <span className="text-rose-500">*</span>
              </label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Other">Postgraduate / Other</option>
              </select>
            </div>
          </div>

          {/* Student Department / Branch */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Student Department / Branch <span className="text-rose-500">*</span>
            </label>
            <select
              name="studentDepartment"
              value={formData.studentDepartment}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
              <option value="Other">Other Branch / Interdisciplinary</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-700 hover:via-indigo-700 hover:to-accent-700 shadow-md shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Confirm Registration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
