# AI Tutor for Neurodiverse Learning

AI Tutor is a full-stack learning app designed for child-friendly lessons, parent visibility, emotion-aware support, and adaptive progression.

## Tech Stack

- Frontend: React + Vite
- Backend: Express + Mongoose
- Database: MongoDB
- Optional AI integration: OpenAI SDK (already wired for extension)

## Core Features

### Learning + Child Experience
- Adaptive quiz difficulty (`easy`, `medium`, `hard`) based on recent performance/emotion trends
- Emotion-aware intervention prompts when stress patterns are detected
- Lesson completion with dynamic star rewards
- Daily quests, streak shields, and calm-comeback bonus stars

### Parent + Progress
- Rich progress reports (emotion mix, exercise accuracy, recommendations, alerts)
- Report downloads: TXT, JSON, and PDF
- Weekly parent digest generation
- In-app notifications for instant alerts and quest/recovery events

### Tutor Chat
- Context-aware tutor responses using:
  - recent conversation history
  - selected child profile
  - saved progress/session analytics
- Persistent per-child chat memory (goals, strengths, focus areas)

### Security + Reliability
- Auth and API rate limits
- Password reset flow (`request-reset` + `reset-password`)
- Stricter token handling
- Backend unit tests (Node test runner)
- GitHub Actions CI for test + build

---

## Repository Structure

```text
AI-Tutor/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    tests/
    server.js
  public/
  src/
    api/
    components/
    pages/
    styles/
    utils/
  .github/workflows/ci.yml
  README.md
```

---

## Local Setup

## 1) Install dependencies

```bash
npm install
npm --prefix backend install
```

## 2) Configure environment variables

Frontend:

```bash
cp .env.example .env
```

Backend:

```bash
cp backend/.env.example backend/.env
```

Backend `.env` keys:
- `PORT` (default `5000`)
- `MONGO_URI`
- `OPENAI_API_KEY` (optional)
- `NODE_ENV`

## 3) Start backend

```bash
npm --prefix backend start
```

## 4) Start frontend

```bash
npm run dev
```

Frontend runs on `http://localhost:3000` and proxies `/api` to backend.

---

## Scripts

Root:
- `npm run dev` - start frontend dev server
- `npm run build` - build frontend production bundle
- `npm run preview` - preview frontend production build
- `npm run test` - run backend tests

Backend:
- `npm --prefix backend start` - start backend server
- `npm --prefix backend test` - run backend tests

---

## Key API Endpoints

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/request-reset`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Progress + Sessions:
- `GET /api/progress`
- `PATCH /api/progress`
- `POST /api/progress/lesson`
- `POST /api/session/save`

Reports:
- `POST /api/report`
- `POST /api/report/weekly-digest`

Notifications:
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `POST /api/notifications/read-all`

Chat:
- `POST /api/chat`

---

## Testing and CI

- Backend tests are located in `backend/tests`.
- CI workflow (`.github/workflows/ci.yml`) runs:
  1. dependency install
  2. backend tests
  3. frontend build

---

## GitHub Upload Checklist

Before pushing:

1. Ensure `.env` files are not committed.
2. Run:
   - `npm run test`
   - `npm run build`
3. Confirm README/env docs are up to date.
4. Commit with a clear message and push.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT - see [LICENSE](./LICENSE).
