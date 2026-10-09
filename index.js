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

// level 1
const LEVEL1_TARGET = 30;

// level 2
let appleMoveCounter = 0;
const APPLE_MOVE_STEPS = 2;
const LEVEL2_TARGET = 30;

// level 3
const LEVEL3_TARGET = 20;

// level 4
let poisonAppleX = -1;
let poisonAppleY = -1;
let isPoisoned = false;
let poisonSteps = 0;
let poisonStepsTaken = 0;
const LEVEL4_TARGET_STEPS = 50;

// level 5
const FIXED_MINE_COUNT = 5;
const DYNAMIC_MINE_COUNT = 5;
let fixedMines = [];
let dynamicMines = [];
const LEVEL5_TARGET = 20;

// level 6
let crateX = 8;
let crateY = 8;
let targetX = 15;
let targetY = 15;
let isTargetActive = false;
let portalA = {x:3, y:10};
let portalB = {x:16, y:10};
const PORTAL_COOLDOWN = 10000;
let crateTeleportReadyAt = 0;
const LEVEL6_TARGET = 10;

// level 7
let visionRange = 3;
let wallMoveCounter = 0;
const WALL_MOVE_STEPS = 4;
let wallDirection = 1;
const LEVEL7_TARGET = 15;

// level 8
let ghostX = 2;
let ghostY = 2;
let ghostCounter = 0;
let ghostStun = 0;
const GHOST_MOVE_STEPS = 1;
const GHOST_STUN_TICKS = 8;
const LEVEL8_TARGET = 20;

// level 9
const LEVEL9_TARGET = 20;

// level 10
const PAST_GAP = 5;
let headHistory = [];
let pastParts = [];
const LEVEL10_TARGET = 30;

let currentLevel = 1;

