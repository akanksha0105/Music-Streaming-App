import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import "./App.css";
import Login from "./components/Login";
import Player from "./components/Player";
import { getTokenFromURL } from "./spotify";
import { useStateValue } from "./StateProvider";

//creates an instance of the spotify that helps in communicating with spotify application
const spotify = new SpotifyWebApi();

function App() {
  const [{ user, token }, dispatch] = useStateValue();
  useEffect(() => {
    const hash = getTokenFromURL();

    console.log("I have a hash", hash);
    window.location.hash = "";
    const _token = hash.access_token;

    if (_token) {
      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });
      // setToken(_token);

      spotify.setAccessToken(_token);

      //returns a promise - gets a user profile
      spotify.getMe().then((user) => {
        dispatch({
          type: "SET_USER",
          user: user,
        });
      });

      spotify.getUserPlaylists().then((currentUserPlaylists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists: currentUserPlaylists,
        });
      });
    }

    spotify.getPlaylist("37i9dQZEVXcWF3x9o55cMH").then((response) => {
      dispatch({
        type: "SET_DISCOVER_WEEKLY",
        discover_weekly: response,
      });
    });
    console.log("Debuging point,I have a token", token);
  }, []);

  console.log("Debuging point, current user after state layer", user);
  console.log("Debuging point,token after state layer", token);

  return (
    <div className="app">
      {token ? <Player spotify={spotify} /> : <Login />}
    </div>
  );
}

export default App;
