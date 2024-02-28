const ws = new WebSocket('ws://localhost:3000'); // Change URL to your deployed server's URL

ws.onopen = function() {
    console.log('WebSocket connection established');
};

ws.onerror = function(error) {
    console.error('WebSocket error:', error);
};

// Function to send coordinates, pinch distance, and three-finger touch data via WebSocket
function sendControlData(data) {
    ws.send(JSON.stringify(data));
}

let isDragging = false;
let lastTapTime = 0;

document.addEventListener('mousedown', () => {
    isDragging = true;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const x = Math.round(event.clientX);
        const y = Math.round(event.clientY);
        console.log(`Mouse X: ${x}, Mouse Y: ${y}`);
        sendControlData({ mouseX: x, mouseY: y });
    }
});

document.addEventListener('touchmove', (event) => {
    event.preventDefault();
    if (event.touches.length === 1) {
        const touch = event.touches[0];
        const x = Math.round(touch.clientX);
        const y = Math.round(touch.clientY);
        console.log(`Touch X: ${x}, Touch Y: ${y}`);
        sendControlData({ mouseX: x, mouseY: y });
    } else if (event.touches.length === 2) {
        // Send the position of the first touch as mouseX and mouseY along with the pinch distance
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const pinchDistance = Math.round(Math.sqrt((touch2.clientX - touch1.clientX) ** 2 + (touch2.clientY - touch1.clientY) ** 2));
        console.log(`Pinch Distance: ${pinchDistance}`);
        // Sending the position of the first touch
        const x = Math.round(touch1.clientX);
        const y = Math.round(touch1.clientY);
        console.log(`Touch X: ${x}, Touch Y: ${y}`);
        sendControlData({ mouseX: x, mouseY: y, radius: pinchDistance });
    } else if (event.touches.length === 3) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const touch3 = event.touches[2];
        // Calculate average X and Y coordinates for three fingers
        const avgX = Math.round((touch1.clientX + touch2.clientX + touch3.clientX) / 3);
        const avgY = Math.round((touch1.clientY + touch2.clientY + touch3.clientY) / 3);
        console.log(`Three fingers moving, avgX: ${avgX}, avgY: ${avgY}`);
        // Send colourx and coloury exclusively for three-finger gesture
        sendControlData({ colourx: avgX, coloury: avgY });
    }
}, { passive: false });


document.addEventListener('touchend', (event) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    if (tapLength < 500 && tapLength > 0 && event.touches.length < 2) { // Adjusted to ignore multi-touch scenarios
        console.log('Double Tap');
        sendControlData({ dtap: true });
    }
    lastTapTime = currentTime;
});
