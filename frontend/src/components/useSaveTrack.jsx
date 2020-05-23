import { useState, useEffect } from "react";

const useSaveTrack = (track, artist, key) => {
  const [trackList, setTrackList] = useState();
  const getApi = async (url) => {
    let response = await fetch(url);
    return await response.json();
  };

  const searchUrl = `https://itunes.apple.com/search?term=${track} ${artist}&country=IE&entity=song&key=${key}`;

  useEffect(() => {
    let links = [];
    getApi(searchUrl).then((data) => {
      if (data.results[0] && data.results[0].wrapperType === "track") {
        const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.song.link/page?url=https://song.link/i/${data.results[0].trackId}`;
        getApi(apiUrl).then((streamingServices) => {
          if (streamingServices && streamingServices.inputNodeUniqueId) {
            Object.entries(streamingServices.nodesByUniqueId).map((node) => {
              if (node[0].includes("AUTOMATED_LINK")) {
                if (node[1].matchNodeUniqueId) {
                  let currentNode = node[1];
                  if (
                    currentNode.sectionNodeUniqueId ===
                    "AUTOMATED_SECTION::LISTEN"
                  ) {
                    links.push({
                      type: "listen",
                      displayName: currentNode.displayName,
                      url: currentNode.url,
                    });
                  }
                  if (
                    currentNode.sectionNodeUniqueId === "AUTOMATED_SECTION::BUY"
                  ) {
                    links.push({
                      type: "buy",
                      displayName: currentNode.displayName,
                      url: currentNode.url,
                    });
                  }
                }
              }
              return null;
            });
          }
          setTrackList(links);
        });
      }
    });
  }, [track, artist, searchUrl]);
  return trackList;
};

export default useSaveTrack;
