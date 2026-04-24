# NoteIt - Capstone Project (Sem 1)
Rishihood University | Web Development | Group Project

---

## Contributors
- **[Your Name]** — [Your Role / What you're handling]
- **[Teammate Name]** — [Their Role / What they're handling]

---

## What are we building?

A simple, clean, full-stack Notes Web App called NoteIt.

The idea is straightforward — you open the app, write a note, save it, and come back to it later. You can edit it, delete it, and your data actually persists in a real database (not just your browser). Nothing fancy, but everything works end to end — from the button you click on the screen, all the way to a row in a SQL database.

This is our first project built from scratch, so we kept the scope realistic but made sure it covers everything — a proper frontend, a backend with APIs, a real database, and all four CRUD operations.

---

## Pages and User Flow

### Home Tab
- Landing page of the app
- Shows a small dashboard — total notes saved, and the 2-3 most recently created notes as a quick preview
- Has a "+ New Note" button
- Clicking "New Note" takes you to the Note Editor page

### Note Editor Page (under Home Tab)
- A title input at the top (short, one line)
- A large text box below it (the actual note content)
- A Save button — on clicking, it sends the data to the backend and saves it in the database
- If you open an existing note to edit, the same page loads with the existing title and content pre-filled, and saving it updates the record (not creates a new one)

### Files Tab
- Shows all saved notes as cards
- Each card displays the note title, first ~80 characters of the content as a preview, and a "Created on" timestamp
- Each card has two buttons — Open/Edit (opens the note in the editor page where you can make changes and save) and Delete (removes the note with a simple confirmation)

### About Us Tab
- A simple static page
- Brief introduction about both contributors — who we are, what we are learning

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend | Python (Flask) |
| Database | Supabase (PostgreSQL — SQL queries) |
| Version Control | Git + GitHub |

---

## Backend APIs (Flask)

| Method | Endpoint | What it does |
|---|---|---|
| GET | `/notes` | Fetch all saved notes |
| POST | `/notes` | Create a new note |
| PUT | `/notes/<id>` | Update an existing note by ID |
| DELETE | `/notes/<id>` | Delete a note by ID |

All APIs will send and receive data in JSON format. Data validation will be done on the backend before saving anything to the database.

---

## Database (Supabase - SQL)

We are using Supabase as our database with direct SQL queries.

### Table: `notes`

| Column | Type | Description |
|---|---|---|
| id | int (auto, primary key) | Unique ID for each note |
| title | text | Title of the note |
| content | text | Main body/content of the note |
| created_at | timestamp | Auto-set when note is created |
| updated_at | timestamp | Auto-updated when note is edited |

---

## UI Plan

- Clean, minimal design — no heavy animations
- Subtle interactions: button hover effects (slight size change), smooth card hover shadow
- Consistent color theme throughout all pages
- Responsive enough to not break on a smaller screen
- Cards in the Files tab will be in a grid layout

---

## CRUD Breakdown

| Operation | Where | API Used |
|---|---|---|
| Create | New Note → Save button | POST `/notes` |
| Read | Files Tab loads all notes, Home shows recent | GET `/notes` |
| Update | Open existing note → Edit → Save | PUT `/notes/<id>` |
| Delete | Delete button on each card | DELETE `/notes/<id>` |

---

*This is our first project built from the ground up. Scope is kept simple on purpose — we wanted something we can fully understand, explain, and defend. We will keep improving it after the VIVA too.*