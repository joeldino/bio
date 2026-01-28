// cooperatives.js - Gestion CRUD des coopératives et membres
// Fonction pour sauvegarder une coopérative
function saveCooperative(event) {
    event.preventDefault();
    
    const id = document.getElementById('cooperativeId').value;
    const cooperativeData = {
        name: document.getElementById('coopName').value,
        location: document.getElementById('coopLocation').value,
        manager: document.getElementById('coopManager').value,
        contact: document.getElementById('coopContact').value,
        email: document.getElementById('coopEmail').value,
        members: parseInt(document.getElementById('coopMembers').value) || 1,
        area: parseFloat(document.getElementById('coopArea').value) || 1,
        specialties: document.getElementById('coopSpecialties').value,
        description: document.getElementById('coopDescription').value
    };
    
    if (id) {
        // Mise à jour
        updateCooperative(parseInt(id), cooperativeData);
        alert('Coopérative modifiée avec succès !');
    } else {
        // Création
        const newCoop = createCooperative(cooperativeData);
        alert(`Coopérative "${newCoop.name}" créée avec succès !`);
    }
    
    closeCooperativeModal();
    loadAllCooperatives();
    
    // Si on est en vue détail, actualiser
    const detailView = document.getElementById('cooperativeDetailView');
    if (detailView && detailView.style.display === 'block') {
        showCooperativeDetail(parseInt(id) || cooperatives[cooperatives.length - 1].id);
    }
}
let cooperatives = [];
let currentUser = null;

