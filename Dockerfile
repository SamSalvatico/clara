FROM node:12-alpine

COPY . .

RUN apk add --no-cache coreutils 

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]