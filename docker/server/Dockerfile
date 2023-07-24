FROM node:18-alpine

WORKDIR /home

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./workspaces/server ./workspaces/server
COPY ./workspaces/shared ./workspaces/shared

RUN yarn install
RUN yarn build:server


CMD ["yarn", "start:prod:server"]