# Étape 1 : Build de l'application React
FROM node:18 AS build

WORKDIR /app

COPY Gradely/package*.json ./

RUN npm install

COPY Gradely ./

RUN npm run build

# Étape 2 : Servir avec Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]