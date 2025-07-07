// déconnexion du profil
document.getElementById('logout').onclick = async function(e) {
  e.preventDefault();
  await fetch('/logout');
  localStorage.removeItem('token');
  document.cookie = 'token=; Max-Age=0; path=/;';
  window.location.href = '/'; 
};


// Affichage du profil utilisateur
document.addEventListener('DOMContentLoaded', async function() {
  const token = localStorage.getItem('token');
  if (token) {
    const res = await fetch('/users/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    console.log('Réponse /users/me:', data);
    if (data.username && data.email) {
      document.getElementById('profile-username').innerText = data.username;
      document.getElementById('profile-email').innerText = data.email;
    }
  }
});

// envoie vers la page edit.html
document.getElementById('edit-profile-btn').onclick = function() {
  window.location.href = '/edit';
};

// Supression de l'utilisateur
document.getElementById('delete-profile-btn').onclick = async function() {
  if (confirm('Supprimer votre profil ? Cette action est irréversible.')) {
    const token = localStorage.getItem('token');
    const res = await fetch('/users/me', {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      alert('Profil supprimé');
      localStorage.removeItem('token');
      window.location.href = '/';
    } else {
      alert('Erreur lors de la suppression');
    }
  }
};

document.addEventListener('DOMContentLoaded', async function() {
  const token = localStorage.getItem('token');
  if (token) {
    const res = await fetch('/users/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    if (data.username && data.email) {
      document.getElementById('profile-username').innerText = data.username;
      document.getElementById('profile-email').innerText = data.email;
    }
  }
  // Affiche la date du jour
  const today = new Date().toLocaleDateString();
  document.getElementById('profile-date').innerText = today;
});

document.addEventListener('DOMContentLoaded', async function() {


  const token = localStorage.getItem('token');
  if (token) {
    const res = await fetch('/reservations/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const reservations = await res.json();
    const tbody = document.querySelector('#reservations-table tbody');
    tbody.innerHTML = '';
    reservations.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.catwayNumber}</td>
        <td>${r.fullName || ''}</td>
        <td>${r.boatName || ''}</td>
        <td>${new Date(r.startDate).toLocaleDateString()}</td>
        <td>${new Date(r.endDate).toLocaleDateString()}</td>
        <td>${r.status}</td>
        <td>
          <button class="edit-btn" data-id="${r._id}">✏️</button>
        </td>
        <td>
          <button class="delete-btn" data-id="${r._id}">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });


// supression de la reservation
tbody.addEventListener('click', async function(e) {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    if (confirm('Supprimer cette réservation ?')) {
      const token = localStorage.getItem('token');
      const res = await fetch(`/reservations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        e.target.closest('tr').remove();
      } else {
        alert('Erreur lors de la suppression');
      }
    }
  }
});

// Modification de la reservation
tbody.addEventListener('click', function(e) {
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.getAttribute('data-id');
    tbody.addEventListener('click', function(e) {
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.getAttribute('data-id');
    const tr = e.target.closest('tr');
    const currentBoat = tr.children[2].innerText;
    const currentName = tr.children[1].innerText;
    const currentStart = tr.children[3].innerText;
    const currentEnd = tr.children[4].innerText;

    // Affiche un mini-formulaire
    tr.innerHTML = `
      <td>${tr.children[0].innerText}</td>
      <td><input value="${currentName}"></td>
      <td><input value="${currentBoat}"></td>
      <td><input type="date" value="${formatDateForInput(currentStart)}"></td>
      <td><input type="date" value="${formatDateForInput(currentEnd)}"></td>
      <td>${tr.children[5].innerText}</td>
      <td colspan="2">
        <button class="save-edit" data-id="${id}">💾</button>
        <button class="cancel-edit">✖️</button>
      </td>
    `;
  }
});

// Fonction utilitaire pour formater la date en yyyy-mm-dd
function formatDateForInput(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

//clic sur "Enregistrer"
tbody.addEventListener('click', async function(e) {
  if (e.target.classList.contains('save-edit')) {
    const tr = e.target.closest('tr');
    const id = e.target.getAttribute('data-id');
    const inputs = tr.querySelectorAll('input');
    const fullName = inputs[0].value;
    const boatName = inputs[1].value;
    const startDate = inputs[2].value;
    const endDate = inputs[3].value;
    const token = localStorage.getItem('token');
    const res = await fetch(`/reservations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ fullName, boatName, startDate, endDate })
    });
    if (res.ok) {
      location.reload();
    } else {
      alert('Erreur lors de la modification');
    }
  }
  // Annuler la modification
  if (e.target.classList.contains('cancel-edit')) {
    location.reload();
  }
});
  }
});

  }
});