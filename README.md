# 🎓 ClubHub — College Club Events Platform

A responsive, production-quality web application for discovering, managing, and registering for college club events, collegiate competitions, workshops, and celebrating student achievers. Designed in the vibrant, modern spirit of **Unstop.com**: featuring a clean card-based layout, bold indigo primary palette (`#4F46E5`), energetic orange/amber accents (`#F97316`), rounded pills, soft drop shadows, and smooth micro-interactions.

---

## 🌟 Key Highlights

### 1. Student / Public Experience (No Login Required)
- **Sticky Glassmorphism Navbar**: Responsive navigation with brand badge, dark/light mode toggle, Winners link, and mobile menu drawer.
- **Dynamic Home Page**:
  - Hero section with live stats badge, punchy headline, and dual CTAs ("Explore Events" & "Register Now").
  - **Featured Event Banner Card**: Prominently spotlights the event marked as "Featured" by the admin, complete with details and instant registration modal trigger.
  - **Upcoming Events Carousel/Grid**: Next upcoming events with capacity indicators and status pills.
  - **Our Winners Section**: Spotlights top student achievers with position badges (Gold, Silver, Bronze), awards, departments, and trophy highlights.
  - **Category Chips Row**: Filter shortcuts for the 5 standardized categories (`Competition`, `Workshop`, `Seminar`, `Cultural`, `Sports`).
  - **Stats Strip**: 50+ Events Hosted, 1,200+ Active Members, 15+ Campus Chapters, ₹5L+ in Prizes.
- **Hall of Fame / Winners Directory (`/winners`)**:
  - Top 3 **Podium Highlight** with gold crowns, silver medals, and bronze emblems.
  - Live search bar and comprehensive filters for Category, Department, and Academic Year.
  - Complete card grid celebrating competition winners and prize earners.
- **Events Directory (`/events`)**:
  - Live search bar with 300ms debouncing.
  - Comprehensive category filter pills, department filter dropdown, date status tabs (*All*, *Upcoming*, *This Week*, *Past Events*), and multi-criteria sorting (*Featured/Upcoming*, *Date Soonest*, *Date Latest*, *Most Popular*).
  - Responsive cards grid (1 col mobile, 2 tablet, 3 desktop).
  - Past events display a disabled "Event Ended" state.
  - Responsive empty state with a "Reset All Filters" action.
- **Event Details Modal / Page (`/events/:id`)**:
  - Full description, eligibility criteria, department, organizer society, venue, and live seat tracker.
  - Social share button (copies direct link to clipboard).
- **Frictionless Registration Flow**:
  - Modal form: Full Name, Email, College Name, Department, Year of Study (1st/2nd/3rd/4th/Other), 10-digit Phone Number.
  - Inline input validation with real-time error removal.
  - **Duplicate Prevention**: Strictly prevents a student from registering twice for the same event with the same email.
  - **Capacity Checks**: Automatically checks seat limits and blocks registration if the event is full or past.
  - **Success Screen & Ticket Pass**: Shows an animated official ticket pass with unique Ticket ID (e.g. `CH-COD-3457`), department, recap of event details, and celebratory confetti animation (`canvas-confetti`).

### 2. Admin Side (`/admin`)
- **Authentication**:
  - Secure JWT authentication (`POST /api/auth/login`).
  - Protected admin routes with route guard.
  - Convenient "Fill Demo Admin Credentials" button on login page.
- **Admin Dashboard (`/admin`)**:
  - 5 KPI summary cards: Total Events, Upcoming Events, Total Registrations, Total Winners, Registrations Today.
  - **Visual Analytics**:
    - Recharts Bar Chart: Registrations per event with custom tooltips.
    - Recharts Doughnut Chart: Student demographic breakdown by year of study.
  - Recent student registrations live stream widget.
- **Manage Events (`/admin/events`)**:
  - Full CRUD operations: Create, Edit, Delete events.
  - **Single-Featured Logic**: Toggling an event as "Featured" automatically unsets any prior featured event.
  - **Preset Image Gallery**: 1-click curated Unsplash high-resolution banners (Coding, Robotics, Music, Cloud, Esports, AI, Design, Chess).
  - **Cascade Deletion**: Confirmation modal with explicit warning that deleting an event also removes its associated registrations.
- **Manage Winners (`/admin/winners`)**:
  - Full CRUD table: Add, Edit, Delete hall of fame winners.
  - Modal form for winner details: Name, Team Name, Position (1/2/3), Event Name, Category, Department, Academic Year, Prize/Award, and Photo URL.
- **Student Registrations (`/admin/registrations`)**:
  - Table showing Ticket ID, Student Name, Email, Phone, College, Department, Year, Event, and Registration Date.
  - Multi-parameter live search (name, email, college, department, ticket).
  - Dropdown filters for Event and Year of Study.
  - Server-side / client pagination controls.
  - **CSV Export**: One-click download of the currently filtered student list as a clean `.csv` file.

