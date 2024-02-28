const ws = new WebSocket('ws://localhost:3000'); // Change URL to your deployed server's URL

ws.onopen = function() {
    console.log('WebSocket connection established');
};

ws.onerror = function(error) {
    console.error('WebSocket error:', error);
};

// Updated function to send size via WebSocket
function sendSize(y) {
    const height = window.innerHeight; // Get the viewport height
    const size = Math.round(((height - y) / height) * 100); // Calculate size from 0 (bottom) to 100 (top)
    const message = JSON.stringify({ size });
    ws.send(message);
}

let isDragging = false;

document.addEventListener('mousedown', () => {
    isDragging = true;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        sendSize(event.clientY);
    }
});

document.addEventListener('touchmove', (event) => {
    event.preventDefault();
    if (isDragging) {
        const touch = event.touches[0];
        sendSize(touch.clientY);
    }
}, { passive: false });
