// Game from https://developer.mozilla.org/fr/docs/Games/Workflows/2D_Breakout_game_pure_JavaScript
const canvas = document.getElementById("game");
const slider = document.querySelector('.slider')
const ctx = canvas.getContext("2d");
const paddleHeight = 10;
const ballRadius = 10;
const paddleWidth = 75;
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const result = document.querySelector('.result')
let speed, paddleY, rightPressed, leftPressed, x, y, dx, dy, paddleX, score, lives, stop, bricks

function init() {
    speed = slider.value
    rightPressed = false;
    leftPressed = false;
    x = canvas.width/2;
    y = canvas.height-30;
    dx = speed;
    dy = -speed;
    paddleX = (canvas.width-paddleWidth)/2
    paddleY = canvas.height-paddleHeight
    lives = 1
    score = 0
    stop = false
    initBricks()
    result.classList.remove('goodgame')
    result.classList.remove('gameover')
}

function exportStatus () {
    return !stop ? {
        rightPressed,
        leftPressed,
        x,
        y,
        paddleX,
        paddleY,
    } : {}
}

function initBricks() {
    bricks = [];
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function start () {
    stop = true
    requestAnimationFrame(() => {
        init()
        draw()
    })
}

document.querySelector('.start').addEventListener("click", start, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
        leftPressed = false;
    }
    else if(e.keyCode == 37) {
        rightPressed = false;
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        result.innerText = "YOU WIN";
                        result.classList.add('goodgame')
                        stop = true
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {
    speed = slider.value
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                result.innerText = "GAME OVER";
                result.classList.add('gameover')
                stop = true
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = speed;
                dy = -speed;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += speed * 1.5;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= speed * 1.5;
    }

    x += dx;
    y += dy;
    if (!stop) requestAnimationFrame(draw);
}
