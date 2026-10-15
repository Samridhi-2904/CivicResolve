# CivicTrack — Civic Issue Reporting & Resolution Platform

Full project specification (MERN Stack)

---

## 1. Problem Statement

Citizens have no easy, centralized way to report local infrastructure problems (potholes, garbage, broken streetlights, water leaks, drainage issues) to municipal authorities — and once reported, they have no visibility into whether anything is actually being done. On the other side, government/municipal staff have no unified dashboard to see, prioritize, and track issues across their jurisdiction.

**CivicTrack** bridges this gap: citizens report geotagged issues with photos, the community upvotes the ones that matter most, officials manage and resolve them through a dashboard, and everyone can see resolution-time analytics — creating public accountability.

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React (Vite) | Fast dev server, modern build tooling |
| Routing | React Router v6 | Client-side routing |
| State management | Redux Toolkit (or Context API for smaller scope) | Global auth/user state, issue list state |
| Styling | Tailwind CSS | Fast, consistent styling |
| Maps | Leaflet + OpenStreetMap (Nominatim for geocoding) | Free, no billing like Google Maps API |
| Charts | Recharts | Analytics dashboard (resolution time, category breakdown) |
| Backend | Node.js + Express.js | REST API |
| Database | MongoDB (Atlas) + Mongoose ODM | Flexible schema for varied issue types |
| Auth | JWT (jsonwebtoken) + bcrypt | Stateless auth, secure password hashing |
| Image upload | Multer + Cloudinary | Handle photo evidence uploads |
| Notifications (stretch) | Nodemailer | Email status-change alerts |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas (DB) | Free tier friendly |
| Version control | Git + GitHub | — |

---

## 3. User Roles

| Role | Capabilities |
|---|---|
| **Citizen** | Register/login, report issue, upload photo, view map/list of issues, upvote issues, track status of own reports, receive notifications |
| **Official** | Login (assigned by admin), view issues in their jurisdiction/department, update status, add resolution notes/photos, view department analytics |
| **Admin** | Manage users, manage departments & jurisdiction mapping, assign officials to departments, view city-wide analytics, override/reassign any issue |

---

## 4. System Flow

### 4.1 Citizen flow
```
Register/Login
   → Submit issue (category, description, photo, auto-geotag via browser GPS or manual pin on map)
   → Issue saved with status = "Pending"
   → Issue appears on public map/list
   → Other citizens can upvote it
   → Citizen gets notified when status changes (Pending → Verified → In Progress → Resolved)
   → Citizen can view resolution photo/note once resolved
```

### 4.2 Official flow
```
Login (role = official, tied to a department + jurisdiction)
   → Dashboard shows only issues within their jurisdiction
   → Filter by category / status / date / upvote count
   → Change status (with mandatory note on each change)
   → Upload "after" photo when resolving
   → Status change triggers StatusLog entry + notification to reporter
```

### 4.3 Admin flow
```
Login (role = admin)
   → Manage departments (create/edit, map to wards/zones)
   → Manage officials (create accounts, assign to department)
   → View city-wide analytics: issues by category, by ward, avg resolution time, SLA breaches
   → Reassign / escalate stuck issues
```

### 4.4 High-level architecture diagram (textual)
```
┌─────────────┐        HTTPS/REST        ┌──────────────┐        Mongoose        ┌───────────┐
│   React     │  ───────────────────►    │   Express    │  ───────────────────► │  MongoDB  │
│  (Vite SPA) │  ◄───────────────────    │  REST API    │  ◄─────────────────── │  Atlas    │
└─────────────┘        JSON              └──────────────┘                        └───────────┘
      │                                          │
      │                                          ├── JWT middleware (auth + role check)
      ├── Leaflet map (OpenStreetMap tiles)       ├── Multer → Cloudinary (image upload)
      ├── Recharts (analytics)                    ├── Nodemailer (status-change email)
      └── Axios (API calls)                       └── bcrypt (password hashing)
```

---

## 5. Database Schema (MongoDB / Mongoose)

### 5.1 `User`
```js
{
  _id: ObjectId,
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,        // bcrypt hashed
  role: { type: String, enum: ['citizen', 'official', 'admin'], default: 'citizen' },
  phone: String,
  ward: String,            // relevant for citizens (their locality) and officials (their jurisdiction)
  departmentId: { type: ObjectId, ref: 'Department' },  // only for officials
  createdAt: Date,
  updatedAt: Date
}
```

