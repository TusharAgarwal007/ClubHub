async function runTests() {
  console.log('--- Commencing Automated API Verification ---');
  const base = 'http://localhost:5000/api';

  // 1. Health check
  console.log('1. Testing /api/health...');
  const healthRes = await fetch(`${base}/health`);
  const health = await healthRes.json();
  console.log('Health status:', health.status, '| DB:', health.databaseType);
  if (health.status !== 'ok') throw new Error('Health check failed');

  // 2. Events list & Categories check
  console.log('\n2. Testing GET /api/events...');
  const eventsRes = await fetch(`${base}/events`);
  const eventsData = await eventsRes.json();
  console.log(`Retrieved ${eventsData.count} events.`);
  if (!eventsData.success || eventsData.count < 8) throw new Error('Events fetch failed or insufficient events');

  const validCategories = new Set(['Workshop', 'Competition', 'Seminar', 'Cultural', 'Sports']);
  const invalidCats = eventsData.events.filter(e => !validCategories.has(e.category));
  if (invalidCats.length > 0) throw new Error(`Invalid categories found: ${invalidCats.map(e => e.category).join(', ')}`);

  const testEvent = eventsData.events[0];
  console.log(`Sample event: "${testEvent.title}" (Category: ${testEvent.category}, Department: ${testEvent.department}, Featured: ${testEvent.isFeatured})`);

  // 3. Admin Login
  console.log('\n3. Testing POST /api/auth/login...');
  const loginRes = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@clubhub.com', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  if (!loginData.success || !loginData.token) throw new Error('Admin login failed: ' + JSON.stringify(loginData));
  console.log('Admin login succeeded! Token generated. User:', loginData.user.name);
  const token = loginData.token;

  // 4. Student Registration
  console.log('\n4. Testing POST /api/registrations (New student)...');
  const testRegPayload = {
    eventId: testEvent._id || testEvent.id,
    fullName: 'Test Candidate',
    email: `candidate_${Date.now()}@university.edu`,
    collegeName: 'National Institute of Technology',
    studentDepartment: 'Computer Science',
    yearOfStudy: '2nd Year',
    phoneNumber: '9876501234'
  };
  const regRes = await fetch(`${base}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testRegPayload)
  });
  const regData = await regRes.json();
  if (!regData.success || !regData.registration.ticketId) throw new Error('Registration failed: ' + JSON.stringify(regData));
  console.log('Registration confirmed! Generated Ticket ID:', regData.registration.ticketId);

  // 5. Duplicate Registration Check
  console.log('\n5. Testing Duplicate Registration Prevention...');
  const dupRes = await fetch(`${base}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testRegPayload)
  });
  const dupData = await dupRes.json();
  if (dupRes.status === 409) {
    console.log('Duplicate check passed! Status: 409 Conflict. Message:', dupData.message);
  } else {
    throw new Error(`Expected 409 status for duplicate registration, but received ${dupRes.status}`);
  }

  // 6. Admin Analytics Stats (including totalWinners)
  console.log('\n6. Testing GET /api/admin/stats...');
  const statsRes = await fetch(`${base}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const statsData = await statsRes.json();
  if (!statsData.success) throw new Error('Stats endpoint failed');
  console.log('Stats KPI: Total Events:', statsData.stats.totalEvents, '| Total Registrations:', statsData.stats.totalRegistrations, '| Total Winners:', statsData.stats.totalWinners);
  if (statsData.stats.totalWinners === undefined) throw new Error('totalWinners missing from stats response');

  // 7. Winners Public API & Filtering
  console.log('\n7. Testing GET /api/winners...');
  const winnersRes = await fetch(`${base}/winners`);
  const winnersData = await winnersRes.json();
  if (!winnersData.success || !Array.isArray(winnersData.winners)) throw new Error('Winners fetch failed');
  console.log(`Retrieved ${winnersData.count} winners. Top winner: ${winnersData.winners[0]?.name}`);

  // Test category filter on winners
  const compWinnersRes = await fetch(`${base}/winners?category=Competition`);
  const compWinnersData = await compWinnersRes.json();
  console.log(`Retrieved ${compWinnersData.count} competition winners.`);

  // 8. Admin Registrations List & Filter
  console.log('\n8. Testing GET /api/registrations...');
  const adminRegsRes = await fetch(`${base}/registrations?limit=5`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const adminRegsData = await adminRegsRes.json();
  if (!adminRegsData.success) throw new Error('Admin registrations endpoint failed');
  console.log(`Retrieved page ${adminRegsData.pagination.page} of ${adminRegsData.pagination.totalPages} (${adminRegsData.pagination.totalCount} total records)`);

  // 9. Admin Export CSV
  console.log('\n9. Testing GET /api/registrations/export...');
  const csvRes = await fetch(`${base}/registrations/export`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const csvText = await csvRes.text();
  if (!csvText.includes('Ticket ID')) throw new Error('CSV export invalid header: ' + csvText.substring(0, 100));
  console.log('CSV Export valid! Sample header and first line:');
  console.log(csvText.split('\r\n').slice(0, 2).join('\n'));

  // 10. Admin Event CRUD (Create, Update, Delete)
  console.log('\n10. Testing Admin Event CRUD cycle...');
  // Create
  const createRes = await fetch(`${base}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Temporary Verification Competition',
      category: 'Competition',
      department: 'Computer Science',
      description: 'Test description for verification',
      date: '2026-12-31',
      time: '10:00 AM - 05:00 PM',
      venue: 'Verification Hall',
      bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      maxSeats: 50,
      isFeatured: false
    })
  });
  const createData = await createRes.json();
  if (!createData.success) throw new Error('Admin create event failed: ' + JSON.stringify(createData));
  const newEventId = createData.event._id || createData.event.id;
  console.log('Created test event with ID:', newEventId);

  // Update
  const updateRes = await fetch(`${base}/events/${newEventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title: 'Updated Verification Competition' })
  });
  const updateData = await updateRes.json();
  if (!updateData.success || updateData.event.title !== 'Updated Verification Competition') {
    throw new Error('Admin update event failed');
  }
  console.log('Updated test event title successfully.');

  // Delete
  const deleteRes = await fetch(`${base}/events/${newEventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const deleteData = await deleteRes.json();
  if (!deleteData.success) throw new Error('Admin delete event failed');
  console.log('Deleted test event successfully. Cascade count:', deleteData.deletedRegistrationsCount);

  // 11. Admin Winners CRUD (Create, Update, Delete)
  console.log('\n11. Testing Admin Winners CRUD cycle...');
  const createWinRes = await fetch(`${base}/winners`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Verification Winner',
      teamName: 'Test Team',
      position: 1,
      eventName: 'CodeSprint 2026',
      category: 'Competition',
      department: 'Computer Science',
      year: '3rd Year',
      prize: '₹10,000 + Certificate'
    })
  });
  const createWinData = await createWinRes.json();
  if (!createWinData.success || !createWinData.winner) throw new Error('Create winner failed: ' + JSON.stringify(createWinData));
  const newWinId = createWinData.winner._id || createWinData.winner.id;
  console.log('Created test winner with ID:', newWinId);

  const updateWinRes = await fetch(`${base}/winners/${newWinId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ prize: '₹12,000 + Gold Medal' })
  });
  const updateWinData = await updateWinRes.json();
  if (!updateWinData.success || updateWinData.winner.prize !== '₹12,000 + Gold Medal') {
    throw new Error('Update winner failed');
  }
  console.log('Updated test winner prize successfully.');

  const deleteWinRes = await fetch(`${base}/winners/${newWinId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const deleteWinData = await deleteWinRes.json();
  if (!deleteWinData.success) throw new Error('Delete winner failed');
  console.log('Deleted test winner successfully.');

  console.log('\n===============================================');
  console.log('🎉 ALL AUTOMATED API TESTS PASSED SUCCESSFULLY!');
  console.log('===============================================');
}

runTests().catch(err => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
