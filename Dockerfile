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

# Stage 2: Serve React Application using nginx
FROM nginx:alpine

# Copy build files from Stage 1 to nginx path
COPY --from=build /app/react/build /usr/share/nginx/html

# Copy nginx configuration (if needed)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
