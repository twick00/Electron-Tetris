function ready(callback) {
    // in case the document is already rendered
    if (document.readyState != 'loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function () {
        if (document.readyState == 'complete') callback();
    });
}

ready(function () {
    blockArr = buildBlockArr();
    nextPiece = blockArr.shift();
    inputPiece = getNewPiece();
    canvas = document.getElementById("canvas");
    c = canvas.getContext("2d");
    //startScreen(c, canvas);
    //drawAll(c, canvas);
    dropBlock(c, canvas);
    document.onkeydown = function (e) {
        e.preventDefault();
        switch (e.keyCode) {
            case 37:
                moveLeft(c, canvas);
                break;
            case 38:
                rotatePiece(c, canvas);
                break;
            case 39:
                moveRight(c, canvas);
                break;
            case 40:
                moveDown(c, canvas);
                break;
            case 32:
                moveDownAll(c, canvas);
                break;
            default:
                console.log('non arrow key');
        }
        drawScreen(c, canvas);
    };
    // do something
});



function dropBlock(c, canvas, timer) {
    var timer = timer || 500;
    dropInterval = setInterval(function () {
        if (moveDown(c, canvas) === false) {
            drawScreen(c, canvas);
        }
    }, timer);
}

function gameOver() {
    clearInterval(dropInterval);
    var styleCanvas = document.getElementById("canvas");
    var styleGameOver = document.getElementById("game-over");
    styleCanvas.style.display = "none";
    styleGameOver.style.display = "block"
    // $("#canvas").hide();
    // $("#game-over").show();
}

function moveLeft(c, canvas) {
    newPiece = inputPiece.translate(directions.left);
    if (newPiece.collides(bottomBlock) || newPiece.collides(boundingBlock)) {
        return;
    } else {
        inputPiece = inputPiece.translate(directions.left);
        drawScreen(c, canvas);
    }
}

function moveRight(c, canvas) {
    newPiece = inputPiece.translate(directions.right);
    if (newPiece.collides(bottomBlock) || newPiece.collides(boundingBlock)) {
        return;
    } else {
        inputPiece = inputPiece.translate(directions.right);
        drawScreen(c, canvas);
    }
}

function moveDown(c, canvas) {
    newPiece = inputPiece.translate(directions.down);
    if (newPiece.collides(bottomBlock) || newPiece.collides(boundingBlock)) {
        bottomBlock = mergeBlocks(bottomBlock, inputPiece);
        inputPiece = getNewPiece();
        return false;
    } else {
        inputPiece = inputPiece.translate(directions.down);
        drawScreen(c, canvas);
    }
}

function moveDownAll(c, canvas) {
    notDone = true;
    while (notDone) {
        newPiece = inputPiece.translate(directions.down);
        if (newPiece.collides(bottomBlock) || newPiece.collides(boundingBlock)) {
            bottomBlock = mergeBlocks(bottomBlock, inputPiece);
            inputPiece = getNewPiece();
            notDone = false;
        } else {
            inputPiece = inputPiece.translate(directions.down);
            drawScreen(c, canvas);
        }
    }
}

function rotatePiece(c, canvas) {
    newPiece = inputPiece.rotate();
    if (newPiece.rotate().collides(bottomBlock) || newPiece.collides(boundingBlock)) {
        return;
    } else {
        inputPiece = inputPiece.rotate();
        drawScreen(c, canvas);
        return inputPiece;
    }
}

function startScreen(c, canvas) {
    var blinkOn = true;
    var textInteveral = window.setInterval(function () {
        var image = document.getElementById('source');
        if (blinkOn) {
            blinkOn = false;
            //console.log("Blink On");
            c.fillStyle = '#555555';
            c.font = '48px serif';
            c.fillText('Press Space to begin.', 350, 600);
            c.drawImage(image, 0, 0);
        } else {
            //console.log("Blink Off");
            blinkOn = true;
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.drawImage(image, 0, 0);
        }
        document.body.onkeydown = function (e) {
            if (e.keyCode == 32) {
                clearInterval(textInteveral);
                var logoFadeInterval = window.setInterval(function () {
                    c.globalAlpha -= 0.01;
                    c.clearRect(0, 0, canvas.width, canvas.height);
                    c.drawImage(image, 0, 0);
                    if (c.globalAlpha <= .01) {
                        //clearInterval(logoFadeInterval);
                        c.clearRect(0, 0, canvas.width, canvas.height);
                        c.globalAlpha = 1;
                        //document.body.onkeydown = null;
                        setTimeout(function () {

                            drawScreen(c, canvas);
                        }, 1000);
                        //return;
                    }
                }, 10);
            }
        };
    }, 500);
}

function buildCanvas(c, canvas) {
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(2, 2);
    c.lineTo(506, 2);
    c.lineTo(506, 1006);
    c.lineTo(2, 1006);
    c.closePath();
    //c.fill();
    c.stroke();
}