### 5.2 `Department`
```js
{
  _id: ObjectId,
  name: String,             // e.g. "Roads & Infrastructure", "Sanitation", "Electrical"
  category: [String],       // issue categories this dept handles, e.g. ["pothole", "drainage"]
  jurisdictionWards: [String], // list of wards/zones this department covers
  officials: [{ type: ObjectId, ref: 'User' }],
  createdAt: Date
}
```

### 5.3 `Issue`
```js
{
  _id: ObjectId,
  title: String,
  description: String,
  category: { type: String, enum: ['pothole', 'garbage', 'streetlight', 'water_leak', 'drainage', 'other'] },
  images: [String],          // Cloudinary URLs, "before" photos
  resolutionImages: [String],// "after" photos, added by official
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]    // [lng, lat] — enables MongoDB geospatial queries
  },
  address: String,           // reverse-geocoded human-readable address
  ward: String,
  status: { type: String, enum: ['pending', 'verified', 'in_progress', 'resolved', 'rejected'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  reportedBy: { type: ObjectId, ref: 'User' },
  assignedDepartment: { type: ObjectId, ref: 'Department' },
  assignedOfficial: { type: ObjectId, ref: 'User' },
  upvotes: [{ type: ObjectId, ref: 'User' }],   // array of userIds who upvoted (also gives upvote count via length)
  resolutionNote: String,
  createdAt: Date,
  verifiedAt: Date,
  resolvedAt: Date,
  updatedAt: Date
}
// Index: { location: '2dsphere' } for geo queries
// Index: { ward: 1, status: 1 } for dashboard filtering
```

### 5.4 `StatusLog`
```js
{
  _id: ObjectId,
  issueId: { type: ObjectId, ref: 'Issue' },
  oldStatus: String,
  newStatus: String,
  note: String,
  changedBy: { type: ObjectId, ref: 'User' },
  timestamp: Date
}
```
Purpose: full audit trail per issue + lets you compute "average time in each status" for analytics.

### 5.5 `Vote` (alternative to embedding upvotes array, use this if you expect scale)
```js
{
  _id: ObjectId,
  issueId: { type: ObjectId, ref: 'Issue' },
  userId: { type: ObjectId, ref: 'User' },
  createdAt: Date
}
// Compound unique index: { issueId: 1, userId: 1 } — prevents duplicate votes
```
> For a resume project, the embedded `upvotes` array in `Issue` is simpler and fine. Use a separate `Vote` collection only if you want to demonstrate handling scale/indexing decisions.

---

## 6. API Route Structure

### Auth
```
POST   /api/auth/register        — citizen self-registration
POST   /api/auth/login           — all roles
GET    /api/auth/me              — get current logged-in user (protected)
```

### Issues
```
POST   /api/issues               — create issue (citizen, protected)
GET    /api/issues               — list issues (public, supports ?category=&status=&ward=&sort=upvotes)
GET    /api/issues/:id           — single issue detail
PATCH  /api/issues/:id/status    — update status (official/admin only, protected + role check)
POST   /api/issues/:id/upvote    — toggle upvote (citizen, protected)
GET    /api/issues/nearby        — geospatial query, ?lat=&lng=&radius=
DELETE /api/issues/:id           — remove issue (admin only)
```

### Departments (admin)
```
POST   /api/departments          — create department
GET    /api/departments          — list departments
PATCH  /api/departments/:id      — edit jurisdiction/category mapping
```

### Users (admin)
```
GET    /api/users                — list users (filter by role)
PATCH  /api/users/:id/role       — assign official role + department
```

### Analytics
```
GET   /api/analytics/summary          — total issues, pending, resolved, avg resolution time
GET   /api/analytics/by-category      — count grouped by category
GET   /api/analytics/by-ward          — count + avg resolution time grouped by ward
GET   /api/analytics/trend            — issues created vs resolved over time (for line chart)
```

---

## 7. Frontend Page/Component Structure

```
src/
├── api/                    # axios instance + API call functions
├── components/
│   ├── common/              (Navbar, Footer, ProtectedRoute, Loader)
│   ├── issue/                (IssueCard, IssueForm, IssueMap, StatusBadge, UpvoteButton)
│   ├── dashboard/            (OfficialDashboardTable, StatusUpdateModal)
│   └── analytics/            (CategoryChart, WardChart, TrendChart, SummaryCards)
├── pages/
│   ├── Home.jsx               (landing + public map view)
│   ├── Login.jsx / Register.jsx
│   ├── ReportIssue.jsx        (citizen: create issue form)
│   ├── MyReports.jsx          (citizen: track own reports)
│   ├── IssueDetail.jsx        (single issue view + status timeline)
│   ├── OfficialDashboard.jsx  (official: manage jurisdiction issues)
│   ├── AdminPanel.jsx         (admin: manage departments/users)
│   └── Analytics.jsx          (public or admin analytics dashboard)
├── context/ or store/        (auth state, Redux slices)
├── routes/                   (AppRouter.jsx, role-based route guards)
└── App.jsx
```

