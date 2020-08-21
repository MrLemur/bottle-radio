import { useState, useEffect } from "react";

const displayNameFix = (name) => {
  let result = name.replace(/([A-Z])/g, " $1");
  let finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
};

const useSaveTrack = (track, artist, key) => {
  const [trackList, setTrackList] = useState([]);
  const getApi = async (url) => {
    let response = await fetch(url);
    return await response.json();
  };

  const searchUrl = `https://itunes.apple.com/search?term=${track} ${artist}&country=IE&entity=song&key=${key}`;

  useEffect(() => {
    if (track != "No data" && artist != "No data") {
      let links = [];
      getApi(searchUrl).then((data) => {
        if (data.results[0] && data.results[0].wrapperType === "track") {
          const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.song.link/v1-alpha.1/links?platform=itunes&type=song&userCountry=GB&id=${data.results[0].trackId}`;
          getApi(apiUrl).then((streamingServices) => {
            if (streamingServices && streamingServices.linksByPlatform) {
              Object.entries(streamingServices.linksByPlatform).map((node) => {
                let url = node[1].url;
                let displayName = displayNameFix(node[0]);
                links.push({
                  type: "listen",
                  displayName: displayName,
                  url: url,
                });
                return null;
              });
            }
            setTrackList(links);
          });
        } else {
          setTrackList([]);
        }
      });
    }
  }, [track, artist, searchUrl]);
  return trackList;
};

export default useSaveTrack;
