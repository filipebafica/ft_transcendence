# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY pong .

COPY docker/dev/script.sh ./script.sh
RUN chmod +x ./script.sh

EXPOSE 3000

# Start the server using the production build
ENTRYPOINT [ "./script.sh" ]
