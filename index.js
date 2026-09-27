const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let tileCount = 20;
let gridStep = canvas.width / tileCount;
let tileSize = gridStep - 2;
let headX = 12;
let headY = 12;
const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let currentLevel = 1;


let speed = 8;
let xVelocity = 0;
let yVelocity = 0;

let isChangingDirection = false;
let score = 0;
const foodSound = new Audio('food.mp3');

function pickLevel() {
    currentLevel++;
    if(currentLevel > 5) {
        currentLevel = 1;
    }
    document.getElementById('level-btn').innerText = 'LEVEL ' + currentLevel;
}

function startGame() {
    switch (currentLevel) {
        case 1: speed = 6; break;
        case 2: speed = 9; break;
        case 3: speed = 12; break;
        case 4: speed = 15; break;
        case 5: speed = 18; break;
    }

    document.getElementById('main-menu').classList.add('hidden');

    headX = 12;
    headY = 12;
    snakeParts.length = 0;
    tailLength = 2;
    score = 0;
    xVelocity = 0;
    yVelocity = 0;

    drawGame();
}

function openSettings() {
    document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
}

function showMenu() {
    document.getElementById('main-menu').classList.remove('hidden');
}
function drawGame() {
    isChangingDirection = false;
    changeSnakePosition();
    if(isGameOver()) return;
    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();

    setTimeout(drawGame, 1000/speed);
}

function isGameOver() {
    if(xVelocity === 0 && yVelocity === 0) return false;
    let gameOver = false;

    // walls
    if(headX < 0) {
        gameOver = true;
    } else if(headX === tileCount) {
        gameOver = true;
    } else if(headY < 0) {
        gameOver = true;
    } else if(headY === tileCount) {
        gameOver = true;
    }

    for(let i = 0; i < snakeParts.length - 1; i++) {
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    if(gameOver) {
        context.fillStyle = 'white';
        context.font = '50px Arial';
        context.fillText('Game Over!', canvas.width/4.5, canvas.height/2);
        setTimeout(showMenu, 1500);
    }

    return gameOver;
}

function drawScore() {
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText('Score ' + score, canvas.width - 100, 23);
}

function clearScreen() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    context.fillStyle = 'green';
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        context.fillRect(part.x * gridStep, part.y * gridStep, tileSize, tileSize);
    }

    context.fillStyle = 'white';
    context.fillRect(headX * gridStep, headY * gridStep, tileSize, tileSize);
}

function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
    if(xVelocity !== 0 || yVelocity !== 0) {
        snakeParts.push(new SnakePart(headX, headY));
        while(snakeParts.length > tailLength) {
            snakeParts.shift();
        }
    }
}

function drawApple() {
    context.fillStyle = 'red';
    context.fillRect(appleX * gridStep, appleY * gridStep, tileSize, tileSize);
}

function spawnApple() {
    let appleOnSnake = true;
    while(appleOnSnake) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        appleOnSnake = false;

        if(appleX === headX && appleY === headY) {
            appleOnSnake = true;
            continue;
        }

        for(let i = 0; i < snakeParts.length; i++) {
            let part = snakeParts[i];
            if(part.x === appleX && part.y === appleY) {
                appleOnSnake = true;
                break;
            }
        }
    }
}

function checkAppleCollision() {
    if(appleX === headX && appleY === headY) {
        spawnApple();
        tailLength++;
        score++;
        foodSound.play();
    }
}

document.addEventListener('keydown', keyDown);

function keyDown(event) {
    if(isChangingDirection) return;
    const key = event.keyCode;
    // up
    if((key === 38 || key === 87) && yVelocity !== 1)  {
        xVelocity = 0;
        yVelocity = -1;
        isChangingDirection = true;
    }

    // down
    if((key === 40 || key === 83) && yVelocity !== -1) {
        xVelocity = 0;
        yVelocity = 1;
        isChangingDirection = true;
    }

    // left
    if((key === 37 || key === 65) && xVelocity !== 1) {
        xVelocity = -1;
        yVelocity = 0;
        isChangingDirection = true;
    }

    // right
    if((key === 39 || key === 68) && xVelocity !== 1) {
        xVelocity = 1;
        yVelocity = 0;
        isChangingDirection = true;
    }
}