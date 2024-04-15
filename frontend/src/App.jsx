import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./App.css";
function App() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "note title 1",
      content: "content",
    },
    {
      id: 2,
      title: "note title 2",
      content: "content",
    },
    {
      id: 3,
      title: "note title 3",
      content: "content",
    },
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const responseData = await fetch("http://localhost:8000/api/notes");
        const notes = responseData.data.notes;
        setNotes(notes);
        // console.log(notes);
      } catch (e) {
        console.log(e);
      }
    };
    fetchNotes();
  }, []);

  const handleAddNote = (e) => {
    e.preventDefault();
    console.log("title", title);
    console.log("content", content);

    const newNote = {
      id: notes.length + 1,
      title: title,
      content: content,
    };

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
  };

  const handleNoteClick = (note) => {
    // Populate form fields with the selected note's title and content
    setTitle(note.title);
    setContent(note.content);
    setSelectedNote(note);
  };

  const handleUppdateNote = (e) => {
    e.preventDefault();
    if (!selectedNote) {
      return;
    }

    const updateNote = {
      id: selectedNote.id,
      title: title,
      content: content,
    };
    const updatedNotesList = notes.map((note) =>
      note.id === selectedNote.id ? updateNote : note
    );
    setNotes(updatedNotesList);
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const deleteNote = (e, noteId) => {
    e.stopPropagation();

    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
  };

  return (
    <div className="app-container">
      <form
        className="note-form"
        onSubmit={(e) =>
          selectedNote ? handleUppdateNote(e) : handleAddNote(e)
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
              <button onClick={(e) => deleteNote(e, note.id)}>x</button>
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
