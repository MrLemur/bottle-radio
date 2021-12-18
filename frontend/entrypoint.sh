#!/bin/bash

/usr/share/caddy/env.sh
song-links &
caddy run --config /etc/caddy/Caddyfile --adapter caddyfile