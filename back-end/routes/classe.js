const express = require('express');
const router = express.Router();

// Définir les routes pour classe
router.get('/', (req, res) => {
  res.send('Liste des classes');
});

module.exports = router;