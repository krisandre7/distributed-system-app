import React, { useState, useEffect } from "react";
import MovieForm from "./MovieForm";
import MovieList from "./MovieList";
import api from "../services/api";
import databases from "../enums/databases";

import "./App.css";

function App() {
  const [mongo1Movies, setMongo1Movies] = useState([]);
  const [mongo2Movies, setMongo2Movies] = useState([]);
  const [error, setError] = useState();

  function setMovies(database, data) {
    return database == databases.MONGO1 ? setMongo1Movies(data): setMongo2Movies(data) 
  };

  const fetchMovies = async (database) => {
    try {
      console.log("http://localhost:3001/api" + database);
      const { movies } = await api.get(database);
      setMovies(database, movies);
    } catch (error) {
      setError("Could not fetch movies!");
    }
  };

  const handleAddMovie = async (title, database) => {
    try {
      const movie = { _id: Date.now(), title };
      setMovies(database, [...mongo1Movies, movie]);

      const { data: savedMovie } = await api.create(database, movie);

      setMovies(database, [...mongo1Movies, savedMovie]);
    } catch (error) {
      setError("Could not save the movie in Mongo1!");
      setMovies(database, database == databases.MONGO1 ? mongo1Movies : mongo2Movies);
    }
  };

  const handleDeleteMovie = async (movie, database) => {
    try {
      const filteredMovies = database == databases.MONGO1 ? 
        mongo1Movies.filter((m) => m !== movie) : mongo2Movies.filter((m) => m !== movie)

      setMovies(database, filteredMovies);
      await api.remove(database + "/" + movie._id);
    } catch (error) {
      setError("Could not delete the movie on Mongo1!");
      setMovies(database, database == databases.MONGO1 ? mongo1Movies : mongo2Movies);
    }
  };

  useEffect(() => {
    fetchMovies(databases.MONGO1);
    fetchMovies(databases.MONGO2);
  }, []);

  return (
    <div className="App">
      <MovieForm onAddMovie={handleAddMovie} database={databases.MONGO1} />
      {error && (
        <p role="alert" className="Error">
          {error}
        </p>
      )}
      <MovieList movies={mongo1Movies} onDeleteMovie={handleDeleteMovie} database={databases.MONGO1} />
    </div>
  );
}

export default App;
