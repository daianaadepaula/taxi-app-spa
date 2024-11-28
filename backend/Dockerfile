FROM node:20

WORKDIR /backend

COPY package*.json ./
COPY tsconfig.json ./
COPY . .

RUN rm -rf node_modules
RUN npm install --legacy-peer-deps

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
