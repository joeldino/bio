// auth.js - Gestion de l'authentification POUR TOUTES LES PAGES
// Ce fichier DOIT être inclus dans toutes les pages protégées

console.log('🔑 auth.js chargé');

// Comptes par défaut (synchronisés avec login.html)
const DEFAULT_USERS = [
    {
        id: 1,
        username: 'Eldinio',
        password: 'dino12',
        role: 'admin',
        fullName: 'Eldinio Admin',
        email: 'admin@bioaneho.tg',
        phone: '+228 96 85 70 42',
        cooperativeId: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        username: 'coop1',
        password: 'coop123',
        role: 'coop_admin',
        fullName: 'Jean Koffi',
        email: 'coop1@bioaneho.tg',
        phone: '+228 90 12 34 56',
        cooperativeId: 1,
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        username: 'agriculteur1',
        password: 'agri123',
        role: 'member',
        fullName: 'Ama Doe',
        email: 'ama@bioaneho.tg',
        phone: '+228 91 23 45 67',
        cooperativeId: 1,
        plotArea: '0.5 hectare',
        specialty: 'Tomates',
        createdAt: new Date().toISOString()
    }
];

// Initialiser les utilisateurs (s'assurer qu'ils existent)
function initializeUsers() {
    console.log('🔧 Initialisation des utilisateurs depuis auth.js');
    
    // Vérifier si les utilisateurs existent
    if (!localStorage.getItem('users')) {
        console.log('📝 Création des utilisateurs par défaut');
        localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
    }
    
    const users = JSON.parse(localStorage.getItem('users'));
    console.log(`✅ ${users.length} utilisateurs disponibles`);
    return users;
}

// Obtenir l'utilisateur courant
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
        console.log('⚠️ Aucun utilisateur connecté');
        return null;
    }
    
    try {
        return JSON.parse(userJson);
    } catch (e) {
        console.error('❌ Erreur parsing currentUser:', e);
        return null;
    }
}

// Vérifier l'authentification
function isAuthenticated() {
    const authenticated = localStorage.getItem('currentUser') !== null;
    console.log('🔐 Authentifié ?', authenticated);
    return authenticated;
}

// Fonction de connexion (utilisée par login.html)
function login(username, password) {
    console.log('🔐 Tentative de connexion via auth.js:', username);
    
    // Initialiser les utilisateurs
    initializeUsers();
    
    // Récupérer les utilisateurs
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Rechercher l'utilisateur
    const user = users.find(u => 
        u.username === username && 
        u.password === password
    );
    
    if (user) {
        console.log('✅ Connexion réussie pour:', user.username);
        
        // Ne pas stocker le mot de passe dans currentUser
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        return {
            success: true,
            user: userWithoutPassword
        };
    }
    
    console.log('❌ Échec de connexion');
    return {
        success: false,
        message: 'Identifiants incorrects'
    };
}

// Déconnexion
function logout() {
    console.log('🚪 Déconnexion');
    localStorage.removeItem('currentUser');
    window.location.href = '../../index.html';
}

// Vérifier les permissions
function hasPermission(requiredRole) {
    const user = getCurrentUser();
    
    if (!user) {
        console.log('⛔ Pas d\'utilisateur pour vérifier les permissions');
        return false;
    }
    
    console.log(`🔒 Vérification permission: ${user.role} => ${requiredRole}`);
    
    // Logique de permission
    if (requiredRole === 'admin' && user.role !== 'admin') {
        console.log('⛔ Permission admin refusée');
        return false;
    }
    
    if (requiredRole === 'coop_admin' && !['admin', 'coop_admin'].includes(user.role)) {
        console.log('⛔ Permission coop_admin refusée');
        return false;
    }
    
    console.log('✅ Permission accordée');
    return true;
}

// Rediriger si non authentifié
function requireAuth(redirectTo = '../../pages/public/login.html') {
    if (!isAuthenticated()) {
        console.log('🔀 Redirection vers login (non authentifié)');
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

// Rediriger si non autorisé
function requireRole(requiredRole, redirectTo = '../../index.html') {
    if (!hasPermission(requiredRole)) {
        console.log(`🔀 Redirection (permission ${requiredRole} refusée)`);
        alert('Accès non autorisé. Vous n\'avez pas les permissions nécessaires.');
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

// Vérifier l'accès admin et afficher les éléments admin
function checkAdminAccess() {
    const user = getCurrentUser();
    if (user && user.role === 'admin') {
        console.log('👑 Affichage éléments admin');
        
        // Afficher toutes les barres admin
        const adminBars = document.querySelectorAll('.admin-bar');
        adminBars.forEach(bar => {
            bar.style.display = 'block';
        });
        
        // Afficher les actions admin sur les cartes
        const adminActions = document.querySelectorAll('.cooperative-actions, .product-actions-admin');
        adminActions.forEach(action => {
            action.style.display = 'flex';
        });
    }
}

// Mettre à jour les infos utilisateur dans le dashboard
function updateUserInfo() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Mettre à jour les éléments avec l'ID userName
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(element => {
        element.textContent = user.fullName || user.username;
    });
    
    // Mettre à jour les éléments avec l'ID userRole
    const userRoleElements = document.querySelectorAll('#userRole');
    userRoleElements.forEach(element => {
        element.textContent = 
            user.role === 'admin' ? 'Administrateur' : 
            user.role === 'coop_admin' ? 'Admin Coopérative' : 'Membre';
    });
    
    // Mettre à jour le message de bienvenue
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = 
            `Bonjour ${user.fullName || user.username}, bienvenue dans votre espace d'administration`;
    }
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page chargée, vérification auth...');
    
    // Initialiser les utilisateurs
    initializeUsers();
    
    // Vérifier l'authentification pour les pages protégées
    const currentPage = window.location.pathname;
    const isPublicPage = currentPage.includes('public/') || 
                        currentPage.includes('index.html') || 
                        currentPage.endsWith('/');
    
    if (!isPublicPage && !isAuthenticated()) {
        console.log('🚫 Accès refusé à page protégée sans auth');
        window.location.href = '../../pages/public/login.html';
        return;
    }
    
    // Si connecté, mettre à jour les infos utilisateur
    if (isAuthenticated()) {
        updateUserInfo();
        checkAdminAccess();
    }
});

// ============================================
// EXPORT DES FONCTIONS POUR LES AUTRES FICHIERS
// ============================================

window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
window.login = login;
window.logout = logout;
window.hasPermission = hasPermission;
window.requireAuth = requireAuth;
window.requireRole = requireRole;
window.checkAdminAccess = checkAdminAccess;
window.updateUserInfo = updateUserInfo;
window.initializeUsers = initializeUsers;

console.log('✅ auth.js prêt avec fonctions exportées');