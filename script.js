const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fixed X position for player (left side of screen)
const fixedX = 50;

// Player properties
const player = {
    x: fixedX,
    y: canvas.height - 400,
    standingWidth: 400,
    standingHeight: 400,
    slidingWidth: 400,
    slidingHeight: 400,
    velocityY: 0,
    jumping: false,
    jumpCount: 0,
    maxJumpCount: 2,
    jumpVelocity: -12,
    gravity: 0.5,
    sliding: false,
    running: false,
    frameIndex: 0,
    framesRunning: ['character1.png', 'character2.png', 'character3.png'],
    frameInterval: 10,
    frameJump1: 'character5.png',
    frameJump2: 'character6.png'
};

let slideButtonPressed = false;

function jump() {
    if (player.jumpCount < player.maxJumpCount) {
        player.velocityY = player.jumpVelocity;
        player.jumping = true;
        player.jumpCount++;
        if (player.jumpCount === 1) {
            player.framesRunning = [player.frameJump1];
        } else if (player.jumpCount === 2) {
            player.framesRunning = [player.frameJump2];
        }
    }
}

function startSlide() {
    if (!slideButtonPressed && !player.jumping) {
        slideButtonPressed = true;
        player.sliding = true;
        updatePlayerSize();
    }
}

function endSlide() {
    slideButtonPressed = false;
    player.sliding = false;
    updatePlayerSize();
}

function reset() {
    player.x = fixedX;
    player.y = canvas.height - player.standingHeight - 50;
    player.velocityY = 0;
    player.jumping = false;
    player.jumpCount = 0;
    player.running = true;
}

function updatePlayerSize() {
    if (player.sliding) {
        player.standingWidth = player.slidingWidth;
        player.standingHeight = player.slidingHeight;
    } else {
        player.standingWidth = 400;
        player.standingHeight = 400;
    }
}

// Keyboard controls
window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp':
            jump();
            break;
        case 'ArrowDown':
            startSlide();
            break;
        case 'KeyR':
            reset();
            break;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowDown') {
        endSlide();
    }
});

// Load images
const characterImagesRunning = [];
let loadedImagesCount = 0;
player.framesRunning.forEach((frame) => {
    const image = new Image();
    image.src = frame;
    image.onload = function () {
        loadedImagesCount++;
        if (loadedImagesCount === player.framesRunning.length) {
            player.running = true;
        }
    };
    characterImagesRunning.push(image);
});

const characterImageSliding = new Image();
characterImageSliding.src = 'character4.png';
characterImageSliding.onload = function () {
    loadedImagesCount++;
    if (loadedImagesCount === player.framesRunning.length + 1) {
        player.running = true;
    }
};

const jumpImages = {
    first: new Image(),
    second: new Image()
};

jumpImages.first.src = player.frameJump1;
jumpImages.second.src = player.frameJump2;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y >= canvas.height - player.standingHeight - 50) {
        player.y = canvas.height - player.standingHeight - 50;
        player.velocityY = 0;
        player.jumping = false;
        player.jumpCount = 0;
        if (!player.sliding) {
            player.framesRunning = ['character1.png', 'character2.png', 'character3.png'];
        }
    }

    updatePlayerSize();

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
        ctx.fillRect(player.x, player.y, player.standingWidth, player.standingHeight);
    }

    requestAnimationFrame(gameLoop);
}

// Dynamic resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    reset();
});

// Start game
gameLoop();