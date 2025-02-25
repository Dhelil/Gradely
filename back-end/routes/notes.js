const express = require('express');
const router = express.Router();
const db = require('../db');


// Routes CRUD Admin
// Route permettant de récupérer toutes les notes
router.get('/', (req, res) => {
  const query = 'SELECT * FROM NOTES';

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des notes :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results);
  });
});

// Route permettant de récupérer une note spécifique selon son id
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM NOTES WHERE id = ?';

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de la note :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results[0] || {}); // Si la note n'existe pas, retourner un objet vide
  });
});

// Route permettant d'ajouter une nouvelle note à un user (élève)
router.post('/:userId/notes/add', (req, res) => {
  const { note_value } = req.body;  // Valeur de la note à ajouter
  const userId = req.params.userId; // ID de l'utilisateur (élève)
  
  // Calculer la date actuelle pour created_at et updated_at
  const currentDate = new Date().toISOString().split('T')[0]; // Format 'YYYY-MM-DD'

  // Insérer la note dans la table NOTES
  const queryNote = `
    INSERT INTO NOTES (note_value, created_at, updated_at)
    VALUES (?, ?, ?)
  `;

  db.query(queryNote, [note_value, currentDate, currentDate], (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout de la note :", err);
      return res.status(500).send("Erreur serveur");
    }

    // Récupérer l'ID de la note insérée
    const noteId = results.insertId;

    // Associer la note à l'utilisateur (élève) dans la table USER_NOTES
    const queryAssociation = `
      INSERT INTO USER_NOTES (id_USER, id_NOTES)
      VALUES (?, ?)
    `;

    db.query(queryAssociation, [userId, noteId], (err2, results2) => {
      if (err2) {
        console.error("Erreur lors de l'association de la note avec l'utilisateur :", err2);
        return res.status(500).send("Erreur serveur");
      }
      res.status(201).send("Note ajoutée à l'élève avec succès !");
    });
  });
});

// Route permettant de modifier une note d'un user (élève)
router.put('/:userId/notes/update/:noteId', (req, res) => {
  const { note_value } = req.body;  // Nouvelle valeur de la note
  const userId = req.params.userId; // ID de l'utilisateur (élève)
  const noteId = req.params.noteId; // ID de la note à modifier

  const query = `
    UPDATE NOTES
    SET note_value = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND id IN (SELECT id_NOTES FROM USER_NOTES WHERE id_USER = ?)
  `;

  db.query(query, [note_value, noteId, userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la mise à jour de la note de l'élève :", err);
      return res.status(500).send("Erreur serveur");
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("La note n'a pas été trouvée pour cet élève");
    }

    res.send("Note modifiée avec succès !");
  });
});

// Route permettant de supprimer une note d'un user (élève)
router.delete('/:userId/delete/:noteId', (req, res) => {
  const userId = req.params.userId;
  const noteId = req.params.noteId;

  // Supprimer l'association dans USER_NOTES
  const deleteUserNoteQuery = `
    DELETE FROM USER_NOTES WHERE id_USER = ? AND id_NOTES = ?
  `;

  db.query(deleteUserNoteQuery, [userId, noteId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'association note-utilisateur :", err);
      return res.status(500).send("Erreur serveur");
    }

    // Vérifier si la note est encore liée à d'autres élèves
    const checkNoteQuery = `SELECT COUNT(*) AS count FROM USER_NOTES WHERE id_NOTES = ?`;

    db.query(checkNoteQuery, [noteId], (err2, results2) => {
      if (err2) {
        console.error("Erreur lors de la vérification de la note :", err2);
        return res.status(500).send("Erreur serveur");
      }

      if (results2[0].count === 0) {
        // Si la note n'est plus associée à personne, la supprimer de NOTES
        const deleteNoteQuery = `DELETE FROM NOTES WHERE id = ?`;
        db.query(deleteNoteQuery, [noteId], (err3) => {
          if (err3) {
            console.error("Erreur lors de la suppression de la note :", err3);
            return res.status(500).send("Erreur serveur");
          }
        });
      }

      res.send("Note supprimée avec succès !");
    });
  });
});





