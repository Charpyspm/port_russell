
document.addEventListener('DOMContentLoaded', () => {
    afficherCatways();
    remplirSelectCatwayNumbers();
    remplirSelectDeleteCatwayNumbers();
    remplirSelectReservationCatways();
});

// recuperation des catways
 async function afficherCatways() {
  const res = await fetch('/catways'); 
  const catways = await res.json();
  console.log(catways);
  const tbody = document.querySelector('#catways-table tbody');
  tbody.innerHTML = '';
  catways.forEach(c => {
    if (c.catwayNumber !== undefined && c.catwayType && c.catwayState) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.catwayNumber}</td>
            <td>${c.catwayType}</td>
            <td>${c.catwayState}</td>
        `;
        tbody.appendChild(tr);
    }
  });
}


// ajout des catways
document.getElementById('addCatwayForm').onsubmit = async function(e) {
    e.preventDefault();
    const catwayType = this.catwayType.value;
    const catwayState = this.catwayState.value;

    const res = await fetch('/catways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catwayType, catwayState})
    });

    const data = await res.json();
    if (res.ok) {
        document.getElementById('catwayResult').innerText = `Catway ajouté ! Numéro attribué : ${data.catwayNumber}`;
        this.reset();
        await afficherCatways();
    } else {
        document.getElementById('catway-result').innerText = 'Erreur : ' + (data.error || JSON.stringify(data));
    }
};

//modification des catways
// selection du numero de catway
async function remplirSelectCatwayNumbers() {
  const res = await fetch('/catways');
  const catways = await res.json();
  const select = document.getElementById('catwayNumberSelect');
  select.innerHTML = '';
  catways.forEach(c => {
    const option = document.createElement('option');
    option.value = c.catwayNumber;
    option.textContent = c.catwayNumber;
    select.appendChild(option);
  });
}

// modification de l'état du catway
document.getElementById('editCatwayForm').onsubmit = async function(e) {
  e.preventDefault();
  const catwayNumber = this.catwayNumber.value;
  const catwayState = this.catwayState.value;

  const res = await fetch(`/catways/${catwayNumber}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ catwayState })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Catway modifié !');
    await afficherCatways();
    await remplirSelectCatwayNumbers();
    this.reset();
  } else {
    alert('Erreur : ' + (data.error || JSON.stringify(data)));
  }
};

// suppression des catways
async function remplirSelectDeleteCatwayNumbers() {
  const res = await fetch('/catways');
  const catways = await res.json();
  const select = document.getElementById('deleteCatwayNumberSelect');
  select.innerHTML = '';
  catways.forEach(c => {
    const option = document.createElement('option');
    option.value = c.catwayNumber;
    option.textContent = c.catwayNumber;
    select.appendChild(option);
  });
}



// Suppression d'un catway
document.getElementById('deleteCatwayForm').onsubmit = async function(e) {
  e.preventDefault();
  const catwayNumber = this.catwayNumber.value;
  const res = await fetch(`/catways/${catwayNumber}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (res.ok) {
    document.getElementById('deleteCatwayResult').innerText = 'Catway supprimé !';
    await remplirSelectDeleteCatwayNumbers();
    await afficherCatways();
    this.reset();
  } else {
    document.getElementById('deleteCatwayResult').innerText = 'Erreur : ' + (data.error || JSON.stringify(data));
  }
};


// reservations des catways
async function remplirSelectReservationCatways() {
  const res = await fetch('/catways');
  const catways = await res.json();
  const select = document.getElementById('reservationCatwayNumber');
  select.innerHTML = '';
  catways.forEach(c => {
    if (c.catwayNumber !== undefined) {
      const option = document.createElement('option');
      option.value = c.catwayNumber;
      option.textContent = c.catwayNumber;
      select.appendChild(option);
    }
  });

  // Définir la date minimale pour les champs date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('startDate').setAttribute('min', today);
  document.getElementById('endDate').setAttribute('min', today);
}



// Gestion de la soumission du formulaire de réservation
document.getElementById('reservationForm').onsubmit = async function(e) {
  e.preventDefault();
  const token = localStorage.getItem('token'); // Assure-toi que le token est bien stocké ici après connexion
  const catwayNumber = this.catwayNumber.value;
  const startDate = this.startDate.value;
  const endDate = this.endDate.value;
  const boatName = this.boatName.value;
  const fullName = this.fullName.value;

  // Vérification côté client : date de fin >= date de début
  if (endDate < startDate) {
    document.getElementById('reservationResult').innerText = "La date de fin doit être supérieure ou égale à la date de début.";
    return;
  }

  const res = await fetch('/catways/reserve', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ catwayNumber, startDate, endDate, boatName, fullName })
  });
  const data = await res.json();
  if (res.ok) {
    document.getElementById('reservationResult').innerText = "Réservation enregistrée !";
    this.reset();
  } else {
    document.getElementById('reservationResult').innerText = data.error || "Erreur lors de la réservation.";
  }
};