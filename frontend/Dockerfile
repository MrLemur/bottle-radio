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

# Default port exposure
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/caddy/
COPY ./env.sh .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

RUN printf ':80 \nroot * /usr/share/caddy \nfile_server \ntry_files {path} /index.html \nencode gzip' > /etc/caddy/Caddyfile

# Start Caddy
CMD ["/bin/bash", "-c", "/usr/share/caddy/env.sh && caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"]