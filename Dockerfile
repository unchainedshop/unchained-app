FROM node:24-alpine AS bundler

# Install app dependencies
RUN mkdir -p /webapp
WORKDIR /webapp
COPY package* /webapp/

ENV PORT=3000
ENV NODE_ENV=production

RUN echo "${GIT_COMMIT}" > /webapp/version.txt && npm ci

COPY . /webapp/

HEALTHCHECK --start-period=10s --interval=20s --timeout=2s \
  CMD wget --spider --header 'content-type: application/json' --post-data '{"operationName":null,"variables":{},"query":"{\n  shopInfo {\n    _id\n  }\n}\n"}' http://localhost:3000/graphql

EXPOSE 3000

USER node

CMD ["npm", "start"]
