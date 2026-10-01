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

let crateX = 8;
let crateY = 8;
let targetX = 15;
let targetY = 15;
let isTargetActive = false;
let portalA = {x:3, y:10};
let portalB = {x:16, y:10};
const PORTAL_COOLDOWN = 10000;
let crateTeleportReadyAt = 0;

let currentLevel = 1;

const walls = [
    {x: 2, y: 2}, {x: 3, y: 2}, {x: 4, y: 2}, {x: 2, y: 3}, {x: 2, y: 4},
    {x: 15, y: 2}, {x: 16, y: 2}, {x: 17, y: 2}, {x: 17, y: 3}, {x: 17, y: 4},
    {x: 2, y: 17}, {x: 2, y: 16}, {x: 2, y: 15}, {x: 3, y: 17}, {x: 4, y: 17},
    {x: 17, y: 17}, {x: 17, y: 16}, {x: 17, y: 15}, {x: 16, y: 17}, {x: 15, y: 17},

    {x: 9, y: 4}, {x: 10, y: 4}, {x: 11, y: 4},
    {x: 9, y: 15}, {x: 10, y: 15}, {x: 11, y: 15},
    {x: 4, y: 9}, {x: 4, y: 10}, {x: 4, y: 11},
    {x: 15, y: 9}, {x: 15, y: 10}, {x: 15, y: 11},

    {x: 8, y: 8}, {x: 9, y: 8}, {x: 10, y: 8}, {x: 11, y: 8},
    {x: 9, y: 9}, {x: 9, y: 10}
];

