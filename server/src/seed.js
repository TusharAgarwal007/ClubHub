const bcrypt = require('bcryptjs');
const config = require('./config');
const db = require('./db');
const { CATEGORIES, DEPARTMENTS } = require('./constants');

async function seed() {
  console.log('--- Starting ClubHub Database Seeding ---');
  await db.init();

  // Clear existing data
  console.log('Clearing old data...');
  await db.events.clearAll();
  await db.registrations.clearAll();
  await db.winners.clearAll();
  await db.admins.clearAll();

  // 1. Create Admin
  const hashedPassword = await bcrypt.hash(config.ADMIN_PASSWORD, 10);
  await db.admins.create({
    email: config.ADMIN_EMAIL,
    password: hashedPassword,
    name: 'ClubHub Lead Administrator',
    role: 'admin'
  });
  console.log(`Created Admin user: ${config.ADMIN_EMAIL} (password: ${config.ADMIN_PASSWORD})`);

  // 2. Sample Events (Strictly 5 categories: Workshop, Competition, Seminar, Cultural, Sports)
  const sampleEvents = [
    {
      title: "CodeSprint 2026: 36-Hour National Flagship Coding Competition",
      category: "Competition",
      department: "Computer Science",
      description: "Join over 500 elite student developers, algorithm specialists, and innovators for our premier annual coding competition. Build groundbreaking algorithmic systems, pitch to top venture leads, and compete for a ₹2,50,000 prize pool and direct interview fast-tracks!",
      date: "2026-10-18",
      time: "09:00 AM - 09:00 PM (Next Day)",
      venue: "Main Auditorium & Innovation Lab, North Campus",
      bannerImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80",
      maxSeats: 250,
      isFeatured: true,
      organizer: "ClubHub Technical Chapter & Google DSC",
      eligibility: "Open to all enrolled college students (all years)"
    },
    {
      title: "RoboWars: Combat Robotics Championship",
      category: "Competition",
      department: "Mechanical Engineering",
      description: "High-octane custom combat robots clash in a battle of steel and electronics! Bring your 15kg or 30kg remote-controlled machines into the ballistic glass arena and battle for the ultimate campus mechanical trophy.",
      date: "2026-10-24",
      time: "11:00 AM - 05:00 PM",
      venue: "Outdoor Open Sports Complex",
      bannerImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80",
      maxSeats: 120,
      isFeatured: false,
      organizer: "Robotics & Automation Society",
      eligibility: "Teams of 2 to 4 students"
    },
    {
      title: "Rhythm & Beats: Inter-College Battle of the Bands",
      category: "Cultural",
      department: "Applied Sciences",
      description: "Experience the electrifying sound of top collegiate rock, fusion, and indie bands competing live on stage. Food trucks, dynamic lighting, and special guest artist performance.",
      date: "2026-10-30",
      time: "05:30 PM - 10:30 PM",
      venue: "Central Amphitheatre",
      bannerImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
      maxSeats: 600,
      isFeatured: false,
      organizer: "Music & Performing Arts Society",
      eligibility: "All students with valid College ID"
    },
    {
      title: "Cloud Native & DevOps Masterclass with Industry Engineers",
      category: "Workshop",
      department: "Information Technology",
      description: "Hands-on, deep-dive workshop into Docker containers, Kubernetes cluster management, CI/CD automated deployment pipelines, and cloud architecture patterns. Certificates provided to all attendees.",
      date: "2026-11-05",
      time: "02:00 PM - 06:00 PM",
      venue: "Computer Science Hall 302 & Virtual Stream",
      bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80",
      maxSeats: 80,
      isFeatured: false,
      organizer: "Cloud Computing Guild",
      eligibility: "Basic familiarity with Linux / Git recommended"
    },
    {
      title: "Campus Smash: Inter-Collegiate Esports Arena",
      category: "Sports",
      department: "Computer Science",
      description: "Compete in Valorant, FIFA 2026, and BGMI live tournament brackets. High-performance gaming stations, live casters, Twitch broadcast, and gaming gear giveaways.",
      date: "2026-11-12",
      time: "10:00 AM - 07:00 PM",
      venue: "Student Activity Center (SAC) Level 2",
      bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
      maxSeats: 160,
      isFeatured: false,
      organizer: "Campus Gaming & Esports League",
      eligibility: "Open to solo players and squads"
    },
    {
      title: "AI Frontiers: Generative AI & Autonomous Agent Systems",
      category: "Seminar",
      department: "Computer Science",
      description: "Keynote talks and panel discussions featuring AI research scientists, startup founders, and engineers discussing LLMs, multi-agent frameworks, and the future of human-AI collaboration.",
      date: "2026-11-18",
      time: "03:00 PM - 06:30 PM",
      venue: "Auditorium Hall B",
      bannerImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      maxSeats: 200,
      isFeatured: false,
      organizer: "Data Science & AI Research Club",
      eligibility: "Open to all branches and faculty"
    },
    {
      title: "Kavya & Kisse: Open Mic Poetry & Storytelling Night",
      category: "Cultural",
      department: "Management",
      description: "An intimate, candle-lit evening of spoken word poetry, acoustic melodies, and heartfelt personal stories. Grab a cup of warm tea, step up to the mic, or simply sit back and listen.",
      date: "2026-11-25",
      time: "06:00 PM - 09:00 PM",
      venue: "Campus Bamboo Garden & Gazebo",
      bannerImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
      maxSeats: 100,
      isFeatured: false,
      organizer: "Literary & Debating Society",
      eligibility: "Open to all performers and attendees"
    },
    {
      title: "Urban Plantation & Eco-Sustainability Drive",
      category: "Seminar",
      department: "Civil Engineering",
      description: "Join hands to plant 500 saplings across campus grounds, audit plastic waste, and create compost pits. Refreshments, eco-friendly volunteer certificates, and ClubHub green badges provided.",
      date: "2026-12-02",
      time: "07:30 AM - 11:30 AM",
      venue: "East Gate Quadrangle",
      bannerImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80",
      maxSeats: 150,
      isFeatured: false,
      organizer: "Social Responsibility & Eco-Cell",
      eligibility: "Open to all students and staff"
    },
    {
      title: "DesignCraft: UI/UX Design Sprint & Portfolio Critique",
      category: "Workshop",
      department: "Information Technology",
      description: "Master modern Figma systems, interactive micro-interactions, responsive design principles, and review real design case studies with senior product designers from leading tech firms.",
      date: "2026-12-08",
      time: "01:00 PM - 05:00 PM",
      venue: "Design Studio Lab, Building 4",
      bannerImage: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80",
      maxSeats: 60,
      isFeatured: false,
      organizer: "Creative Designers Guild",
      eligibility: "Bring a laptop with Figma installed"
    },
    {
      title: "Annual Speed Chess Championship 2026",
      category: "Sports",
      department: "Electronics & Communication",
      description: "5-minute blitz and 15-minute rapid chess tournament following FIDE swiss pairing rules. Trophies, cash rewards, and official collegiate chess ratings awarded.",
      date: "2026-08-15",
      time: "09:30 AM - 04:30 PM",
      venue: "Recreation & Chess Lounge",
      bannerImage: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200&auto=format&fit=crop&q=80",
      maxSeats: 64,
      isFeatured: false,
      organizer: "Chess & Mind Sports Club",
      eligibility: "All skill levels welcome"
    }
  ];

  console.log(`Seeding ${sampleEvents.length} events...`);
  const createdEvents = [];
  for (const ev of sampleEvents) {
    const created = await db.events.create(ev);
    createdEvents.push(created);
  }

  // 3. Seed Winners (14 Indian students across events, positions, and departments)
  const sampleWinners = [
    {
      name: "Aarav Sharma",
      teamName: "Algorhythm Squad",
      position: 1,
      eventName: "CodeSprint 2026: National Coding Championship",
      category: "Competition",
      department: "Computer Science",
      year: "3rd Year",
      prize: "₹25,000 + Gold Trophy",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Priya Nair",
      teamName: "CodeCrafters",
      position: 2,
      eventName: "CodeSprint 2026: National Coding Championship",
      category: "Competition",
      department: "Information Technology",
      year: "2nd Year",
      prize: "₹15,000 + Silver Medal",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Rohan Verma",
      teamName: "Binary Beasts",
      position: 3,
      eventName: "CodeSprint 2026: National Coding Championship",
      category: "Competition",
      department: "Electronics & Communication",
      year: "4th Year",
      prize: "₹10,000 + Bronze Medal",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Ananya Iyer",
      teamName: "",
      position: 1,
      eventName: "National Collegiate Debate Championship",
      category: "Competition",
      department: "Management",
      year: "3rd Year",
      prize: "₹12,000 + Champion Plaque",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Kabir Mehta",
      teamName: "Acoustic Horizon",
      position: 1,
      eventName: "Rhythm & Beats: Inter-College Battle of the Bands",
      category: "Cultural",
      department: "Applied Sciences",
      year: "2nd Year",
      prize: "₹20,000 + Studio Recording Deal",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Diya Kapoor",
      teamName: "Echoes of Soul",
      position: 2,
      eventName: "Rhythm & Beats: Inter-College Battle of the Bands",
      category: "Cultural",
      department: "Computer Science",
      year: "1st Year",
      prize: "₹10,000 + Pro Audio Gear",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Arjun Reddy",
      teamName: "Titan Mech Team",
      position: 1,
      eventName: "RoboWars: Combat Robotics Championship",
      category: "Competition",
      department: "Mechanical Engineering",
      year: "4th Year",
      prize: "₹30,000 + Heavyweight Trophy",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Sanya Gupta",
      teamName: "Spark Dynamix",
      position: 2,
      eventName: "RoboWars: Combat Robotics Championship",
      category: "Competition",
      department: "Electronics & Communication",
      year: "3rd Year",
      prize: "₹18,000 + Silver Plaque",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Vikram Malhotra",
      teamName: "",
      position: 1,
      eventName: "Annual Speed Chess Championship 2026",
      category: "Sports",
      department: "Civil Engineering",
      year: "3rd Year",
      prize: "₹8,000 + FIDE Rated Board",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Tanvi Deshmukh",
      teamName: "",
      position: 2,
      eventName: "Annual Speed Chess Championship 2026",
      category: "Sports",
      department: "Information Technology",
      year: "2nd Year",
      prize: "₹5,000 + Silver Medal",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Aditya Sen",
      teamName: "Cloud Wizards",
      position: 1,
      eventName: "Cloud Native & DevOps Masterclass",
      category: "Workshop",
      department: "Computer Science",
      year: "4th Year",
      prize: "₹10,000 + Cloud Certification Voucher",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Rhea Banerjee",
      teamName: "Pixels & Prototypes",
      position: 1,
      eventName: "DesignCraft: UI/UX Design Sprint",
      category: "Workshop",
      department: "Information Technology",
      year: "2nd Year",
      prize: "₹10,000 + Annual Figma Pro License",
      photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Karan Patel",
      teamName: "",
      position: 1,
      eventName: "AI Frontiers Research Symposium",
      category: "Seminar",
      department: "Computer Science",
      year: "4th Year",
      prize: "₹15,000 + Best Paper Award",
      photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80"
    },
    {
      name: "Meera Joshi",
      teamName: "",
      position: 2,
      eventName: "AI Frontiers Research Symposium",
      category: "Seminar",
      department: "Electronics & Communication",
      year: "3rd Year",
      prize: "₹8,000 + Best Presentation Award",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
    }
  ];

  console.log(`Seeding ${sampleWinners.length} winners...`);
  for (const w of sampleWinners) {
    await db.winners.create(w);
  }

  // 4. Sample Registrations across events
  const colleges = [
    "Delhi Technological University",
    "IIT Delhi",
    "Netaji Subhas University of Technology",
    "BITS Pilani",
    "IIIT Hyderabad",
    "Vellore Institute of Technology",
    "NIT Trichy",
    "Hansraj College, DU"
  ];

  const studentDepartments = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Management",
    "Applied Sciences"
  ];

  const students = [
    { fullName: "Aarav Sharma", email: "aarav.sharma@example.com", phone: "9876543210", year: "3rd Year" },
    { fullName: "Priya Nair", email: "priya.nair@example.com", phone: "9823456781", year: "2nd Year" },
    { fullName: "Rohan Verma", email: "rohan.verma@example.com", phone: "9811223344", year: "4th Year" },
    { fullName: "Ananya Iyer", email: "ananya.iyer@example.com", phone: "9765432109", year: "1st Year" },
    { fullName: "Kabir Mehta", email: "kabir.mehta@example.com", phone: "9988776655", year: "3rd Year" },
    { fullName: "Diya Kapoor", email: "diya.kapoor@example.com", phone: "9834567890", year: "2nd Year" },
    { fullName: "Arjun Reddy", email: "arjun.reddy@example.com", phone: "9123456780", year: "4th Year" },
    { fullName: "Sanya Gupta", email: "sanya.gupta@example.com", phone: "9871122334", year: "1st Year" },
    { fullName: "Vikram Malhotra", email: "vikram.m@example.com", phone: "9911224455", year: "3rd Year" },
    { fullName: "Tanvi Deshmukh", email: "tanvi.d@example.com", phone: "9845123456", year: "2nd Year" },
    { fullName: "Aditya Sen", email: "aditya.sen@example.com", phone: "9867543211", year: "4th Year" },
    { fullName: "Rhea Banerjee", email: "rhea.b@example.com", phone: "9753124680", year: "1st Year" },
    { fullName: "Karan Patel", email: "karan.patel@example.com", phone: "9898765432", year: "3rd Year" },
    { fullName: "Meera Joshi", email: "meera.joshi@example.com", phone: "9819283746", year: "2nd Year" },
    { fullName: "Nikhil Kulkarni", email: "nikhil.k@example.com", phone: "9731245678", year: "4th Year" },
    { fullName: "Ishita Roy", email: "ishita.roy@example.com", phone: "9945123456", year: "1st Year" }
  ];

  console.log('Seeding sample registrations...');
  const flagshipEvent = createdEvents[0];
  const roboEvent = createdEvents[1];
  const bandEvent = createdEvents[2];
  const workshopEvent = createdEvents[3];
  const aiEvent = createdEvents[5];

  // Distribute students among events with realistic timestamps
  let regIndex = 0;
  for (const st of students) {
    const targetEvent = regIndex % 5 === 0 ? flagshipEvent :
                        regIndex % 5 === 1 ? roboEvent :
                        regIndex % 5 === 2 ? bandEvent :
                        regIndex % 5 === 3 ? workshopEvent : aiEvent;

    const college = colleges[regIndex % colleges.length];
    const dept = studentDepartments[regIndex % studentDepartments.length];

    let regDate = new Date();
    if (regIndex > 5) {
      regDate.setDate(regDate.getDate() - (regIndex % 7 + 1));
    }

    await db.registrations.create({
      eventId: targetEvent._id || targetEvent.id,
      fullName: st.fullName,
      email: st.email,
      collegeName: college,
      studentDepartment: dept,
      yearOfStudy: st.year,
      phoneNumber: st.phone,
      registeredAt: regDate.toISOString()
    });

    regIndex++;
  }

  console.log(`Seeded ${students.length} registrations across events.`);
  console.log('--- Database seeding completed successfully! ---');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed with error:', err);
  process.exit(1);
});
