const mysql = require('mysql2');
require('dotenv').config({path:'./.env'});

// Log des variables d'environnement
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

// Créer une connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'db',  // db est le nom du service de base de données dans Docker Compose
  user: process.env.DB_USER || 'exampleuser',  // Utilise l'utilisateur défini dans .env
  password: process.env.DB_PASSWORD || 'examplepassword',  // Mot de passe dans .env
  database: process.env.DB_NAME || 'Gradely',  // Nom de la base de données défini dans .env
});


// Connecter à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    process.exit(1);
  }
  console.log('Connecté à la base de données MySQL');
});

module.exports = db;