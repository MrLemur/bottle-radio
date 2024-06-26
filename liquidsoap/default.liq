set("init.daemon", false)
set("init.daemon.pidfile.path", "/etc/liquidsoap/liquidsoap.pid")
set("log.stdout", true)
set("log.file", false)
set("server.telnet", true)
set("server.telnet.bind_addr", "0.0.0.0")
set("server.telnet.port", 8004)
set("harbor.bind_addrs", ["0.0.0.0"])

set("tag.encodings", ["UTF-8", "ISO-8859-1"])
set("encoder.encoder.export", ["artist", "title", "album", "song"])

setenv("TZ", "UTC")

def get_var(variable, default) =
  env_var = environment.get(variable)
  log(env_var)
  if env_var == "" then default else env_var end
end

jingle = single("/etc/liquidsoap/jingle.mp3")

def to_live(old, new) =
  add(
    normalize=false,
    [
      fade.in(new),
      sequence([blank(duration=1.), jingle, fallback([])]),
      fade.out(old)
    ]
  )
end

def from_live(old, new) =
  sequence(merge=true, [fade.out(old), jingle, fade.in(new)])
end

# Add missing metadata to live stream function
def fix_live_metadata(m) =
  # Grab the current title

  # Grab the current title
  title = m["title"]
  artist = m["artist"]

  # Insert metadata if it is missing during live broadcast
  if
    title == "Unknown" or title == ""
  then
    [
      (
        "title",
        "Live Broadcast - This is a live broadcast"
      )
    ]
  else
    [("title", title)]
  end
end

def log_metadata(m) =
  # Grab the current title and artist
  metadata = string.split(separator="-", m["title"])
  title = url.encode(string.trim(list.nth(default="", metadata, 0)))
  artist = url.encode(string.trim(list.nth(default="", metadata, 1)))
  ignore(
    http.head(
      timeout=0.5, "http://frontend:10000/?title=#{title}&artist=#{artist}"
    )
  )
  print(
    "Sending metadata to frontend: #{title} by #{artist}"
  )
end

mopidy_stream =
  mksafe(
    audio_to_stereo(
      input.harbor(
        "/mopidy",
        id="mopidy_stream",
        port=8010,
        user="mopidy",
        password="mopidy",
        metadata_charset="UTF-8",
        max=30.0
      )
    )
  )

mopidy_stream = source.on_metadata(mopidy_stream, log_metadata)

# Live Broadcasting
live =
  input.harbor(
    "/",
    id="live_streamer_input",
    port=8005,
    user=get_var("LIQUIDSOAP_DJ_USERNAME", "dj"),
    password=get_var("LIQUIDSOAP_DJ_PASSWORD", "dj"),
    metadata_charset="UTF-8"
  )

# Add metadata if missing to live stream
live = map_metadata(fix_live_metadata, live)

radio =
  fallback(
    track_sensitive=false,
    transition_length=11.0,
    transitions=[to_live, from_live],
    [live, mopidy_stream]
  )

# Local Broadcasts
output.icecast(
  %mp3(samplerate = 44100, stereo = true, bitrate = 256, id3v2 = true),
  id="icecast_stream",
  host="icecast",
  port=8000,
  password=get_var("ICECAST_SOURCE_PASSWORD", "admin"),
  mount="/radio.mp3",
  name=
    "Bottle Radio",
  description=
    "Radio in a bottle.",
  genre="",
  public=false,
  encoding="UTF-8",
  radio
)
