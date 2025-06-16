document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    if (token) {
        // affiche la card user
        document.getElementById('user-card').style.display = 'block';

        // affiche le nom de l'utilisateur
        const res = await fetch('/users/me', {
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await res.json();
        console.log(data);
        if (data.username) {
            document.getElementById('user-username').innerText = data.username;
        }
        
        // bouton supprimer
        document.getElementById('delete-profile').onclick = async function () {
            if (confirm('Voulez vous vraiment supprimer votre compte ?')) {
                const res = await fetch('/users/me', {
                    method: 'DELETE',
                    headers: { 'Authorization' : 'Bearer ' + token }
                });
                if (res.ok) {
                    alert('Profil supprimé');
                    localStorage.removeItem('token');
                    window.location.href = '/login.html';
                } else {
                    alert('Erreur lors de la suppression');
                }
            }
        };

    }
})