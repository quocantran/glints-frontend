FROM node:18-alpine AS install-dependencies

RUN apk update && apk add chromium

WORKDIR /user/apps/server

COPY . .

RUN npm install --quiet --no-optional --no-fund --loglevel=error

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]
