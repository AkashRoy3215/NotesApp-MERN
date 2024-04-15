const Note = require("../models/notesModel");

exports.getAllNotes = async (req, res) => {
  try {
    const query = req.query;
    const notes = await Note.find(query);
    return res.status(201).json({
      status: "success",
      data: {
        notes,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const note = new Note({
    title,
    content,
  });

  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await note.deleteOne();
    res.status(500).json({ message: "Note Deleted Succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.title = title;
    note.content = content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
