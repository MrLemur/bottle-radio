FROM debian:bullseye-slim

LABEL Author Kassim Benhaddad <kassim@kass.im>

# Switch to the root user while we do our changes
USER root

# Install GStreamer and other required Debian packages
RUN apt-get update \
    && apt-get install -y \
    dumb-init \
    gnupg \
    wget \
    git \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-ugly \
    python3-gst-1.0 \
    python3-pip

RUN mkdir -p /etc/apt/keyrings \
    && wget -q -O /etc/apt/keyrings/mopidy-archive-keyring.gpg https://apt.mopidy.com/mopidy.gpg \
    && wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/bullseye.list \
    && apt-get update \
    && apt-get install -y libspotify-dev \
    && rm -rf /var/lib/apt/lists/*

RUN wget -q -O libshout3_2.4.1-2_amd64.deb http://ftp.de.debian.org/debian/pool/main/libs/libshout/libshout3_2.4.1-2_amd64.deb \
    && dpkg -i ./libshout3_2.4.1-2_amd64.deb

RUN wget -q -O gst-plugin-spotify_0.12.2-1_amd64.deb https://github.com/kingosticks/gst-plugins-rs-build/releases/download/gst-plugin-spotify_0.12.2-1/gst-plugin-spotify_0.12.2-1_amd64.deb \
    && dpkg -i ./gst-plugin-spotify_0.12.2-1_amd64.deb

# Install additional Python dependencies
RUN python3 -m pip install --no-cache \
    tox \
    mopidy-mpd \
    Mopidy-Spotify==5.0.0a1 \
    mopidy-local \
    Mopidy-SoundCloud \
    Mopidy-Podcast \
    Mopidy-Iris

RUN useradd -ms /bin/bash mopidy
ENV HOME=/var/lib/mopidy
RUN set -ex \
    && usermod -G audio,sudo mopidy \
    && mkdir -p /var/lib/mopidy/local \
    && chown mopidy:audio -R $HOME  \
    && chmod go+rwx -R $HOME \
    && echo "1" >> /IS_CONTAINER

COPY mopidy.conf /var/lib/mopidy/.config/mopidy/mopidy.conf

COPY mpc_pause_check.sh /opt/

RUN chmod +x /opt/mpc_pause_check.sh

HEALTHCHECK --interval=60s --timeout=30s CMD bash /opt/mpc_pause_check.sh

# Runs as mopidy user by default.
USER mopidy:audio

VOLUME ["/var/lib/mopidy/local"]

EXPOSE 6680

ENTRYPOINT ["/usr/local/bin/mopidy"]