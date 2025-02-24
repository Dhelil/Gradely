const express = require('express');
const router = express.Router();
const db = require('../db');


// Routes CRUD Admin
// Middleware pour vérifier si l'utilisateur est un administrateur
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
      next();
  } else {
      res.status(403).json({ message: 'Accès refusé : réservée aux administrateurs' });
  }
}

// Route permettant de récupérer toutes les classes
router.get('/', (req, res) => {
  const query = 'SELECT * FROM CLASSE';

  db.query(query, (err, results) => {
      if (err) {
          console.error("Erreur lors de la récupération des classes :", err);
          return res.status(500).send("Erreur serveur");
      }
      res.json(results);
  });
});

// Route permettant de récupérer une classe selon son id spécifié
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM CLASSE WHERE id = ?';

  db.query(query, [req.params.id], (err, results) => {
      if (err) {
          console.error("Erreur lors de la récupération de la classe :", err);
          return res.status(500).send("Erreur serveur");
      }
      res.json(results[0] || {}); // Si la classe n'existe pas, retourner un objet vide
  });
});

// Route permettant d'ajouter une nouvelle classe
router.post('/add', (req, res) => {
  const { name, niveau, annee_scolaire } = req.body;  // On récupère les données envoyées

  // Calculer la date actuelle pour created_at et updated_at
  const currentDate = new Date().toISOString().split('T')[0]; // Format 'YYYY-MM-DD'

  const query = `
      INSERT INTO CLASSE (name, niveau, annee_scolaire, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [name, niveau, annee_scolaire, currentDate, currentDate], (err, results) => {
      if (err) {
          console.error("Erreur lors de l'ajout de la classe :", err);
          return res.status(500).send("Erreur serveur");
      }
      res.status(201).send("Classe ajoutée avec succès !");
  });
});

// Route permettant de modifier une classe existante
router.put('/update/:id', (req, res) => {
  const { name, niveau, annee_scolaire } = req.body;

  const query = `
      UPDATE CLASSE 
      SET name = ?, niveau = ?, annee_scolaire = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?`;

  db.query(query, [name, niveau, annee_scolaire, req.params.id], (err, results) => {
      if (err) {
          console.error("Erreur lors de la mise à jour de la classe :", err);
          return res.status(500).send("Erreur serveur");
      }
      res.send("Classe mise à jour avec succès !");
  });
});

// Route permettant de supprimer une classe
router.delete('/delete/:id', (req, res) => {
  const query = 'DELETE FROM CLASSE WHERE id = ?';

  db.query(query, [req.params.id], (err, results) => {
      if (err) {
          console.error("Erreur lors de la suppression de la classe :", err);
          return res.status(500).send("Erreur serveur");
      }
      res.send("Classe supprimée avec succès !");
  });
});

  

// Autres routes
// Route permettant de récupérer tous les users d'une classe spécifié
router.get('/:id/users', (req, res) => {
  const query = `
    SELECT u.id, u.name, u.surname, u.email, u.role 
    FROM USER u
    JOIN USER_CLASSE uc ON u.id = uc.id_USER
    WHERE uc.id_CLASSE = ?;
  `;

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des utilisateurs :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(results);
  });
});

// Route permettant d'ajouter un user à une classe via son nom et prénom
router.post('/:classeId/users/add', (req, res) => {
  const { name, surname } = req.body;
  const classeId = req.params.classeId;

  // On récupère l'ID de l'utilisateur en fonction de son nom et prénom
  const userQuery = 'SELECT id FROM USER WHERE name = ? AND surname = ?';
  
  db.query(userQuery, [name, surname], (err, userResults) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'utilisateur :", err);
      return res.status(500).send("Erreur serveur");
    }
    
    if (userResults.length === 0) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    const userId = userResults[0].id;

    // Ajouter l'utilisateur à la classe
    const addUserToClassQuery = `
      INSERT INTO USER_CLASSE (id_USER, id_CLASSE) 
      VALUES (?, ?)
    `;
    
    db.query(addUserToClassQuery, [userId, classeId], (err, results) => {
      if (err) {
        console.error("Erreur lors de l'ajout de l'utilisateur à la classe :", err);
        return res.status(500).send("Erreur serveur");
      }
      res.status(201).send("Utilisateur ajouté à la classe avec succès !");
    });
  });
});


// Route permettant de supprimer un user (élève) d'une classe
router.delete('/:id/users/:userId/remove', (req, res) => {
  const query = 'DELETE FROM USER_CLASSE WHERE id_USER = ? AND id_CLASSE = ?';

  db.query(query, [req.params.userId, req.params.id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'utilisateur de la classe :", err);
      return res.status(500).send("Erreur serveur");
    }
    res.send("Utilisateur retiré de la classe avec succès !");
  });
});


module.exports = router;