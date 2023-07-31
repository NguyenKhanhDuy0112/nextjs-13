#!/bin/sh

mkdir -p ./src/locales/en && \
    cd ./src/locales/en && \
    curl https://localise.biz/api/export/locale/en-US.json\?index\=id\&format\=i18next\&order\=id\&key\=PtwUQmq8uVwxz8j9t6nVPeFONcjpE1P4 -o common.json

cd ../../../

mkdir -p ./src/locales/vi && \
    cd ./src/locales/vi && \
    curl https://localise.biz/api/export/locale/vi-VN.json\?index\=id\&format\=i18next\&order\=id\&key\=PtwUQmq8uVwxz8j9t6nVPeFONcjpE1P4 -o common.json
