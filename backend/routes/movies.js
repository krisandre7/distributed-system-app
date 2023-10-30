const express = require("express");
const validateId = require("../middleware/validateId");
const MovieSchema = require("../schemas/movie");
const databases = require("../enums/databases");
const mongoose = require("mongoose");

const router = express.Router();

function getMovieModel(database) {
  const connection_number = databases[database];
  const connection = mongoose.connections[connection_number];
  return connection.model('Movie', MovieSchema);
};

router.get("/:db/", async (req, res) => {
  const MovieModel = getMovieModel(req.params.db);

  const movies = await MovieModel.find().sort("title");
  res.send(movies);
});

router.get("/:db/:title", async (req, res) => {
  const MovieModel = getMovieModel(req.params.db);

  const movies = await MovieModel.find().sort("title");
  const movie = movies.find((movie) => movie.title.toLowerCase() == req.params.title.toLowerCase());

  if (!movie) return res.status(404).send();
  res.send(movie);
});

router.post("/:db", async (req, res) => {
  if (!req.body.title) return res.status(400).send("Title is required.");
  const MovieModel = getMovieModel(req.params.db);

  const movie = new MovieModel({ title: req.body.title });
  await movie.save();
  res.status(201).send(movie);
});

router.delete("/:db/:id", async (req, res) => {
  const MovieModel = getMovieModel(req.params.db);
  const movie = await MovieModel.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.status(204).send();
});

module.exports = router;
