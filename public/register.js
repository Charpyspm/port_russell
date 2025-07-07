document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('registerForm').onsubmit = async function(e) {
    e.preventDefault();
    const username = this.username.value;
    const email = this.email.value;
    const password = this.password.value;
    const res = await fetch('/users/add', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('result').innerText = 'Inscription réussie !';
    } else {
      document.getElementById('result').innerText = 'Erreur : ' + (data.error || JSON.stringify(data));
    }
  };

  document.getElementById('logout').onclick = async function(e) {
    e.preventDefault();
    await fetch('/logout');
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/;';
    window.location.href = '/';
  };
});