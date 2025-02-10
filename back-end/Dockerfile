# Utiliser une image de base officielle de Node.js
FROM node:14

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port que l'application utilise
EXPOSE 4000

# Définir la commande à exécuter lorsque le conteneur démarre
CMD ["node", "index.js"]