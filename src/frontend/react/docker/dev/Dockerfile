# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY . .
RUN npm install

CMD ["npm", "start"]