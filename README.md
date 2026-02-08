# Scoreboard App

![gitleaks](https://github.com/jancherian/SCOREIT/actions/workflows/gitleaks.yml/badge.svg)

A full-stack, real-time college scoreboard for managing and displaying live match scores across multiple sports. Operators control matches from a dashboard, and a projector-friendly display view shows the scoreboard to the audience.

## Tech stack

- **Frontend**: React 19, React DOM, Vite 7, Tailwind CSS 4, React Router, Socket.io client, Axios, Framer Motion, React Hot Toast, Lucide React, Tailwind Merge, Canvas Confetti
- **Backend**: Node.js (CommonJS), Express 5, Socket.io, Mongoose, Multer, CORS, dotenv, UUID
- **Database**: MongoDB
- **Tooling**: ESLint, Nodemon, Concurrently

## Project structure

- `server/` – API, WebSocket server, MongoDB models, file uploads
- `client/` – React SPA for display, control panel, and history views

## Prerequisites

- Node.js and npm installed
- MongoDB running locally on `mongodb://localhost:27017`
  - Or update `MONGO_URI` in `server/.env` to a cloud instance (for example, MongoDB Atlas)

## Installation

From the project root (`scoreboard-app`), install dependencies at root, server, and client:

```bash
# Root dev tools (concurrently, etc.)
npm install

# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install

cd ..
```

## Environment configuration

Environment files (already created but documented here):

- `server/.env`:

  ```env
  MONGO_URI=mongodb://localhost:27017/scoreboard
  PORT=5000
  CLIENT_URL=http://localhost:5173
  ```

- `client/.env`:

  ```env
  VITE_SERVER_URL=http://localhost:5000
  ```

## Running in development

From the project root:

```bash
npm run dev
```

This will:

- start the backend on `http://localhost:5000`
- start the Vite dev server on `http://localhost:5173`

You can also run each side independently:

- **Backend only**:

  ```bash
  cd server
  npm run dev
  ```

- **Frontend only**:

  ```bash
  cd client
  npm run dev
  ```

## How to use

1. Ensure MongoDB is running locally, or that `MONGO_URI` points to a reachable MongoDB instance (e.g. MongoDB Atlas).
2. Start the app with `npm run dev` from the project root.
3. Open `http://localhost:5173` in a browser.
4. From the home screen:
   - **Control Panel** (`/control`): for setting up matches, updating scores, managing timers, and marking full time.
   - **Display View** (`/display`): a read-only, projector-friendly scoreboard view.
   - **History** (`/history`): list of completed matches and final scores.
5. For best experience, open `/control` on an operator device (laptop/tablet) and `/display` on a separate device/monitor/projector. Changes made in the control panel are pushed in real time to all display clients via Socket.io.
