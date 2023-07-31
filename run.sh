# #!/bin/sh

# echo "Regenerate Application Configuration"

# #Handle static host file
# # INDEX_FILE=$(ls ./build/index.html)
# # echo $INDEX_FILE
# # envsub --syntax handlebars $INDEX_FILE $INDEX_FILE

# # Replace env by envsub in all bundle file
# for f in ./build/static/js/* ; do envsub --syntax handlebars "$f" "$f" ; done

# apk --no-cache add curl

# mkdir -p ./build/locales/en && \
#     curl https://localise.biz/api/export/locale/en-US.json\?index\=id\&format\=i18next\&order\=id\&key\=PtwUQmq8uVwxz8j9t6nVPeFONcjpE1P4 -o ./build/locales/en/common.json

# mkdir -p ./build/locales/vi && \
#     curl https://localise.biz/api/export/locale/vi-VN.json\?index\=id\&format\=i18next\&order\=id\&key\=PtwUQmq8uVwxz8j9t6nVPeFONcjpE1P4 -o ./build/locales/vi/common.json

# #Handle nginx default config
# NGINX_CONF_FILE=$(ls /etc/nginx/conf.d/default.conf)
# echo $NGINX_CONF_FILE
# envsub --syntax handlebars $NGINX_CONF_FILE $NGINX_CONF_FILE

# #Handle React static HTMLs

# # echo $FILE
# # STATIC_ARTIFACT=./build/bundle.js
# # echo $STATIC_ARTIFACT
# # envsub --syntax handlebars $STATIC_ARTIFACT $STATIC_ARTIFACT

# echo "Run application"
# nginx -t
# nginx -g "daemon off;"

# echo "Webapp started"

#for f in ./build/static/js/* ; do envsub --syntax handlebars "$f" "$f" ; done

npm install 

npm install -g envsub

envsub --syntax handlebars ".env.tmpl" ".env"

vesion='$aNEXT_PUBLIC_BUILD_VERSION'=$(git rev-parse HEAD)
sed -i -e "$vesion" .env

npm run build

npm run start