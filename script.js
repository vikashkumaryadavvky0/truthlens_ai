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
    spawnRate: 800 // milliseconds between obstacle spawns
};

// ==================== TRAIN OBJECT ==================== //
const train = {
    x: 375,
    y: 550,
    width: 50,
    height: 35,
    speed: 7,
    velocityX: 0,
    velocityY: 0,

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Keep train within game bounds
        if (this.x < 0) this.x = 0;
        if (this.x > 750) this.x = 750;
        if (this.y < 0) this.y = 0;
        if (this.y > 550) this.y = 550;
    },

    render() {
        const trainEl = document.getElementById('train');
        if (trainEl) {
            trainEl.style.left = this.x + 'px';
            trainEl.style.top = (600 - this.y - this.height) + 'px';
        }
    },

    reset() {
        this.x = 375;
        this.y = 550;
        this.velocityX = 0;
        this.velocityY = 0;
    }
};

// ==================== OBSTACLE CLASS ==================== //
class Obstacle {
    constructor(x, y, type = 'rock') {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 3 + Math.random() * 2;
        this.type = type;
        this.element = document.createElement('div');
        this.element.className = `obstacle ${this.type}`;
        this.element.textContent = this.type === 'rock' ? '🪨' : '🌲';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.position = 'absolute';
        this.element.style.width = '40px';
        this.element.style.height = '40px';
        this.element.style.display = 'flex';
        this.element.style.alignItems = 'center';
        this.element.style.justifyContent = 'center';
        this.element.style.fontSize = '24px';
        this.element.style.zIndex = '5';
        document.getElementById('obstaclesContainer').appendChild(this.element);
    }

    update() {
        this.y += this.speed;
        this.element.style.top = this.y + 'px';
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    isOffScreen() {
        return this.y > 600;
    }
}

// ==================== OBSTACLES MANAGEMENT ==================== //
let obstacles = [];
let lastSpawnTime = Date.now();

function spawnObstacle() {
    const randomX = Math.random() * 760;
    const randomType = Math.random() > 0.5 ? 'rock' : 'tree';
    obstacles.push(new Obstacle(randomX, -50, randomType));
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.update();

        if (obstacle.isOffScreen()) {
            obstacle.remove();
            obstacles.splice(i, 1);
            gameState.score += 10;
            gameState.obstaclesAvoided++;
            gameState.currentStreak++;
            if (gameState.currentStreak > gameState.maxStreak) {
                gameState.maxStreak = gameState.currentStreak;
            }
            updateHUD();
        }
    }
}

// ==================== COLLISION DETECTION ==================== //
function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function checkCollisions() {
    for (let obstacle of obstacles) {
        if (isColliding(train, obstacle)) {
            gameState.lives--;
            gameState.currentStreak = 0;
            obstacle.remove();
            obstacles = obstacles.filter(obs => obs !== obstacle);
            updateHUD();

            if (gameState.lives <= 0) {
                endGame();
                return;
            }
        }
    }
}

// ==================== KEYBOARD CONTROLS ==================== //
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ') {
        e.preventDefault();
        togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function handleInput() {
    train.velocityX = 0;
    train.velocityY = 0;

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
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');
    if (scoreEl) scoreEl.textContent = gameState.score;
    if (livesEl) livesEl.textContent = gameState.lives;
}

// ==================== GAME LOOP ==================== //
let gameLoopId = null;

function gameLoop() {
    if (!gameState.gameRunning || gameState.gamePaused) {
        gameLoopId = requestAnimationFrame(gameLoop);
        return;
    }

    // Handle input
    handleInput();
    train.update();
    train.render();

    // Spawn obstacles at intervals
    const now = Date.now();
    if (now - lastSpawnTime > gameState.spawnRate) {
        spawnObstacle();
        lastSpawnTime = now;
        // Increase difficulty over time
        gameState.spawnRate = Math.max(500, gameState.spawnRate - 5);
    }

    // Update all obstacles
    updateObstacles();

    // Check collisions
    checkCollisions();

    // Continue game loop
    gameLoopId = requestAnimationFrame(gameLoop);
}

// ==================== GAME STATE MANAGEMENT ==================== //
function startGame() {
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (startScreen) startScreen.classList.add('hidden');
    if (gameOverScreen) gameOverScreen.classList.add('hidden');

    gameState.score = 0;
    gameState.lives = 3;
    gameState.gameRunning = true;
    gameState.gamePaused = false;
    gameState.obstaclesAvoided = 0;
    gameState.maxStreak = 0;
    gameState.currentStreak = 0;
    gameState.spawnRate = 800;

    train.reset();
    
    // Clear obstacles
    obstacles.forEach(obs => obs.remove());
    obstacles = [];
    lastSpawnTime = Date.now();

    updateHUD();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function endGame() {
    gameState.gameRunning = false;
    cancelAnimationFrame(gameLoopId);

    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScoreEl = document.getElementById('finalScore');
    const obstaclesAvoidedEl = document.getElementById('obstaclesAvoided');
    const maxStreakEl = document.getElementById('maxStreak');

    if (finalScoreEl) finalScoreEl.textContent = gameState.score;
    if (obstaclesAvoidedEl) obstaclesAvoidedEl.textContent = gameState.obstaclesAvoided;
    if (maxStreakEl) maxStreakEl.textContent = gameState.maxStreak;

    if (gameOverScreen) gameOverScreen.classList.remove('hidden');
}

function restartGame() {
    obstacles.forEach(obs => obs.remove());
    obstacles = [];
    startGame();
}

function togglePause() {
    if (!gameState.gameRunning) return;

    gameState.gamePaused = !gameState.gamePaused;
    const pausedScreen = document.getElementById('pausedScreen');
    
    if (gameState.gamePaused) {
        if (pausedScreen) pausedScreen.classList.remove('hidden');
    } else {
        if (pausedScreen) pausedScreen.classList.add('hidden');
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

// ==================== EVENT LISTENERS & INITIALIZATION ==================== //
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚂 Train Game Loading...');
    
    // Setup event listeners
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');

    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
    }

    // Initialize HUD
    updateHUD();
    
    console.log('🚂 Train Game Ready! Click Start Game to begin.');
});
