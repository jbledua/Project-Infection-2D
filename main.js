let mainGameObj;
function startGame() {
    var canvas = document.getElementById('gameSurface');
    var gl = canvas.getContext('webgl');

    // Create Game Object
    mainGameObj = new Game(canvas, gl);

    // Start Gamess
    mainGameObj.start();

    window.requestAnimationFrame(g_frameEventHndlr);

    canvas.onmousedown = function (e, _canvas) {
        scaledY = scaleInRange(e.clientY, 0, canvas.height, -1, 1);
        scaledX = scaleInRange((canvas.width - e.clientX), 0, canvas.width, -1, 1)

        g_clickEventHndlr(scaledX, scaledY);
    };
}

function scaleInRange(_x, _minIn, _maxIn, _minOut, _maxOut) {
    return Math.round((((_maxIn - _minIn) / (_maxOut - _minOut)) - _x) * (_maxOut - _minOut) / (_maxIn - _minIn) * 100) / 100
}

function collision(bact1, bact2) {
    var xDist = bact2.getX() - bact1.getX();
    var yDist = bact2.getY() - bact1.getY();
    var rad = bact1.getRadius() + bact2.getRadius();

    var totalDist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

    if ((totalDist - rad) < 0) {
        return true;
    }

    return false;
}

//---------------------------------------------------------
// Frame
//---------------------------------------------------------

function g_frameEventHndlr() 
{
    mainGameObj.update();
    window.requestAnimationFrame(g_frameEventHndlr);
}

//---------------------------------------------------------
// Click
//---------------------------------------------------------
function g_clickEventHndlr(_x, _y) {
    var tempArr = mainGameObj.getBactArr()
    for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].clicked(_x, _y) == true) {
            mainGameObj.gainScore();
            mainGameObj.destroy(i)
        }
    }
}
