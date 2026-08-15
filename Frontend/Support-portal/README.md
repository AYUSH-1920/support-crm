# Support CRM — Customer Support Ticketing System

A full-stack support ticketing system built for the Datastraw Assessment. Customer support agents can create tickets, search and filter them, view full details, update status, and add notes.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router
- **Backend:** Node.js, Express
- **Database:** SQLite (via better-sqlite3)

## Features

- Create tickets with customer info, subject, and description
- Auto-generated ticket ID and timestamp
- List all tickets with status and creation date
- Search tickets by customer name
- Filter tickets by status (Open / In Progress / Closed)
- View full ticket details, including notes
- Update ticket status and add notes
- Delete tickets

## Project Structure
Support-Crm/
└── Frontend/
└── Support-portal/
├── backend/ # Express API + SQLite database
│ ├── server.js
│ ├── database.js
│ └── package.json
└── src/ # React frontend
├── components/
├── pages/
└── App.jsx

## Setup Instructions

### Backend

```bash
cd Frontend/Support-portal/backend
npm install
node server.js
```

The API will run on `http://localhost:5000`.

### Frontend

```bash
cd Frontend/Support-portal
npm install
npm run dev
```

The app will run on `http://localhost:5173` (or whichever port Vite assigns).

## Environment Variables

Copy `.env.example` to `.env` in the `backend/` folder and adjust as needed:

PORT=5000

## API Endpoints

| Method | Endpoint                  | Description                          |
|--------|----------------------------|---------------------------------------|
| POST   | `/api/tickets`             | Create a new ticket                  |
| GET    | `/api/tickets`              | List all tickets (supports `?status=` and `?search=`) |
| GET    | `/api/tickets/:ticket_id`  | Get ticket details + notes            |
| PUT    | `/api/tickets/:ticket_id`  | Update ticket status and/or add a note |
| DELETE | `/api/tickets/:ticket_id`  | Delete a ticket                       |

## Database Schema

**tickets**
- `id` (PK)
- `ticket_id` (unique)
- `customer_name`
- `customer_email`
- `subject`
- `description`
- `status` (Open / In Progress / Closed, default: Open)
- `created_at`
- `updated_at`

**notes**
- `id` (PK)
- `ticket_id` (FK → tickets)
- `note_text`
- `created_at`

## Deployment

- **Frontend:** Deployed on Vercel
- **Backend:** Deployed on Render

Live URL: _(add after deployment)_

## Notes

- Delete functionality was added beyond the core spec to make cleanup of test/duplicate tickets easier for support staff.

## Approach & Tech Choices

I chose **Node.js + Express** for the backend since I'm most comfortable with JavaScript, and **SQLite** (via `better-sqlite3`) to keep the database layer simple for a project of this scope, as recommended in the assessment brief. The frontend uses **React with Vite** for fast local development, styled with **Tailwind CSS**, and **React Router** for client-side navigation between the ticket list, create-ticket form, and ticket detail views.

### Challenges Faced

- **Status filtering initially returned empty results** — traced back to inconsistent casing (`"open"` vs `"Open"`) in test data created manually via Postman. Fixed by resetting the database and being consistent with status values sent from the actual UI (the dropdown only ever sends exact-cased values, so this doesn't occur through normal app usage).
- **Table schema not updating after edits to `database.js`** — `CREATE TABLE IF NOT EXISTS` only applies on first creation, so schema changes made later didn't take effect until the local SQLite file was deleted and recreated.

### What I'd Improve With More Time

- Add input validation on the backend (e.g. restrict `status` to the three valid values, validate email format)
- Add a lightweight access gate before real deployment, since the brief noted auth was optional but nice to have
- Add pagination for the ticket list to handle larger volumes of tickets


What I'd Improve With More Time, as a natural continuation
## Future Enhancement: Automation with n8n

For a real support team handling high ticket volume, a natural next step would be integrating [n8n](https://n8n.io) (open-source workflow automation) to reduce manual overhead. A few concrete use cases:

- **Auto-notifications:** Trigger an email or Slack message to the assigned agent whenever a new ticket is created, using n8n's webhook trigger connected to the `POST /api/tickets` endpoint.
- **SLA monitoring:** Run a scheduled n8n workflow that checks tickets still marked `Open` past a certain time threshold and flags/escalates them automatically.
- **Customer follow-ups:** When a ticket status changes to `Closed`, trigger an automated satisfaction survey email to the customer via n8n's email/HTTP nodes.
- **Multi-channel intake:** Instead of only accepting tickets via the web form, use n8n to ingest support requests from email or a contact form and forward them into `POST /api/tickets`, centralizing tickets from multiple channels into one system (directly addressing the brief's mention of "multiple channels" support).

This wasn't implemented in the current submission to keep the core scope focused and stable within the deadline, but the REST API is already structured in a way that would make n8n integration straightforward — n8n could call the existing endpoints directly via its HTTP Request node without needing any backend changes.