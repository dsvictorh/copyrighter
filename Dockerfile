FROM node:14

WORKDIR /copyrighter

COPY . .

RUN npm install

RUN npm run build