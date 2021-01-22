FROM php:7-fpm-alpine

# Important to set the timezone
RUN apk add --no-cache tzdata

# Easy installation of PHP extensions in official PHP Docker images, feel free to add or remove :
# opcache required to speedup the php
# pdo_mysql required by php-telegram-bot/core
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions && sync && \
    install-php-extensions opcache pdo_mysql

# Use the default production configuration
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Copy configuration file
COPY docker.conf /usr/local/etc/php-fpm.d/docker.conf
COPY php-custom.ini /usr/local/etc/php/conf.d/php-custom.ini
