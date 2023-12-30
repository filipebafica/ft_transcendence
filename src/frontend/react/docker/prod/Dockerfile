# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm install -D serve

RUN npm run build

CMD ["npx", "serve", "build", "-p", "3001"]
