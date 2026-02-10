#build 
FROM node:24 AS node-build
RUN mkdir /build
WORKDIR  /build
COPY rest_api/package*.json  ./
COPY rest_api/ ./
RUN npm ci 
COPY rest_api/ ./
ARG  DATABASE_URL
#generate prisma client 
ENV DATABASE_URL=$DATABASE_URL
RUN  npx prisma migrate prod && npx prisma generate

#production 
FROM alpine:latest 
RUN apk add --update nodejs 
RUN addgroup -S node && adduser -S node -G node
USER node 
WORKDIR /node/api/code
COPY --from=node-build --chown=node:node /build ./
EXPOSE  3000
RUN  cd rest_api/

#ensure we're running the command from a directory containing package.json
CMD   ["npm","run", "prod"]
