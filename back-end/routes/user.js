const express = require('express');
const router = express.Router();
const db = require('../db'); // Accède à db.js qui se trouve dans /app
const bcrypt = require('bcryptjs'); // Utilisation de bcryptjs
const jwt = require('jsonwebtoken');



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
router.post('/add', async (req, res) => {
    console.log("Données reçues :", req.body); // Vérifie ce que le frontend envoie

    const { name, surname, email, password, phone_number, adress, role } = req.body;

    // Vérifier si tous les champs requis sont fournis
    if (!name || !surname || !email || !password || !phone_number || !adress || !role) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    try {
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Requête SQL sans `id` si c'est une clé auto-incrémentée
        const SQL = `INSERT INTO USER (name, surname, email, password, phone_number, adress, role) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        // Exécution de la requête
        db.query(SQL, [name, surname, email, hashedPassword, phone_number, adress, role], (err, result) => {
            if (err) {
                console.error("Erreur SQL :", err); // Afficher l'erreur SQL exacte
                return res.status(400).json({ message: "Erreur SQL lors de la création de l'user", error: err });
            }

            res.status(201).json({ 
                message: "Création de l'user réussie", 
                user: { id: result.insertId, name, surname, email, phone_number, adress, role } 
            });
        });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur lors de la création de l'user", error });
    }
});

// Route de login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Requête pour vérifier l'utilisateur dans la base de données et récupérer son nom, prénom, email, etc.
    const checkUserQuery = 'SELECT id, email, name, surname, password FROM USER WHERE email = ?';
  
    db.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'utilisateur:', err);
            return res.status(500).json({ message: "Erreur lors de la vérification de l'utilisateur" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
        }

        // Vérification du mot de passe
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Erreur lors de la vérification du mot de passe:', err);
                return res.status(500).json({ message: "Erreur lors de la vérification du mot de passe" });
            }

            if (!isMatch) {
                return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
            }

            // Créer un objet utilisateur avec les informations nécessaires
            const utilisateur = {
                id: user.id,
                email: user.email,
                name: user.name, // Ajout du prénom
                surname: user.surname, // Ajout du nom de famille
            };

            // Générer un token JWT
            const token = jwt.sign(
                { id: utilisateur.id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Réponse avec le token et les informations utilisateur
            res.json({ token, user: utilisateur });
        });
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
