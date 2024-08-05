# Fetching the minified node image on apline linux
FROM node:18-alpine

# Setting up the work directory
WORKDIR /app

# COPY package.json
COPY package.json /app

# Installing dependencies
RUN npm install

# Copying all the files in our project
COPY . /app

# Exposing server port
EXPOSE 4000

# Starting our application
CMD [ 'npm' , 'start' ]