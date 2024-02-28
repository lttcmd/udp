// Establish a WebSocket connection
const ws = new WebSocket('wss://seal-app-stzjp.ondigitalocean.app/');// Change URL to your deployed server's URL


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
    let touchCount = event.touches.length;
    isMouseDown(touchCount === 1 || touchCount === 2 ? 1 : 0); // Call isMouseDown with 1 if 1 or 2 touches, otherwise 0
    
    if (touchCount === 1) {
        const touch = event.touches[0];
        const x = Math.round(touch.clientX);
        const y = Math.round(touch.clientY);
        console.log(`Touch X: ${x}, Touch Y: ${y}`);
        sendControlData({ mouseX: x, mouseY: y });
    } else if (touchCount === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const midpointX = Math.round((touch1.clientX + touch2.clientX) / 2);
        const midpointY = Math.round((touch1.clientY + touch2.clientY) / 2);
        const pinchDistance = Math.round(Math.sqrt((touch2.clientX - touch1.clientX) ** 2 + (touch2.clientY - touch1.clientY) ** 2));
        console.log(`Pinch Distance: ${pinchDistance}`);
        sendControlData({ mouseX: midpointX, mouseY: midpointY, radius: pinchDistance });
    } else if (touchCount === 3) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const touch3 = event.touches[2];
        const avgX = Math.round((touch1.clientX + touch2.clientX + touch3.clientX) / 3);
        const avgY = Math.round((touch1.clientY + touch2.clientY + touch3.clientY) / 3);
        console.log(`Three fingers moving, avgX: ${avgX}, avgY: ${avgY}`);
        sendControlData({ colourx: avgX, coloury: avgY });
    }
}, { passive: false });

document.addEventListener('touchend', (event) => {
    if (event.touches.length === 0) {
        isMouseDown(0); // No fingers are touching the screen
    }
    
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    if (tapLength < 500 && tapLength > 0 && event.touches.length < 2) {
        console.log('Double Tap');
        sendControlData({ dtap: true });
    }
    lastTapTime = currentTime;
});

// isMouseDown function to send the touch status
function isMouseDown(value) {
    sendControlData({ isMouseDown: value });
}

document.addEventListener('touchstart', (event) => {
    let touchCount = event.touches.length;
    isMouseDown(touchCount === 1 || touchCount === 2 ? 1 : 0); // Call isMouseDown with 1 if 1 or 2 touches, otherwise 0
});
