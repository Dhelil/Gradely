const express = require('express');
const router = express.Router();
const db = require('../db');


// Routes CRUD Admin
// Route permettant de récupérer tous les devoirs
router.get('/', (req, res) => {
  const query = 'SELECT * FROM DEVOIR';

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des devoirs :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results);
  });
});

// Route permettant de récupérer un devoir spécifique selon son id
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM DEVOIR WHERE id = ?';

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération du devoir :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results[0] || {}); // Si le devoir n'existe pas, retourner un objet vide
  });
});

// Route permettant d'ajouter un nouveau devoir
router.post('/add', (req, res) => {
  const { title, description, status } = req.body;

  // Calculer la date actuelle pour created_at et updated_at
  const currentDate = new Date().toISOString().split('T')[0]; // Format 'YYYY-MM-DD'

  const query = `
    INSERT INTO DEVOIR (title, description, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [title, description, status, currentDate, currentDate], (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout du devoir :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.status(201).send("Devoir ajouté avec succès !");
  });
});

// Route permettant de modifier un devoir existant
router.put('/update/:id', (req, res) => {
  const { title, description, status } = req.body;

  const query = `
    UPDATE DEVOIR
    SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.query(query, [title, description, status, req.params.id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la mise à jour du devoir :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.send("Devoir mis à jour avec succès !");
  });
});

// Route permettant de supprimer un devoir
router.delete('/delete/:id', (req, res) => {
  const query = 'DELETE FROM DEVOIR WHERE id = ?';

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la suppression du devoir :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.send("Devoir supprimé avec succès !");
  });
});




// Autre routes
// Route permettant de récupérer tous les devoirs d'une classe spécifique
router.get('/:classeId/devoirs', (req, res) => {
  const query = `
    SELECT d.id, d.title, d.description, d.status
    FROM DEVOIR d
    JOIN CLASSE_DEVOIR cd ON d.id = cd.id_DEVOIR
    WHERE cd.id_CLASSE = ?
  `;

  db.query(query, [req.params.classeId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des devoirs de la classe :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results);
  });
});

// Route permettant d'ajouter un devoir à une classe spécifique
router.post('/:classeName/devoirs/add', (req, res) => {
  const { devoirId } = req.body;
  const classeName = req.params.classeName;  // On récupère le nom de la classe dans l'URL

  // On cherche l'ID de la classe en fonction de son nom
  const findClasseIdQuery = 'SELECT id FROM CLASSE WHERE name = ?';

  db.query(findClasseIdQuery, [classeName], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'ID de la classe :", err);
      return res.status(500).send("Erreur serveur");
    }

    if (results.length === 0) {
      return res.status(404).send("Classe non trouvée");
    }

    const classeId = results[0].id;  // On récupère l'ID de la classe

    // Maintenant qu'on a l'ID de la classe, on peut ajouter le devoir
    const query = `
      INSERT INTO CLASSE_DEVOIR (id_CLASSE, id_DEVOIR)
      VALUES (?, ?)
    `;

    db.query(query, [classeId, devoirId], (err, results) => {
      if (err) {
        console.error("Erreur lors de l'ajout du devoir à la classe :", err);
        return res.status(500).send("Erreur serveur");
      }
      res.status(201).send("Devoir ajouté à la classe avec succès !");
    });
  });
});


module.exports = router;