# # Stage 1: Build the application
# FROM node:18 AS build

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Compile TypeScript to JavaScript
# RUN npm run build

# # Stage 2: Create the production image
# FROM node:18-alpine

# # Set the working directory
# WORKDIR /app

# # Copy the package.json and package-lock.json
# COPY package*.json ./

# # Install production dependencies only
# RUN npm install --only=production

# # Copy the build artifacts from the previous stage
# COPY --from=build /app/dist /app/dist

# # Expose the port the app runs on
# EXPOSE 3000

# # Start the application
# CMD ["npm", "start"]

#########################################################

FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./
RUN npm install --only=production
COPY ./ ./

CMD [ "npm", "run", "dev" ]