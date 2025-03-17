const express = require('express');
const router = express.Router();
const db = require('../db'); // Accède à db.js qui se trouve dans /app


// Middleware pour vérifier si l'utilisateur est un administrateur
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Accès refusé : réservée aux administrateurs' });
    }
}

// Route permettant de récupérer tous les users (réservés aux admins)
router.get('/', (req, res) => {
    const query = 'SELECT * FROM USER';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        res.status(500).send('Erreur lors de la récupération des utilisateurs');
        return;
      }
      res.json(results);
    });
});

// Route permettant de récupérer un user selon son id 
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM USER WHERE id = ?';

    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs:', err);
            res.status(500).send('Erreur lors de la récupération des utilisateurs');
            return;
        }
        res.json(results);
    });
});

// Route permettant d'ajouter un user
router.post('/add', (req, res) => {
    const { id, name, surname, email, password, phone_number, adress, role, created_at, updated_at } = req.body;

    const SQL = `
        INSERT INTO USER (id, name, surname, email, password, phone_number, adress, role) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(SQL, [id, name, surname, email, password, phone_number, adress, role], (err, result) => {
        if (err) {
            return res.status(400).json({ message: 'Erreur lors de la création d\'user' });
        }
        res.status(201).json({ message: 'Création de l\'user réussie', user: { id: result.insertId, name, surname, email, phone_number, adress, role } });
    });
});

// Route permettant de mettre a jour un user (ce que l'on souhaite le concernant) selon son id
router.put('/update/:id', (req, res) => {
    const userId = req.params.id;
    
    const fields = req.body; // Récupère uniquement les champs envoyés

    if (Object.keys(fields).length === 0) {
        return res.status(400).json({ message: "Aucune donnée fournie pour la mise à jour" });
    }

    // Génération dynamique de la requête SQL
    const sqlParts = Object.keys(fields).map(field => `${field} = ?`).join(', ');
    const values = [...Object.values(fields), userId];

    const SQL = `UPDATE USER SET ${sqlParts} WHERE id = ?`;

    db.query(SQL, values, (err, result) => {
        if (err) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
            return res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
        }
        res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
    });
});

// Route permettant de supprimer un user
router.delete('/delete/:id', (req, res) => {
    const userId = req.params.id;

    // Vérification
    console.log('Suppression avec succès pour l\'utilisateur avec ID:', userId); 

    const SQL = 'DELETE FROM USER WHERE id = ?';

    db.query(SQL, [userId], (err, result) => {
        if (err) {
            return res.status(400).json({ message: 'Erreur lors de la suppression de l\'user' });
        }
        res.status(200).json({ message: 'Suppression de l\'user réussie' });
    });
});

// Route permettant de récupérer les users d'une classe selon l'id spécifié
router.get('/class/:id', (req, res) => {
    const classId = req.params.id;

    const SQL = `
        SELECT U.id, U.name, U.surname, U.email, U.phone_number, U.adress, U.role 
        FROM USER U
        JOIN USER_CLASSE UC ON U.id = UC.id_USER
        WHERE UC.id_CLASSE = ?`;

    db.query(SQL, [classId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs de la classe:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        res.json(results);
    });
});


module.exports = router;