function colorPick(color) {
    var colors = [];
    switch (color) {
        case 1:
            colors = ['#00ffff', '#33ffff', '#00dddd'];
            break;
        case 2:
            colors = ['#0000ff', '#3333ff', '#0000dd'];
            break;
        case 3:
            colors = ['#ff7700', '#ff9933', '#dd6600'];
            break;
        case 4:
            colors = ['#ffff00', '#ffff33', '#dddd00'];
            break;
        case 5:
            colors = ['#00ff00', '#33ff33', '#00dd00'];
            break;
        case 6:
            colors = ['#ff0000', '#ff3333', '#dd0000'];
            break;
        case 7:
            colors = ['#770077', '#993399', '#660066'];
            break;
        default:
            console.log('color out of bounds in colorpick ' + color);
    }
    return colors;
}

function getNewPiece() {
    inputPiece = nextPiece;
    if (blockArr.length === 0) {
        blockArr = buildBlockArr();
    }
    nextPiece = blockArr.shift();
    if (inputPiece.collides(bottomBlock)) {
        gameOver();
        console.log("GAME OVER");
    }
    return inputPiece;
}

function drawScreen(c, canvas) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    buildCanvas(c, canvas);
    drawUI(c);
    c.fillStyle = '#000000';
    c.fillRect(506, 0, 50, 1008);
    c.fillRect(556, 208, 308, 40);
    c.fillRect(556, 377, 308, 631);
    for (var i = 0; i < inputPiece.points.length; i++) {
        drawTile(c, inputPiece.points[i].x, inputPiece.points[i].y, inputPiece.points[i].meta.color);
    }
    for (var o = 0; o < bottomBlock.points.length; o++) {
        drawTile(c, bottomBlock.points[o].x, bottomBlock.points[o].y, bottomBlock.points[o].meta.color);
    }
}

function drawTile(c, x, y, color) {
    var xPos = (50 * x) + 5;
    var yPos = (50 * y) + 5;
    var colors = colorPick(color);
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(xPos, yPos);
    c.lineTo(xPos + 48, yPos);
    c.lineTo(xPos + 48, yPos + 48);
    c.lineTo(xPos, yPos + 48);
    c.closePath();
    c.stroke();

    c.fillStyle = colors[0];
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(xPos + 2, yPos);
    c.lineTo(xPos + 48, yPos);
    c.lineTo(xPos + 48, yPos + 48);
    c.lineTo(xPos + 2, yPos + 48);
    c.closePath();

    c.beginPath();
    c.moveTo(xPos + 9, yPos + 9);
    c.lineTo(xPos + 39, yPos + 9);
    c.lineTo(xPos + 39, yPos + 39);
    c.lineTo(xPos + 9, yPos + 39);
    c.closePath();
    c.fill();

    c.fillStyle = colors[1];
    c.beginPath();
    c.moveTo(xPos + 1, yPos + 1);
    c.lineTo(xPos + 9, yPos + 9);
    c.lineTo(xPos + 39, yPos + 9);
    c.lineTo(xPos + 47, yPos + 1);
    c.closePath();
    c.fill();

    //c.fillStyle = '#aaaaaa';
    c.beginPath();
    c.moveTo(xPos + 1, yPos + 1);
    c.lineTo(xPos + 9, yPos + 9);
    c.lineTo(xPos + 9, yPos + 39);
    c.lineTo(xPos + 1, yPos + 47);
    c.closePath();
    c.fill();

    c.fillStyle = colors[2];
    c.beginPath();
    c.moveTo(xPos + 1, yPos + 47);
    c.lineTo(xPos + 9, yPos + 39);
    c.lineTo(xPos + 39, yPos + 39);
    c.lineTo(xPos + 47, yPos + 47);
    c.closePath();
    c.fill();

    c.beginPath();
    c.moveTo(xPos + 47, yPos + 47);
    c.lineTo(xPos + 39, yPos + 39);
    c.lineTo(xPos + 39, yPos + 9);
    c.lineTo(xPos + 47, yPos + 1);
    c.closePath();
    c.fill();
}

function drawUI(c, canvas) {
    c.beginPath();
    //c.lineWidth = 4;
    c.fillStyle = '#ccffdd';
    c.moveTo(556, 2);
    c.lineTo(860, 2);
    c.lineTo(860, 206);
    c.lineTo(556, 206);
    c.closePath();
    c.fill();
    c.stroke();

    c.moveTo(556, 250);
    c.lineTo(860, 250);
    c.lineTo(860, 375);
    c.lineTo(556, 375);
    c.closePath();
    c.stroke();
    c.fillStyle = 'darkblue';
    c.font = '48px Arial';
    c.textAlign = 'center';
    c.fillText('Score:', 708, 300);
    c.fillText(score, 708, 350);

    nextPiece.points.forEach(function (Point) {
        drawTile(c, Point.x + 12, Point.y + 1, Point.meta.color);
    });
}

function drawNextTile(c, canvas, x, y) {

    if ((x <= 5) && (y <= 3)) {
        var xPos = (50 * x) + 560;
        var yPos = (50 * y) + 6;
        c.beginPath();
        c.moveTo(xPos, yPos);
        c.lineTo(xPos + 46, yPos);
        c.lineTo(xPos + 46, yPos + 46);
        c.lineTo(xPos, yPos + 46);
        c.closePath();
        c.stroke();
    } else {
        console.log('Call out of bounds to drawNextTile function');
    }
}