const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 12;
let headY = 12;
const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let speed = 8;
let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const foodSound = new Audio('food.mp3');

function drawGame() {
    changeSnakePosition();
    let result = isGameOver();
    if(result) return;

    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();

    // level 2
    if(score > 2) {
        speed = 11;
    }
    if(score > 10) {
        speed = 15;
    }
    setTimeout(drawGame, 1000/speed);
}

function isGameOver() {
    let gameOver = false;
    if(xVelocity === 0 && yVelocity === 0) return false;

    // walls
    if(headX < 0) {
        gameOver = true;
    } else if(headY === tileCount) {
        gameOver = true;
    } else if(headY < 0) {
        gameOver = true;
    } else if(headY === tileCount) {
        gameOver = true;
    }

    for(let i = 0; i < snakeParts.length; i++) {
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
        context.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }
    snakeParts.push(new SnakePart(headX, headY));
    if(snakeParts.length > tailLength) {
        snakeParts.shift();
    }

    context.fillStyle = 'white';
    context.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple() {
    context.fillStyle = 'red';
    context.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
    if(appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        foodSound.play();
    }
}

document.addEventListener('keydown', keyDown);

function keyDown(event) {

    // up
    if(event.keyCode === 38 || event.keyCode === 87) {
        if(yVelocity === 1) return;
        xVelocity = 0;
        yVelocity = -1;
    }

    // down
    if(event.keyCode === 40 || event.keyCode === 83) {
        if(yVelocity === -1) return;
        xVelocity = 0;
        yVelocity = 1;
    }

    // left
    if(event.keyCode === 37 || event.keyCode === 65) {
        if(xVelocity === 1) return;
        xVelocity = -1;
        yVelocity = 0;
    }

    // right
    if(event.keyCode === 39 || event.keyCode === 68) {
        if(xVelocity === -1) return;
        xVelocity = 1;
        yVelocity = 0;
    }
}

drawGame();