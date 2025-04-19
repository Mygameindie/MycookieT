
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player properties
const player = {
    x: 400,
    y: canvas.height - 400, // Initial height while standing
    standingWidth: 400,
    standingHeight: 400,
    slidingWidth: 400,
    slidingHeight: 400,
    velocityY: 0,
    jumping: false,
    jumpCount: 0,
    maxJumpCount: 2, // Maximum number of jumps (including initial jump)
    jumpVelocity: -12, // Adjust jump velocity to make the player jump higher
    gravity: 0.5,
    sliding: false, // Track if player is sliding
    running: false, // Track if player is running
    frameIndex: 0, // Index of the current frame
    framesRunning: [ // Array of frames for running animation
        'character1.png',
        'character2.png',
        'character3.png'
    ],
    frameInterval: 10, // Interval between frame changes (in frames)
    frameJump1: 'character5.png', // Frame for first jump
    frameJump2: 'character6.png' // Frame for second jump
};

// Flags to track button states
let slideButtonPressed = false;

// Jump function (responds only to ArrowUp)
function jump() {
    if (player.jumpCount < player.maxJumpCount) {
        player.velocityY = player.jumpVelocity;
        player.jumping = true;
        player.jumpCount++;
        if (player.jumpCount === 1) {
            player.framesRunning = [player.frameJump1]; // First jump animation
        } else if (player.jumpCount === 2) {
            player.framesRunning = [player.frameJump2]; // Second jump animation
        }
    }
}

// Start sliding (shared for touch and keyboard)
function startSlide() {
    if (!slideButtonPressed && !player.jumping) { // Disable sliding if jumping
        slideButtonPressed = true;
        player.sliding = true;
        updatePlayerSize();
    }
}

// End sliding (shared for touch and keyboard)
function endSlide() {
    slideButtonPressed = false;
    player.sliding = false;
    updatePlayerSize();
}

// Reset function (shared for touch and keyboard)
function reset() {
    player.x = 400;
    player.y = canvas.height - player.standingHeight - 50;
    player.velocityY = 0;
    player.jumping = false;
    player.jumpCount = 0;
    player.running = true;
}

// Update player size based on sliding status
function updatePlayerSize() {
    if (player.sliding) {
        player.standingWidth = player.slidingWidth;
        player.standingHeight = player.slidingHeight;
    } else {
        player.standingWidth = 400; // Set width back to normal size
        player.standingHeight = 400; // Set height back to normal size
    }
}

// Add keyboard event listeners
window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp': // Jump only on Up Arrow key
            jump();
            break;
        case 'ArrowDown': // Slide on Down Arrow key
            startSlide();
            break;
        case 'KeyR': // Reset on 'R' key
            reset();
            break;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowDown') { // End slide on Down Arrow key release
        endSlide();
    }
});

// Load character images
const characterImagesRunning = [];
let loadedImagesCount = 0;
player.framesRunning.forEach((frame, index) => {
    const image = new Image();
    image.src = frame;
    image.onload = function() {
        loadedImagesCount++; 
        if (loadedImagesCount === player.framesRunning.length) {
            player.running = true; // Start the game loop after all images are loaded
        }
    };
    characterImagesRunning.push(image);
});

const characterImageSliding = new Image();
characterImageSliding.src = 'character4.png'; // Load character4.png for sliding
characterImageSliding.onload = function() {
    loadedImagesCount++;
    if (loadedImagesCount === player.framesRunning.length + 1) {
        player.running = true; // Start the game loop after all images are loaded
    }
};

const jumpImages = {
    first: new Image(),
    second: new Image(),
};

jumpImages.first.src = player.frameJump1;
jumpImages.second.src = player.frameJump2;

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply gravity
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Check if player is on the ground
    if (player.y >= canvas.height - player.standingHeight - 50) {
        player.y = canvas.height - player.standingHeight - 50;
        player.velocityY = 0;
        player.jumping = false;
        player.jumpCount = 0; // Reset jump count when player touches the ground
        if (!player.sliding) { // Reset frames to running animation only when not sliding
            player.framesRunning = ['character1.png', 'character2.png', 'character3.png'];
        }
    }

    // Update player size based on sliding status
    updatePlayerSize();

    // Draw player
    if (player.jumping) {
        const jumpImage = player.jumpCount === 1 ? jumpImages.first : jumpImages.second;
        ctx.drawImage(jumpImage, player.x, player.y, player.standingWidth, player.standingHeight);
    } else if (player.sliding) {
        ctx.drawImage(characterImageSliding, player.x, player.y, player.standingWidth, player.standingHeight);
    } else if (player.running) {
        const currentFrameIndex = Math.floor(player.frameIndex / player.frameInterval) % player.framesRunning.length;
        ctx.drawImage(characterImagesRunning[currentFrameIndex], player.x, player.y, player.standingWidth, player.standingHeight);
        player.frameIndex++;
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, player.standingWidth, player.standingHeight); // Adjusted width and height for standing
    }

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();