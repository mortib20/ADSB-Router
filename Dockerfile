FROM node:20-alpine3.17 as build

WORKDIR /app
COPY . .

RUN npm install -d
RUN npx tsc

FROM node:20-alpine3.17

WORKDIR /app
COPY --from=build /app/dist /app