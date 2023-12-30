# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY pong .

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]
