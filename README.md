# AI-Tutor: Personalized Learning Engine for Children with Autism Spectrum Disorder

AI-Tutor is a full-stack learning platform built to support children with Autism Spectrum Disorder through calm lessons, adaptive quizzes, emotion-aware pacing, parent progress tracking, and AI-assisted tutor conversations.

The goal is not to replace teachers, therapists, or caregivers. It is a supportive learning engine that helps each child practice at an appropriate pace while giving parents and educators clearer insight into progress, mood patterns, and topic readiness.

## Objectives

- Deliver autism-friendly lessons with predictable structure, simple language, and clear visual feedback.
- Personalize quiz difficulty across easy, medium, and hard levels using child progress and emotion trends.
- Provide topic-based recommended YouTube practice links for colors, numbers, letters, shapes, emotions, and social skills.
- Track caregiver-reviewed video practice completion.
- Let teachers or therapists assign topic goals and target levels.
- Track learning sessions, emotions, quiz accuracy, stars, streaks, and rewards.
- Generate parent-friendly reports and weekly learning summaries.
- Offer an AI tutor chat experience that can answer questions, explain topics, and review progress.

## Tools and Technologies Used

- React and Vite for the frontend
- Node.js and Express.js for the backend API
- MongoDB and Mongoose for database storage
- OpenAI SDK for AI tutor/report generation
- face-api.js for browser-based emotion detection support
- Postman for API testing
- VS Code for development
- Git and GitHub for version control
- npm for package management

## Main Modules

### Child Learning Engine

- Lessons for colors, numbers, letters, shapes, emotions, and social skills
- Adaptive quiz levels:
  - Easy: fewer choices and simpler questions
  - Medium: standard topic practice
  - Hard: more questions, stronger distractors, and reasoning prompts
- Recommended YouTube practice resource for each topic
- Video completion tracking after caregiver review
- Text-to-speech support for lesson items and quiz questions
- Star rewards after lesson completion

### Emotion-Aware Support

- Optional camera-based emotion detection
- Support prompts when repeated negative emotion patterns are detected
- Calm reset activities such as breathing, movement breaks, and confidence-building tasks
- Difficulty adjustment when a learner appears frustrated, sad, or sleepy

### Parent and Teacher Dashboard

- Child profile management
- Teacher/therapist goal assignment with topic and target level
- Emotion check-ins
- Accuracy, session, and practice-time analytics
- Daily quest and streak tracking
- Parent alerts and notifications
- Downloadable TXT, JSON, and PDF reports
- Weekly digest generation

### AI Tutor Chat

- Child-aware chat context
- Progress-aware fallback responses
- AI-powered tutoring when the backend OpenAI key is configured
- Helpful prompts for lessons, feelings, reports, and next-step recommendations

## Project Structure

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
    .env.example
    server.js
  public/
    models/
  src/
    api/
    components/
    pages/
    styles/
    utils/
  package.json
  vite.config.js
  README.md
```

## Local Setup

### 1. Install Dependencies

PowerShell may block `npm.ps1` on some Windows systems. If that happens, use `npm.cmd`.

```powershell
npm.cmd install
npm.cmd --prefix backend install
```

### 2. Configure Backend Environment

Create `backend/.env` from the example file:

```powershell
Copy-Item backend\.env.example backend\.env
```

Required/backend keys:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-tutor
OPENAI_API_KEY=
```

`OPENAI_API_KEY` is optional for basic app exploration, but AI tutor/report features need it.

### 3. Start MongoDB

Start a local MongoDB server, or replace `MONGO_URI` with your MongoDB Atlas connection string.

### 4. Start Backend

```powershell
npm.cmd --prefix backend start
```

Backend default URL:

```text
http://localhost:5000
```

### 5. Start Frontend

Open a second terminal:

```powershell
npm.cmd run dev
```

Frontend default URL:

```text
http://localhost:3000
```

## API Testing With Postman

Use Postman to test the backend endpoints while the server is running.

Common flows:

- Register/login a parent account
- Create a child profile
- Save a learning session
- Fetch progress analytics
- Generate reports
- Test AI tutor chat

Key endpoint groups:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/children`
- `POST /api/children`
- `GET /api/progress`
- `PATCH /api/progress`
- `POST /api/progress/lesson`
- `POST /api/session/save`
- `POST /api/report`
- `POST /api/report/weekly-digest`
- `POST /api/chat`
- `GET /api/notifications`

## Scripts

Frontend:

- `npm.cmd run dev` - start Vite development server
- `npm.cmd run build` - build production frontend
- `npm.cmd run preview` - preview production build
- `npm.cmd run test:frontend` - run frontend learning engine tests
- `npm.cmd run test` - run frontend and backend tests

Backend:

- `npm.cmd --prefix backend start` - start Express API server
- `npm.cmd --prefix backend test` - run backend tests

## Recent Learning Upgrade

Each learning topic now includes:

- A recommended YouTube practice link
- A caregiver-reviewed completion marker
- Separate easy, medium, and hard question sets
- More questions as difficulty increases
- Distinct prompts at each level so repeated lessons feel less static

## GitHub Upload Checklist

Before uploading or opening a pull request:

1. Confirm real `.env` files are not staged.
2. Run `npm.cmd install` and `npm.cmd --prefix backend install` if dependencies changed.
3. Run `npm.cmd run test`.
4. Run `npm.cmd run build`.
5. Review `README.md`, `CONTRIBUTING.md`, and `SECURITY.md`.
6. Commit only source, config, docs, lockfiles, and public assets. Do not commit `node_modules/` or `dist/`.

## Recommended Future Improvements

- Add a therapist/teacher mode for manually assigning goals.
- Add offline printable worksheets for each topic.
- Add stronger accessibility controls for contrast, reading speed, and sound sensitivity.
- Add automated frontend tests for lesson completion and quiz behavior.
- Replace YouTube search links with a curated, reviewed video table before production use.

## Important Notes

- Do not commit real `.env` files or API keys.
- The camera is optional and should be used only with caregiver consent.
- YouTube links should be reviewed by a parent/teacher before a child watches independently.
- This app is an educational support tool, not a medical diagnostic system.
