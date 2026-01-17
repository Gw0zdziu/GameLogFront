FROM node:alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm cache clean --force
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine
RUN rm -r /usr/share/nginx/html/*
COPY --from=build /app/dist/game-log-front/browser/ /usr/share/nginx/html/
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
