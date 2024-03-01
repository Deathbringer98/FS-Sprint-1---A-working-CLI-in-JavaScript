document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const token = generateToken();
    document.getElementById('token').textContent = `Token for ${username}: ${token}`;
});

function generateToken() {
    return Math.random().toString(36).substring(2);
}