# Gradely - Gestion Scolaire

Application web intuitive pour la gestion des notes académiques, développée par Medjeni Dhelil.

## 🚀 Installation
``` git clone [URL_DU_DEPOT] ```
``` cd Docker ```
``` docker compose up -d --build ```

### 🌐 Accès
- Frontend : http://localhost
- Backend : http://localhost:4000
- pypMyAdmin : http://localhost:8080 avec root root pour id et mdp

### 🆕 Première utilisation
Création de compte
Les comptes par défaut ne sont pas fonctionnels (problème d hash). Vous devez :
1. Créer un nouveau compte via l'interface
2. Utiliser ces identifiants pour vous connecter

## 📝 Description

Gradely permet aux étudiants et enseignants de gérer facilement :
- 📌 Les notes académiques
- 📝 Les devoirs
- 📊 Les performances étudiantes

Avec une interface claire et des visualisations données.

## ✨ Fonctionnalités principales

### 🔐 Authentification
- Gestion des rôles (Étudiant/Enseignant/Admin/Professeurs)
- Système de connexion sécurisé

### 📚 Gestion pédagogique
- Profils étudiants et cours
- Saisie et consultation des notes
- Gestion des devoirs
- Cahier de texte numérique

### 📊 Analytics
- Statistiques de performance
- Visualisations des moyennes
- Alertes automatiques

## 🛠 Technologies

### Backend
- **API** : Node.js/Express
- **Authentification** : JWT

### Frontend
- **Framework** : React.js
- **Styling** : Bootstrap/TailwindCSS

### Base de données
- **SGBD** : MariaDB (MySQL)
- **Admin** : phpMyAdmin

### Prérequis
- Docker + Docker Compose
- Ports 80, 4000, 8080 disponibles

### 📊 Trello
https://trello.com/b/t3PEdZed/gradely

