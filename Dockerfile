# Fetching the minified node image on apline linux
FROM node:18-alpine

# Declaring env
ENV NODE_ENV=development
ENV TZ=Pacific/Auckland

# Setting up the work directory
WORKDIR /express-docker

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN npm install

# Building our application
RUN npm run heroku-postbuild

# Starting our application
CMD [ "npm", "run", "start" ]

# Exposing server port
EXPOSE 5001
