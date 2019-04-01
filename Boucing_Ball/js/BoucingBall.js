var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
const ballRadius = 10;
var pointX = canvas.width/2;
var pointY = canvas.height-30;
var moveX = 4;
var moveY = -4;
const paddleHeight = 10;
const paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var paused = false;
var brickRowCount = 7;
var brickColumnCount = 4;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var brickColor = "#" + Math.floor(Math.random() * 255 * 255 * 255).toString(16);
var ballColor = "#" + Math.floor(Math.random() * 255 * 255 * 255).toString(16);

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { pointX: 0, pointY: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
window.addEventListener('keydown', pauseGameKeyHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(pointX > b.pointX && pointX < b.pointX+brickWidth && pointY > b.pointY && pointY < b.pointY+brickHeight) {
                    moveY = -moveY;
                    b.status = 0;
                    score++;
                    document.getElementById('collision').play();
                    if(score == brickRowCount*brickColumnCount) {
                        document.getElementById('win').play();
                        alert("YOU WIN, CONGRATULATION!");
                        if (confirm("Would You Like Play Again ?")) {

                        }else {
                            window.close();
                        }
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(pointX, pointY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = brickColor;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].pointX = brickX;
                bricks[c][r].pointY = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColor;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if(pointX + moveX > canvas.width - ballRadius || pointX + moveX < ballRadius) {
        moveX = -moveX;
    }
    if(pointY + moveY < ballRadius) {
        moveY = -moveY;
    }
    else if(pointY + moveY > canvas.height-ballRadius) {
        if(pointX > paddleX && pointX < paddleX + paddleWidth) {
            document.getElementById('collision').play();
            moveY = -moveY;
        }
        else {
            lives--;
            document.getElementById('lose').play();
            if(!lives) {
                if (confirm("Game Over! Your Score: "+ score + "\n Would You Like Play Again ?")) {

                }else {
                    window.close();
                }
                document.location.reload();
            }
            else {
                pointX = canvas.width/2;
                pointY = canvas.height-30;
                moveX = 3;
                moveY = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    pointX += moveX;
    pointY += moveY;
    if(!paused) {
        requestAnimationFrame(draw);
    }
}

function pauseGameKeyHandler(e) {
    var keyCode = e.keyCode;
    switch(keyCode){
        case 80: //P
            togglePause();
            offInstruction();
            break;
    }
}

function togglePause() {
    paused = !paused;
    draw();
}

function onInstruction() {
    document.getElementById("overlay").style.display = "block";
    togglePause();
}

function offInstruction() {
    document.getElementById("overlay").style.display = "none";
}

draw();
