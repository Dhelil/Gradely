const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

// Importer le module de connexion à la base de données
const db = require('./db');

app.use(express.json()); // Ajoute ceci pour parser le body des requêtes JSON

// Importer les fichiers de routes
const cahierDeTexteRoutes = require('./routes/cahier_de_texte');
const classeRoutes = require('./routes/classe');
const devoirRoutes = require('./routes/devoir');
const notesRoutes = require('./routes/notes');
const matieresRoutes = require('./routes/matieres');
const vieScolaireRoutes = require('./routes/vie_scolaire');
const userRoutes = require('./routes/user');

// Utiliser les routes
app.use('/cahier_de_texte', cahierDeTexteRoutes);
app.use('/classe', classeRoutes);
app.use('/devoir', devoirRoutes);
app.use('/notes', notesRoutes);
app.use('/matieres', matieresRoutes);
app.use('/vie_scolaire', vieScolaireRoutes);
app.use('/user', userRoutes);


// Route de test par défaut
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});