import React, { useState, useEffect } from "react";
import MovieForm from "./MovieForm";
import MovieList from "./MovieList";
import api from "../services/api";
import databases from "../enums/databases";

import "./App.css";

function App() {
  const moviesEndpoint = "/movies";
  const [mongo1Movies, setMongo1Movies] = useState([]);
  const [mongo2Movies, setMongo2Movies] = useState([]);
  const [error, setError] = useState();

  function setMovies(database, data) {
    return database == databases.MONGO1 ? setMongo1Movies(data): setMongo2Movies(data) 
  };

  const fetchMovies = async (database) => {
    try {
      const movies = await api.get(moviesEndpoint + database);
      setMovies(database, movies.data);
    } catch (error) {
      setError("Could not fetch movies!");
    }
  };

  const handleAddMovie = async (title, database) => {
    try {
      const movie = { _id: Date.now(), title };
      
      await api.create(moviesEndpoint + database, movie);

      setMovies(database, database == databases.MONGO1 ? 
        [...mongo1Movies, movie] : [...mongo2Movies, movie]);
    } catch (error) {
      setError("Could not save the movie!");
      setMovies(database, database == databases.MONGO1 ? mongo1Movies : mongo2Movies);
    }
  };

  const handleDeleteMovie = async (movie, database) => {
    try {
      const filteredMovies = database == databases.MONGO1 ? 
        mongo1Movies.filter((m) => m !== movie) : mongo2Movies.filter((m) => m !== movie)

      setMovies(database, filteredMovies);
      await api.remove(moviesEndpoint + database + "/" + movie._id);
    } catch (error) {
      setError("Could not delete the movie!");
      setMovies(database, database == databases.MONGO1 ? mongo1Movies : mongo2Movies);
    }
  };

  useEffect(() => {
    fetchMovies(databases.MONGO1);
    fetchMovies(databases.MONGO2);
  }, []);

  return (
    <div>
      <div className="App">
        <MovieForm onAddMovie={handleAddMovie} database={databases.MONGO1} />
        {error && (
          <p role="alert" className="Error">
            {error}
          </p>
        )}
        <MovieList movies={mongo1Movies} onDeleteMovie={handleDeleteMovie} database={databases.MONGO1} />
      </div>
      <div className="App">
        <MovieForm onAddMovie={handleAddMovie} database={databases.MONGO2} />
        {error && (
          <p role="alert" className="Error">
            {error}
          </p>
        )}
        <MovieList movies={mongo2Movies} onDeleteMovie={handleDeleteMovie} database={databases.MONGO2} />
      </div>
    </div>
  );
}

export default App;
