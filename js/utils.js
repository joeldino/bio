// utils.js - Fonctions utilitaires

// Formater un nombre en devise
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
    }).format(amount);
}

// Formater une date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Formater une date et heure
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Générer un ID unique
function generateId(prefix = '') {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
}

// Valider un email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Valider un téléphone
function isValidPhone(phone) {
    const regex = /^[\+]?[0-9\s\-\(\)]+$/;
    return regex.test(phone);
}

// Afficher un message de succès
function showSuccess(message, duration = 3000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-success';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span style="margin-left: 10px;">${message}</span>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, duration);
}

// Afficher un message d'erreur
function showError(message, duration = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-error';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span style="margin-left: 10px;">${message}</span>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, duration);
}

// Ajouter les animations CSS
function addAlertStyles() {
    if (!document.querySelector('#alert-styles')) {
        const style = document.createElement('style');
        style.id = 'alert-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Télécharger un fichier
function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Lire un fichier
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}

// Exporter en CSV
function exportToCSV(data, headers) {
    let csv = headers.join(',') + '\n';
    data.forEach(row => {
        csv += headers.map(header => {
            let cell = row[header] || '';
            // Échapper les guillemets et les virgules
            cell = String(cell).replace(/"/g, '""');
            if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                cell = `"${cell}"`;
            }
            return cell;
        }).join(',') + '\n';
    });
    return csv;
}

// Gestionnaire de chargement
function showLoader() {
    let loader = document.getElementById('global-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        loader.innerHTML = `
            <div style="text-align: center;">
                <i class="fas fa-spinner fa-spin fa-3x" style="color: var(--primary-color);"></i>
                <p style="margin-top: 20px; color: #666;">Chargement...</p>
            </div>
        `;
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
}

function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Initialiser les styles d'alerte
addAlertStyles();

// Export des fonctions
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.generateId = generateId;
window.isValidEmail = isValidEmail;
window.isValidPhone = isValidPhone;
window.showSuccess = showSuccess;
window.showError = showError;
window.downloadFile = downloadFile;
window.readFile = readFile;
window.exportToCSV = exportToCSV;
window.showLoader = showLoader;
window.hideLoader = hideLoader;