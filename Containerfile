FROM docker.io/node:latest

WORKDIR /app
VOLUME /app/data
VOLUME /app/config

COPY . /app
RUN npm install

CMD npm start
