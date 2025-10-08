document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberLogin');
    window.location.href = 'login.html';
});