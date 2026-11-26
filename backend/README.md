# Smart Fix Backend

Express.js and MongoDB authentication API for **Smart Fix – Smart Problem Reporting and Resolution System**.

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection string

## Setup & Run

1. Go to the `backend` folder and install packages:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment variables in `backend/.env` (use `backend/.env.example` as a reference):
   - `PORT=5000`
   - `CLIENT_URL=http://localhost:5173`
   - `MONGO_URI=mongodb://127.0.0.1:27017/smartfix`
   - `JWT_SECRET=<your-long-random-secret>`
   - `JWT_EXPIRES_IN=7d`
3. Start the server:
   ```bash
   npm run dev
   ```
   Or for standard execution without watch mode:
   ```bash
   npm start
   ```

## Available Endpoints

- `GET /api/health` — Checks whether the API server is running and reports the live MongoDB connection state (`connected` or `disconnected`).
- `POST /api/auth/register` — Registers a new user (`name`, `email`, `password`, optional `role`: `citizen` or `technician`) and returns a JWT token.
- `POST /api/auth/login` — Authenticates an existing user (`email`, `password`) and returns a JWT token.
- `GET /api/auth/me` — Protected route requiring `Authorization: Bearer <token>` header; returns the logged-in user's profile.
