# Use the Node.js alpine image
FROM node:18-alpine

# Set up the working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .



# Expose the application port
EXPOSE 4000

# Start the compiled JavaScript file
CMD ["npm", "start"]