// level 3 walls
const level3Walls = [
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

// level 4 walls
const level4Walls = [
    {x: 2, y: 3}, {x: 3, y: 3}, {x: 3, y: 4}, {x: 5, y: 2}, {x: 5, y: 5},
    {x: 8, y: 7}, {x: 9, y: 7}, {x: 9, y: 8}, {x: 11, y: 9}, {x: 11, y: 10}, {x: 12, y: 10},
    {x: 4, y: 12}, {x: 4, y: 13}, {x: 5, y: 15}, {x: 6, y: 15}, {x: 6, y: 16},
    {x: 14, y: 3}, {x: 15, y: 3}, {x: 17, y: 5}, {x: 17, y: 6},
    {x: 14, y: 14}, {x: 15, y: 14}, {x: 15, y: 17}, {x: 16, y: 12}
];

// level 6 walls
const level6Walls = [
    {x: 10, y: 0}, {x: 10, y: 1}, {x: 10, y: 2}, {x: 10, y: 3}, {x: 10, y: 4},
    {x: 10, y: 5}, {x: 10, y: 6}, {x: 10, y: 7}, {x: 10, y: 8}, {x: 10, y: 9},
    {x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}, {x: 10, y: 13}, {x: 10, y: 14},
    {x: 10, y: 15}, {x: 10, y: 16}, {x: 10, y: 17}, {x: 10, y: 18}, {x: 10, y: 19}
];

// level 7 walls
const level7Walls = [
    {x: 6, y: 6}, {x: 6, y: 7}, {x: 6, y: 8}, {x: 6, y: 9},
    {x: 13, y: 10}, {x: 13, y: 11}, {x: 13, y: 12}, {x: 13, y: 13},
    {x: 9, y: 4}, {x: 10, y: 4}, {x: 11, y: 4},
    {x: 8, y: 15}, {x: 9, y: 15}, {x: 10, y: 15}
];

// level 9 walls
const LEVEL9_BASE_WALLS = [
    {x: 4, y: 4}, {x: 5, y: 4}, {x: 6, y: 4}, {x: 7, y: 4},
    {x: 14, y: 8}, {x: 14, y: 9}, {x: 14, y: 10}, {x: 14, y: 11}, {x: 14, y: 12},
    {x: 3, y: 14}, {x: 4, y: 14}, {x: 5, y: 14}, {x: 3, y: 15},
    {x: 10, y: 6}, {x: 11, y: 6}, {x: 12, y: 6},
    {x: 16, y: 3}, {x: 17, y: 3}, {x: 17, y: 4},
    {x: 7, y: 9}, {x: 7, y: 10}, {x: 7, y: 11}, {x: 7, y: 12},
    {x: 10, y: 17}, {x: 11, y: 17}, {x: 12, y: 17}, {x: 13, y: 17},
    {x: 16, y: 15}, {x: 16, y: 16}, {x: 16, y: 17}
];
let level9Walls = [];

let speed = 8;
let xVelocity = 0;
let yVelocity = 0;

let isChangingDirection = false;
let score = 0;
const foodSound = new Audio('food.mp3');

function pickLevel() {
    currentLevel++;
    if(currentLevel > 10) {
        currentLevel = 1;
    }
    document.getElementById('level-btn').innerText = 'LEVEL ' + currentLevel;
}

function startGame() {
    switch (currentLevel) {
        case 1: speed = 6; break;
        case 2: speed = 8; break;
        case 3: speed = 8; break;
        case 4: speed = 8; break;
        case 5: speed = 7; break;
        case 6: speed = 7; break;
        case 7: speed = 7; break;
        case 8: speed = 8; break;
        case 9: speed = 8; break;
        case 10: speed = 8; break;
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

    if(currentLevel === 2){
        appleMoveCounter = 0;
        spawnApple();
    }

    if(currentLevel === 4) {
        spawnPoisonApple()
        spawnApple();
        isPoisoned = false;
        poisonStepsTaken = 0;
    }

    if(currentLevel === 5) {
        generateMines();
        spawnApple();
    }

    if(currentLevel === 7) {
        wallMoveCounter = 0;
        spawnApple();
    }

    if(currentLevel === 8) {
        ghostX = 2;
        ghostY = 2;
        ghostCounter = 0;
        ghostStun = 0;
        spawnApple();
    }

    if(currentLevel === 9) {
        level9Walls = [];
        for(let i = 0; i < LEVEL9_BASE_WALLS.length; i++) {
            level9Walls.push({x: LEVEL9_BASE_WALLS[i].x, y: LEVEL9_BASE_WALLS[i].y});
        }
        spawnApple();
    }

    if(currentLevel === 10) {
        headHistory = [];
        pastParts = [];
        spawnApple();
    }
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
    drawLevel5();
    drawLevel6();
    checkAppleCollision();

    if(checkWinCondition()) return;

    drawApple();
    drawGhost()
    drawPast();
    drawSnake();
    drawFog();
    drawScore();

    setTimeout(drawGame, 1000/speed);
}

function isGameOver() {
    if(xVelocity === 0 && yVelocity === 0) return false;
    let gameOver = false;

    // walls
    if(currentLevel !== 1 && currentLevel !== 2 && currentLevel !== 5
        && currentLevel !== 6 && currentLevel !== 7 && currentLevel !== 8 && currentLevel !== 10) {
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

    if(currentLevel === 3) {
        for(let i = 0; i < level3Walls.length; i++) {
            let wall = level3Walls[i];
            if(headX === wall.x && headY === wall.y) {
                gameOver = true;
                break;
            }
        }
    }

    if(currentLevel === 4) {
        for(let i = 0; i < level4Walls.length; i++) {
            let wall = level4Walls[i];
            if(headX === wall.x && headY === wall.y) {
                gameOver = true;
                break;
            }
        }
    }

    if(currentLevel === 5) {
        for(let i = 0; i < fixedMines.length; i++) {
            if(headX === fixedMines[i].x && headY === fixedMines[i].y) {
                gameOver = true;
                break;
            }
        }

        for(let i = 0; i < dynamicMines.length; i++) {
            if(headX === dynamicMines[i].x && headY === dynamicMines[i].y) {
                gameOver = true;
                break;
            }
        }
    }

    if (currentLevel === 6) {
        for (let i = 0; i < level6Walls.length; i++) {
            if (headX === level6Walls[i].x && headY === level6Walls[i].y) {
                gameOver = true;
                break;
            }
        }
    }

    if (currentLevel === 7) {
        for (let i = 0; i < level7Walls.length; i++) {
            if (headX === level7Walls[i].x && headY === level7Walls[i].y) {
                gameOver = true;
                break;
            }
        }
    }

    if (currentLevel === 8 && headX === ghostX && headY === ghostY) {
        gameOver = true;
    }

    if (currentLevel === 9) {
        for (let i = 0; i < level9Walls.length; i++) {
            if (headX === level9Walls[i].x && headY === level9Walls[i].y) {
                gameOver = true;
                break;
            }
        }
    }

    if(currentLevel === 10) {
        for(let i = 0; i < pastParts.length; i++) {
            if(headX === pastParts[i].x && headY === pastParts[i].y) {
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
    context.fillStyle = 'gray';

    if (currentLevel === 3) {
        for (let i = 0; i < level3Walls.length; i++) {
            context.fillRect(level3Walls[i].x * gridStep, level3Walls[i].y * gridStep, tileSize, tileSize);
        }
    }

    if (currentLevel === 4) {
        for (let i = 0; i < level4Walls.length; i++) {
            context.fillRect(level4Walls[i].x * gridStep, level4Walls[i].y * gridStep, tileSize, tileSize);
        }
    }

    if (currentLevel === 6) {
        for (let i = 0; i < level6Walls.length; i++) {
            context.fillRect(level6Walls[i].x * gridStep, level6Walls[i].y * gridStep, tileSize, tileSize);
        }
    }

    if (currentLevel === 7) {
        for (let i = 0; i < level7Walls.length; i++) {
            context.fillRect(level7Walls[i].x * gridStep, level7Walls[i].y * gridStep, tileSize, tileSize);
        }
    }

    if (currentLevel === 9) {
        for (let i = 0; i < level9Walls.length; i++) {
            context.fillRect(level9Walls[i].x * gridStep, level9Walls[i].y * gridStep, tileSize, tileSize);
        }
    }
}

function drawFog() {
    if(currentLevel === 7) {
        for(let i = 0; i < tileCount; i++) {
            for(let j = 0; j < tileCount; j++) {
                let disX = Math.abs(headX - i);
                let disY = Math.abs(headY - j);
                let isNearHead = (disX <= visionRange && disY <= visionRange);

                if(!isNearHead) {
                    context.fillStyle = 'black';
                    context.fillRect(i * gridStep, j * gridStep, gridStep, gridStep);
                }
            }
        }
    }
}

function moveLevel7Walls() {
    let hitEdge = false;
    for(let i = 0; i < level7Walls.length; i++) {
        let newY = level7Walls[i].y + wallDirection;
        if(newY < 0 || newY >= tileCount) {
            hitEdge = true;
            break;
        }
    }
    if(hitEdge) {
        wallDirection *= -1;
    }

    for(let i = 0; i < level7Walls.length; i++) {
        level7Walls[i].y += wallDirection;
    }
}

function drawLevel5 () {
    if(currentLevel !== 5) return;
    checkAndDrawMineWarning(fixedMines);
    checkAndDrawMineWarning(dynamicMines);
}

function drawLevel6() {
    if(currentLevel === 6) {
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


function checkAndDrawMineWarning(mineList) {
    for(let i = 0; i < mineList.length; i++) {
        let mine = mineList[i];
        let disX = Math.abs(headX - mine.x);
        let disY = Math.abs(headY - mine.y);
        let dis = Math.max(disX, disY);

        if(dis === 1) {
            context.fillStyle = 'rgba(255, 0, 0, 0.4)';
            context.fillRect(mine.x * gridStep, mine.y * gridStep, tileSize, tileSize);
        } else if (dis === 2) {
            context.fillStyle = 'rgba(255, 255, 0, 0.25)';
            context.fillRect(mine.x * gridStep, mine.y * gridStep, tileSize, tileSize);
        }
    }
}

function drawScore() {
    context.fillStyle = 'white';
    context.font = '20px Arial';

    if (currentLevel === 1) {
        context.fillText(`Score: ${score} | Target: ${LEVEL1_TARGET}`, 10, 25);
    } else if (currentLevel === 2) {
        context.fillText(`Score: ${score} | Target: ${LEVEL2_TARGET}`, 10, 25);
    } else if (currentLevel === 3) {
        context.fillText(`Score: ${score} | Target: ${LEVEL3_TARGET}`, 10, 25);
    } else if (currentLevel === 4) {
        context.fillText(`Poison Steps: ${poisonStepsTaken}/${LEVEL4_TARGET_STEPS}`, 10, 25);
    } else if (currentLevel === 5) {
        context.fillText(`Score: ${score} | Target: ${LEVEL5_TARGET}`, 10, 25);
    } else if (currentLevel === 6) {
        context.fillText(`Score: ${score} | Target: ${LEVEL6_TARGET}`, 10, 25);
    } else if (currentLevel === 7) {
        context.fillText(`Score: ${score} | Target: ${LEVEL7_TARGET}`, 10, 25);
    } else if (currentLevel === 8) {
        context.fillText(`Score: ${score} | Target: ${LEVEL8_TARGET}`, 10, 25);
    } else if (currentLevel === 9) {
        context.fillText(`Score: ${score} | Target: ${LEVEL9_TARGET}`, 10, 25);
    } else if (currentLevel === 10) {
        context.fillText(`Score: ${score} | Target: ${LEVEL10_TARGET}`, 10, 25);
    } else {
        context.fillText(`Score: ${score}`, 10, 25);
    }
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

    if(isPoisoned) {
        context.fillStyle = 'purple';
    } else {
        context.fillStyle = 'white';
    }
    context.fillRect(headX * gridStep, headY * gridStep, tileSize, tileSize);
}

function changeSnakePosition() {
    let nextX = headX + xVelocity;
    let nextY = headY + yVelocity;

    if (currentLevel === 1 || currentLevel === 2 || currentLevel === 5
        || currentLevel === 6 || currentLevel === 7 || currentLevel === 8 || currentLevel === 10) {
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

    if (currentLevel === 6) {
        if (!isTargetActive && nextX === crateX && nextY === crateY) {
            let nextCrateX = crateX + xVelocity;
            let nextCrateY = crateY + yVelocity;

            let insideCanvas = (nextCrateX >= 0 && nextCrateX < tileCount && nextCrateY >= 0 && nextCrateY < tileCount);

            let hitWall = false;
            for (let i = 0; i < level6Walls.length; i++) {
                if (nextCrateX === level6Walls[i].x && nextCrateY === level6Walls[i].y) {
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

    if(currentLevel === 2 && (xVelocity !== 0 || yVelocity !== 0)) {
        appleMoveCounter++;
        if(appleMoveCounter >= APPLE_MOVE_STEPS) {
            moveAppleRandom();
            appleMoveCounter = 0;
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

    if(currentLevel === 10 && (xVelocity !== 0 || yVelocity !== 0)) {
        let pastDelay = tailLength + PAST_GAP;
        headHistory.push({x: headX, y: headY});
        while(headHistory.length > pastDelay + tailLength) {
            headHistory.shift();
        }

        pastParts = [];
        if(headHistory.length > pastDelay) {
            let start = headHistory.length - 1 - pastDelay;
            for(let i = start; i >= 0 && pastParts.length < tailLength; i--) {
                pastParts.push({x: headHistory[i].x, y: headHistory[i].y});
            }
        }
    }

    if(isPoisoned) {
        poisonSteps = poisonSteps - 1;
        if (xVelocity !== 0 || yVelocity !== 0) {
            poisonStepsTaken++;
        }

        if(poisonSteps <= 0) {
            isPoisoned = false;
        }
    }

    if (currentLevel === 7 && (xVelocity !== 0 || yVelocity !== 0)) {
        wallMoveCounter++;
        if (wallMoveCounter >= WALL_MOVE_STEPS) {
            moveLevel7Walls();
            wallMoveCounter = 0;
        }
    }

    if (currentLevel === 8 && (xVelocity !== 0 || yVelocity !== 0)) {
        moveGhost();
    }
}

function drawApple() {
    if (!(currentLevel === 6 && !isTargetActive) && currentLevel !== 4) {
        context.fillStyle = 'red';
        context.fillRect(appleX * gridStep, appleY * gridStep, tileSize, tileSize);
    }

    if (currentLevel === 4 && poisonAppleX !== -1) {
        context.fillStyle = 'purple';
        context.fillRect(poisonAppleX * gridStep, poisonAppleY * gridStep, tileSize, tileSize);
    }
}

function spawnApple() {
    if(currentLevel === 4) return;
    let appleOnSnake = true;
    while(appleOnSnake) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        appleOnSnake = false;

        if(appleX === headX && appleY === headY) {
            appleOnSnake = true;
            continue;
        }

        if(currentLevel === 3) {
            for(let i = 0; i < level3Walls.length; i++) {
                let wall = level3Walls[i];
                if(appleX === wall.x && appleY === wall.y) {
                    appleOnSnake = true;
                    break;
                }
            }
        }

        if(currentLevel === 6) {
            if(appleX === 10) { appleOnSnake = true; continue; }
            if((appleX === portalA.x && appleY === portalA.y)
                || (appleX === portalB.x && appleY === portalB.y)
                || (appleX === crateX && appleY === crateY)
                || (appleX === targetX && appleY === targetY)) {
                appleOnSnake = true;
                continue;
            }
        }

        if(currentLevel === 7) {
            for(let i = 0; i < level7Walls.length; i++) {
                let wall = level7Walls[i];
                if(appleX === wall.x && appleY === wall.y) {
                    appleOnSnake = true;
                    break;
                }
            }
        }

        if(currentLevel === 9) {
            for(let i = 0; i < level9Walls.length; i++) {
                let wall = level9Walls[i];
                if(appleX === wall.x && appleY === wall.y) {
                    appleOnSnake = true;
                    break;
                }
            }
        }

        if(currentLevel === 10) {
            for(let i = 0; i < pastParts.length; i++) {
                if(appleX === pastParts[i].x && appleY === pastParts[i].y) {
                    appleOnSnake = true;
                    break;
                }
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

function moveAppleRandom() {
    let directions = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
    let validMoves = [];

    for(let i = 0; i <directions.length; i++) {
        let newX = appleX + directions[i].x;
        let newY = appleY + directions[i].y;
        if(newX >= 0 && newX < tileCount && newY >= 0 && newY < tileCount) {
            let onSnake = false;
            if(newX === headX && newY === headY) {
                onSnake = true;
            }
            for(let j = 0; j < snakeParts.length; j++) {
                if(snakeParts[j].x === newX && snakeParts[j].y === newY) {
                    onSnake = true;
                    break;
                }
            }
            if(!onSnake) {
                validMoves.push({x: newX, y: newY});
            }
        }
    }

    if(validMoves.length > 0) {
        let randomMoves = validMoves[Math.floor(Math.random() * validMoves.length)];
        appleX = randomMoves.x;
        appleY = randomMoves.y;
    }
}

function moveGhost() {
    if(ghostStun > 0) {
        ghostStun--;
        return;
    }
    ghostCounter++;
    if(ghostCounter < GHOST_MOVE_STEPS) return;
    ghostCounter = 0;

    const dx = headX - ghostX;
    const dy = headY - ghostY;
    if(Math.abs(dx) >= Math.abs(dy)) {
        ghostX += Math.sign(dx);
    } else {
        ghostY += Math.sign(dy);
    }
}

function drawGhost() {
    if(currentLevel !== 8) return;
    context.fillStyle = ghostStun > 0 ? 'gray' : 'cyan';
    context.fillRect(ghostX * gridStep, ghostY * gridStep, tileSize, tileSize);
}

function drawPast() {
    if(currentLevel !== 10) return;
    context.fillStyle = 'rgba(120, 160, 255, 0.6)';
    for(let i = 0; i < pastParts.length; i++) {
        context.fillRect(pastParts[i].x * gridStep, pastParts[i].y * gridStep, tileSize, tileSize);
    }
}

function spawnPoisonApple() {
    let valid = false;
    while(!valid) {
        poisonAppleX = Math.floor(Math.random() * tileCount);
        poisonAppleY = Math.floor(Math.random() * tileCount);
        valid = true;

        if(poisonAppleX === headX && poisonAppleY === headY) valid = false;
        // if(poisonAppleX === appleX && poisonAppleY === appleY) valid = false;

        if(currentLevel === 4) {
            for(let i = 0; i < level4Walls.length; i++) {
                if(poisonAppleX === level4Walls[i].x && poisonAppleY === level4Walls[i].y) {
                    valid = false;
                    break;
                }
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
    if (currentLevel !== 6 || isTargetActive) return;
    if (crateX === targetX && crateY === targetY) {
        isTargetActive = true;
        spawnApple();
    }
}

function checkAppleCollision() {
    if(appleX === headX && appleY === headY) {
        if (currentLevel === 6 && !isTargetActive) return;
        tailLength++;
        score++;
        foodSound.play();

        if (currentLevel === 6) {
            isTargetActive = false;
            do {
                targetX = Math.floor(Math.random() * (tileCount - 4)) + 2;
                targetY = Math.floor(Math.random() * (tileCount - 4)) + 2;
            } while (targetX === 10 || (targetX === portalA.x && targetY === portalA.y)
                || (targetX === portalB.x && targetY === portalB.y));
            resetCrate(-1, -1);
        } else {
            if(currentLevel === 5){
                relocateDynamicMines();
            }
            if(currentLevel === 8) {
                ghostStun = GHOST_STUN_TICKS;
            }
            if(currentLevel === 9) {
                rotateWorld();
            }
            spawnApple();
        }
    }

    if (currentLevel === 4 && headX === poisonAppleX && headY === poisonAppleY) {
        score = score + 3;
        isPoisoned = true;
        poisonSteps = 10;
        spawnPoisonApple();
    }
}

function checkWinCondition() {
    if (currentLevel === 1 && score >= LEVEL1_TARGET) {
        displayWinText('LEVEL 1 COMPLETED!');
        return true;
    }

    if (currentLevel === 2 && score >= LEVEL2_TARGET) {
        displayWinText('LEVEL 2 COMPLETED!');
        return true;
    }

    if (currentLevel === 3 && score >= LEVEL3_TARGET) {
        displayWinText('LEVEL 3 COMPLETED!');
        return true;
    }

    if (currentLevel === 4 && poisonStepsTaken >= LEVEL4_TARGET_STEPS) {
        displayWinText('LEVEL 4 COMPLETED!');
        return true;
    }

    if (currentLevel === 5 && score >= LEVEL5_TARGET) {
        displayWinText('LEVEL 5 COMPLETED!');
        return true;
    }

    if (currentLevel === 6 && score >= LEVEL6_TARGET) {
        displayWinText('LEVEL 6 COMPLETED!');
        return true;
    }

    if (currentLevel === 7 && score >= LEVEL7_TARGET) {
        displayWinText('LEVEL 7 COMPLETED!');
        return true;
    }

    if (currentLevel === 8 && score >= LEVEL8_TARGET) {
        displayWinText('LEVEL 8 COMPLETED!');
        return true;
    }

    if (currentLevel === 9 && score >= LEVEL9_TARGET) {
        displayWinText('LEVEL 9 COMPLETED!');
        return true;
    }

    if (currentLevel === 10 && score >= LEVEL10_TARGET) {
        displayWinText('LEVEL 10 COMPLETED!');
        return true;
    }

    return false;
}

function displayWinText(text) {
    context.fillStyle = 'gold';
    context.font = '40px Arial';
    context.textAlign = 'center';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    context.textAlign = 'left';
    setTimeout(showMenu, 1500);
}

function generateMines() {
    fixedMines = [];
    while(fixedMines.length < FIXED_MINE_COUNT) {
        let mx = Math.floor(Math.random() * tileCount);
        let my = Math.floor(Math.random() * tileCount);
        if (Math.abs(mx - 12) <= 2 && Math.abs(my - 12) <= 2) continue;

        let hasMine = false;
        for(let i = 0; i < fixedMines.length; i++) {
            if(fixedMines[i].x === mx && fixedMines[i].y === my) {
                hasMine = true;
                break;
            }
        }

        if(hasMine === false) {
            fixedMines.push({x: mx, y: my});
        }
    }
    relocateDynamicMines();
}

function rotatePoint(p) {
    const nx = tileCount - 1 - p.y;
    const ny = p.x;
    p.x = nx;
    p.y = ny;
}

function rotateWorld() {
    const hx = tileCount - 1 - headY;
    const hy = headX;
    headX = hx;
    headY = hy;

    const vx = -yVelocity;
    const vy = xVelocity;
    xVelocity = vx;
    yVelocity = vy;
    for(let i = 0; i < snakeParts.length; i++) {
        rotatePoint(snakeParts[i]);
    }
    for(let i = 0; i < level9Walls.length; i++) {
        rotatePoint(level9Walls[i]);
    }

    let newWalls = [];
    for(let i = 0; i < level9Walls.length; i++) {
        let wall = level9Walls[i];
        let keepWall = true;
        let disX = Math.abs(wall.x - headX);
        let disY = Math.abs(wall.y - headY);
        if(disX <= 2 && disY <= 2) {
            keepWall = false;
        }

        for(let j = 0; j < snakeParts.length; j++) {
            if(snakeParts[j].x === wall.x && snakeParts[j].y === wall.y) {
                keepWall = false;
                break;
            }
        }

        if(keepWall) {
            newWalls.push(wall);
        }
    }
    level9Walls = newWalls;
}

function relocateDynamicMines() {
    dynamicMines = [];
    while(dynamicMines.length < DYNAMIC_MINE_COUNT) {
        let mx = Math.floor(Math.random() * tileCount);
        let my = Math.floor(Math.random() * tileCount);
        if(mx === headX && my === headY) continue;
        if(mx === appleX && my === appleY) continue;
        let hasMine = false;

        for(let i = 0; i < fixedMines.length; i++) {
            if(fixedMines[i].x === mx && fixedMines[i].y === my) {
                hasMine = true;
                break;
            }
        }

        for(let i = 0; i < dynamicMines.length; i++) {
            if(dynamicMines[i].x === mx && dynamicMines[i].y === my) {
                hasMine = true;
                break;
            }
        }

        for(let i = 0; i < snakeParts.length; i++) {
            if(snakeParts[i].x === mx && snakeParts[i].y === my) {
                hasMine = true;
                break;
            }
        }

        if(hasMine === false) {
            dynamicMines.push({x: mx, y: my});
        }
    }
}

document.addEventListener('keydown', keyDown);

function keyDown(event) {
    if(isChangingDirection) return;
    let key = event.keyCode;

    if(isPoisoned) {
        if (key === 38) {
            key = 40;
        } else if (key === 40) {
            key = 38;
        } else if (key === 37) {
            key = 39;
        } else if (key === 39) {
            key = 37;
        } else if (key === 87) {
            key = 83;
        } else if (key === 83) {
            key = 87;
        } else if (key === 65) {
            key = 68;
        } else if (key === 68) {
            key = 65;
        }
    }

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