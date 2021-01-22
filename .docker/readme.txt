cd php
docker build -t dodyagung/telegram-sale-bot-php .
docker push dodyagung/telegram-sale-bot-php

cd nginx
docker build -t dodyagung/telegram-sale-bot-nginx .
docker push dodyagung/telegram-sale-bot-nginx

cd mariadb
docker build -t dodyagung/telegram-sale-bot-mariadb .
docker push dodyagung/telegram-sale-bot-mariadb