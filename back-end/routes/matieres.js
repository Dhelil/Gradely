const express = require('express');
const router = express.Router();
const db = require('../db');


// Routes CRUD Admin
// Route permettant de récupérer toutes les matières
router.get('/', (req, res) => {
  const query = 'SELECT * FROM MATIERE';

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des matières :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results);
  });
});

// Route permettant de récupérer une matière spécifique selon son id
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM MATIERE WHERE id = ?';

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de la matière :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results[0] || {}); // Si la matière n'existe pas, retourner un objet vide
  });
});

// Route permettant d'ajouter une nouvelle matière
router.post('/add', (req, res) => {
  const { name, description } = req.body;

  // Calculer la date actuelle pour created_at et updated_at
  const currentDate = new Date().toISOString().split('T')[0]; // Format 'YYYY-MM-DD'

  const query = `
    INSERT INTO MATIERE (name, description, created_at, updated_at)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [name, description, currentDate, currentDate], (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout de la matière :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.status(201).send("Matière ajoutée avec succès !");
  });
});

// Route permettant de modifier une matière existante
router.put('/update/:id', (req, res) => {
  const { name, description } = req.body;

  const query = `
    UPDATE MATIERE
    SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.query(query, [name, description, req.params.id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la mise à jour de la matière :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.send("Matière mise à jour avec succès !");
  });
});

// Route permettant de supprimer une matière
router.delete('/delete/:id', (req, res) => {
  const query = 'DELETE FROM MATIERE WHERE id = ?';

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la suppression de la matière :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.send("Matière supprimée avec succès !");
  });
});




// Autres routes
// Route permettant de récupérer toutes les classes d'une matière spécifique
// router.get('/:id/classes', (req, res) => {
//   const query = `
//     SELECT c.id, c.name, c.niveau, c.annee_scolaire
//     FROM CLASSE c
//     JOIN MATIERE_CLASSE mc ON c.id = mc.id_CLASSE
//     WHERE mc.id_MATIERE = ?
//   `;

//   db.query(query, [req.params.id], (err, results) => {
//     if (err) {
//       console.error("Erreur lors de la récupération des classes de la matière :", err);
//       return res.status(500).send("Erreur serveur");
//     }
//     res.json(results);
//   });
// });

// // Route permettant d'obtenir tous les devoirs associés à une matière
// router.get('/:matiereId/devoirs', (req, res) => {
//   const query = `
//     SELECT d.id, d.title, d.description, d.status
//     FROM DEVOIR d
//     JOIN MATIERE_DEVOIR md ON d.id = md.id_DEVOIR
//     WHERE md.id_MATIERE = ?
//   `;

//   db.query(query, [req.params.matiereId], (err, results) => {
//     if (err) {
//       console.error("Erreur lors de la récupération des devoirs de la matière :", err);
//       return res.status(500).send("Erreur serveur");
//     }
//     res.json(results);
//   });
// });

// // Route permettant de mettre à jour la matière d'un devoir
// router.put('/devoirs/:devoirId/matiere/:matiereId', (req, res) => {
//   const { devoirId, matiereId } = req.params;

//   const query = `
//     UPDATE MATIERE_DEVOIR
//     SET id_MATIERE = ?
//     WHERE id_DEVOIR = ?
//   `;

//   db.query(query, [matiereId, devoirId], (err, results) => {
//     if (err) {
//       console.error("Erreur lors de la mise à jour de la matière du devoir :", err);
//       return res.status(500).send("Erreur serveur");
//     }
//     res.send("Matière du devoir mise à jour avec succès !");
//   });
// });


module.exports = router;
