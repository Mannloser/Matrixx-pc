# Matrixx-pc

PC building web app. Build your custom rig, check compatibility, save to your account, share with others, and browse a pre-built library. Built with React + Vite, Node.js, and MongoDB.

🔗 **Live Demo:** [https://matrixx-pc.pages.dev/](https://matrixx-pc.pages.dev/)

---

## Tech Stack

**Frontend**
- React 19
- React Router v7
- Axios
- Vite 8

**Backend**
- Node.js
- MongoDB
- JWT Authentication
- Nodemailer (email via app password)

---

## 📁 Folder Structure

```
Matrixx-pc/
├── backend/
│   ├── config/                  # DB and app configuration
│   ├── controller/              # Request handlers (auth, user, parts, profile, admin)
│   ├── middleware/              # Express middleware (auth)
│   ├── models/                  # Mongoose models (builds, parts, prebuilds, user)
│   ├── routes/                  # Express route definitions
│   ├── utils/                   # Helper utilities (email service)
│   ├── package.json
│   └── server.js                # Express app entry point
├── frontend/
│   ├── public/                  # Static assets
│   └── src/
│       ├── api/                 # Client-side API wrappers
│       ├── components/          # Reusable UI components
│       ├── pages/               # Route pages (admin side, user side, auth)
│       ├── App.jsx              # Root React component
│       ├── main.jsx             # React app entry point
│       └── index.css            # Global styles
│   ├── index.html               # HTML entry point
│   ├── package.json
│   └── vite.config.js           # Vite configuration
├── .env.example                 # Environment variable template
├── .gitignore
├── package.json                 # Root package (monorepo scripts)
└── README.md                    # This file
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- A MongoDB connection URI (local or Atlas)
- A Gmail account with an App Password for email

### 1. Clone the repo

```bash
git clone https://github.com/Mannloser/Matrixx-pc.git
cd Matrixx-pc
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
MONGO_URI=your_mongo_connection_here
JWT_SECRET=your_jwt_secret_here
MAILING_USER=your_email_here
MAILING_PASS=your_app_password_here
```

### 3. Install dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 4. Run the app

```bash
# Run frontend (from /frontend)
npm run dev

# Run backend (from /backend)
node server.js
```

---

## Deployment

The frontend is deployed to GitHub Pages via `gh-pages`.

```bash
# From the root
npm run deploy
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `MAILING_USER` | Gmail address used for sending emails |
| `MAILING_PASS` | Gmail App Password (not your regular password) |

---

## Author

- **Mannloser** — [Mannloser](https://github.com/Mannloser)
- **mannloser** — [@mannloser](https://instagram.com/mannloser)
- **6ryukkk** — [@6ryukkk](https://youtube.com/@6ryukkk)
