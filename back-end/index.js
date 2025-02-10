const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

// Importer le module de connexion à la base de données
const db = require('./db');


// Importer les fichiers de routes
// const cahierDeTexteRoutes = require('./routes/cahier_de_texte');
// const classeRoutes = require('./routes/classe');
// const devoirRoutes = require('./routes/devoir');
// const notesRoutes = require('./routes/notes');
// const matieresRoutes = require('./routes/matieres');
// const vieScolaireRoutes = require('./routes/vie_scolaire');

// // Utiliser les routes
// app.use('/cahier_de_texte', cahierDeTexteRoutes);
// app.use('/classe', classeRoutes);
// app.use('/devoir', devoirRoutes);
// app.use('/notes', notesRoutes);
// app.use('/matieres', matieresRoutes);
// app.use('/vie_scolaire', vieScolaireRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route de test pour vérifier la connexion à la base de données
app.get('/user', (req, res) => {
  const query = 'SELECT * FROM USER';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      res.status(500).send('Erreur lors de la récupération des utilisateurs');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});