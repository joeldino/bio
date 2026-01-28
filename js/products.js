// products.js - Gestion des produits

let currentProductId = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Charger les produits
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const container = document.getElementById('productsContainer');
    const user = getCurrentUser();
    const isAdmin = user && user.role === 'admin';
    
    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-seedling fa-3x" style="color: #ddd; margin-bottom: 1rem;"></i>
                <p>Aucun produit enregistré.</p>
                ${isAdmin ? '<button class="btn btn-primary" onclick="openProductModal()">Ajouter le premier produit</button>' : ''}
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            ${isAdmin ? `
                <div class="product-actions-admin" style="position: absolute; top: 1rem; right: 1rem; display: none; gap: 0.5rem;">
                    <button class="action-btn btn-edit" onclick="editProduct(${product.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteProduct(${product.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : ''}
            
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
                <p class="product-description">${(product.description || '').substring(0, 80)}${(product.description || '').length > 80 ? '...' : ''}</p>
                
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" style="flex:1;">
                        <i class="fas fa-cart-plus"></i> Ajouter
                    </button>
                    <button class="btn btn-outline" onclick="showProductDetail(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Afficher les actions admin au survol
    if (isAdmin) {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                const actions = this.querySelector('.product-actions-admin');
                if (actions) actions.style.display = 'flex';
            });
            card.addEventListener('mouseleave', function() {
                const actions = this.querySelector('.product-actions-admin');
                if (actions) actions.style.display = 'none';
            });
        });
    }
}

// Charger les options des coopératives pour les filtres
function loadCooperativesFilter() {
    const cooperatives = JSON.parse(localStorage.getItem('cooperatives')) || [];
    const select = document.getElementById('filterCooperative');
    const selectModal = document.getElementById('productCooperative');
    
    const options = cooperatives.map(coop => 
        `<option value="${coop.name}">${coop.name}</option>`
    ).join('');
    
    if (select) {
        select.innerHTML = '<option value="">Toutes les coopératives</option>' + options;
    }
    
    if (selectModal) {
        selectModal.innerHTML = '<option value="">Sélectionner une coopérative</option>' + options;
    }
}

// Filtrer les produits
function filterProducts() {
    const search = document.getElementById('searchProduct').value.toLowerCase();
    const cooperative = document.getElementById('filterCooperative').value;
    const season = document.getElementById('filterSeason').value;
    const sort = document.getElementById('sortProducts').value;
    
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Filtrage
    if (search) {
        products = products.filter(p => 
            p.name.toLowerCase().includes(search) || 
            (p.description && p.description.toLowerCase().includes(search))
        );
    }
    
    if (cooperative) {
        products = products.filter(p => p.cooperative === cooperative);
    }
    
    if (season) {
        products = products.filter(p => p.season === season);
    }
    
    // Tri
    switch(sort) {
        case 'name':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-asc':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            products.sort((a, b) => (b.sales || 0) - (a.sales || 0));
            break;
    }
    
    displayFilteredProducts(products);
}

function displayFilteredProducts(products) {
    const container = document.getElementById('productsContainer');
    const user = getCurrentUser();
    const isAdmin = user && user.role === 'admin';
    
    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-search fa-3x" style="color: #ddd; margin-bottom: 1rem;"></i>
                <p>Aucun produit ne correspond à votre recherche.</p>
                <button class="btn btn-outline" onclick="resetFilters()">Réinitialiser les filtres</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            ${isAdmin ? `
                <div class="product-actions-admin" style="position: absolute; top: 1rem; right: 1rem; display: none; gap: 0.5rem;">
                    <button class="action-btn btn-edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : ''}
            
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
                
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" style="flex:1;">
                        <i class="fas fa-cart-plus"></i> Ajouter
                    </button>
                    <button class="btn btn-outline" onclick="showProductDetail(${product.id})">
                        Détails
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function resetFilters() {
    document.getElementById('searchProduct').value = '';
    document.getElementById('filterCooperative').value = '';
    document.getElementById('filterSeason').value = '';
    document.getElementById('sortProducts').value = 'name';
    loadProducts();
}

// Afficher les détails d'un produit
function showProductDetail(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Produit non trouvé');
        return;
    }
    
    currentProductId = productId;
    
    // Mettre à jour l'URL
    window.history.pushState({}, '', `?id=${productId}`);
    
    // Cacher liste, montrer détail
    document.getElementById('productsListView').style.display = 'none';
    document.getElementById('productDetailView').style.display = 'block';
    
    // Remplir les informations
    document.getElementById('productDetailName').textContent = product.name;
    document.getElementById('productDetailPrice').textContent = `${product.price} FCFA/${product.unit}`;
    document.getElementById('productDetailCoop').textContent = product.cooperative;
    document.getElementById('productDetailSeason').textContent = product.season || 'Non spécifié';
    document.getElementById('productDetailUnit').textContent = product.unit;
    document.getElementById('productDetailAvailability').textContent = product.stock > 0 ? 'En stock' : 'Rupture';
    document.getElementById('productDetailDescription').textContent = product.description || 'Aucune description disponible.';
    document.getElementById('productImageLarge').innerHTML = `<i class="${product.image || 'fas fa-seedling'}"></i>`;
    
    // Statistiques
    document.getElementById('statStock').textContent = product.stock || 0;
    document.getElementById('statSales').textContent = product.sales || 0;
    document.getElementById('statRating').textContent = product.rating ? product.rating.toFixed(1) : '0.0';
    
    // Formulaire de commande
    document.getElementById('orderUnit').textContent = product.unit;
    document.getElementById('orderQuantity').value = 1;
    updateOrderTotal();
    
    // Afficher les actions admin si nécessaire
    const user = getCurrentUser();
    if (user && user.role === 'admin') {
        document.getElementById('adminProductActions').style.display = 'flex';
    }
}

