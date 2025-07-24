document.getElementById('contactForm').addEventListener('submit', function(e) {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const formMessage = document.getElementById('formMessage');

    if (!name || !email || !message) {
        e.preventDefault(); // Only prevent if fields are empty
        formMessage.textContent = 'Please fill in all fields.';
        formMessage.style.color = 'red';
        return;
    }
    // Allow normal submission to Formspree
    formMessage.textContent = 'Sending your message...';
    formMessage.style.color = 'blue';
});