---

## 🛠️ Tech Stack

- **Frontend**:
  - [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [React Router DOM v6](https://reactrouter.com/)
  - [Lucide Icons](https://lucide.dev/)
  - [Recharts](https://recharts.org/)
  - [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend**:
  - [Node.js](https://nodejs.org/) (Express 4)
  - [Mongoose](https://mongoosejs.com/) (MongoDB)
  - **Zero-Setup Embedded Storage Adapter**: Automatically attempts connection to MongoDB; if MongoDB is not running locally, seamlessly falls back to persistent storage (`server/data/clubhub_data.json`) with an identical query API.
  - [JSON Web Token (JWT)](https://jwt.io/) & [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
  - [CORS](https://github.com/expressjs/cors) & [Dotenv](https://github.com/motdotla/dotenv)

---

## 📁 Project Structure

```
codechef/
├── client/                     # Frontend React (Vite) Application
│   ├── index.html              # HTML entry with Plus Jakarta Sans
│   ├── vite.config.js          # Vite configuration with API proxy (/api -> :5000)
│   ├── tailwind.config.js      # Custom theme colors (Indigo brand + Orange accent)
│   ├── src/
│   │   ├── main.jsx            # React root
│   │   ├── App.jsx             # Routes & protected route guards
│   │   ├── index.css           # Tailwind base styles & glassmorphism
│   │   ├── api/
│   │   │   └── client.js       # Centralized REST API client
│   │   ├── constants/
│   │   │   └── index.js        # 5 Valid Categories & 7 Standard Departments
│   │   ├── data/
│   │   │   └── dummyWinners.js # 14 Achievers Fallback Data
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Admin JWT session management
│   │   │   └── ThemeContext.jsx# Dark/light theme state & persistence
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, EventCard, WinnerCard, SearchBar, FilterBar, Modal, Toast, DataTable
│   │   │   ├── events/         # RegistrationModal, EventDetailsModal
│   │   │   ├── winners/        # WinnersSection, PodiumHighlight
│   │   │   └── admin/          # AdminLayout, StatCard, EventFormModal, WinnerFormModal
│   │   └── pages/
│   │       ├── HomePage.jsx
│   │       ├── EventsPage.jsx
│   │       ├── EventDetailsPage.jsx
│   │       ├── WinnersPage.jsx
│   │       ├── AdminLoginPage.jsx
│   │       ├── AdminDashboardPage.jsx
│   │       ├── AdminEventsPage.jsx
│   │       ├── AdminWinnersPage.jsx
│   │       └── AdminRegistrationsPage.jsx
│   └── package.json
│
├── server/                     # Backend Express API Server
│   ├── .env                    # Active environment variables
│   ├── .env.example            # Template environment variables
│   ├── src/
│   │   ├── index.js            # Express app entry & HTTP listener
│   │   ├── config.js           # Central configuration
│   │   ├── constants.js        # Centralized categories and departments
│   │   ├── db/
│   │   │   ├── index.js        # Dual-engine DB adapter (MongoDB + Local Fallback)
│   │   │   ├── mongoose.js     # Mongoose Schemas (Event, Registration, Winner, Admin)
│   │   │   └── store.js        # Persistent file storage engine with auto-migration
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT verification middleware
│   │   ├── routes/
│   │   │   ├── auth.js         # Login & /me verification
│   │   │   ├── events.js       # Public browsing & Admin event CRUD
│   │   │   ├── registrations.js# Public registration & Admin table + CSV export
│   │   │   ├── stats.js        # Admin KPI metrics and Recharts series
│   │   │   └── winners.js      # Winners public listing & admin CRUD
│   │   └── seed.js             # Database seeder (10 events, 14 winners, 16 registrations, admin)
│   ├── test_api.js             # Automated end-to-end API verification suite
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (Tested with Node v24)
- **npm**: v9.0.0 or higher
- *(Optional)* MongoDB: If MongoDB is installed and running, set `MONGODB_URI` in `.env`. If not, no setup is needed—the embedded persistent storage handles everything automatically!

### 2. Environment Setup

The backend `.env` is already configured in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clubhub
JWT_SECRET=super_secret_clubhub_jwt_key_2026
ADMIN_EMAIL=admin@clubhub.com
ADMIN_PASSWORD=admin123
```

### 3. Seed Sample Data

Run the database seed script to populate 10 college events (strictly 5 categories), 14 student winners, 16 sample registrations, and the default admin:

```bash
cd server
node src/seed.js
```

### 4. Run the Application

#### Start the Backend Server:
```bash
cd server
npm start
# Server listens at http://localhost:5000
```

#### Start the Frontend Client:
```bash
cd client
npm run dev
# Frontend runs at http://localhost:3000
```

Open **`http://localhost:3000`** in your browser!

---

## 🔑 Default Admin Credentials

| Field | Value |
|---|---|
| **Login URL** | `http://localhost:3000/admin/login` |
| **Email** | `admin@clubhub.com` |
| **Password** | `admin123` |

*(Tip: The login page includes a **"Fill Demo Admin Credentials"** button for instant 1-click evaluation.)*

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server health & active database mode |
| `GET` | `/api/events` | Public | List events (`?search=&category=&department=&status=&sort=`) |
| `GET` | `/api/events/:id` | Public | Get single event details with registration count |
| `POST` | `/api/registrations` | Public | Register student for an event (duplicate & capacity checked) |
| `GET` | `/api/winners` | Public | List winners (`?search=&category=&department=&year=&limit=`) |
| `POST` | `/api/winners` | Admin | Create winner card |
| `PUT` | `/api/winners/:id` | Admin | Update winner details |
| `DELETE` | `/api/winners/:id` | Admin | Delete winner |
| `POST` | `/api/auth/login` | Public | Admin login, returns JWT token |
| `GET` | `/api/auth/me` | Admin | Verify JWT token & get admin profile |
| `POST` | `/api/events` | Admin | Create new event (`isFeatured` handles uniqueness) |
| `PUT` | `/api/events/:id` | Admin | Update event details |
| `DELETE` | `/api/events/:id` | Admin | Delete event (cascades associated registrations) |
| `GET` | `/api/registrations` | Admin | Filter & paginate registrations (`?search=&eventId=&yearOfStudy=&department=&page=&limit=`) |
| `GET` | `/api/registrations/export`| Admin | Export filtered registrations as downloadable CSV |
| `GET` | `/api/admin/stats` | Admin | KPI cards & Recharts analytics series |

---

## 🌐 Deployment

ClubHub is architected for zero-downtime, serverless frontend + containerized backend deployment using **MongoDB Atlas**, **Render**, and **Vercel**.

### Step 1: Database Setup (MongoDB Atlas)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a user (e.g. `clubhub_admin`) with read/write privileges.
4. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere) so Render can reach the cluster.
5. Click **Connect** → **Drivers** (Node.js) and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/clubhub?retryWrites=true&w=majority
   ```

---

### Step 2: Backend Deployment (Render)

1. Sign in to [Render](https://render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository: `https://github.com/TusharAgarwal007/ClubHub`.
3. Configure the service settings:
   - **Name**: `clubhub-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables**:
   | Key | Value | Description |
   |---|---|---|
   | `PORT` | `5000` | Server listening port |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | `<random_secure_key>` | Secret key for signing admin JWT tokens |
   | `ADMIN_EMAIL` | `admin@clubhub.com` | Default admin email |
   | `ADMIN_PASSWORD` | `admin123` | Default admin password |
   | `CLIENT_URL` | `https://clubhub.vercel.app` | Your deployed Vercel frontend URL (for CORS) |
   | `NODE_ENV` | `production` | Production environment flag |
5. Click **Create Web Service**. Once deployed, copy your Render URL (e.g., `https://clubhub-api.onrender.com`).
6. **Seed Initial Data**:
   - In the Render dashboard, open the **Shell** tab and run:
     ```bash
     node src/seed.js
     ```
   - Verify health: `https://clubhub-api.onrender.com/api/health`

---

### Step 3: Frontend Deployment (Vercel)

1. Sign in to [Vercel](https://vercel.com/) and click **Add New...** → **Project**.
2. Import your GitHub repository: `https://github.com/TusharAgarwal007/ClubHub`.
3. Configure project settings:
   - **Root Directory**: Click *Edit* and select `client`.
   - **Framework Preset**: `Vite` (automatically detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the **Environment Variable**:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://clubhub-api.onrender.com/api` |
   *(Note: Point this to your Render service with `/api` appended).*
5. Click **Deploy**.
6. Vercel automatically applies the SPA rewrite rules from [`client/vercel.json`](file:///c:/Users/agarw/Desktop/codechef/client/vercel.json), ensuring seamless client-side routing on all deep links (`/events`, `/winners`, `/admin`).
7. Update `CLIENT_URL` in your Render backend environment variables with your final Vercel domain if it differs.

---

## 🎨 Design System

- **Palette**: Indigo (`#4F46E5`), Violet (`#7C3AED`), Vibrant Orange (`#F97316`), Amber (`#F59E0B`), Slate Gray.
- **Card Styling**: Rounded corners (`rounded-2xl` / `rounded-3xl`), subtle border (`border-slate-200 dark:border-slate-800`), smooth hover translate (`hover:-translate-y-1.5`) and deep shadow (`hover:shadow-card-hover`).
- **Dark Mode**: Persisted via `ThemeContext` and `localStorage`, toggled instantly with the sun/moon icon.
- **Accessibility**: Keyboard navigation, semantic HTML (`<main>`, `<header>`, `<footer>`, `<aside>`, `<nav>`), accessible forms with `<label>` association and ARIA descriptions.

