FROM nginx:stable-alpine

# important to set the timezone
RUN apk add --no-cache tzdata

# copy configuration file
COPY default.conf /etc/nginx/conf.d/default.conf

# set work dir
WORKDIR /var/www/html