const express = require('express');
const app = express();
const port = 4000;

// Importer le module de connexion à la base de données
const db = require('./db');


// Importer les fichiers de routes
const cahierDeTexteRoutes = require('./routes/cahier_de_texte');
const classeRoutes = require('./routes/classe');
const devoirRoutes = require('./routes/devoir');
const notesRoutes = require('./routes/notes');
const matieresRoutes = require('./routes/matieres');
const vieScolaireRoutes = require('./routes/vie_scolaire');

// Utiliser les routes
app.use('/cahier_de_texte', cahierDeTexteRoutes);
app.use('/classe', classeRoutes);
app.use('/devoir', devoirRoutes);
app.use('/notes', notesRoutes);
app.use('/matieres', matieresRoutes);
app.use('/vie_scolaire', vieScolaireRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route de test pour vérifier la connexion à la base de données
app.get('/users', (req, res) => {
  const SQL = 'SELECT * FROM USER';

  db.query(SQL, (err, result) => {
    if (err) {
      return res.status(400).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
    }
    res.status(200).json({ message: 'Récupération de tous les utilisateurs', users: result });
  });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});