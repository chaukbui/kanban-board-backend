FROM node:15.13.0-alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

CMD [ "npm", "start" ]
EXPOSE 8080
