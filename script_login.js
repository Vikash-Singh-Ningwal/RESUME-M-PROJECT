document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = this.email.value;
    const password = this.password.value;
    const errDivEmail = document.getElementById('emailError');
    const errDivPassword = document.getElementById('passwordError');

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(response => response.text())
      .then(data => {
        alert(data);  // Display server response (success or error)
        if (data.includes('✅ Login successful')) {
          // Redirect or perform post-login actions here
          window.location.href = './TEMPLATES/index.html';
        }
        errDivEmail.innerText = "Information Doesn't exits, recheck input details. "
      })
      .catch(err => console.error('❌ Login Error:', err));
  });
