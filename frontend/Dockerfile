# Official Node.js image
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm clean-install
COPY . .

#RUN npm run dev
RUN npm run build

CMD ["npm", "start"]