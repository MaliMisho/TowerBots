const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let towers = [];
let towerImage = new Image();
towerImage.src = './images/towerImage.png';

let enemies = [];
let enemyImage = new Image();
enemyImage.src = './images/enemyImage.png';

let isPlacingTower = false; // Flag to track if in tower placement mode
let Vatts = 3; // Vatts - currency to build towers


class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100; // Shooting range
        this.cooldown = 0; // Cooldown time between shots
    }

    draw() {
        ctx.drawImage(towerImage, this.x, this.y, 40, 40);
    }

    shoot(enemy) {
        if (this.cooldown === 0) {
            ctx.beginPath();
            ctx.moveTo(this.x + 20, this.y + 20); // Tower center
            ctx.lineTo(enemy.x + 15, enemy.y + 15); // Enemy center
            ctx.strokeStyle = 'black';
            ctx.stroke();

            this.cooldown = 50; // Set cooldown time
            enemy.health -= 1;
        }
    }

    update() {
        if (this.cooldown > 0) {
            this.cooldown -= 1;
        }

        // Find the first enemy in range and shoot
        for (let enemy of enemies) {
            const distance = Math.hypot(enemy.x - this.x, enemy.y - this.y);
            if (distance < this.range) {
                this.shoot(enemy);
                break;
            }
        }
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.health = 3; // Health points
    }

    draw() {
        ctx.drawImage(enemyImage, this.x, this.y, 30, 30);
    }

    move() {
        this.x += .5;
    }
}


function spawnEnemy() {
    enemies.push(new Enemy(0, Math.random() * canvas.height));
}

const enemySpawnInterval = 2000;
setInterval(spawnEnemy, enemySpawnInterval);
setInterval(spawnEnemy, 5500);
setInterval(spawnEnemy, 8500);
setInterval(spawnEnemy, 10000);

function updateVattsDisplay() {
    document.getElementById('vatts-display').innerText = `Vatts: ${Vatts}`;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw towers
    towers.forEach(tower => {
        tower.update();
        tower.draw();
    });

    // Update and draw enemies
    enemies = enemies.filter(enemy => {
        if (enemy.health <= 0) {
            Vatts += 3;
            updateVattsDisplay();
            return false;
        }
        return true;
    });

    enemies.forEach(enemy => {
        enemy.move();
        enemy.draw();
    });

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

document.getElementById('build-tower').addEventListener('click', () => {
    isPlacingTower = true; // Enable tower placement mode
});

// Place tower on canvas click
canvas.addEventListener('click', (e) => {
    if (isPlacingTower && Vatts >= 3) { // Check if there are enough Vatts
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        towers.push(new Tower(x - 20, y - 20)); // Center the tower at the click
        Vatts -= 3;
        isPlacingTower = false; // Disable tower placement mode
        updateVattsDisplay();
    }
});

spawnEnemy();
gameLoop();