const express = require("express");
const notesRouter = express.Router();
const notesController = require("../controllers/notesController");

notesRouter.get("/", notesController.getAllNotes);
notesRouter.post("/", notesController.createNote);
notesRouter.delete("/:id", notesController.deleteNote);
notesRouter.put("/:id", notesController.updateNote);

module.exports = notesRouter;
