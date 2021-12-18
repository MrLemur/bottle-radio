import { useState, useEffect } from "react";

const useSaveTrack = (track, artist) => {
  const [trackList, setTrackList] = useState([]);
  const getApi = async (url) => {
    let response = await fetch(url);
    return await response.json();
  };

  const hostURL = window.location.protocol + "//" + window.location.host;

  const linksUrl = hostURL + "/song-links.json";

  useEffect(() => {
    if (track !== "No data" && artist !== "No data") {
      setTimeout(() => {
        getApi(linksUrl).then((data) => {
          setTrackList(data);
        })
      },3000)} else {
          setTrackList([]);
        }
  }, [track, artist, linksUrl]);
  return trackList;
};

export default useSaveTrack;
