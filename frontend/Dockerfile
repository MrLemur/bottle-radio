# Build go binary
FROM golang:1.17-alpine as go_builder
WORKDIR /app
COPY song-links/main.go .
COPY song-links/go.mod .
RUN go build -ldflags="-s -w"
RUN chmod +x song-links

# => Build container
FROM node:16-alpine as builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build

# => Run container
FROM caddy/caddy

# Static build
COPY --from=builder /app/build /usr/share/caddy/

# Copy Go songs-link binary
COPY --from=go_builder /app/song-links /usr/local/bin/

# Default port exposure
EXPOSE 80 10000

# Copy .env file and shell script to container
WORKDIR /usr/share/caddy/
COPY ./env.sh .

# Add bash
RUN apk add --no-cache bash

# Add entrypoint.sh
COPY ./entrypoint.sh /etc/

# Make our shell script executable
RUN chmod +x env.sh

RUN printf ':80 \nroot * /usr/share/caddy \nfile_server \ntry_files {path} /index.html \nencode gzip' > /etc/caddy/Caddyfile

# Start Caddy
CMD ["/etc/entrypoint.sh"]