// Autre routes
// Récupérer toutes les notes d'un élève
router.get('/:userId/notes', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT * FROM NOTES
    WHERE id IN (SELECT id_NOTES FROM USER_NOTES WHERE id_USER = ?)
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des notes de l'élève :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results);
  });
});

// Récupérer toutes les notes d'une classe
router.get('/classe/:classeId/notes', (req, res) => {
  const classeId = req.params.classeId;

  const query = `
    SELECT N.* FROM NOTES N
    JOIN USER_NOTES UN ON N.id = UN.id_NOTES
    JOIN USER U ON UN.id_USER = U.id
    WHERE U.id_CLASSE = ?
  `;

  db.query(query, [classeId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des notes de la classe :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results);
  });
});

// Route permettant de récupérer toutes les notes d'un élève pour un devoir spécifique
router.get('/:userId/devoir/:devoirId/notes', (req, res) => {
  const { userId, devoirId } = req.params;

  const query = `
    SELECT * FROM NOTES 
    WHERE id IN (
      SELECT id_NOTES FROM USER_NOTES 
      WHERE id_USER = ? AND id_NOTES IN (
        SELECT id FROM NOTES WHERE id IN (
          SELECT id_DEVOIR FROM CLASSE_DEVOIR WHERE id_DEVOIR = ?
        )
      )
    )
  `;

  db.query(query, [userId, devoirId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des notes de l'élève pour ce devoir :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results);
  });
});


// Route permettant de calculer la moyenne des notes d'un élève
router.get('/:userId/moyenne', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT AVG(note_value) AS moyenne
    FROM NOTES
    WHERE id IN (SELECT id_NOTES FROM USER_NOTES WHERE id_USER = ?)
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors du calcul de la moyenne :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json({ moyenne: results[0].moyenne });
  });
});

// Route permettant de calculer la moyenne des notes d'une classe
router.get('/classe/:classeId/moyenne', (req, res) => {
  const classeId = req.params.classeId;

  const query = `
    SELECT AVG(note_value) AS moyenne
    FROM NOTES
    WHERE id IN (SELECT id_DEVOIR FROM CLASSE_DEVOIR WHERE id_CLASSE = ?)
  `;

  db.query(query, [classeId], (err, results) => {
    if (err) {
      console.error("Erreur lors du calcul de la moyenne de la classe :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json({ moyenne: results[0].moyenne });
  });
});

// Route permettant de récupérer les notes d'un devoir spécifique
router.get('/devoir/:devoirId/notes', (req, res) => {
  const devoirId = req.params.devoirId;

  const query = `
    SELECT * FROM NOTES
    WHERE id IN (SELECT id_DEVOIR FROM CLASSE_DEVOIR WHERE id_DEVOIR = ?)
  `;

  db.query(query, [devoirId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des notes pour ce devoir :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results);
  });
});

// Route permettant de récupérer la meilleure note d'un élève
router.get('/:userId/best_rating', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT MAX(note_value) AS meilleure_note
    FROM NOTES
    WHERE id IN (SELECT id_NOTES FROM USER_NOTES WHERE id_USER = ?)
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de la meilleure note de l'élève :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json({ meilleure_note: results[0].meilleure_note || 0 }); // Retourne 0 si aucune note
  });
});

// Route permettant de récupérer la pire note d'un élève
router.get('/:userId/bad_rating', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT MIN(note_value) AS pire_note
    FROM NOTES
    WHERE id IN (SELECT id_NOTES FROM USER_NOTES WHERE id_USER = ?)
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de la pire note de l'élève :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json({ pire_note: results[0].pire_note || 0 }); // Retourne 0 si aucune note
  });
});

module.exports = router;