import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./App.css";
function App() {
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/notes");
        const responseData = await response.json();
        const notes = responseData.data.notes; // Accessing the notes array from the data object
        setNotes(notes);
        console.log(notes);
      } catch (e) {
        console.log(e);
      }
    };
    fetchNotes();
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", //Don't know what it does.
        },
        body: JSON.stringify({
          id,
          title,
          content,
        }),
      });
      const responseData = await response.json();

      const newNote = responseData.data.notes;

      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    } catch (e) {
      console.log(e);
    }
  };

  const handleNoteClick = (note) => {
    // Populate form fields with the selected note's title and content
    setTitle(note.title);
    setContent(note.content);
    setSelectedNote(note);
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedNote.id,
            title,
            content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const updateNote = {
        id: selectedNote.id,
        title: title,
        content: content,
      };

      // Update the note in the notes array
      const updatedNotesList = notes.map((note) =>
        note.id === selectedNote.id ? updateNote : note
      );
      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const deleteNote = async () => {
    // e.stopPropagation();
    try {
      const response = await fetch(
        `http://localhost:8000/api/notes/${selectedNote.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
    // Remove the deleted note from the notes array
    const updatedNotesList = notes.filter(
      (note) => note.id !== selectedNote.id
    );
    setNotes(updatedNotesList);
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
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          type="text"
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
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
            key={note.id}
            onClick={() => handleNoteClick(note)}
          >
            <div className="notes-header">
              <button onClick={() => deleteNote(note.id)}>x</button>
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
