const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('clubhub_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (data && data.message) || response.statusText || 'An error occurred';
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Public Events
  async getEvents(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.sort) query.append('sort', params.sort);
    
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/events${qs}`);
  },

  async getEventById(id) {
    return request(`/events/${id}`);
  },

  // Public Registration
  async registerForEvent(registrationData) {
    return request('/registrations', {
      method: 'POST',
      body: JSON.stringify(registrationData)
    });
  },

  // Admin Auth
  async loginAdmin(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async getAdminMe() {
    return request('/auth/me');
  },

  // Admin Events
  async createEvent(eventData) {
    return request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  },

  async updateEvent(id, eventData) {
    return request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    });
  },

  async deleteEvent(id) {
    return request(`/events/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Registrations
  async getRegistrations(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.eventId && params.eventId !== 'All') query.append('eventId', params.eventId);
    if (params.yearOfStudy && params.yearOfStudy !== 'All') query.append('yearOfStudy', params.yearOfStudy);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/registrations${qs}`);
  },

  getExportCsvUrl(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.eventId && params.eventId !== 'All') query.append('eventId', params.eventId);
    if (params.yearOfStudy && params.yearOfStudy !== 'All') query.append('yearOfStudy', params.yearOfStudy);
    return `${API_BASE}/registrations/export?${query.toString()}`;
  },

  // Admin Stats
  async getAdminStats() {
    return request('/admin/stats');
  },

  // Winners API
  async getWinners(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.department && params.department !== 'All') query.append('department', params.department);
    if (params.year && params.year !== 'All') query.append('year', params.year);
    if (params.limit) query.append('limit', params.limit);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/winners${qs}`);
  },

  async createWinner(winnerData) {
    return request('/winners', {
      method: 'POST',
      body: JSON.stringify(winnerData)
    });
  },

  async updateWinner(id, winnerData) {
    return request(`/winners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(winnerData)
    });
  },

  async deleteWinner(id) {
    return request(`/winners/${id}`, {
      method: 'DELETE'
    });
  }
};
