const express = require('express');
const router = express.Router();

// Définir les routes pour matieres
router.get('/', (req, res) => {
  res.send('Liste des matières');
});

module.exports = router;