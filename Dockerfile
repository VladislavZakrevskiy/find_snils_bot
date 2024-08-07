FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    TELEGRAM_KEY=7215076719:AAGyt047Oh0iu4GLL4mwq8CUyFS0tZ5YujA

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i
COPY . .
CMD [ "npm", "build" ]
CMD [ "npm", "start" ]
