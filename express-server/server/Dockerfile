FROM node:12-alpine

RUN npm install -g nodemon
WORKDIR /server

COPY package*.json ./
RUN npm install 

COPY ./ ./

EXPOSE 5000

CMD [ "npm", "run", "dev"]