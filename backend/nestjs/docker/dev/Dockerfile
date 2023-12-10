# Use a multi-stage build for smaller image size
FROM node:18 AS builder

# Create app directory
WORKDIR /usr/src/app

COPY pong .

# Install build dependencies
RUN apt-get update && apt-get install -y build-essential

# Install app dependencies
RUN npm install

# Creates a "dist" folder with the production build
RUN npm run build

# Use a lighter image for the final stage
FROM node:18-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy only necessary files, including the built application
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start:dev"]
