/* ==================== TRAIN GAME - MAIN SCRIPT ==================== */

// ==================== GAME STATE ==================== //

const gameState = {
    score: 0,
    lives: 3,
    gameRunning: false,
    gamePaused: false,
    obstaclesAvoided: 0,
    maxStreak: 0,
    currentStreak: 0,
    level: 1,
    spawnRate: 0.8 // seconds between obstacle spawns
};

// ==================== TRAIN OBJECT ==================== //

const train = {
    x: 400, // Center of game area
    y: 550, // Near bottom
    width: 50,
    height: 35,
    speed: 6,
    velocityX: 0,
    velocityY: 0,
    maxX: 750, // Game area width - train width
    maxY: 550, // Game area height - train height

    // Update train position based on input
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Boundary constraints
        if (this.x < 0) this.x = 0;
        if (this.x > this.maxX) this.x = this.maxX;
        if (this.y < 0) this.y = 0;
        if (this.y > this.maxY) this.y = this.maxY;
    },

    // Render train on screen
    render() {
        const trainEl = document.getElementById('train');
        trainEl.style.left = this.x + 'px';
        trainEl.style.bottom = (600 - this.y - this.height) + 'px';
    },

    // Reset position to starting point
    reset() {
        this.x = 375;
        this.y = 550;
        this.velocityX = 0;
        this.velocityY = 0;
    }
};

// ==================== OBSTACLE OBJECT ==================== //

class Obstacle {
    constructor(x, y, type = 'rock') {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 4 + Math.random() * 2; // Random speed between 4-6
        this.type = type; // 'rock' or 'tree'
        this.element = null;
        this.create();
    }

    // Create DOM element for obstacle
    create() {
        this.element = document.createElement('div');
        this.element.className = `obstacle ${this.type}`;
        this.element.innerHTML = this.type === 'rock' ? '🪨' : '🌲';
        document.getElementById('obstaclesContainer').appendChild(this.element);
        this.render();
    }

    // Update obstacle position
    update() {
        this.y += this.speed;
    }

    // Render obstacle on screen
    render() {
        if (this.element) {
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
        }
    }

    // Remove obstacle from DOM
    remove() {
        if (this.element) {
            this.element.remove();
        }
    }

    // Check if obstacle is off-screen (bottom)
    isOffScreen() {
        return this.y > 600;
    }
}

// ==================== OBSTACLES MANAGEMENT ==================== //

let obstacles = [];
let lastSpawnTime = 0;

// Spawn new obstacle at random x position
function spawnObstacle() {
    const randomX = Math.random() * (800 - 40);
    const randomType = Math.random() > 0.5 ? 'rock' : 'tree';
    obstacles.push(new Obstacle(randomX, -40, randomType));
}

// Update all obstacles and remove off-screen ones
function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        obstacle.render();

        // Remove if off-screen
        if (obstacle.isOffScreen()) {
            obstacle.remove();
            obstacles.splice(index, 1);
            // Obstacle avoided - increase score
            gameState.score += 10;
            gameState.obstaclesAvoided++;
            gameState.currentStreak++;
            if (gameState.currentStreak > gameState.maxStreak) {
                gameState.maxStreak = gameState.currentStreak;
            }
            updateHUD();
        }
    });
}

// ==================== COLLISION DETECTION ==================== //

function checkCollisions() {
    for (let obstacle of obstacles) {
        if (isColliding(train, obstacle)) {
            handleCollision(obstacle);
            return true;
        }
    }
    return false;
}

// Bounding box collision detection
function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Handle collision with obstacle
function handleCollision(obstacle) {
    gameState.lives--;
    gameState.currentStreak = 0;
    obstacle.remove();
    obstacles = obstacles.filter(obs => obs !== obstacle);

    // Visual feedback
    const trainEl = document.getElementById('train');
    trainEl.classList.add('pulse');
    setTimeout(() => trainEl.classList.remove('pulse'), 500);

    updateHUD();

    if (gameState.lives <= 0) {
        endGame();
    }
}

// ==================== KEYBOARD CONTROLS ==================== //

const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    // Pause/Resume with Space
    if (e.key === ' ') {
        e.preventDefault();
        togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update train velocity based on pressed keys
function handleInput() {
    train.velocityX = 0;
    train.velocityY = 0;

    // Arrow keys or WASD
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        train.velocityX = -train.speed;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        train.velocityX = train.speed;
    }
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        train.velocityY = -train.speed;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        train.velocityY = train.speed;
    }
}

// ==================== HUD UPDATES ==================== //

function updateHUD() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
}

// ==================== GAME LOOP ==================== //

let gameLoopId = null;
let currentTime = 0;

function gameLoop(timestamp) {
    if (!gameState.gameRunning || gameState.gamePaused) {
        gameLoopId = requestAnimationFrame(gameLoop);
        return;
    }

    currentTime = timestamp || 0;

    // Handle player input
    handleInput();
    train.update();
    train.render();

    // Spawn obstacles at regular intervals
    if (currentTime - lastSpawnTime > gameState.spawnRate * 1000) {
        spawnObstacle();
        lastSpawnTime = currentTime;
        // Gradually increase difficulty
        gameState.spawnRate = Math.max(0.5, 0.8 - gameState.level * 0.05);
    }

    // Update obstacles
    updateObstacles();

    // Check for collisions
    checkCollisions();

    // Continue loop
    gameLoopId = requestAnimationFrame(gameLoop);
}

// ==================== GAME STATE MANAGEMENT ==================== //

function startGame() {
    // Hide start screen
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');

    // Reset game state
    gameState.score = 0;
    gameState.lives = 3;
    gameState.gameRunning = true;
    gameState.gamePaused = false;
    gameState.obstaclesAvoided = 0;
    gameState.maxStreak = 0;
    gameState.currentStreak = 0;
    gameState.level = 1;
    gameState.spawnRate = 0.8;

    // Reset train and obstacles
    train.reset();
    obstacles.forEach(obs => obs.remove());
    obstacles = [];
    lastSpawnTime = 0;

    // Update HUD
    updateHUD();

    // Start game loop
    gameLoopId = requestAnimationFrame(gameLoop);
}

function endGame() {
    gameState.gameRunning = false;

    // Show game over screen
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('obstaclesAvoided').textContent = gameState.obstaclesAvoided;
    document.getElementById('maxStreak').textContent = gameState.maxStreak;
    document.getElementById('gameOverScreen').classList.remove('hidden');

    // Clean up
    cancelAnimationFrame(gameLoopId);
}

function restartGame() {
    // Clear obstacles
    obstacles.forEach(obs => obs.remove());
    obstacles = [];

    // Start new game
    startGame();
}

function togglePause() {
    if (!gameState.gameRunning) return;

    gameState.gamePaused = !gameState.gamePaused;

    const pausedScreen = document.getElementById('pausedScreen');
    if (gameState.gamePaused) {
        pausedScreen.classList.remove('hidden');
    } else {
        pausedScreen.classList.add('hidden');
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

// ==================== EVENT LISTENERS ==================== //

// Start button
document.getElementById('startBtn').addEventListener('click', startGame);

// Restart button
document.getElementById('restartBtn').addEventListener('click', restartGame);

// Initialize game - show start screen
document.addEventListener('DOMContentLoaded', () => {
    updateHUD();
    console.log('🚂 Train Game Loaded! Press "Start Game" to begin.');
});
