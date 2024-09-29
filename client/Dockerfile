# Stage 1: Build the React Vite application
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the built application
FROM node:18-alpine

# Install serve globally
RUN npm install -g serve

# Copy the built files from the previous stage
COPY --from=build /app/dist /app/dist

# Expose the port the app runs on
EXPOSE 3000

# Set the default command to serve the application
CMD ["serve", "-s", "/app/dist"]

