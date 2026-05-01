from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import os
 
# Load environment variables from .env file
load_dotenv()
 
app = Flask(__name__)
CORS(app)  # Allow all origins so frontend can connect from any port (e.g. 5500)

# Connect to Supabase using credentials from .env file
SUPABASE_URL = "https://ykccdifabhyxpnghewgv.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrY2NkaWZhYmh5eHBuZ2hld2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNDc0MjIsImV4cCI6MjA5MjgyMzQyMn0.Mtz_JezQLzmP63bmz7d3bumrI4hiTlFV0Tii_WRLYRE"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
 
 
# GET /notes — fetch all notes from the database
@app.route("/notes", methods=["GET"])
def get_notes():
    response = supabase.table("notes").select("*").order("created_at", desc=True).execute()
    return jsonify(response.data), 200
 
 
# POST /notes — create a new note
@app.route("/notes", methods=["POST"])
def create_note():
    data = request.get_json()
 
    # Validation — make sure title and content are present and not empty
    if not data:
        return jsonify({"error": "No data received"}), 400
    if not data.get("title") or data["title"].strip() == "":
        return jsonify({"error": "Title is required"}), 400
    if not data.get("content") or data["content"].strip() == "":
        return jsonify({"error": "Content is required"}), 400
 
    new_note = {
        "title": data["title"].strip(),
        "content": data["content"].strip()
    }
 
    response = supabase.table("notes").insert(new_note).execute()
    return jsonify(response.data[0]), 201
 
 
# PUT /notes/<id> — update an existing note by its ID
@app.route("/notes/<int:note_id>", methods=["PUT"])
def update_note(note_id):
    data = request.get_json()
 
    # Validation
    if not data:
        return jsonify({"error": "No data received"}), 400
    if not data.get("title") or data["title"].strip() == "":
        return jsonify({"error": "Title is required"}), 400
    if not data.get("content") or data["content"].strip() == "":
        return jsonify({"error": "Content is required"}), 400
 
    updated_note = {
        "title": data["title"].strip(),
        "content": data["content"].strip()
    }
 
    response = supabase.table("notes").update(updated_note).eq("id", note_id).execute()
 
    if not response.data:
        return jsonify({"error": "Note not found"}), 404
 
    return jsonify(response.data[0]), 200
 
 
# DELETE /notes/<id> — delete a note by its ID
@app.route("/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    response = supabase.table("notes").delete().eq("id", note_id).execute()
 
    if not response.data:
        return jsonify({"error": "Note not found"}), 404
 
    return jsonify({"message": "Note deleted successfully"}), 200
 
 
if __name__ == "__main__":
    app.run(debug=True, port=5001)