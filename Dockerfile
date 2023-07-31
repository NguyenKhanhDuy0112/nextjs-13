# => Build container
FROM node:18.17.0 as react_build_base

# ARG MOMO_AUTH_TOKEN

WORKDIR /app

# COPY ./public /app/public

# RUN npm config set @momo-miniapp:registry https://gitlab.com/api/v4/projects/27153631/packages/npm/

# RUN npm config set -- '//gitlab.com/api/v4/projects/27153631/packages/npm/:_authToken' $MOMO_AUTH_TOKEN

COPY . ./

CMD [ "./run.sh" ]