const level3Walls = [
    {x: 10, y: 0}, {x: 10, y: 1}, {x: 10, y: 2}, {x: 10, y: 3}, {x: 10, y: 4},
    {x: 10, y: 5}, {x: 10, y: 6}, {x: 10, y: 7}, {x: 10, y: 8}, {x: 10, y: 9},
    {x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}, {x: 10, y: 13}, {x: 10, y: 14},
    {x: 10, y: 15}, {x: 10, y: 16}, {x: 10, y: 17}, {x: 10, y: 18}, {x: 10, y: 19}
];

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
        case 3: speed = 7; break;
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

    crateX = 8;
    crateY = 8;
    targetX = 15;
    targetY = 15;
    crateTeleportReadyAt = 0;
    isTargetActive = false;

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
    checkCrateOnTarget();
    if(isGameOver()) return;
    clearScreen();
    drawWalls();
    drawLevel3();
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
    if(currentLevel !== 1 && currentLevel !== 3) {
        if (headX < 0) {
            gameOver = true;
        } else if (headX === tileCount) {
            gameOver = true;
        } else if (headY < 0) {
            gameOver = true;
        } else if (headY === tileCount) {
            gameOver = true;
        }
    }

    if(currentLevel === 2) {
        for(let i = 0; i < walls.length; i++) {
            let wall = walls[i];
            if(headX === wall.x && headY === wall.y) {
                gameOver = true;
                break;
            }
        }
    }

    if(currentLevel === 3) {
        for(let i = 0; i < level3Walls.length; i++) {
            let wall = level3Walls[i];
            if(headX === wall.x && headY === wall.y) {
                gameOver = true;
                break;
            }
        }
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

function drawWalls() {
    if(currentLevel === 2) {
        context.fillStyle = 'gray';
        for(let i = 0; i < walls.length; i++) {
            let wall = walls[i];
            context.fillRect(wall.x * gridStep, wall.y * gridStep, tileSize, tileSize);
        }
    }

    if(currentLevel === 3) {
        context.fillStyle = 'gray';
        for(let i = 0; i < level3Walls.length; i++) {
            let wall = level3Walls[i];
            context.fillRect(wall.x * gridStep, wall.y * gridStep, tileSize, tileSize);
        }
    }
}

function drawLevel3() {
    if(currentLevel === 3) {
        context.fillStyle = 'orange';
        context.fillRect(portalA.x * gridStep, portalA.y * gridStep, tileSize, tileSize);
        context.fillStyle = 'blue';
        context.fillRect(portalB.x * gridStep, portalB.y * gridStep, tileSize, tileSize);

        if (isTargetActive) return;

        context.strokeStyle = 'yellow';
        context.lineWidth = 2;
        context.strokeRect(targetX * gridStep, targetY * gridStep, tileSize, tileSize);

        if(isTargetActive) {
            context.fillStyle = 'gold';
        } else {
            context.fillStyle = 'brown';
        }
        context.fillRect(crateX * gridStep, crateY * gridStep, tileSize, tileSize);
    }
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
    let nextX = headX + xVelocity;
    let nextY = headY + yVelocity;

    if (currentLevel === 1 || currentLevel === 3) {
        if (nextX < 0) {
            nextX = tileCount - 1;
        }
        if (nextX >= tileCount){
            nextX = 0;
        }
        if (nextY < 0) {
            nextY = tileCount - 1;
        }
        if (nextY >= tileCount) {
            nextY = 0;
        }
    }

    if (currentLevel === 3) {
        if (!isTargetActive && nextX === crateX && nextY === crateY) {
            let nextCrateX = crateX + xVelocity;
            let nextCrateY = crateY + yVelocity;

            let insideCanvas = (nextCrateX >= 0 && nextCrateX < tileCount && nextCrateY >= 0 && nextCrateY < tileCount);

            let hitWall = false;
            for (let i = 0; i < level3Walls.length; i++) {
                if (nextCrateX === level3Walls[i].x && nextCrateY === level3Walls[i].y) {
                    hitWall = true;
                    break;
                }
            }

            if (insideCanvas && !hitWall) {
                crateX = nextCrateX;
                crateY = nextCrateY;
            } else {
                resetCrate(nextX, nextY);
            }
        }

        const now = Date.now();
        if (now >= crateTeleportReadyAt) {
            if (crateX === portalA.x && crateY === portalA.y) {
                crateX = portalB.x; crateY = portalB.y;
                crateTeleportReadyAt = now + PORTAL_COOLDOWN;
            } else if (crateX === portalB.x && crateY === portalB.y) {
                crateX = portalA.x; crateY = portalA.y;
                crateTeleportReadyAt = now + PORTAL_COOLDOWN;
            }
        }

        if (nextX === portalA.x && nextY === portalA.y) {
            nextX = portalB.x; nextY = portalB.y;
        } else if (nextX === portalB.x && nextY === portalB.y) {
            nextX = portalA.x; nextY = portalA.y;
        }
    }

    headX = nextX;
    headY = nextY;

    if (xVelocity !== 0 || yVelocity !== 0) {
        snakeParts.push(new SnakePart(headX, headY));
        while (snakeParts.length > tailLength) {
            snakeParts.shift();
        }
    }
}

function drawApple() {
    if (currentLevel === 3 && !isTargetActive) return;
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

        if(currentLevel === 2) {
            for(let i = 0; i < walls.length; i++) {
                let wall = walls[i];
                if(appleX === wall.x && appleY === wall.y) {
                    appleOnSnake = true;
                    break;
                }
            }
        }

        if(currentLevel === 3) {
            if(appleX === 10) { appleOnSnake = true; continue; }
            if((appleX === portalA.x && appleY === portalA.y)
                || (appleX === portalB.x && appleY === portalB.y)
                || (appleX === crateX && appleY === crateY)
                || (appleX === targetX && appleY === targetY)) {
                appleOnSnake = true;
                continue;
            }
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

function resetCrate(avoidX, avoidY) {
    let valid = false;
    let newX, newY;

    while (!valid) {
        newX = Math.floor(Math.random() * (tileCount - 4)) + 2;
        newY = Math.floor(Math.random() * (tileCount - 4)) + 2;
        valid = true;

        if (newX === 10) {
            valid = false;
        }
        if (newX === headX && newY === headY) {
            valid = false;
        }
        if (newX === avoidX && newY === avoidY) {
            valid = false;
        }

        if ((newX === portalA.x && newY === portalA.y) || (newX === portalB.x && newY === portalB.y)) {
            valid = false;
        }
        if (newX === targetX && newY === targetY) {
            valid = false;
        }

        for (let i = 0; i < snakeParts.length; i++) {
            if (snakeParts[i].x === newX && snakeParts[i].y === newY) {
                valid = false;
                break;
            }
        }
    }

    crateX = newX;
    crateY = newY;
    crateTeleportReadyAt = 0;
}

function checkCrateOnTarget() {
    if (currentLevel !== 3 || isTargetActive) return;
    if (crateX === targetX && crateY === targetY) {
        isTargetActive = true;
        spawnApple();
    }
}

function checkAppleCollision() {
    if(appleX === headX && appleY === headY) {
        if (currentLevel === 3 && !isTargetActive) return;
        tailLength++;
        score++;
        foodSound.play();

        if (currentLevel === 3) {
            isTargetActive = false;
            do {
                targetX = Math.floor(Math.random() * (tileCount - 4)) + 2;
                targetY = Math.floor(Math.random() * (tileCount - 4)) + 2;
            } while (targetX === 10 || (targetX === portalA.x && targetY === portalA.y)
                || (targetX === portalB.x && targetY === portalB.y));
            resetCrate(-1, -1);
        } else {
            spawnApple();
        }
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
    if((key === 39 || key === 68) && xVelocity !== -1) {
        xVelocity = 1;
        yVelocity = 0;
        isChangingDirection = true;
    }
}