function showProductsList() {
    window.history.pushState({}, '', 'products.html');
    document.getElementById('productsListView').style.display = 'block';
    document.getElementById('productDetailView').style.display = 'none';
    currentProductId = null;
    loadProducts();
    updateCartDisplay();
}

// Gestion du panier
function addToCartFromProductList(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Vérifier le stock
    if (product.stock !== undefined && product.stock <= 0) {
        alert('Ce produit est en rupture de stock');
        return;
    }
    
    // Ajouter au panier
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        quantity: 1,
        cooperative: product.cooperative
    };
    
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartDisplay();
    alert(`${product.name} ajouté au panier !`);
}

function addToCartFromDetail() {
    if (!currentProductId) return;
    
    const quantity = parseInt(document.getElementById('orderQuantity').value) || 1;
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === currentProductId);
    
    if (!product) return;
    
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        quantity: quantity,
        cooperative: product.cooperative
    };
    
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartDisplay();
    alert(`${quantity} ${product.unit} de ${product.name} ajouté(s) au panier !`);
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartCount || !cartTotal || !cartSummary) return;
    
    cart = JSON.parse(localStorage.getItem('cart')) || [];
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

function increaseQuantity() {
    const input = document.getElementById('orderQuantity');
    input.value = parseInt(input.value) + 1;
    updateOrderTotal();
}

function decreaseQuantity() {
    const input = document.getElementById('orderQuantity');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
        updateOrderTotal();
    }
}

function updateOrderTotal() {
    const quantity = parseInt(document.getElementById('orderQuantity').value) || 1;
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === currentProductId);
    
    if (product) {
        const total = product.price * quantity;
        document.getElementById('orderTotal').textContent = total.toLocaleString();
    }
}

// Fonctions CRUD admin
function openProductModal(product = null) {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        alert('Accès réservé aux administrateurs');
        return;
    }
    
    loadCooperativesFilter();
    
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (product) {
        modalTitle.textContent = 'Modifier le Produit';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productUnit').value = product.unit;
        document.getElementById('productCooperative').value = product.cooperative;
        document.getElementById('productCategory').value = product.category || 'légume';
        document.getElementById('productSeason').value = product.season || 'Toute l\'année';
        document.getElementById('productStock').value = product.stock || 0;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productImageIcon').value = product.image || 'fas fa-seedling';
    } else {
        modalTitle.textContent = 'Nouveau Produit';
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('productStock').value = 0;
    }
    
    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function saveProduct(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        alert('Permission refusée');
        return;
    }
    
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const unit = document.getElementById('productUnit').value;
    const cooperative = document.getElementById('productCooperative').value;
    const category = document.getElementById('productCategory').value;
    const season = document.getElementById('productSeason').value;
    const stock = parseInt(document.getElementById('productStock').value) || 0;
    const description = document.getElementById('productDescription').value;
    const image = document.getElementById('productImageIcon').value || 'fas fa-seedling';
    
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (id) {
        // Modification
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                unit,
                cooperative,
                category,
                season,
                stock,
                description,
                image,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Création
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            name,
            price,
            unit,
            cooperative,
            category,
            season,
            stock,
            description,
            image,
            sales: 0,
            rating: 0,
            createdAt: new Date().toISOString(),
            status: 'active'
        });
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    closeProductModal();
    loadProducts();
    alert('Produit enregistré avec succès !');
}

function editProduct(id) {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        alert('Accès réservé aux administrateurs');
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === id);
    
    if (product) {
        openProductModal(product);
    }
}

function deleteProduct(id) {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        alert('Accès réservé aux administrateurs');
        return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
        let products = JSON.parse(localStorage.getItem('products'));
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        
        if (currentProductId === id) {
            showProductsList();
        }
        
        alert('Produit supprimé avec succès !');
    }
}

function exportProducts() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        alert('Accès réservé aux administrateurs');
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `produits-bioaneho-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Gestion du bouton retour navigateur
window.addEventListener('popstate', function(event) {
    showProductsList();
});

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    loadProducts();
    loadCooperativesFilter();
    updateCartDisplay();
    
    // Vérifier si on doit afficher un produit spécifique
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        showProductDetail(parseInt(productId));
    }
});

// Export des fonctions
window.loadProducts = loadProducts;
window.filterProducts = filterProducts;
window.resetFilters = resetFilters;
window.showProductDetail = showProductDetail;
window.showProductsList = showProductsList;
window.addToCart = addToCartFromProductList;
window.addToCartFromDetail = addToCartFromDetail;
window.updateCartDisplay = updateCartDisplay;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.updateOrderTotal = updateOrderTotal;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.saveProduct = saveProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.exportProducts = exportProducts;