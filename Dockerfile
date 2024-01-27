FROM node:21-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json yarn.lock .
RUN yarn install
COPY server.js .
EXPOSE 7000
CMD [ "yarn", "start"]
