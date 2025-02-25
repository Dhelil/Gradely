const express = require('express');
const router = express.Router();
const db = require('../db');


// Routes CRUD Admin
// Route permettant de récupérer tous les évènements de vie scolaire
router.get('/', (req, res) => {
  const query = 'SELECT * FROM VIE_SCOLAIRE';

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des événements :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results);
  });
});

// Route permettant d'ajouter un évènement de vie scolaire
router.post('/add', (req, res) => {
  const { type, description, date, sanction, retard, status } = req.body;
  const currentDate = new Date().toISOString().split('T')[0];

  const query = `
    INSERT INTO VIE_SCOLAIRE (type, description, date, sanction, retard, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [type, description, date, sanction, retard, status, currentDate, currentDate], (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout de l'événement :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.status(201).send("Événement ajouté avec succès !");
  });
});

// Route permettant de récupérer un évènement de vie scolaire par son id
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM VIE_SCOLAIRE WHERE id = ?';

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'événement :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results[0] || {});
  });
});

// Route permettant de mettre à jour un évènement de vie scolaire (uniquement le champ souhaité)
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const fieldsToUpdate = req.body; // Contient uniquement les champs qu'on veut modifier

  // Vérifier s'il y a bien des champs à mettre à jour
  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ message: "Aucune donnée fournie pour la mise à jour." });
  }

  // Construire dynamiquement la requête SQL
  const setClause = Object.keys(fieldsToUpdate)
    .map(field => `${field} = ?`)
    .join(', ');

  const values = Object.values(fieldsToUpdate);
  values.push(id); // L'ID sera le dernier paramètre

  const query = `UPDATE VIE_SCOLAIRE SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Erreur lors de la mise à jour :", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Aucun événement de vie scolaire trouvé avec cet ID." });
    }

    res.json({ message: "Mise à jour réussie !" });
  });
});

// Route permettant de supprimer un évènement de vie scolaire
router.delete('/delete/:id', (req, res) => {
  const query = 'DELETE FROM VIE_SCOLAIRE WHERE id = ?';

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'événement :", err);
      return res.status(500).send("Erreur serveur");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Événement non trouvé");
    }
    res.send("Événement supprimé avec succès !");
  });
});






// Autre routes
// Route permettant de récupérer les évènements de vie scolaire d'un élève
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT * FROM VIE_SCOLAIRE
    WHERE id IN (SELECT id_VIE_SCOLAIRE FROM USER_VIE_SCOLAIRE WHERE id_USER = ?)
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des événements de l'élève :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results);
  });
});

// Route permettant d'associer (ajouter) un évènement de vie scolaire à un élève
router.post('/:userId/:eventId', (req, res) => {
  const { userId, eventId } = req.params;

  const query = `
    INSERT INTO USER_VIE_SCOLAIRE (id_USER, id_VIE_SCOLAIRE)
    VALUES (?, ?)
  `;

  db.query(query, [userId, eventId], (err, results) => {
    if (err) {
      console.error("Erreur lors de l'association de l'événement à l'élève :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.status(201).send("Événement associé à l'élève avec succès !");
  });
});

// Route permettant de supprimer un évènement de vie scolaire d'un élève
router.delete('/delete/:userId/:eventId', (req, res) => {
  const { userId, eventId } = req.params;

  const query = `
    DELETE FROM USER_VIE_SCOLAIRE
    WHERE id_USER = ? AND id_VIE_SCOLAIRE = ?
  `;

  db.query(query, [userId, eventId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'association de l'événement avec l'élève :", err);
      return res.status(500).send("Erreur serveur");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Association non trouvée");
    }
    res.send("Association supprimée avec succès !");
  });
});


module.exports = router;