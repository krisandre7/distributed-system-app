const express = require("express");
const validateId = require("../middleware/validateId");
const Movie = require("../models/movie");
const databases = require("../enums/databases");

const router = express.Router();

router.get("/:db/", async (req, res) => {

  var db = databases[req.params.db];
  console.log(db);

  const movies = await Movie.find().sort("title");
  res.send(movies);
});

router.get("/:db/:id", validateId, async (req, res) => {
  var db = databases[req.params.db];

  const movie = await Movie.findById(req.params.db, req.params.id);
  if (!movie) return res.status(404).send();
  res.send(movie);
});

router.post("/:db", async (req, res) => {
  var db = databases[req.params.db];
  
  if (!req.body.title) return res.status(400).send("Title is required.");

  const movie = new Movie({ title: req.body.title });
  await movie.save();
  res.status(201).send(movie);
});

router.delete("/:db/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.status(204).send();
});

module.exports = router;
