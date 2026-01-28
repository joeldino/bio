// orders.js - Gestion des commandes

// Charger les commandes
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const container = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-shopping-cart" style="font-size: 2rem; color: #ddd; margin-bottom: 1rem;"></i>
                    <p>Aucune commande enregistrée</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Trier par date (plus récent en premier)
    orders.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    
    container.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.items ? order.items.length : 0} articles</td>
            <td>${(order.total || 0).toLocaleString()} FCFA</td>
            <td>
                <span class="order-status status-${order.status || 'pending'}">
                    ${getStatusText(order.status)}
                </span>
            </td>
            <td>${order.date ? new Date(order.date).toLocaleDateString('fr-FR') : 'N/A'}</td>
            <td>
                <div class="order-actions">
                    <button class="btn-icon btn-view" onclick="viewOrder(${order.id})" title="Voir">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-edit" onclick="editOrder(${order.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteOrder(${order.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updateOrderStats(orders);
}

function getStatusText(status) {
    switch(status) {
        case 'pending': return 'En attente';
        case 'processing': return 'En traitement';
        case 'shipped': return 'Expédié';
        case 'delivered': return 'Livré';
        case 'cancelled': return 'Annulé';
        default: return 'En attente';
    }
}

function updateOrderStats(orders) {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const thisMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.date || order.createdAt);
        const now = new Date();
        return orderDate.getMonth() === now.getMonth() && 
               orderDate.getFullYear() === now.getFullYear();
    });
    const monthRevenue = thisMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    document.getElementById('totalOrdersCount').textContent = totalOrders;
    document.getElementById('pendingOrdersCount').textContent = pendingOrders;
    document.getElementById('totalRevenueAmount').textContent = totalRevenue.toLocaleString();
    document.getElementById('monthRevenueAmount').textContent = monthRevenue.toLocaleString();
}

// Voir une commande
function viewOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Commande non trouvée');
        return;
    }
    
    let orderDetails = `Commande #${order.id}\n\n`;
    orderDetails += `Client: ${order.customerName}\n`;
    orderDetails += `Email: ${order.customerEmail || 'Non spécifié'}\n`;
    orderDetails += `Téléphone: ${order.customerPhone || 'Non spécifié'}\n`;
    orderDetails += `Adresse: ${order.shippingAddress || 'Non spécifié'}\n`;
    orderDetails += `Date: ${order.date ? new Date(order.date).toLocaleDateString('fr-FR') : 'N/A'}\n`;
    orderDetails += `Statut: ${getStatusText(order.status)}\n`;
    orderDetails += `Total: ${(order.total || 0).toLocaleString()} FCFA\n\n`;
    
    if (order.items && order.items.length > 0) {
        orderDetails += 'Articles:\n';
        order.items.forEach((item, index) => {
            orderDetails += `${index + 1}. ${item.name} - ${item.quantity} x ${item.price} FCFA = ${item.quantity * item.price} FCFA\n`;
        });
    }
    
    orderDetails += `\nNotes: ${order.notes || 'Aucune'}`;
    
    alert(orderDetails);
}

// Créer une commande depuis le panier
function createOrderFromCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Votre panier est vide');
        return;
    }
    
    const customerName = prompt('Nom du client:');
    if (!customerName) return;
    
    const customerPhone = prompt('Téléphone du client:');
    const shippingAddress = prompt('Adresse de livraison:');
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    
    const order = {
        id: newId,
        customerName,
        customerPhone,
        shippingAddress,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Vider le panier
    localStorage.removeItem('cart');
    if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
    }
    
    alert(`Commande #${newId} créée avec succès !\nTotal: ${order.total.toLocaleString()} FCFA`);
    loadOrders();
}

// Modifier une commande
function editOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Commande non trouvée');
        return;
    }
    
    const newStatus = prompt('Nouveau statut (pending/processing/shipped/delivered/cancelled):', order.status);
    if (!newStatus || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
        alert('Statut invalide');
        return;
    }
    
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders();
    alert('Statut de la commande mis à jour');
}

// Supprimer une commande
function deleteOrder(orderId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        alert('Commande supprimée');
    }
}

// Filtrer les commandes
function filterOrders() {
    const status = document.getElementById('filterOrderStatus').value;
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (status) {
        orders = orders.filter(o => o.status === status);
    }
    
    if (startDate) {
        const start = new Date(startDate);
        orders = orders.filter(o => new Date(o.date || o.createdAt) >= start);
    }
    
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        orders = orders.filter(o => new Date(o.date || o.createdAt) <= end);
    }
    
    displayFilteredOrders(orders);
}

function displayFilteredOrders(orders) {
    const container = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-search fa-3x" style="color: #ddd; margin-bottom: 1rem;"></i>
                    <p>Aucune commande ne correspond à votre recherche</p>
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.items ? order.items.length : 0} articles</td>
            <td>${(order.total || 0).toLocaleString()} FCFA</td>
            <td>
                <span class="order-status status-${order.status || 'pending'}">
                    ${getStatusText(order.status)}
                </span>
            </td>
            <td>${order.date ? new Date(order.date).toLocaleDateString('fr-FR') : 'N/A'}</td>
            <td>
                <div class="order-actions">
                    <button class="btn-icon btn-view" onclick="viewOrder(${order.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-edit" onclick="editOrder(${order.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Exporter les commandes
function exportOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (orders.length === 0) {
        alert('Aucune commande à exporter');
        return;
    }
    
    const format = document.getElementById('exportOrderFormat')?.value || 'json';
    
    if (format === 'json') {
        const dataStr = JSON.stringify(orders, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const fileName = `commandes-bioaneho-${new Date().toISOString().split('T')[0]}.json`;
        
        downloadFile(dataUri, fileName);
    } else if (format === 'csv') {
        let csvContent = "ID,Client,Articles,Total,Statut,Date\n";
        orders.forEach(order => {
            csvContent += `"${order.id}","${order.customerName}","${order.items ? order.items.length : 0}","${order.total || 0}","${getStatusText(order.status)}","${order.date || ''}"\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const fileName = `commandes-bioaneho-${new Date().toISOString().split('T')[0]}.csv`;
        
        downloadFile(url, fileName);
    }
}

function downloadFile(url, fileName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    if (!requireRole(['admin', 'coop_admin'])) return;
    
    loadOrders();
    updateUserInfo();
    updateCurrentDate();
    
    // Définir la date d'aujourd'hui comme date de fin par défaut
    const today = new Date().toISOString().split('T')[0];
    const endDateInput = document.getElementById('filterEndDate');
    if (endDateInput) {
        endDateInput.value = today;
    }
    
    // Définir la date de début comme il y a 30 jours
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const startDateInput = document.getElementById('filterStartDate');
    if (startDateInput) {
        startDateInput.value = startDate.toISOString().split('T')[0];
    }
});

// Export des fonctions
window.loadOrders = loadOrders;
window.viewOrder = viewOrder;
window.createOrderFromCart = createOrderFromCart;
window.editOrder = editOrder;
window.deleteOrder = deleteOrder;
window.filterOrders = filterOrders;
window.exportOrders = exportOrders;