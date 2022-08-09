#! /bin/bash

JS_PATH=/home/konng/ballgame/game/static/js/
JS_PATH_DIST=${JS_PATH}dist/
JS_PATH_SRC=${JS_PATH}src/

# 将 src 目录下的 js 文件打包为一个文件 
find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}game.js
