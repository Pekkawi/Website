# Choose the correct base image for your Raspberry Pi's architecture
FROM node:current-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of your application's source code
COPY . .

# Build your application
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start your application
CMD ["npm", "start"]