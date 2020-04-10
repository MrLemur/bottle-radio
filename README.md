# Bottle Radio

![Bottle radio](bottle_radio.png)

This is the initial scaffolding for a radio service that allows an always playing web stream to be sent to an Icecast server. It also allows a live streamer/DJ to connect to the app and play live, with a jingle used in the transitions.

This project is using a few Docker containers to demonstrate this with Spotify. The underlying tech is [Liquidsoap](https://www.liquidsoap.info/) for describing how streams should be handled, Icecast for streaming to listeners, Traefik for routing, Mopidy for Spotify integration, and React for the frontend application.

## TODO

- [x] add ability to pop out player in iframe
- [x] add links for itunes direct stream
- [ ] add indicator on page to show broadcast in progress
- [ ] add function/container to create a new jingle based on DJ name
- [ ] add function to give DJ name and Spotify playlist, and automatically switch to playlist with jingle

## Setup

1. Ensure you have Docker installed.
2. Clone this repo to a directory of your choice.
3. Change in to the directory and run `docker-compose up`.
4. The first run might take a while as it needs to build the image.

## Usage

Once the containers are spun up, there are two ways to interact with it

### Listening

In your browser, go to `https://[your_domain]/radio.mp3`. This is the Icecast stream and you should hear coming from Mopidy.

### Streaming

To set up a live stream:

- Using Butt or similar, configure the server to be `[your_domain]` on port `8005` using the Icecast 2 protocol.
- Set the mount point to `/`.
- Set the username and password to be `dj`.
- You can start broadcasting/talking once the stream is 11 seconds live.
- If you go to the listening page, you will hear the transition to jingle as expected.

## Configuration

The Liquidsoap configuration is hard coded in to the file `conf/default.liq`.

If you make any changes, you will need to run `docker-compose down` and `docker-compose up` for them to take effect.
