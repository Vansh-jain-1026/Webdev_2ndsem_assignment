// Base URL of your Flask backend
const API_URL = "https://webdev-2ndsem-assignment.onrender.com";

// Formats a date string like "27 Apr 2026"
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// Trims content to a short preview (first 80 chars)
function getPreview(content) {
    if (content.length <= 80) return content;
    return content.substring(0, 80) + "...";
}

// Show the editor section, hide the home dashboard
// If noteId is passed, we are editing an existing note
function showEditor(noteId) {
    document.getElementById("home-view").classList.add("hidden");
    document.getElementById("editor-view").classList.remove("hidden");

    // Clear previous values
    document.getElementById("note-title").value = "";
    document.getElementById("note-content").value = "";
    document.getElementById("editing-note-id").value = "";
    document.getElementById("editor-message").textContent = "";
    document.getElementById("editor-message").className = "editor-msg";

    if (noteId) {
        // We are editing — fetch the note and pre-fill the form
        document.getElementById("editor-heading").textContent = "Edit Note";
        document.getElementById("editing-note-id").value = noteId;
        loadNoteIntoEditor(noteId);
    } else {
        // New note
        document.getElementById("editor-heading").textContent = "New Note";
    }
}

// Go back to the home dashboard
function showHome() {
    document.getElementById("editor-view").classList.add("hidden");
    document.getElementById("home-view").classList.remove("hidden");
    loadHomePage();
}

// Fetch a single note by ID and fill the editor fields
async function loadNoteIntoEditor(noteId) {
    try {
        const response = await fetch(`${API_URL}/notes`);
        const notes = await response.json();
        const note = notes.find(n => n.id === noteId);
        if (note) {
            document.getElementById("note-title").value = note.title;
            document.getElementById("note-content").value = note.content;
        }
    } catch (error) {
        console.error("Error loading note:", error);
    }
}

// Save note — decides whether to POST (new) or PUT (edit) based on editing-note-id
async function saveNote() {
    const title = document.getElementById("note-title").value.trim();
    const content = document.getElementById("note-content").value.trim();
    const noteId = document.getElementById("editing-note-id").value;
    const msgEl = document.getElementById("editor-message");

    // Frontend validation
    if (!title) {
        msgEl.textContent = "Please add a title.";
        msgEl.className = "editor-msg error";
        return;
    }
    if (!content) {
        msgEl.textContent = "Please write something in the note.";
        msgEl.className = "editor-msg error";
        return;
    }

    const noteData = { title, content };

    try {
        let response;

        if (noteId) {
            // Editing an existing note — PUT request
            response = await fetch(`${API_URL}/notes/${noteId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(noteData)
            });
        } else {
            // Creating a new note — POST request
            response = await fetch(`${API_URL}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(noteData)
            });
        }

        const result = await response.json();

        if (response.ok) {
            msgEl.textContent = "Note saved!";
            msgEl.className = "editor-msg";
            // Wait a moment then go back to home
            setTimeout(() => {
                showHome();
            }, 800);
        } else {
            msgEl.textContent = result.error || "Something went wrong.";
            msgEl.className = "editor-msg error";
        }

    } catch (error) {
        msgEl.textContent = "Could not connect to the server.";
        msgEl.className = "editor-msg error";
        console.error("Save error:", error);
    }
}

// Load dashboard data: total count + recent 3 notes
async function loadHomePage() {
    try {
        const response = await fetch(`${API_URL}/notes`);
        const notes = await response.json();

        // Update total count
        document.getElementById("total-count").textContent = notes.length;

        // Show only the 3 most recent notes
        const recentContainer = document.getElementById("recent-notes");
        recentContainer.innerHTML = "";

        const recentNotes = notes.slice(0, 3);

        if (recentNotes.length === 0) {
            recentContainer.innerHTML = `<p style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.85rem;">No notes yet. Create your first one above.</p>`;
            return;
        }

        recentNotes.forEach(note => {
            const card = createCard(note, false);
            recentContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading home page:", error);
    }
}


// Load all notes and display them as cards
async function loadFilesPage() {
    try {
        const response = await fetch(`${API_URL}/notes`);
        const notes = await response.json();

        const container = document.getElementById("all-notes");
        const emptyState = document.getElementById("empty-state");
        const countEl = document.getElementById("files-count");

        container.innerHTML = "";

        if (notes.length === 0) {
            emptyState.classList.remove("hidden");
            countEl.textContent = "";
            return;
        }

        emptyState.classList.add("hidden");
        countEl.textContent = `${notes.length} note${notes.length > 1 ? "s" : ""}`;

        notes.forEach(note => {
            const card = createCard(note, true);
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading files:", error);
    }
}

// Delete a note by ID
async function deleteNote(noteId, cardElement) {
    const confirmed = confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_URL}/notes/${noteId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            // Remove the card from the DOM without reloading the page
            cardElement.remove();

            // If on files page, update count
            const countEl = document.getElementById("files-count");
            if (countEl) {
                const remaining = document.querySelectorAll(".card").length;
                if (remaining === 0) {
                    document.getElementById("empty-state").classList.remove("hidden");
                    countEl.textContent = "";
                } else {
                    countEl.textContent = `${remaining} note${remaining > 1 ? "s" : ""}`;
                }
            }

            // If on home page, also update count
            const totalCount = document.getElementById("total-count");
            if (totalCount) {
                totalCount.textContent = parseInt(totalCount.textContent) - 1;
            }
        }
    } catch (error) {
        console.error("Delete error:", error);
    }
}


// Creates and returns a card DOM element for a note
// showDeleteEdit = true means show Open/Delete buttons (Files page)
// showDeleteEdit = false means show only Open button (Home page recent cards)
function createCard(note, showDeleteEdit) {
    const card = document.createElement("div");
    card.className = "card";

    const currentPage = window.location.pathname;
    const isFilesPage = currentPage.includes("files.html");

    card.innerHTML = `
        <div class="card-title">${note.title}</div>
        <div class="card-preview">${getPreview(note.content)}</div>
        <div class="card-date">Created on ${formatDate(note.created_at)}</div>
        <div class="card-actions">
            ${isFilesPage
            ? `<button class="btn-edit" onclick="openNoteForEdit(${note.id})">Open / Edit</button>
                   <button class="btn-delete" data-id="${note.id}">Delete</button>`
            : `<button class="btn-edit" onclick="showEditor(${note.id})">Open / Edit</button>`
        }
        </div>
    `;

    // Attach delete handler (so we can pass the card element itself)
    if (isFilesPage) {
        const deleteBtn = card.querySelector(".btn-delete");
        deleteBtn.addEventListener("click", () => deleteNote(note.id, card));
    }

    return card;
}

// Called from files.html cards — redirects to index.html with note ID in URL
function openNoteForEdit(noteId) {
    window.location.href = `index.html?edit=${noteId}`;
}


// When the page loads, figure out which page we're on and run the right code
window.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("files.html")) {
        // Files page — load all notes
        loadFilesPage();

    } else if (path.includes("about.html")) {
        // About page — nothing to load dynamically

    } else {
        // Home page (index.html)
        loadHomePage();

        // Check if we came from files.html to edit a specific note
        const params = new URLSearchParams(window.location.search);
        const editId = params.get("edit");
        if (editId) {
            showEditor(parseInt(editId));
        }
    }
});