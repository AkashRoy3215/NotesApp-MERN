import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const api = axios.create({
    baseURL: "https://notesapp-mern-lmqp.onrender.com",
  });

  const fetchNotes = async () => {
    try {
      const response = await api.get(
        "https://notesapp-mern-lmqp.onrender.com/api/notes"
      );
      setNotes(response.data.data.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "https://notesapp-mern-lmqp.onrender.com/api/notes",
        {
          title,
          content,
        }
      );
      console.log("Response from adding note:", response);
      if (response.status === 200 || 201) {
        setNotes([...notes, response.data]);
        setTitle("");
        setContent("");
      } else {
        throw new Error(response.data.error || "Failed to add note");
      }
    } catch (error) {
      console.error("Error adding note:", error.message);
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(
        `https://notesapp-mern-lmqp.onrender.com/api/notes/${selectedNote._id}`,
        {
          title,
          content,
        }
      );
      if (response.status === 200 || 201) {
        const updatedNote = { ...selectedNote, title, content };
        const updatedNotes = notes.map((note) =>
          note._id === updatedNote._id ? updatedNote : note
        );
        setNotes(updatedNotes);
        setTitle("");
        setContent("");
        setSelectedNote(null);
      } else {
        throw new Error("Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await api.delete(
        `https://notesapp-mern-lmqp.onrender.com/api/notes/${id}`
      );
      if (response.status === 200 || 201) {
        setNotes(notes.filter((note) => note._id !== id));
        setTitle("");
        setContent("");
        setSelectedNote(null);
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleNoteClick = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setSelectedNote(note);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  return (
    <div className="app-container">
      <form
        className="note-form"
        onSubmit={(e) =>
          selectedNote ? handleUpdateNote(e) : handleAddNote(e)
        }
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows="10"
          required
        ></textarea>

        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div
            className="note-item"
            key={note._id}
            onClick={() => handleNoteClick(note)}
          >
            <div className="notes-header">
              <button onClick={() => deleteNote(note._id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
