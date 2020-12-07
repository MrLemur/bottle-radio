import React, { useState, useEffect, useContext } from "react";
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
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Link,
  Spinner,
} from "@chakra-ui/react";
import {
  FaPlayCircle,
  FaPauseCircle,
  FaVolumeMute,
  FaVolumeUp,
  FaSpinner,
  FaHeart,
} from "react-icons/fa";
import useSaveTrack from "./useSaveTrack";

import { ModalContext, VisualiserContext } from "./Contexts";
import { useRef } from "react";

const Player = () => {
  const variables = window._env_ ? window._env_ : { REACT_ICECAST_URL: "" };
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [nowPlaying, setNowPlaying] = useState(["No data", "No data"]);
  const [listeners, setListeners] = useState([0, 0]);
  const { colorMode } = useColorMode();
  const colorHover = { light: "white", dark: "black" };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const trackLinks = useSaveTrack(
    nowPlaying[0],
    nowPlaying[1],
    variables.REACT_KEY
  );
  const audioRef = useRef(null);
  const { setPlayer } = useContext(VisualiserContext);

  useEffect(() => {
    const audio = document.getElementById("player");
    if (audio) {
      setPlayer(audioRef);
    }
  }, [setPlayer]);

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
      let listeners = json.icestats.source.listeners;
      let peakListeners = json.icestats.source.listener_peak;

      if (listeners && listeners) {
        setListeners([listeners, peakListeners]);
      }
    };
    updateStats();
    setInterval(() => {
      updateStats();
    }, 10000);
  }, [variables.REACT_ICECAST_URL]);

  const togglePlay = () => {
    let player = document.getElementById("player");
    if (firstLoad) {
      setFirstLoad(false);
    }
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

  const TrackModal = (props) => {
    const { modal, setModal } = useContext(ModalContext);

    useEffect(() => {
      if (!modal) {
        setModal(trackLinks);
      }
    }, [modal, setModal]);

    return (
      <div>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setModal();
          }}
          size="sm"
          isCentered
        >
          <ModalOverlay>
            <ModalContent>
              <ModalCloseButton />
              <ModalBody>
                <Grid templateColumns="1fr 1fr" justifyItems="center" gap={0}>
                  {modal && modal.length > 0 ? (
                    modal.map((link) => (
                      <Link key={link.url} href={link.url} isExternal>
                        <Button variant="ghost">{link.displayName}</Button>
                      </Link>
                    ))
                  ) : (
                    <div>
                      <Spinner size="sm" /> Loading...
                    </div>
                  )}
                </Grid>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </div>
    );
  };

  return (
    <div>
      <Flex
        direction="column"
        justify="center"
        align="center"
        width="100%"
        height="100%"
      >
        <Box>
          <Grid
            m={2}
            p={2}
            templateColumns="auto 1fr auto"
            alignItems="center"
            gap={1}
          >
            <Box
              gridRow="1/4"
              w="80px"
              h="80px"
              aria-label="Play toggle"
              as={loading ? FaSpinner : playing ? FaPauseCircle : FaPlayCircle}
              onClick={togglePlay}
              _hover={{ color: colorHover[colorMode] }}
              mr={1}
              className={loading ? "icon-spin" : ""}
            />
            <Text m={0} align="center">
              <strong>{nowPlaying[0]}</strong>
            </Text>
            <Text m={0} align="center">
              {nowPlaying[1]}
            </Text>

            <Flex direction="row" justify="center" maxWidth={400} p={2}>
              <Slider
                defaultValue={100}
                min={0}
                max={100}
                step={10}
                onChange={changeVolume}
                width="80px"
              >
                <SliderTrack>
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
                crossOrigin="anonymous"
                autoPlay
                preload="none"
                ref={audioRef}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadStart={() => {
                  if (!firstLoad) {
                    setLoading(true);
                  }
                }}
                onCanPlay={() => setLoading(false)}
              >
                <source
                  src={variables.REACT_ICECAST_URL + "radio.mp3"}
                  type="audio/mp3"
                />
                Your browser does not support the audio element.
              </audio>
            </Flex>
            <Text gridColumn="1/4">
              <strong>Listeners: </strong>
              {listeners[0]} <strong>Peak: </strong>
              {listeners[1]}
            </Text>
            <Box gridColumn="3" gridRow="1/4" alignItems="center">
              <Box
                w="25px"
                h="25px"
                as={FaHeart}
                mx={1}
                onClick={onOpen}
                _hover={{ color: "tomato" }}
              />
              {isOpen ? <TrackModal /> : null}
            </Box>
          </Grid>
        </Box>
      </Flex>
    </div>
  );
};
export default Player;
