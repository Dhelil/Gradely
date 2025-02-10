const express = require('express');
const router = express.Router();

// Définir les routes pour notes
router.get('/', (req, res) => {
  res.send('Liste des notes');
});

module.exports = router;