---

## 8. Backend Folder Structure

```
server/
├── config/
│   ├── db.js               (MongoDB connection)
│   └── cloudinary.js
├── models/
│   ├── User.js
│   ├── Department.js
│   ├── Issue.js
│   └── StatusLog.js
├── controllers/
│   ├── authController.js
│   ├── issueController.js
│   ├── departmentController.js
│   ├── userController.js
│   └── analyticsController.js
├── routes/
│   ├── authRoutes.js
│   ├── issueRoutes.js
│   ├── departmentRoutes.js
│   ├── userRoutes.js
│   └── analyticsRoutes.js
├── middleware/
│   ├── authMiddleware.js    (verify JWT)
│   ├── roleMiddleware.js    (restrict by role)
│   ├── uploadMiddleware.js  (multer config)
│   └── errorHandler.js
├── utils/
│   ├── generateToken.js
│   └── sendEmail.js
├── server.js
└── .env
```

---

## 9. Core Feature List (build order)

1. **Auth system** — register/login, JWT issuance, role-based middleware
2. **Issue reporting** — form with category, description, photo upload (Cloudinary), location capture (browser geolocation API + Leaflet pin-drop fallback)
3. **Public issue feed** — list + map view, filter by category/status/ward
4. **Upvoting** — one vote per user per issue, sort feed by upvotes
5. **Official dashboard** — jurisdiction-filtered table, status update with mandatory note, "after" photo upload on resolve
6. **Status timeline** — show full StatusLog history on issue detail page (transparency feature)
7. **Admin panel** — department CRUD, jurisdiction-to-ward mapping, official account creation
8. **Analytics dashboard** — Recharts: issues by category (bar), by ward (bar/heatmap-style), resolution trend over time (line), summary cards (total/pending/resolved/avg resolution days)
9. **Notifications (stretch)** — Nodemailer email when reporter's issue status changes
10. **SLA flagging (stretch)** — auto-flag issues open > N days as "overdue" for escalation

---

## 10. Key Differentiators (what makes this more than a CRUD clone)

- **Community upvoting** drives visible prioritization — most-voted issues surface to the top, creating public pressure/accountability.
- **Full status audit trail** (`StatusLog`) — not just a status field, but a timestamped history anyone can view, including who changed it and why.
- **Geospatial queries** (`2dsphere` index) — "issues near me" is a real MongoDB geo feature, not just lat/lng stored as plain numbers.
- **Jurisdiction-based access control** — officials only see issues in their assigned wards, which is a genuine RBAC problem (not just admin vs. user).
- **Ward-level analytics** — average resolution time per ward is the kind of metric a real municipal ops team would actually want.

---

## 11. Build Timeline (2–3 weeks, solo)

| Days | Task |
|---|---|
| 1–2 | Project setup, Mongoose schemas, auth (register/login/JWT), role middleware |
| 3–5 | Issue creation API + frontend form, Cloudinary upload, Leaflet location picker |
| 6–8 | Public feed (list + map), filters, upvote endpoint + UI |
| 9–11 | Official dashboard, status update flow, StatusLog, department/jurisdiction filtering |
| 12–13 | Admin panel (department & user management) |
| 14–16 | Analytics dashboard (Recharts), summary stats, ward-wise breakdown |
| 17–18 | Polish UI, responsive design, error handling, loading states |
| 19–21 | Deploy (Vercel + Render + Atlas), write README, record demo video/GIF |

---

## 12. Deployment Checklist

- [ ] MongoDB Atlas cluster created, connection string in `.env`
- [ ] Cloudinary account + API keys in `.env`
- [ ] Backend deployed to Render (set env vars: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`)
- [ ] Frontend deployed to Vercel (set `VITE_API_URL` to Render backend URL)
- [ ] CORS configured on backend to allow frontend domain
- [ ] Seed script to create one admin account + sample departments
- [ ] README with setup instructions, screenshots, and live demo link
- [ ] `.env.example` committed (never commit real `.env`)

---

## 13. Reference Repos (for architecture study, not direct copy)

- `azezal1/GovConnect` — dual citizen/official portal, geotagging, analytics dashboard
- `jshn22/issues-tracker` (Civic-Assist) — clean MERN base, JWT + Cloudinary + Leaflet
- `VIII4/Care-n-v2` — community voting/prioritization mechanic
