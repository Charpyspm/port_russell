// déconnexion du profil
document.getElementById('logout').onclick = async function(e) {
  e.preventDefault();
  await fetch('/logout');
  localStorage.removeItem('token');
  window.location.href = 'index.html'; 
};


// Affichage du profil utilisateur
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
});



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
        <td>${r.catway}</td>
        <td>${new Date(r.startDate).toLocaleDateString()}</td>
        <td>${new Date(r.endDate).toLocaleDateString()}</td>
        <td>${r.status}</td>
      `;
      tbody.appendChild(tr);
    });
  }
});