// main.js - Fonctions principales du site
// Dans main.js, ajoutez ce code :

// Fonction pour charger les coopératives
async function loadCooperatives() {
    try {
        const response = await fetch('../../data/cooperatives.json');
        const cooperatives = await response.json();
        const container = document.getElementById('cooperativesList');
        
        if (container) {
            container.innerHTML = cooperatives.map(coop => `
                <div class="cooperative-card" data-id="${coop.id}">
                    <div class="coop-image">
                        <img src="${coop.image}" alt="${coop.name}">
                    </div>
                    <div class="coop-content">
                        <h3>${coop.name}</h3>
                        <p class="coop-location">
                            <i class="fas fa-map-marker-alt"></i> ${coop.location}
                        </p>
                        <p class="coop-description">${coop.shortDescription}</p>
                        <div class="coop-members">
                            <i class="fas fa-users"></i>
                            <span>${coop.members} membres</span>
                        </div>
                        <button class="btn btn-primary view-details" onclick="viewCooperativeDetails(${coop.id})">
                            Voir les détails
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erreur de chargement des coopératives:', error);
    }
}

// Fonction pour voir les détails d'une coopérative
function viewCooperativeDetails(coopId) {
    // Sauvegarder l'ID dans le localStorage
    localStorage.setItem('selectedCooperative', coopId);
    
    // Rediriger vers la page de détails
    window.location.href = '../private/cooperative-details.html';
}

// Fonction pour charger les détails sur la page dédiée
async function loadCooperativeDetails() {
    const coopId = localStorage.getItem('selectedCooperative');
    
    if (!coopId) {
        window.location.href = '../private/cooperatives.html';
        return;
    }
    
    try {
        const response = await fetch('../../data/cooperatives.json');
        const cooperatives = await response.json();
        const cooperative = cooperatives.find(c => c.id == coopId);
        
        if (!cooperative) {
            window.location.href = '../private/cooperatives.html';
            return;
        }
        
        const container = document.getElementById('cooperativeDetails');
        if (container) {
            container.innerHTML = `
                <section class="cooperative-detail">
                    <div class="breadcrumb">
                        <a href="../private/cooperatives.html">Coopératives</a> 
                        <i class="fas fa-chevron-right"></i>
                        <span>${cooperative.name}</span>
                    </div>
                    
                    <div class="coop-detail-header">
                        <div class="coop-detail-image">
                            <img src="${cooperative.image}" alt="${cooperative.name}">
                        </div>
                        <div class="coop-detail-info">
                            <h1>${cooperative.name}</h1>
                            <p class="coop-location">
                                <i class="fas fa-map-marker-alt"></i> ${cooperative.location}
                            </p>
                            <div class="coop-stats">
                                <div class="stat">
                                    <i class="fas fa-users"></i>
                                    <span>${cooperative.members} membres</span>
                                </div>
                                <div class="stat">
                                    <i class="fas fa-calendar"></i>
                                    <span>Créée en ${cooperative.founded}</span>
                                </div>
                                <div class="stat">
                                    <i class="fas fa-hectare-sign"></i>
                                    <span>${cooperative.hectares} hectares</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="coop-detail-content">
                        <div class="coop-description">
                            <h2>À propos</h2>
                            <p>${cooperative.description}</p>
                        </div>
                        
                        <div class="coop-products">
                            <h2>Produits principaux</h2>
                            <div class="products-list">
                                ${cooperative.products.map(product => `
                                    <div class="product-tag">
                                        <i class="fas fa-seedling"></i>
                                        <span>${product}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        ${cooperative.contact ? `
                        <div class="coop-contact">
                            <h2>Contact</h2>
                            <p><i class="fas fa-user"></i> Responsable: ${cooperative.contact.leader}</p>
                            <p><i class="fas fa-phone"></i> Téléphone: ${cooperative.contact.phone}</p>
                            <p><i class="fas fa-envelope"></i> Email: ${cooperative.contact.email}</p>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="back-button">
                        <a href="../private/cooperatives.html" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i> Retour aux coopératives
                        </a>
                    </div>
                </section>
            `;
        }
    } catch (error) {
        console.error('Erreur de chargement des détails:', error);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Charger les coopératives sur la page d'accueil
    if (document.getElementById('cooperativesList')) {
        loadCooperatives();
    }
    
    // Charger les détails sur la page dédiée
    if (document.getElementById('cooperativeDetails')) {
        loadCooperativeDetails();
    }
});
// Initialisation des données
function initializeData() {
    // Produits de démonstration
    const sampleProducts = [
        {
            id: 1,
            name: "Tomates Bio",
            price: 500,
            unit: "kg",
            cooperative: "Maraîchers Bio d'Aného",
            season: "Toute l'année",
            image: "fas fa-apple-alt",
            description: "Tomates cultivées sans pesticides, riches en goût",
            stock: 150,
            sales: 45
        },
        {
            id: 2,
            name: "Oignons Locaux",
            price: 400,
            unit: "kg",
            cooperative: "Coopérative Aklakou",
            season: "Décembre - Mars",
            image: "fas fa-pepper-hot",
            description: "Oignons doux, parfaits pour toutes vos recettes",
            stock: 200,
            sales: 32
        },
        {
            id: 3,
            name: "Gombo Frais",
            price: 300,
            unit: "kg",
            cooperative: "Bio Aného Sud",
            season: "Juin - Octobre",
            image: "fas fa-leaf",
            description: "Gombo tendre, excellent pour les sauces",
            stock: 120,
            sales: 28
        }
    ];
    
    // Coopératives de démonstration
    const sampleCooperatives = [
        {
            id: 1,
            name: "Maraîchers Bio d'Aného",
            location: "Aného-centre",
            members: 12,
            area: "5",
            contact: "+228 90 12 34 56",
            specialties: ["Tomates", "Oignons", "Gombo"],
            description: "Coopérative pionnière dans le maraîchage bio à Aného",
            manager: "Kossi Adjo",
            createdAt: "2023-01-15",
            status: "active"
        },
        {
            id: 2,
            name: "Coopérative Aklakou",
            location: "Aklakou",
            members: 8,
            area: "3",
            contact: "+228 91 23 45 67",
            specialties: ["Carottes", "Betteraves", "Piments"],
            description: "Spécialisée dans les légumes racines",
            manager: "Yao Mensah",
            createdAt: "2023-03-10",
            status: "active"
        }
    ];
    
    // Membres de démonstration
    const sampleMembers = [
        {
            id: 1,
            fullName: "Kossi Adjo",
            email: "kossi@bioaneho.tg",
            phone: "+228 90 12 34 56",
            cooperative: "Maraîchers Bio d'Aného",
            role: "agriculteur",
            status: "active",
            plotArea: "1 hectare",
            specialty: "Tomates",
            joinDate: "2023-01-20"
        },
        {
            id: 2,
            fullName: "Ama Doe",
            email: "ama@bioaneho.tg",
            phone: "+228 91 23 45 67",
            cooperative: "Coopérative Aklakou",
            role: "agriculteur",
            status: "active",
            plotArea: "0.5 hectare",
            specialty: "Carottes",
            joinDate: "2023-03-15"
        }
    ];
    
    // Initialiser le localStorage
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
    
    if (!localStorage.getItem('cooperatives')) {
        localStorage.setItem('cooperatives', JSON.stringify(sampleCooperatives));
    }
    
    if (!localStorage.getItem('members')) {
        localStorage.setItem('members', JSON.stringify(sampleMembers));
    }
    
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('contactMessages')) {
        localStorage.setItem('contactMessages', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('journalEntries')) {
        localStorage.setItem('journalEntries', JSON.stringify([]));
    }
}

// Menu mobile
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Fermer le menu en cliquant sur un lien
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// Charger les produits en vedette sur la page d'accueil
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const products = JSON.parse(localStorage.getItem('products')).slice(0, 4);
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">
                <i class="${product.image || 'fas fa-seedling'}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${product.price} FCFA/${product.unit}</div>
                <div class="product-meta">
                    <span><i class="fas fa-users"></i> ${product.cooperative}</span>
                    <span><i class="fas fa-calendar"></i> ${product.season || 'N/A'}</span>
                </div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})" style="width:100%;margin-top:10px;">
                    <i class="fas fa-cart-plus"></i> Ajouter au panier
                </button>
            </div>
        </div>
    `).join('');
}

// Charger les coopératives sur la page d'accueil
function loadCooperativesHome() {
    const container = document.getElementById('cooperativesList');
    if (!container) return;
    
    const cooperatives = JSON.parse(localStorage.getItem('cooperatives')).slice(0, 3);
    
    container.innerHTML = cooperatives.map(coop => `
        <div class="cooperative-card">
            <div class="cooperative-header">
                <div class="cooperative-icon">
                    <i class="fas fa-tractor"></i>
                </div>
                <h3 class="cooperative-name">${coop.name}</h3>
            </div>
            <div class="cooperative-details">
                <p><i class="fas fa-map-marker-alt"></i> ${coop.location}</p>
                <p><i class="fas fa-users"></i> ${coop.members} membres</p>
                <p><i class="fas fa-vector-square"></i> ${coop.area || 'N/A'} hectares</p>
                <p><i class="fas fa-seedling"></i> ${Array.isArray(coop.specialties) ? coop.specialties.slice(0, 3).join(', ') : (coop.specialties || 'Non spécifié')}</p>
            </div>
            <a href="../pages/private/cooperatives.html?id=${coop.id}" class="btn btn-outline" style="margin-top:15px;width:100%;">
                Voir les détails
            </a>
        </div>
    `).join('');
}

// Gestion du panier
function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Vérifier si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            quantity: 1,
            cooperative: product.cooperative
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} ajouté au panier !`);
    
    // Mettre à jour l'affichage du panier si présent
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartCount || !cartTotal || !cartSummary) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (totalCount > 0) {
        cartCount.textContent = totalCount;
        cartTotal.textContent = totalAmount.toLocaleString();
        cartSummary.style.display = 'block';
    } else {
        cartSummary.style.display = 'none';
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupMobileMenu();
    
    // Charger les données selon la page
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname === '/' || 
        window.location.pathname.endsWith('/')) {
        loadFeaturedProducts();
        loadCooperativesHome();
    }
    
    // Mettre à jour le panier
    updateCartDisplay();
});

// Export des fonctions pour les autres fichiers
window.addToCart = addToCart;
window.updateCartDisplay = updateCartDisplay;