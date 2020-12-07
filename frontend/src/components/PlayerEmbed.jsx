import React, { useState, useEffect } from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Flex,
  useColorMode,
  Text,
  Grid,
} from "@chakra-ui/react";
import {
  FaPlayCircle,
  FaPauseCircle,
  FaVolumeMute,
  FaVolumeUp,
  FaSpinner,
} from "react-icons/fa";

const PlayerEmbed = () => {
  const variables = window._env_ ? window._env_ : { REACT_ICECAST_URL: "" };
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(["No data", "No data"]);
  const { colorMode } = useColorMode();
  const colorHover = { light: "white", dark: "black" };

  useEffect(() => {
    const updateStats = async () => {
      let url = variables.REACT_ICECAST_URL + "status-json.xsl";
      let response = await fetch(url);
      let json = await response.json();
      let track = json.icestats.source.title;
      if (track && track !== "") {
        let artist = track.split(" - ")[0];
        track = track.split(" - ").slice(1).join(" - ");
        setNowPlaying([track, artist]);
      }
    };
    updateStats();
    setInterval(() => {
      updateStats();
    }, 10000);
  }, [variables.REACT_ICECAST_URL]);

  const togglePlay = () => {
    let player = document.getElementById("player");
    if (player.paused) {
      setPlaying(true);
      player.load();
      player.play();
    } else {
      setPlaying(false);
      player.pause();
    }
  };

  const changeVolume = (value) => {
    let player = document.getElementById("player");
    value <= 0 ? setMuted(true) : setMuted(false);
    player.volume = value / 100;
  };

  return (
    <div>
      <Flex
        direction="column"
        justify="center"
        align="center"
        width="100%"
        height="100%"
        bg="transparent"
      >
        <Box>
          <Grid
            m={2}
            p={2}
            templateColumns="auto 1fr"
            alignItems="center"
            gap={1}
          >
            <Box
              gridRow="1/4"
              size="80px"
              aria-label="Play toggle"
              as={loading ? FaSpinner : playing ? FaPauseCircle : FaPlayCircle}
              onClick={togglePlay}
              _hover={{ color: colorHover[colorMode] }}
              mr={1}
              className={loading ? "icon-spin" : ""}
            />
            <Text m={0} align="right">
              <strong>{nowPlaying[0]}</strong>
            </Text>
            <Text m={0} align="right">
              {nowPlaying[1]}
            </Text>

            <Flex direction="row" justify="center" maxWidth={400} p={2}>
              <Slider
                defaultValue={100}
                min={0}
                max={100}
                step={10}
                onChange={changeVolume}
                width={80}
              >
                <SliderTrack style={{ height: "5px" }}>
                  <SliderFilledTrack bg="tomato" />
                </SliderTrack>
                <SliderThumb size={2} />
              </Slider>
              <Box
                w="20px"
                h="20px"
                as={muted ? FaVolumeMute : FaVolumeUp}
                ml={3}
              />
              <audio
                id="player"
                autoPlay
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadStart={() => setLoading(true)}
                onLoadedData={() => setLoading(false)}
              >
                <source
                  src={variables.REACT_ICECAST_URL + "radio.mp3"}
                  type="audio/mp3"
                />
                Your browser does not support the audio element.
              </audio>
            </Flex>
          </Grid>
        </Box>
      </Flex>
    </div>
  );
};
export default PlayerEmbed;
