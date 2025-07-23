document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const formMessage = document.getElementById('formMessage');

    if (!name || !email || !message) {
        formMessage.textContent = 'Please fill in all fields.';
        formMessage.style.color = 'red';
        return;
    }

    // Simulate sending message
    formMessage.textContent = 'Thank you, ' + name + '! Your message has been sent.';
    formMessage.style.color = 'green';
    document.getElementById('contactForm').reset();
});
