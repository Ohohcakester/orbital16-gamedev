// Initialisation
var RES_X = 800;
var RES_Y = 600;
var fps = 60;

var mainCanvas = document.getElementById('mainCanvas');
var ctx = mainCanvas.getContext('2d');
mainCanvas.width = RES_X;
mainCanvas.height = RES_Y;
window.addEventListener('keydown', keyboardPress, false);
window.addEventListener('keyup', keyboardRelease, false);
var nextFrameTime = 0;
// Initialisation - END

var key_up = false;
var key_down = false;
var key_left = false;
var key_right = false;

function initialiseGame() {
}

function updateFrame() {
}

function drawFrame() {
}

function keyboardPress(e) {
    console.log('Pressed ' + e.keyCode);
    switch(e.keyCode) {
        case 38: key_up = true; break;
        case 40: key_down = true; break;
        case 37: key_left = true; break;
        case 39: key_right = true; break;
        default: return;
    }
    e.preventDefault();
}

function keyboardRelease(e) {
    switch(e.keyCode) {
        case 38: key_up = false; break;
        case 40: key_down = false; break;
        case 37: key_left = false; break;
        case 39: key_right = false; break;
        default: return;
    }
    e.preventDefault();
}

// This is called in an infinite while loop.
function gameLoop(time){
    if (time > nextFrameTime) {
        // Update Frame
        updateFrame();
        
        nextFrameTime += 1000/fps;
    }
    
    // Draw Frame
    clearScreen();
    drawFrame();
    
    window.requestAnimationFrame(gameLoop);
}

function main() {
    initialiseGame();
    gameLoop();
}