const express = require('express');
const router = express.Router();
const db = require('../db');


// Route CRUD Admin
// Route permettant de récupérer le cahier de texte d'une classe
router.get('/', (req, res) => {
    // Requête SQL
    const SQL = 'SELECT * FROM CAHIER_DE_TEXTE';
  
    // Traitement de la requête
    db.query(SQL, (err, result) => {
      if (err) {
        return res.status(400).json({ message: 'Erreur lors de la récupération des cahiers' });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: 'Aucun cahier trouvé' });
      }
      res.status(200).json({ message: 'Récupération de tous les cahiers', cahiers: result });
    });
});

// Route permettant de récupérer un cahier de texte selon son id spécifié
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM CAHIER_DE_TEXTE WHERE id = ?';

  db.query(query, [req.params.id], (err, results) => {
      if (err) {
          console.error('Erreur lors de la récupération du cahier de texte:', err);
          return res.status(500).json({ message: 'Erreur serveur' });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Cahier de texte non trouvé' });
      }
      res.json(results[0]);
  });
});

// Route permettant d'ajouter un nouveau cahier de texte
router.post('/add', (req, res) => {
  const { description, date } = req.body;

  if (!description || !date) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
  }

  const query = 'INSERT INTO CAHIER_DE_TEXTE (description, date) VALUES (?, ?)';

  db.query(query, [description, date], (err, result) => {
      if (err) {
          console.error('Erreur lors de l\'ajout du cahier de texte:', err);
          return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.status(201).json({ message: 'Cahier de texte ajouté avec succès', id: result.insertId });
  });
});

// Route permettant de modifier un cahier de texte existant
router.put('/update/:id', (req, res) => {
  const { description, date } = req.body;

  const query = 'UPDATE CAHIER_DE_TEXTE SET description = ?, date = ? WHERE id = ?';

  db.query(query, [description, date, req.params.id], (err, result) => {
      if (err) {
          console.error('Erreur lors de la mise à jour du cahier de texte:', err);
          return res.status(500).json({ message: 'Erreur serveur' });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Cahier de texte non trouvé' });
      }
      res.json({ message: 'Cahier de texte mis à jour avec succès' });
  });
});

// Route permettant de supprimer un cahier de texte
router.delete('/delete/:id', (req, res) => {
  const query = 'DELETE FROM CAHIER_DE_TEXTE WHERE id = ?';

  db.query(query, [req.params.id], (err, result) => {
      if (err) {
          console.error('Erreur lors de la suppression du cahier de texte:', err);
          return res.status(500).json({ message: 'Erreur serveur' });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Cahier de texte non trouvé' });
      }
      res.json({ message: 'Cahier de texte supprimé avec succès' });
  });
});




// Autre routes
// Route permettant de récupérer tous les cahiers de texte d'une classe spécifique
router.get('/classe/:classeId', (req, res) => {
  const query = `
      SELECT * FROM CAHIER_DE_TEXTE cdt
      JOIN CLASSE_CAHIER_TEXTE cct ON cdt.id = cct.id_CAHIER_DE_TEXTE
      WHERE cct.id_CLASSE = ?;
  `;
  db.query(query, [req.params.classeId], (err, results) => {
      if (err) {
          console.error("Erreur lors de la récupération des cahiers de texte :", err);
          return res.status(500).send("Erreur serveur");
      }
      res.json(results);
  });
});

// Route permettant d'associer un cahier de texte à une classe
router.post('/:cahierId/associate-to-class/:classeId', (req, res) => {
  const query = `
      INSERT INTO CLASSE_CAHIER_TEXTE (id_CLASSE, id_CAHIER_DE_TEXTE) 
      VALUES (?, ?);
  `;
  db.query(query, [req.params.classeId, req.params.cahierId], (err, results) => {
      if (err) {
          console.error("Erreur lors de l'association :", err);
          return res.status(500).send("Erreur serveur");
      }
      res.send("Cahier de texte associé à la classe avec succès !");
  });
});

// Route permettant de récupérer tous les cahiers de texte associés aux classes d'un utilisateur spécifique
router.get('/user/:userId/cahiers', (req, res) => {
  const query = `
      SELECT cdt.* FROM CAHIER_DE_TEXTE cdt
      JOIN CLASSE_CAHIER_TEXTE cct ON cdt.id = cct.id_CAHIER_DE_TEXTE
      JOIN USER_CLASSE uc ON cct.id_CLASSE = uc.id_CLASSE
      WHERE uc.id_USER = ?;
  `;
  db.query(query, [req.params.userId], (err, results) => {
      if (err) {
          console.error("Erreur lors de la récupération des cahiers de texte :", err);
          return res.status(500).send("Erreur serveur");
      }
      res.json(results);
  });
});

// Route permettant de dissocier un cahier de texte d'une classe (sans le supprimer)
router.delete('/:cahierId/separate/:classeId', (req, res) => {
  const query = `
      DELETE FROM CLASSE_CAHIER_TEXTE 
      WHERE id_CAHIER_DE_TEXTE = ? AND id_CLASSE = ?;
  `;
  db.query(query, [req.params.cahierId, req.params.classeId], (err, results) => {
      if (err) {
          console.error("Erreur lors de la suppression de l'association :", err);
          return res.status(500).send("Erreur serveur");
      }
      res.send("Cahier de texte dissocié de la classe avec succès !");
  });
});

// Route permettant de récupérer un cahier de texte par son id avec tous les détails
router.get('/details/:id', (req, res) => {
  const query = `
      SELECT cdt.*, c.name AS classe_name 
      FROM CAHIER_DE_TEXTE cdt
      LEFT JOIN CLASSE_CAHIER_TEXTE cct ON cdt.id = cct.id_CAHIER_DE_TEXTE
      LEFT JOIN CLASSE c ON cct.id_CLASSE = c.id
      WHERE cdt.id = ?;
  `;
  db.query(query, [req.params.id], (err, results) => {
      if (err) {
          console.error("Erreur lors de la récupération des détails :", err);
          return res.status(500).send("Erreur serveur");
      }
      res.json(results[0] || {});
  });
});



module.exports = router;