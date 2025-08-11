# 🏡 Silversjö Real Estate

A full-stack web application for browsing, searching, and managing real estate property listings. Built with React, Node.js, Supabase, and TypeScript — featuring user authentication, admin controls, and a clean mobile-first UI.

---

## 🚀 Live Demo

🔗 https://silversjo-technical-exam.vercel.app/

---

## 👥 Test Accounts

### Admin User

- **Email:** silversjo@gmail.com
- **Password:** silversjo12345.

### Regular

    Create your own account.

---

## 📦 Tech Stack

| Layer      | Tech                             |
| ---------- | -------------------------------- |
| Frontend   | React, Next.js, TypeScript       |
| Backend    | Node.js, Express, TypeScript     |
| Database   | Supabase (PostgreSQL)            |
| Auth       | Supabase Auth (JWT)              |
| Storage    | Supabase Storage (Images)        |
| Deployment | Vercel (Frontend), Railway (API) |
| Maps       | Mapbox Autocomplete (Bonus)      |

---

## ✨ FEATURES

### 🔐 User Roles

- Regular users can browse listings.
- Admins can create, edit, and delete listings.

### 🏘️ Property Listings

- Title, Description, Location, Price, Type, Status, Images
- Multiple image support
- Timestamps for creation and updates

### 🔍 Search & Filtering

- Keyword search (title, description, location)
- Filters: price range, property type, status
- Pagination

### 📱 Frontend UX

- Mobile-first responsive design
- Grid/List view toggle
- Detail page for each listing
- Login/Register pages
- (Optional) Saved favorites dashboard

### 🛠️ Backend API

- RESTful endpoints with Express
- Supabase client for DB and auth
- Role-based access via JWT middleware
- Image upload via Supabase Storage

### 🗺️ Bonus Features

- Mapbox autocomplete integration
- CI/CD via Vercel and Railway
- Contact form (optional)
- Unit/integration tests (optional)

---

## 🧑‍💻 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/your-username/silversjo-real-estate.git
cd silversjo-real-estate

cd frontend
pnpm install
pnpm run dev


cd backend
pnpm install
pnpm run dev



```

# Frontend

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_BASE=http://localhost:4000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Backend

SUPABASE_URL= your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_anon_key
MAPBOX_TOKEN=your_mapbox_token
PORT=PORT
