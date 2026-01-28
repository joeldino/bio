# 🌱 Site Web - Maraîchage Bio à Aného

Site web complet pour la gestion des coopératives de maraîchage bio à Aného, Togo.

## 📁 Structure du projet


## 🚀 Fonctionnalités

### Pour le public
- Consultation des coopératives et produits
- Système de commande en ligne
- Information sur les points de vente
- Actualités du projet
- Formulaire de contact

### Pour les administrateurs
- Tableau de bord statistique
- CRUD complet des coopératives
- CRUD complet des produits
- Gestion des membres
- Gestion des commandes
- Export des données

### Pour les membres
- Espace personnel
- Suivi de production
- Journal d'apprentissage collectif

## 🔐 Comptes de démonstration

- **Administrateur:** Eldinio / dino12
- **Admin Coopérative:** coop1 / coop123
- **Membre:** agriculteur1 / agri123

## 💾 Stockage des données

Le site utilise `localStorage` pour stocker les données (démonstration uniquement). En production, il faudra:

1. Remplacer par une base de données MySQL/PostgreSQL
2. Implémenter un backend PHP/Node.js
3. Sécuriser l'authentification
4. Ajouter un système de sauvegarde

## 🛠 Technologies utilisées

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript Vanilla
- Font Awesome (icônes)
- localStorage (stockage temporaire)

## 📱 Responsive Design

Le site est entièrement responsive et s'adapte à:
- Ordinateurs de bureau
- Tablettes
- Smartphones

## 🔧 Installation

1. Téléchargez tous les fichiers
2. Ouvrez `pages/public/index.html` dans un navigateur
3. Pour modifier, éditez les fichiers HTML/CSS/JS

### Serveur local recommandé
```bash
# Avec Node.js
npx serve .

# Avec PHP
php -S localhost:8000

# Avec Python
python -m http.server 8000