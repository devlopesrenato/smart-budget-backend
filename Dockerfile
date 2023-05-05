FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

COPY ./prisma/schema.prisma ./prisma/schema.prisma

COPY ./.env ./.env

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]