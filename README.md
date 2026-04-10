# Matrixx-pc

A full-stack web application built with React and Node.js, featuring user authentication, email support, and a MongoDB database. Deployed live on GitHub Pages.

🔗 **Live Demo:** [mannloser.github.io/Matrixx-pc](https://mannloser.github.io/Matrixx-pc/)

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

## Project Structure

```
Matrixx-pc/
├── frontend/        # React app (Vite)
├── backend/         # Node.js API server
├── .env.example     # Environment variable template
└── package.json     # Root scripts
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

**Mannloser** — [github.com/Mannloser](https://github.com/Mannloser)
