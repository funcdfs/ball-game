sudo redis-server /etc/redis/redis.conf

daphne -b 0.0.0.0 -p 5015 ballgame.asgi:application

uwsgi --ini script/uwsgi.ini

./script/compress_game_js.sh
