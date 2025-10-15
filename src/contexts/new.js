const token = localStorage.getItem('authToken'); // Or wherever you store your token
if (!token) {
    // Handle the case where there is no token (e.g., redirect to login)
    setUser(null);
    return;
}

const response = await fetch('/api/auth/me', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Add other headers as needed
    }
});

// Kiểm tra response trước khi parse JSON
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}

const text = await response.text();

if (!text) {
    throw new Error('Empty response from server');
}

const result = JSON.parse(text);

if (result.success) {
    setUser(result.user);
} else {
    setUser(null);
}
