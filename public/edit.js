document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    let userId = null;
    if (token) {
        const resMe = await fetch('/users/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const userData = await resMe.json();
        console.log('userData:', userData);
        userId = userData._id;
    }
    document.getElementById('editForm').onsubmit = async function(e) {
        e.preventDefault();
        const username = this.username.value;
        const email = this.email.value;
        const password = this.password.value;
        const token = localStorage.getItem('token');
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        const res = await fetch('/users/' + userId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById('result').innerText = 'Modification réussie';

        } else {
            document.getElementById('result').innerText = 'Erreur : ' + (data.error || JSON.stringify(data));
        }
    };
});