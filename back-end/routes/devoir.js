const express = require('express');
const router = express.Router();

// Définir les routes pour devoir
router.get('/', (req, res) => {
  res.send('Liste des devoirs');
});

module.exports = router;