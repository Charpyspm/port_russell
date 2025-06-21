document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('loginForm').onsubmit = async function(e) {
    e.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    const res = await fetch('/users/login', {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({email, password})
    });
    const data = await res.json();
    if (data.token) {
      document.getElementById('result').innerText = 'Login successful! Token: ' + data.token;
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard.html';
    } else {
      document.getElementById('result').innerText = 'login failed:' +data.message;
    }
  };
});