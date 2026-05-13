# Contributing

Thanks for contributing to AI Tutor.

## Setup

1. Install dependencies:
   - `npm install`
   - `npm --prefix backend install`
2. Copy env files:
   - `cp .env.example .env` (or create manually)
   - `cp backend/.env.example backend/.env`
3. Run backend:
   - `npm --prefix backend start`
4. Run frontend:
   - `npm run dev`

## Workflow

1. Create a feature branch.
2. Make focused changes.
3. Run checks before PR:
   - `npm run test`
   - `npm run build`
4. Open a pull request with:
   - What changed
   - Why it changed
   - How you tested it

## Coding Guidelines

- Keep changes scoped.
- Follow existing UI and API patterns.
- Add tests when introducing new logic.
- Avoid breaking API responses used by the frontend.
