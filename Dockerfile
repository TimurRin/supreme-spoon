FROM node:22.11.0

WORKDIR /app

RUN chown -R node:node /app

USER node

COPY package*.json ./
COPY esbuild.js ./
COPY src src
COPY test test
COPY migrations migrations

RUN npm ci

RUN npm run build

CMD ["npm", "start"]
