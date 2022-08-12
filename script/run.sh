uwsgi --ini script/uwsgi.ini
./script/compress_game_js.sh
daphne -b 0.0.0.0 -p 5015 ballgame.asgi:application
