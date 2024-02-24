document.addEventListener('mousemove', (event) => {
    const x = event.clientX; // Get the horizontal coordinate
    const y = event.clientY; // Get the vertical coordinate

    // Send the coordinates to your server
    fetch('http://localhost:3000/mouseposition', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mouseX: x, mouseY: y }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => console.log('Data successfully sent to the server:', data))
    .catch(error => console.error('Error sending data to the server:', error));
});
