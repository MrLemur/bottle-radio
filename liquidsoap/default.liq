
set("init.daemon", false)
set("init.daemon.pidfile.path","/etc/liquidsoap/liquidsoap.pid")
set("log.stdout", true)
set("log.file", false)
set("server.telnet",true)
set("server.telnet.bind_addr","0.0.0.0")
set("server.telnet.port", 8004)
set("harbor.bind_addrs",["0.0.0.0"])

set("tag.encodings",["UTF-8","ISO-8859-1"])
set("encoder.encoder.export",["artist","title","album","song"])

setenv("TZ", "UTC")

def get_var(variable, default) =
  env_var = getenv(variable)
  log(env_var)
  if env_var == "" then default else env_var end
end

# Define a transition that fades out the
# old source, adds a jingle, and then 
# plays the new source
def to_live(jingle,old,new) = 
  # Fade out old source
  old = fade.final(old)
  # Superpose the jingle
  s = add([jingle,old])
  # Compose this in sequence with
  # the new source
  sequence([s,new])
end

def from_live(jingle,old,new) = 
  # Fade out old source
  old = fade.final(old)
  # Superpose the jingle
  s = add([jingle,old])
  # Compose this in sequence with
  # the new source
  sequence([s,fade.initial(new)],merge=true)
end

jingles = audio_to_stereo(playlist("/etc/liquidsoap/jingles"))
jingle_live = audio_to_stereo(single("/etc/liquidsoap/jingles/jingle.mp3"))

mopidy_stream = mksafe(audio_to_stereo(input.harbor("/mopidy", id = "mopidy_stream", port = 8010,  user = "mopidy", password = "mopidy", metadata_charset = "UTF-8", max = 30.0)))

mopidy_stream = smooth_add(delay=0.3, p=0.35, normal = mopidy_stream, special = switch([({0m0s},random([jingles]))]))

# Add missing metadata to live stream function
def fix_live_metadata(m) =
  # Grab the current title
  title = m["title"]
  # Insert metadata if it is missing during live broadcast
  if title == "Unknown" or title == "" then [("title","Live Broadcast - This is a live broadcast")] else [("title",title)] end
end

# Live Broadcasting
live = audio_to_stereo(input.harbor("/", id = "live_streamer_input", port = 8005,  user = get_var("LIQUIDSOAP_DJ_USERNAME","dj"), password = get_var("LIQUIDSOAP_DJ_PASSWORD","dj"), metadata_charset = "UTF-8", max = 30.0))
# Add metadata if missing to live stream
live = map_metadata(fix_live_metadata, live)

radio = fallback(track_sensitive=false,transition_length=11.0,transitions=[to_live(jingle_live),from_live(jingle_live)],[live,mopidy_stream])

# Talk over stream using microphone mount.
mic = input.harbor("mic", port=8015, user = get_var("LIQUIDSOAP_DJ_USERNAME","dj"), password = get_var("LIQUIDSOAP_DJ_PASSWORD","dj"), buffer=1.0)

radio = smooth_add(delay=0.3, p=0.30, normal=radio, special=mic)

# Local Broadcasts
output.icecast(%mp3(samplerate=44100, stereo=true, bitrate=256, id3v2=true), id="icecast_stream", host = "icecast", port = 8000, password = get_var("ICECAST_SOURCE_PASSWORD","admin"), mount = "/radio.mp3", name = "Bottle Radio", description = "Radio in a bottle.", genre = "", public = false, encoding = "UTF-8", radio)
