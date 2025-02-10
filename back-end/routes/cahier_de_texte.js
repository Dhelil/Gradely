const express = require('express');
const router = express.Router();
const db = require('./db');

// Route permettant de récupérer le cahier de texte d'une classe
router.get('/cahiers', (req, res) => {
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

module.exports = router;