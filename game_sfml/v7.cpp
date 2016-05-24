#include <SFML/Graphics.hpp>
#include <iostream>

/// Globals
sf::RenderWindow* window;
int RES_X = 800;
int RES_Y = 600;

bool key_up = false;
bool key_down = false;
bool key_left = false;
bool key_right = false;

class Player;
class Bullet;
class Enemy;
Player* player;
std::vector<Bullet> bullets;
std::vector<Enemy> enemies;
unsigned long long frameCount;


class Bullet {
public:
    int radius = 8;
    bool isActive = true;
    int vx, vy;
    int x, y;

    Bullet(int x, int y, int vx, int vy): x(x),y(y),vx(vx),vy(vy) {}

    void update() {
        if (!isActive) return;

        x += vx;
        y += vy;
        if (x >= RES_X + radius || x < -radius ||
            y >= RES_Y + radius || y < -radius) isActive = false;
    }

    void draw() {
        if (!isActive) return;

        sf::CircleShape shape;
        shape.setFillColor(sf::Color::Yellow);
        shape.setRadius(radius);
        shape.setOrigin(radius,radius);
        shape.setPosition(x,y);
        window->draw(shape);
    }
};

class Player {
public:
    bool isActive = true;
    int width = 40, height = 40;
    int speed = 6;
    int x, y;

    Player(int x, int y): x(x), y(y) {}

    void update() {
        if (!isActive) return;
        
        int vx = 0, vy = 0;
        if (key_up) vy -= speed;
        if (key_down) vy += speed;
        if (key_left) vx -= speed;
        if (key_right) vx += speed;
        x += vx;
        y += vy;
    }

    void draw() {
        if (!isActive) return;
        
        sf::RectangleShape shape;
        shape.setFillColor(sf::Color::Blue);
        shape.setSize(sf::Vector2f(width, height));
        shape.setOrigin(width/2, height/2);
        shape.setPosition(x, y);
        window->draw(shape);
    }
    
    void shoot() {
        if (!isActive) return;
        
        bullets.push_back(Bullet(x,y,20,0));
    }
};


class Enemy {
public:
    float speed = 2.5f;
    const int radius = 60;
    bool isActive = true;
    float x, y;

    Enemy(int x, int y): x(x), y(y) {}

    void update() {
        if (!isActive) return;

        float vx = player->x - x;
        float vy = player->y - y;
        float magnitude = sqrt(vx*vx+vy*vy);
        if (magnitude != 0) {
            vx *= speed / magnitude;
            vy *= speed / magnitude;
        }
        x += vx;
        y += vy;
    }

    void collisionCheck(Bullet& bullet) {
        if (!isActive || !bullet.isActive) return;

        int dx = x - bullet.x;
        int dy = y - bullet.y;
        int r = radius + bullet.radius;
        if (dx*dx+dy*dy <= r*r) {
            isActive = false;
            bullet.isActive = false;
        }
    }

    void collisionCheck(Player* _player) {
        if (!isActive || !_player->isActive) return;

        int dx = x - _player->x;
        int dy = y - _player->y;
        int r = radius;
        if (dx*dx+dy*dy <= r*r) {
            _player->isActive = false;
        }
    }

    void draw() {
        if (!isActive) return;

        sf::CircleShape shape;
        shape.setFillColor(sf::Color::Red);
        shape.setRadius(radius);
        shape.setOrigin(radius,radius);
        shape.setPosition(x,y);
        window->draw(shape);
    }
};

void spawnEnemy() {
    int x = RES_X + 100;
    int y = rand()%RES_Y;
    enemies.push_back(Enemy(x,y));
}


void initialiseGame() {
    player = new Player(RES_X/2, RES_Y/2);
    bullets.clear();
    enemies.clear();
    frameCount = 0;
}

void updateGame() {
    player->update();
    for (int i=0;i<bullets.size();++i) {
        bullets[i].update();
    }
    for (int i=0;i<enemies.size();++i) {
        enemies[i].update();
    }
    
    if (frameCount%30 == 0) {
        spawnEnemy();
    }
    ++frameCount;
}

void drawGameFrame() {
    player->draw();
    for (int i=0;i<bullets.size();++i) {
        bullets[i].draw();
    }
    for (int i=0;i<enemies.size();++i) {
        enemies[i].draw();
        
        for (int j=0;j<bullets.size();++j) {
            enemies[i].collisionCheck(bullets[j]);
        }
        enemies[i].collisionCheck(player);
    }
}

void keyDown(sf::Keyboard::Key keyCode) {
    switch(keyCode) {
        case sf::Keyboard::Up: key_up = true; break;
        case sf::Keyboard::Down: key_down = true; break;
        case sf::Keyboard::Left: key_left = true; break;
        case sf::Keyboard::Right: key_right = true; break;
        case sf::Keyboard::Z: {
            player->shoot();
            break;
        }
        case sf::Keyboard::R: {
            initialiseGame();
            break;
        }
    }
}

void keyUp(sf::Keyboard::Key keyCode) {
    switch(keyCode) {
        case sf::Keyboard::Up: key_up = false; break;
        case sf::Keyboard::Down: key_down = false; break;
        case sf::Keyboard::Left: key_left = false; break;
        case sf::Keyboard::Right: key_right = false; break;
    }
}

void processEvent(sf::Event& event) {
    switch(event.type) {
        case sf::Event::Closed: {
            window->close();
            break;
        }
        case sf::Event::KeyPressed: {
            keyDown(event.key.code);
            break;
        }
        case sf::Event::KeyReleased: {
            keyUp(event.key.code);
            break;
        }
    }
}

int main() {
    window = new sf::RenderWindow(sf::VideoMode(RES_X, RES_Y), "Awesome Game");

    sf::Clock clock;
    float frameTime = 1/60.0f;
    float dTime = 0;

    initialiseGame();

    while (window->isOpen()) {
        dTime += clock.getElapsedTime().asSeconds();
        clock.restart();

        // Event handling
        sf::Event event;
        while(window->pollEvent(event)) {
            processEvent(event);
        }

        // Safeguard (slowdown) to prevent game from lagging to death
        if (dTime > 5*frameTime) dTime = 5*frameTime;

        // Update game
        while (dTime > frameTime) {
            dTime -= frameTime;
            updateGame();
        }

        // Draw frame
        window->clear();
        drawGameFrame();
        window->display();
    }

    delete window;
    delete player;
    return 0;
}