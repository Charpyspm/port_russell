
document.addEventListener('DOMContentLoaded', () => {
    afficherCatways();
    remplirSelectCatwayNumbers();
});

// recuperation des catways
 async function afficherCatways() {
  const res = await fetch('/catways'); 
  const catways = await res.json();
  console.log(catways);
  const tbody = document.querySelector('#catways-table tbody');
  tbody.innerHTML = '';
  catways.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.catwayNumber}</td>
      <td>${c.catwayType}</td>
      <td>${c.catwayState}</td>
    `;
    tbody.appendChild(tr);
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

document.addEventListener('DOMContentLoaded', remplirSelectDeleteCatwayNumbers);

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