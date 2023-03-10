const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

// Global Variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
const defenders = [];
const enemies = [];
const enemyPosition = [];

let enemiesInterval = 600;
let numberOfResources = 800;
let frame = 0;

// Game Board
const controlsBar = {
    width: canvas.width,
    height: cellSize
}

// Mouse
const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1
}

let canvasPosition = canvas.getBoundingClientRect();
 
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave', (e) => {
    mouse.x = undefined;
    mouse.y = undefined;
});

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw(){
        if (mouse.x && mouse.y && collision(this, mouse))
        {
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

const createGrid = () => {
    for(let y = cellSize ; y < canvas.height ; y += cellSize){
        for(let x = 0 ; x < canvas.width ; x += cellSize)
            gameGrid.push(new Cell(x, y));
    }
}

createGrid();

function handleGameGrid(){
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}

// Projectiles
// Defenders
class Defender {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
        this.shooting = false;
        this.health = 100;
        this.projectiles = [];
        this.timer = 0;
    }
    draw(){
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "gold";
        ctx.font = "30px Arial";
        ctx.fillText(Math.floor(this.health), this.x + 18, this.y + 28);
    }
}

// Find the closest cell to click to place defender.
canvas.addEventListener('click', () => {
    const gridPositionX = mouse.x - (mouse.x % cellSize);
    const gridPositionY = mouse.y - (mouse.y % cellSize);

    if(gridPositionY < cellSize) return;

    // Check if the space if free to add defender
    for(let i = 0 ; i < defenders.length ; i++){
        if(defenders[i].x === gridPositionX && defenders[i].y === gridPositionY)
            return;
    }

    let defenderCost = 100;
    if(numberOfResources >= defenderCost){
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numberOfResources -= defenderCost;
    }
});

function handleDefenders() {
    for (let i=0 ; i < defenders.length ; i++){
        defenders[i].draw();
    }
}

// Enemies
class Enemy {
    constructor(verticalPosition){
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize;
        this.height = cellSize;
        this.speed = Math.random() * 0.2 + 0.4;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
    }
    update() {
        this.x -= this.movement;
    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, cellSize, cellSize);
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 30);
    }
}

function handleEnemies(){
    for(let i=0; i < enemies.length; i++){
        enemies[i].update();
        enemies[i].draw();
    }
    if (frame % 100 === 0) {
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize;
        enemies.push(new Enemy(verticalPosition));
        enemyPosition.push(verticalPosition);
        console.log(enemyPosition)
    }
}
// Resources


// Utilities
function handleGameStatus() {
    ctx.fillStyle = 'gold';
    ctx.font = '30px Arial';
    ctx.fillText("Resources Remaining:  " + numberOfResources, 40, 60);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green"
    ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
    handleGameGrid();
    handleDefenders();
    handleEnemies();
    handleGameStatus();
    frame++;
    //console.log(frame);
    requestAnimationFrame(animate);
}

animate();

function collision(first, second) {
    if(     !(  first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)

    ) {
        return true;
    }
}