// Initialisation des données
async function initData() {
    try {
        // Charger l'utilisateur courant
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Charger les coopératives depuis le localStorage ou initialiser avec des données par défaut
        const savedCooperatives = localStorage.getItem('cooperatives');
        
        if (savedCooperatives) {
            cooperatives = JSON.parse(savedCooperatives);
        } else {
            // Données par défaut
            cooperatives = [
                {
                    id: 1,
                    name: "Coopérative La Terre Promise",
                    location: "Aného-centre",
                    description: "Spécialisée dans les légumes feuilles traditionnels togolais. Nous pratiquons l'agroécologie depuis 2018.",
                    manager: "Kossi Adjo",
                    contact: "+228 90 12 34 56",
                    email: "laterrepromise@bioaneho.tg",
                    members: 15,
                    area: 5.2,
                    specialties: ["Épinard local", "Adémè", "Gboma", "Piment", "Tomate"],
                    createdAt: "2018-03-15",
                    membersList: [
                        { id: 1, name: "Kossi Adjo", role: "Président", phone: "+228 90 12 34 56", joined: "2018-03-15" },
                        { id: 2, name: "Afi Mensah", role: "Trésorière", phone: "+228 91 23 45 67", joined: "2018-04-10" },
                        { id: 3, name: "Komlan Doe", role: "Membre", phone: "+228 92 34 56 78", joined: "2019-01-20" }
                    ]
                },
                {
                    id: 2,
                    name: "Coopérative Les Jardins d'Aného",
                    location: "Aného-Sud",
                    description: "Les Jardins d'Aného regroupent 12 familles d'agriculteurs engagés dans la production biologique de légumes fruits.",
                    manager: "Afi Sossou",
                    contact: "+228 91 23 45 67",
                    email: "jardinsaneho@bioaneho.tg",
                    members: 12,
                    area: 3.8,
                    specialties: ["Tomate", "Aubergine", "Poivron", "Concombre", "Courgette"],
                    createdAt: "2020-06-22",
                    membersList: [
                        { id: 1, name: "Afi Sossou", role: "Présidente", phone: "+228 91 23 45 67", joined: "2020-06-22" },
                        { id: 2, name: "Yao Koffi", role: "Secrétaire", phone: "+228 93 45 67 89", joined: "2020-07-05" }
                    ]
                },
                {
                    id: 3,
                    name: "Coopérative Bio-Glidji",
                    location: "Aklakou",
                    description: "Producteurs de fruits tropicaux biologiques certifiés.",
                    manager: "Jean Akakpo",
                    contact: "+228 93 45 67 89",
                    email: "bioglidji@bioaneho.tg",
                    members: 8,
                    area: 4.5,
                    specialties: ["Mangue", "Papaye", "Ananas", "Citron"],
                    createdAt: "2021-02-10",
                    membersList: [
                        { id: 1, name: "Jean Akakpo", role: "Président", phone: "+228 93 45 67 89", joined: "2021-02-10" },
                        { id: 2, name: "Marie Lawson", role: "Membre", phone: "+228 94 56 78 90", joined: "2021-03-15" }
                    ]
                }
            ];
            saveCooperatives();
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des données:', error);
        cooperatives = [];
    }
}

// Sauvegarder les coopératives dans localStorage
function saveCooperatives() {
    localStorage.setItem('cooperatives', JSON.stringify(cooperatives));
}

// CRUD pour les coopératives

// CREATE - Créer une nouvelle coopérative
function createCooperative(cooperativeData) {
    const newId = cooperatives.length > 0 ? Math.max(...cooperatives.map(c => c.id)) + 1 : 1;
    
    const newCooperative = {
        id: newId,
        name: cooperativeData.name,
        location: cooperativeData.location,
        description: cooperativeData.description || '',
        manager: cooperativeData.manager || '',
        contact: cooperativeData.contact || '',
        email: cooperativeData.email || '',
        members: parseInt(cooperativeData.members) || 1,
        area: parseFloat(cooperativeData.area) || 1,
        specialties: cooperativeData.specialties ? cooperativeData.specialties.split(',').map(s => s.trim()) : [],
        createdAt: new Date().toISOString().split('T')[0],
        membersList: cooperativeData.membersList || []
    };
    
    cooperatives.push(newCooperative);
    saveCooperatives();
    return newCooperative;
}

// READ - Lire toutes les coopératives
function getAllCooperatives() {
    return cooperatives;
}

// READ - Lire une coopérative par ID
function getCooperativeById(id) {
    return cooperatives.find(coop => coop.id === id);
}

// UPDATE - Mettre à jour une coopérative
function updateCooperative(id, cooperativeData) {
    const index = cooperatives.findIndex(coop => coop.id === id);
    
    if (index === -1) return null;
    
    cooperatives[index] = {
        ...cooperatives[index],
        ...cooperativeData,
        id: id,
        members: parseInt(cooperativeData.members) || cooperatives[index].members,
        area: parseFloat(cooperativeData.area) || cooperatives[index].area,
        specialties: cooperativeData.specialties ? 
            cooperativeData.specialties.split(',').map(s => s.trim()) : 
            cooperatives[index].specialties
    };
    
    saveCooperatives();
    return cooperatives[index];
}

// DELETE - Supprimer une coopérative
function deleteCooperative(id) {
    const index = cooperatives.findIndex(coop => coop.id === id);
    
    if (index === -1) return false;
    
    cooperatives.splice(index, 1);
    saveCooperatives();
    return true;
}

// CRUD pour les membres d'une coopérative

// CREATE - Ajouter un membre à une coopérative
function addMemberToCooperative(coopId, memberData) {
    const cooperative = getCooperativeById(coopId);
    
    if (!cooperative) return null;
    
    if (!cooperative.membersList) {
        cooperative.membersList = [];
    }
    
    const newMemberId = cooperative.membersList.length > 0 ? 
        Math.max(...cooperative.membersList.map(m => m.id)) + 1 : 1;
    
    const newMember = {
        id: newMemberId,
        name: memberData.name,
        role: memberData.role || 'Membre',
        phone: memberData.phone || '',
        joined: new Date().toISOString().split('T')[0]
    };
    
    cooperative.membersList.push(newMember);
    cooperative.members = cooperative.membersList.length;
    saveCooperatives();
    
    return newMember;
}

// READ - Lire tous les membres d'une coopérative
function getMembersByCooperativeId(coopId) {
    const cooperative = getCooperativeById(coopId);
    return cooperative ? cooperative.membersList || [] : [];
}

// UPDATE - Mettre à jour un membre
function updateMember(coopId, memberId, memberData) {
    const cooperative = getCooperativeById(coopId);
    
    if (!cooperative || !cooperative.membersList) return null;
    
    const memberIndex = cooperative.membersList.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) return null;
    
    cooperative.membersList[memberIndex] = {
        ...cooperative.membersList[memberIndex],
        ...memberData,
        id: memberId
    };
    
    saveCooperatives();
    return cooperative.membersList[memberIndex];
}

