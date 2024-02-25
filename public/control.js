// Function to send coordinates to the server
function sendCoordinates(x, y) {
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
}

// Flag to track if the mouse is being dragged
let isDragging = false;

// Event listener for mouse down to set dragging flag
document.addEventListener('mousedown', () => {
    isDragging = true;
});

// Event listener for mouse up to clear dragging flag
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Event listener for mouse movement
document.addEventListener('mousemove', (event) => {
    // Check if dragging is in progress
    if (isDragging) {
        const x = event.clientX; // Get the horizontal coordinate
        const y = event.clientY; // Get the vertical coordinate
        sendCoordinates(x, y);
    }
});

// Event listener for touch movement
document.addEventListener('touchmove', (event) => {
    event.preventDefault(); // Prevent scrolling and other default touch behaviors

    // Touch events can involve multiple touch points (fingers), so we'll just take the first one for simplicity
    const touch = event.touches[0];
    const x = touch.clientX; // Get the horizontal coordinate
    const y = touch.clientY; // Get the vertical coordinate
    sendCoordinates(x, y);
}, { passive: false }); // Necessary for preventDefault to work

