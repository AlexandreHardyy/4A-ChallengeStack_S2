FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

ARG BASEURL_SERVER
ENV BASEURL_SERVER ${BASEURL_SERVER}

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]