// DELETE - Supprimer un membre
function deleteMember(coopId, memberId) {
    const cooperative = getCooperativeById(coopId);
    
    if (!cooperative || !cooperative.membersList) return false;
    
    const memberIndex = cooperative.membersList.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) return false;
    
    cooperative.membersList.splice(memberIndex, 1);
    cooperative.members = cooperative.membersList.length;
    saveCooperatives();
    
    return true;
}

// Fonctions d'affichage et d'interface

// Charger toutes les coopératives
async function loadAllCooperatives() {
    await initData();
    displayCooperatives(cooperatives);
}

// Afficher les coopératives
function displayCooperatives(coops) {
    const container = document.getElementById('cooperativesContainer');
    
    if (!container) return;
    
    if (coops.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-tractor" style="font-size: 4rem; color: #ddd; margin-bottom: 1rem;"></i>
                <h3 style="color: #666;">Aucune coopérative trouvée</h3>
                <p>Créez votre première coopérative !</p>
                <button class="btn btn-primary" onclick="openCreateCooperativeModal()">
                    <i class="fas fa-plus"></i> Créer une coopérative
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = coops.map(coop => `
        <div class="cooperative-card" data-id="${coop.id}">
            ${currentUser && currentUser.role === 'admin' ? `
            <div class="cooperative-actions">
                <button class="action-btn btn-edit" onclick="editCooperative(${coop.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="deleteCooperativePrompt(${coop.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            ` : ''}
            
            <div class="coop-image">
                <img src="${coop.image || '../../assets/images/default-coop.jpg'}" alt="${coop.name}">
            </div>
            
            <div class="coop-content">
                <h3>${coop.name}</h3>
                <p class="coop-location">
                    <i class="fas fa-map-marker-alt"></i> ${coop.location}
                </p>
                <p class="coop-description">${coop.description.substring(0, 100)}...</p>
                <div class="coop-members">
                    <i class="fas fa-users"></i>
                    <span>${coop.members || 0} membres</span>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 1rem;">
                    <button class="btn btn-primary" onclick="showCooperativeDetail(${coop.id})">
                        <i class="fas fa-eye"></i> Voir détails
                    </button>
                    ${currentUser && currentUser.role === 'admin' ? `
                    <button class="btn btn-outline" onclick="manageMembers(${coop.id})">
                        <i class="fas fa-user-friends"></i> Membres
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Filtrer les coopératives
function filterCooperatives() {
    const searchTerm = document.getElementById('searchCooperative').value.toLowerCase();
    const locationFilter = document.getElementById('filterLocation').value;
    
    let filtered = cooperatives;
    
    if (searchTerm) {
        filtered = filtered.filter(coop => 
            coop.name.toLowerCase().includes(searchTerm) ||
            coop.location.toLowerCase().includes(searchTerm) ||
            coop.description.toLowerCase().includes(searchTerm)
        );
    }
    
    if (locationFilter) {
        filtered = filtered.filter(coop => coop.location === locationFilter);
    }
    
    displayCooperatives(filtered);
}

// Afficher les détails d'une coopérative
function showCooperativeDetail(coopId) {
    const coop = getCooperativeById(coopId);
    
    if (!coop) {
        alert('Coopérative non trouvée');
        return;
    }
    
    // Masquer la liste et afficher les détails
    document.getElementById('cooperativesListView').style.display = 'none';
    document.getElementById('cooperativeDetailView').style.display = 'block';
    
    // Calculer l'âge en mois
    const createdDate = new Date(coop.createdAt);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - createdDate.getFullYear()) * 12 + 
                      (now.getMonth() - createdDate.getMonth());
    
    // Afficher les informations
    document.getElementById('detailTitle').textContent = coop.name;
    document.getElementById('detailDescription').textContent = coop.description;
    document.getElementById('detailMembers').textContent = coop.members;
    document.getElementById('detailArea').textContent = coop.area;
    document.getElementById('detailProducts').textContent = coop.specialties.length;
    document.getElementById('detailAge').textContent = monthsDiff;
    document.getElementById('detailLocation').textContent = coop.location;
    document.getElementById('detailContact').textContent = coop.contact;
    document.getElementById('detailManager').textContent = coop.manager;
    
    // Formatter la date
    const dateObj = new Date(coop.createdAt);
    document.getElementById('detailCreatedAt').textContent = 
        dateObj.toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    
    // Afficher les spécialités
    const specialtiesContainer = document.getElementById('detailSpecialties');
    specialtiesContainer.innerHTML = coop.specialties.map(spec => `
        <span class="product-tag">${spec}</span>
    `).join('');
    
    // Afficher les membres
    const membersListContainer = document.getElementById('detailMembersList');
    membersListContainer.innerHTML = coop.membersList && coop.membersList.length > 0 ? 
        coop.membersList.map(member => `
            <div class="member-item">
                <div class="member-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div style="flex: 1;">
                    <strong>${member.name}</strong>
                    <div style="font-size: 0.9rem; color: #666;">
                        ${member.role} • ${member.phone}
                    </div>
                    <div style="font-size: 0.8rem; color: #999;">
                        Membre depuis ${new Date(member.joined).toLocaleDateString('fr-FR')}
                    </div>
                </div>
                ${currentUser && currentUser.role === 'admin' ? `
                <div style="display: flex; gap: 5px;">
                    <button class="action-btn btn-edit" style="width: 30px; height: 30px;" 
                            onclick="editMember(${coop.id}, ${member.id})">
                        <i class="fas fa-edit" style="font-size: 0.8rem;"></i>
                    </button>
                    <button class="action-btn btn-delete" style="width: 30px; height: 30px;"
                            onclick="deleteMemberPrompt(${coop.id}, ${member.id})">
                        <i class="fas fa-trash" style="font-size: 0.8rem;"></i>
                    </button>
                </div>
                ` : ''}
            </div>
        `).join('') : `
        <div style="text-align: center; padding: 2rem; color: #666;">
            <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
            <p>Aucun membre enregistré</p>
            ${currentUser && currentUser.role === 'admin' ? `
            <button class="btn btn-outline" onclick="addNewMember(${coop.id})">
                <i class="fas fa-user-plus"></i> Ajouter un membre
            </button>
            ` : ''}
        </div>
    `;
    
    // Ajouter le bouton d'ajout de membre pour les admins
    if (currentUser && currentUser.role === 'admin') {
        const addMemberBtn = document.createElement('button');
        addMemberBtn.className = 'btn btn-primary';
        addMemberBtn.innerHTML = '<i class="fas fa-user-plus"></i> Ajouter un membre';
        addMemberBtn.onclick = () => addNewMember(coopId);
        addMemberBtn.style.marginTop = '1rem';
        
        if (!membersListContainer.querySelector('.btn')) {
            membersListContainer.appendChild(addMemberBtn);
        }
    }
}

// Revenir à la liste
function showListView() {
    document.getElementById('cooperativesListView').style.display = 'block';
    document.getElementById('cooperativeDetailView').style.display = 'none';
    // Nettoyer l'URL
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
}

// Gestion du modal pour les coopératives
function openCreateCooperativeModal() {
    document.getElementById('modalTitle').textContent = 'Nouvelle Coopérative';
    document.getElementById('cooperativeId').value = '';
    document.getElementById('coopName').value = '';
    document.getElementById('coopLocation').value = '';
    document.getElementById('coopManager').value = '';
    document.getElementById('coopContact').value = '';
    document.getElementById('coopEmail').value = '';
    document.getElementById('coopMembers').value = '1';
    document.getElementById('coopArea').value = '1';
    document.getElementById('coopSpecialties').value = '';
    document.getElementById('coopDescription').value = '';
    
    document.getElementById('cooperativeModal').style.display = 'flex';
}

function editCooperative(id) {
    const coop = getCooperativeById(id);
    
    if (!coop) return;
    
    document.getElementById('modalTitle').textContent = 'Modifier la Coopérative';
    document.getElementById('cooperativeId').value = coop.id;
    document.getElementById('coopName').value = coop.name;
    document.getElementById('coopLocation').value = coop.location;
    document.getElementById('coopManager').value = coop.manager || '';
    document.getElementById('coopContact').value = coop.contact || '';
    document.getElementById('coopEmail').value = coop.email || '';
    document.getElementById('coopMembers').value = coop.members || 1;
    document.getElementById('coopArea').value = coop.area || 1;
    document.getElementById('coopSpecialties').value = coop.specialties ? coop.specialties.join(', ') : '';
    document.getElementById('coopDescription').value = coop.description || '';
    
    document.getElementById('cooperativeModal').style.display = 'flex';
}

function closeCooperativeModal() {
    document.getElementById('cooperativeModal').style.display = 'none';
}

function saveCooperative(event) {
    event.preventDefault();
    
    const id = document.getElementById('cooperativeId').value;
    const cooperativeData = {
        name: document.getElementById('coopName').value,
        location: document.getElementById('coopLocation').value,
        manager: document.getElementById('coopManager').value,
        contact: document.getElementById('coopContact').value,
        email: document.getElementById('coopEmail').value,
        members: document.getElementById('coopMembers').value,
        area: document.getElementById('coopArea').value,
        specialties: document.getElementById('coopSpecialties').value,
        description: document.getElementById('coopDescription').value
    };
    
    if (id) {
        // Mise à jour
        updateCooperative(parseInt(id), cooperativeData);
    } else {
        // Création
        createCooperative(cooperativeData);
    }
    
    closeCooperativeModal();
    loadAllCooperatives();
    
    // Si on est en vue détail, actualiser
    if (document.getElementById('cooperativeDetailView').style.display === 'block') {
        showCooperativeDetail(parseInt(id) || cooperatives[cooperatives.length - 1].id);
    }
}

function deleteCooperativePrompt(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette coopérative ? Cette action est irréversible.')) {
        deleteCooperative(id);
        loadAllCooperatives();
        
        // Si on est en vue détail, revenir à la liste
        if (document.getElementById('cooperativeDetailView').style.display === 'block') {
            showListView();
        }
    }
}

// Gestion des membres
function manageMembers(coopId) {
    showCooperativeDetail(coopId);
}

function addNewMember(coopId) {
    const memberName = prompt('Nom complet du nouveau membre:');
    if (!memberName) return;
    
    const memberRole = prompt('Rôle du membre (Président, Trésorier, Membre, etc.):', 'Membre');
    if (memberRole === null) return;
    
    const memberPhone = prompt('Numéro de téléphone:');
    
    const newMember = addMemberToCooperative(coopId, {
        name: memberName,
        role: memberRole,
        phone: memberPhone || ''
    });
    
    if (newMember) {
        alert('Membre ajouté avec succès !');
        showCooperativeDetail(coopId);
    }
}

function editMember(coopId, memberId) {
    const coop = getCooperativeById(coopId);
    if (!coop || !coop.membersList) return;
    
    const member = coop.membersList.find(m => m.id === memberId);
    if (!member) return;
    
    const newName = prompt('Nouveau nom:', member.name);
    if (newName === null) return;
    
    const newRole = prompt('Nouveau rôle:', member.role);
    if (newRole === null) return;
    
    const newPhone = prompt('Nouveau téléphone:', member.phone);
    
    updateMember(coopId, memberId, {
        name: newName,
        role: newRole,
        phone: newPhone || ''
    });
    
    alert('Membre modifié avec succès !');
    showCooperativeDetail(coopId);
}

function deleteMemberPrompt(coopId, memberId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
        deleteMember(coopId, memberId);
        alert('Membre supprimé avec succès !');
        showCooperativeDetail(coopId);
    }
}

// Export des données
function exportCooperatives() {
    const dataStr = JSON.stringify(cooperatives, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cooperatives-bio-aneho-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadAllCooperatives();
});