# Stage 1: Download Node
FROM node:20.15.1-alpine AS build

# Working Directory as Variable
ENV APP_HOME=/app/react

# Set the working directory
WORKDIR $APP_HOME

# Copy package.json and package-lock.json from local to docker image path
COPY package*.json ./

# Install dependencies (node modules)
RUN npm install

# Copy all files from local to docker image path
COPY . .

# Build React application
RUN npm run build

# Stage 2: Serve React Application using serve
FROM node:20.15.1-alpine

# Install `serve` globally
RUN npm install -g serve

# Copy build files from Stage 1 to current path
COPY --from=build /app/react/build home/build

# Expose port 5000 (default port for `serve`)
EXPOSE 5000

# Start the `serve` server
CMD ["serve", "-s", "build", "-l", "5000"]
