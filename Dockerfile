FROM node:14-alpine

RUN apk add --no-cache postgresql-client
RUN apk add --no-cache postgresql-dev gcc python3 musl-dev
RUN apk add --no-cache --virtual .build-deps make g++

WORKDIR /app

COPY package*.json ./

COPY ./prisma/schema.prisma ./prisma/schema.prisma

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]