const express = require('express');
const router = express.Router();

// Définir les routes pour vie_scolaire
router.get('/', (req, res) => {
  res.send('Liste de la vie scolaire');
});

module.exports = router;