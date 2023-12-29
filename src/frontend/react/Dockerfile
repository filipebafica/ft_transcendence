# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY . .
RUN chmod +x ./script.sh

ENTRYPOINT [ "./script.sh" ]
