FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=base /app/dist ./dist
COPY .env.example ./
EXPOSE 8081
CMD ["node", "dist/server.js"]
