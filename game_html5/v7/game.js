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

var player;
var bullets = [];
var enemies = [];
var frameCount = 0;

var Bullet = function(x,y,vx,vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 8;
    this.isActive = true;
};

Bullet.prototype = {
    update: function() {
        if (!this.isActive) return;
        
        this.x += this.vx;
        this.y += this.vy;
    },
    
    draw: function() {
        if (!this.isActive) return;
        
        drawCircle(this.x, this.y, this.radius, '#ffff00');
    },
};

var Player = function(x,y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.speed = 6;
    this.isActive = true;
};

Player.prototype = {
    update: function() {
        if (!this.isActive) return;
    
        var vx = 0, vy = 0;
        if (key_up) vy -= this.speed;
        if (key_down) vy += this.speed;
        if (key_left) vx -= this.speed;
        if (key_right) vx += this.speed;
        this.x += vx;
        this.y += vy;
    },

    draw: function() {
        if (!this.isActive) return;
        
        drawRect(this.x - this.width/2, this.y - this.height/2,
                 this.width, this.height, '#0000ff');
    },
    
    shoot: function() {
        if (!this.isActive) return;
        
        bullets.push(new Bullet(this.x, this.y, 20, 0));
    },
};

var Enemy = function(x,y) {
    this.x = x;
    this.y = y;
    this.speed = 2.5;
    this.radius = 60;
    this.isActive = true;
};

Enemy.prototype = {
    update: function() {
        if (!this.isActive) return;
        
        var vx = player.x - this.x;
        var vy = player.y - this.y;
        var magnitude = Math.sqrt(vx*vx+vy*vy);
        if (magnitude != 0) {
            vx *= this.speed / magnitude;
            vy *= this.speed / magnitude;
        }
        this.x += vx;
        this.y += vy;
    },
    
    bulletCollisionCheck: function(bullet) {
        if (!this.isActive || !bullet.isActive) return;
        var dx = this.x - bullet.x;
        var dy = this.y - bullet.y;
        var r = this.radius + bullet.radius;
        if (dx*dx+dy*dy <= r*r) {
            this.isActive = false;
            bullet.isActive = false;
        }
    },
    
    playerCollisionCheck: function(_player) {
        if (!this.isActive || !_player.isActive) return;
        var dx = this.x - _player.x;
        var dy = this.y - _player.y;
        var r = this.radius;
        if (dx*dx+dy*dy <= r*r) {
            _player.isActive = false;
        }
    },
    
    draw: function() {
        if (!this.isActive) return;
        
        drawCircle(this.x, this.y, this.radius, '#ff0000');
    },
};

function spawnEnemy() {
    var x = RES_X + 100;
    var y = Math.random() * RES_Y;
    enemies.push(new Enemy(x, y));
}

function initialiseGame() {
    player = new Player(RES_X/2, RES_Y/2);
    bullets = [];
    enemies = [];
    frameCount = 0;
}

function updateFrame() {
    player.update();
    for (var i=0;i<bullets.length;++i) {
        bullets[i].update();
    }
    for (var i=0;i<enemies.length;++i) {
        enemies[i].update();
        
        for (var j=0;j<bullets.length;++j) {
            enemies[i].bulletCollisionCheck(bullets[j]);
        }
        enemies[i].playerCollisionCheck(player);
    }
    
    if (frameCount%30 === 0) {
        spawnEnemy();
    }
    ++frameCount;
}

function drawFrame(){
    player.draw();
    for (var i=0;i<bullets.length;++i) {
        bullets[i].draw();
    }
    for (var i=0;i<enemies.length;++i) {
        enemies[i].draw();
    }
}

function keyboardPress(e) {
    console.log('Pressed ' + e.keyCode);
    switch(e.keyCode) {
        case 38: key_up = true; break;
        case 40: key_down = true; break;
        case 37: key_left = true; break;
        case 39: key_right = true; break;
        case 90: player.shoot(); break;   // Z
        case 82: initialiseGame(); break; // R
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