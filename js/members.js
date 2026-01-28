// members.js - Gestion CRUD des membres

let members = [];
let currentUser = null;

// Initialisation des données
async function initMemberData() {
    try {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        const savedMembers = localStorage.getItem('members');
        
        if (savedMembers) {
            members = JSON.parse(savedMembers);
        } else {
            // Données par défaut
            members = [
                {
                    id: 1,
                    firstName: "Kossi",
                    lastName: "Adjo",
                    fullName: "Kossi Adjo",
                    cooperativeId: 1,
                    cooperative: "Coopérative La Terre Promise",
                    role: "Président",
                    phone: "+228 90 12 34 56",
                    email: "kossi.adjo@bioaneho.tg",
                    address: "Aného-centre, Quartier Commerce",
                    joinDate: "2018-03-15",
                    status: "active",
                    notes: "Fondateur de la coopérative"
                },
                {
                    id: 2,
                    firstName: "Afi",
                    lastName: "Mensah",
                    fullName: "Afi Mensah",
                    cooperativeId: 1,
                    cooperative: "Coopérative La Terre Promise",
                    role: "Trésorière",
                    phone: "+228 91 23 45 67",
                    email: "afi.mensah@bioaneho.tg",
                    address: "Aného-Sud, Quartier Pêcheurs",
                    joinDate: "2018-04-10",
                    status: "active",
                    notes: "Spécialiste en gestion financière"
                },
                {
                    id: 3,
                    firstName: "Komlan",
                    lastName: "Doe",
                    fullName: "Komlan Doe",
                    cooperativeId: 1,
                    cooperative: "Coopérative La Terre Promise",
                    role: "Membre",
                    phone: "+228 92 34 56 78",
                    email: "komlan.doe@bioaneho.tg",
                    address: "Aného-centre",
                    joinDate: "2019-01-20",
                    status: "active"
                }
            ];
            saveMembers();
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des membres:', error);
        members = [];
    }
}

// Sauvegarder les membres
function saveMembers() {
    localStorage.setItem('members', JSON.stringify(members));
}

// CRUD pour les membres

// CREATE - Créer un nouveau membre
function createMember(memberData) {
    const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
    
    // Trouver le nom de la coopérative
    const cooperatives = JSON.parse(localStorage.getItem('cooperatives')) || [];
    const cooperative = cooperatives.find(c => c.id == memberData.cooperativeId);
    
    const newMember = {
        id: newId,
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        fullName: `${memberData.firstName} ${memberData.lastName}`,
        cooperativeId: parseInt(memberData.cooperativeId),
        cooperative: cooperative ? cooperative.name : 'Non spécifié',
        role: memberData.role,
        phone: memberData.phone,
        email: memberData.email || '',
        address: memberData.address || '',
        joinDate: memberData.joinDate,
        status: memberData.status || 'active',
        notes: memberData.notes || '',
        createdAt: new Date().toISOString()
    };
    
    members.push(newMember);
    saveMembers();
    
    // Mettre à jour le nombre de membres dans la coopérative
    updateCooperativeMembersCount(newMember.cooperativeId);
    
    // Ajouter à la liste des membres de la coopérative
    if (cooperative) {
        addMemberToCooperativeList(newMember);
    }
    
    return newMember;
}

// READ - Lire tous les membres
function getAllMembers() {
    return members;
}

// READ - Lire un membre par ID
function getMemberById(id) {
    return members.find(member => member.id === parseInt(id));
}

// READ - Lire les membres d'une coopérative
function getMembersByCooperativeId(coopId) {
    return members.filter(member => member.cooperativeId === parseInt(coopId));
}

// UPDATE - Mettre à jour un membre
function updateMember(id, memberData) {
    const index = members.findIndex(member => member.id === parseInt(id));
    
    if (index === -1) return null;
    
    // Sauvegarder l'ancienne coopérative
    const oldCoopId = members[index].cooperativeId;
    
    // Trouver le nom de la nouvelle coopérative
    const cooperatives = JSON.parse(localStorage.getItem('cooperatives')) || [];
    const cooperative = cooperatives.find(c => c.id == memberData.cooperativeId);
    
    members[index] = {
        ...members[index],
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        fullName: `${memberData.firstName} ${memberData.lastName}`,
        cooperativeId: parseInt(memberData.cooperativeId),
        cooperative: cooperative ? cooperative.name : 'Non spécifié',
        role: memberData.role,
        phone: memberData.phone,
        email: memberData.email || '',
        address: memberData.address || '',
        joinDate: memberData.joinDate,
        status: memberData.status || 'active',
        notes: memberData.notes || '',
        updatedAt: new Date().toISOString()
    };
    
    saveMembers();
    
    // Mettre à jour les comptes de membres si la coopérative a changé
    if (oldCoopId !== members[index].cooperativeId) {
        updateCooperativeMembersCount(oldCoopId);
        updateCooperativeMembersCount(members[index].cooperativeId);
        
        // Mettre à jour la liste des membres dans la coopérative
        removeMemberFromCooperativeList(parseInt(id), oldCoopId);
        addMemberToCooperativeList(members[index]);
    }
    
    return members[index];
}

// DELETE - Supprimer un membre
function deleteMember(id) {
    const index = members.findIndex(member => member.id === parseInt(id));
    
    if (index === -1) return false;
    
    const deletedMember = members[index];
    
    members.splice(index, 1);
    saveMembers();
    
    // Mettre à jour le compte de membres de la coopérative
    updateCooperativeMembersCount(deletedMember.cooperativeId);
    
    // Retirer de la liste des membres de la coopérative
    removeMemberFromCooperativeList(parseInt(id), deletedMember.cooperativeId);
    
    return true;
}

// Mettre à jour le compte de membres d'une coopérative
function updateCooperativeMembersCount(coopId) {
    const cooperatives = JSON.parse(localStorage.getItem('cooperatives')) || [];
    const coopIndex = cooperatives.findIndex(c => c.id === parseInt(coopId));
    
    if (coopIndex !== -1) {
        const coopMembers = members.filter(m => m.cooperativeId === parseInt(coopId));
        cooperatives[coopIndex].members = coopMembers.length;
        localStorage.setItem('cooperatives', JSON.stringify(cooperatives));
    }
}

// Ajouter un membre à la liste des membres d'une coopérative
function addMemberToCooperativeList(member) {
    const cooperatives = JSON.parse(localStorage.getItem('cooperatives')) || [];
    const coopIndex = cooperatives.findIndex(c => c.id === member.cooperativeId);
    
    if (coopIndex !== -1) {
        if (!cooperatives[coopIndex].membersList) {
            cooperatives[coopIndex].membersList = [];
        }
        
        // Vérifier si le membre n'existe pas déjà
        const existingIndex = cooperatives[coopIndex].membersList.findIndex(m => m.id === member.id);
        
        if (existingIndex === -1) {
            cooperatives[coopIndex].membersList.push({
                id: member.id,
                name: member.fullName,
                role: member.role,
                phone: member.phone,
                joined: member.joinDate
            });
            
            localStorage.setItem('cooperatives', JSON.stringify(cooperatives));
        }
    }
}

// Retirer un membre de la liste des membres d'une coopérative
function removeMemberFromCooperativeList(memberId, coopId) {
    const cooperatives = JSON.parse(localStorage.getItem('cooperatives')) || [];
    const coopIndex = cooperatives.findIndex(c => c.id === parseInt(coopId));
    
    if (coopIndex !== -1 && cooperatives[coopIndex].membersList) {
        const memberIndex = cooperatives[coopIndex].membersList.findIndex(m => m.id === parseInt(memberId));
        
        if (memberIndex !== -1) {
            cooperatives[coopIndex].membersList.splice(memberIndex, 1);
            localStorage.setItem('cooperatives', JSON.stringify(cooperatives));
        }
    }
}

// Fonctions d'affichage
async function loadAllMembers() {
    await initMemberData();
    displayMembers(members);
}

function displayMembers(memberList) {
    const container = document.getElementById('membersList');
    const emptyState = document.getElementById('emptyState');
    
    if (!container) return;
    
    if (memberList.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    container.innerHTML = memberList.map(member => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="member-avatar-table">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <div style="font-weight: 500;">${member.fullName}</div>
                        <div style="font-size: 0.9rem; color: #666;">${member.email || ''}</div>
                    </div>
                </div>
            </td>
            <td>${member.cooperative || 'Non spécifié'}</td>
            <td>
                <span class="role-badge ${getRoleClass(member.role)}">
                    ${member.role}
                </span>
            </td>
            <td>
                <div style="font-weight: 500;">${member.phone || 'Non renseigné'}</div>
                <div style="font-size: 0.9rem; color: #666;">${member.address || ''}</div>
            </td>
            <td>
                ${member.joinDate ? new Date(member.joinDate).toLocaleDateString('fr-FR') : 'N/A'}
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-view" onclick="viewMemberDetail(${member.id})" title="Voir détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-edit" onclick="editMember(${member.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="openDeleteModal(${member.id}, '${member.fullName}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function viewMemberDetail(memberId) {
    const member = getMemberById(memberId);
    if (!member) return;
    
    const detail = `
        <h3>${member.fullName}</h3>
        <p><strong>Coopérative:</strong> ${member.cooperative}</p>
        <p><strong>Rôle:</strong> ${member.role}</p>
        <p><strong>Téléphone:</strong> ${member.phone}</p>
        <p><strong>Email:</strong> ${member.email}</p>
        <p><strong>Adresse:</strong> ${member.address}</p>
        <p><strong>Date d'adhésion:</strong> ${new Date(member.joinDate).toLocaleDateString('fr-FR')}</p>
        <p><strong>Statut:</strong> ${member.status === 'active' ? 'Actif' : member.status === 'inactive' ? 'Inactif' : 'Suspendu'}</p>
        ${member.notes ? `<p><strong>Notes:</strong> ${member.notes}</p>` : ''}
    `;
    
    alert(detail);
}

function saveMember(event) {
    event.preventDefault();
    
    const id = document.getElementById('memberId').value;
    const memberData = {
        firstName: document.getElementById('memberFirstName').value,
        lastName: document.getElementById('memberLastName').value,
        cooperativeId: document.getElementById('memberCooperative').value,
        role: document.getElementById('memberRole').value,
        phone: document.getElementById('memberPhone').value,
        email: document.getElementById('memberEmail').value,
        address: document.getElementById('memberAddress').value,
        joinDate: document.getElementById('memberJoinDate').value,
        status: document.getElementById('memberStatus').value,
        notes: document.getElementById('memberNotes').value
    };
    
    if (id) {
        // Mise à jour
        updateMember(id, memberData);
    } else {
        // Création
        createMember(memberData);
    }
    
    closeMemberModal();
    loadAllMembers();
    
    alert(`Membre ${id ? 'modifié' : 'ajouté'} avec succès !`);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadAllMembers();
});