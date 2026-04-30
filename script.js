const API_URL = "http://127.0.0.1:5001";

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