const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const winnerDisplay = document.getElementById('winner-display');
const restartButton = document.getElementById('restart-button');

const gridSize = 5;
const cols = canvas.width / gridSize;
const rows = canvas.height / gridSize;

// Change trails to an array of objects to store position AND color
const trails = [];
let gameLoop;
let gameOver = false;

// Bike class
class Bike {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.direction = controls.initialDirection;
        this.controls = controls;
        this.alive = true;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, gridSize, gridSize);
    }

    update() {
        if (!this.alive) return;

        // Add current position AND color to the trail array
        trails.push({ x: this.x, y: this.y, color: this.color });

        // Update position based on direction
        switch (this.direction) {
            case 'up':
                this.y -= gridSize;
                break;
            case 'down':
                this.y += gridSize;
                break;
            case 'left':
                this.x -= gridSize;
                break;
            case 'right':
                this.x += gridSize;
                break;
        }

        // Check for collisions
        const newPositionKey = `${this.x},${this.y}`;
        const hasCollided = trails.some(segment => `${segment.x},${segment.y}` === newPositionKey);

        if (
            this.x < 0 || this.x >= canvas.width ||
            this.y < 0 || this.y >= canvas.height ||
            hasCollided
        ) {
            this.alive = false;
        }
    }
}

let player1, player2;

function initGame() {
    // Reset game state
    trails.length = 0; // Clear the trails array
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameOver = false;
    winnerDisplay.textContent = 'First to crash loses!';
    restartButton.style.display = 'none';

    // Create bikes
    player1 = new Bike(
        Math.floor(cols / 4) * gridSize,
        Math.floor(rows / 2) * gridSize,
        '#0ff', // Cyan
        {
            initialDirection: 'right',
            up: 'w', down: 's', left: 'a', right: 'd'
        }
    );

    player2 = new Bike(
        Math.floor(cols / 4 * 3) * gridSize,
        Math.floor(rows / 2) * gridSize,
        '#FF0000', // Red
        {
            initialDirection: 'left',
            up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight'
        }
    );

    // Start game loop
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(game, 100);
}

function game() {
    if (gameOver) return;

    // Update bikes
    player1.update();
    player2.update();

    // Check for game over condition
    if (!player1.alive || !player2.alive) {
        gameOver = true;
        clearInterval(gameLoop);

        let winner;
        if (!player1.alive && !player2.alive) {
            winner = 'It\'s a tie!';
        } else if (!player1.alive) {
            winner = 'Player 2 wins!';
        } else {
            winner = 'Player 1 wins!';
        }

        winnerDisplay.textContent = `Game Over! ${winner}`;
        restartButton.style.display = 'block';
    }

    // Draw everything
    draw();
}

function draw() {
    // Clear canvas for drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the trails with their stored color
    trails.forEach(segment => {
        ctx.fillStyle = segment.color;
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw bikes
    player1.draw();
    player2.draw();
}

// Handle keyboard input
document.addEventListener('keydown', e => {
    // Player 1 controls
    if (player1.alive) {
        switch (e.key) {
            case player1.controls.up:
                if (player1.direction !== 'down') player1.direction = 'up';
                break;
            case player1.controls.down:
                if (player1.direction !== 'up') player1.direction = 'down';
                break;
            case player1.controls.left:
                if (player1.direction !== 'right') player1.direction = 'left';
                break;
            case player1.controls.right:
                if (player1.direction !== 'left') player1.direction = 'right';
                break;
        }
    }

    // Player 2 controls
    if (player2.alive) {
        switch (e.key) {
            case player2.controls.up:
                if (player2.direction !== 'down') player2.direction = 'up';
                break;
            case player2.controls.down:
                if (player2.direction !== 'up') player2.direction = 'down';
                break;
            case player2.controls.left:
                if (player2.direction !== 'right') player2.direction = 'left';
                break;
            case player2.controls.right:
                if (player2.direction !== 'left') player2.direction = 'right';
                break;
        }
    }
});

// Restart button functionality
restartButton.addEventListener('click', initGame);

// Start the game for the first time
initGame();

