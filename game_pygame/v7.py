import sys, pygame
import random
FRAME_UPDATE_EVENT = pygame.USEREVENT+1

screen = None
RES_X = 800
RES_Y = 600

key_up = False
key_down = False
key_left = False
key_right = False

player = None
bullets = []
enemies = []
frameCount = 0

class Bullet(object):
    def __init__(self, x, y, vx, vy):
        self.x = x
        self.y = y
        self.vx = vx
        self.vy = vy
        self.isActive = True
        self.radius = 8

    def update(self):
        if not self.isActive: return
        
        self.x += self.vx
        self.y += self.vy

        if self.x > RES_X + self.radius or self.x < -self.radius or\
           self.y > RES_Y + self.radius or self.y < -self.radius:
           self.isActive = False

    def draw(self):
        if not self.isActive: return
        
        pygame.draw.circle(screen, (255,255,0), (self.x, self.y), self.radius)


    
class Player(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.width = 40
        self.height = 40
        self.speed = 6
        self.isActive = True
        
    def update(self):
        if not self.isActive: return
    
        vx = 0; vy = 0
        if (key_up): vy -= self.speed
        if (key_down): vy += self.speed
        if (key_left): vx -= self.speed
        if (key_right): vx += self.speed
        self.x += vx
        self.y += vy
    
    def draw(self):
        if not self.isActive: return
        
        pygame.draw.rect(screen, (0,0,255),
            (self.x-self.width//2, self.y-self.height//2, self.width, self.height))
            
    def shoot(self):
        if not self.isActive: return
        
        bullets.append(Bullet(self.x,self.y,20,0))
        

class Enemy(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.speed = 2.5
        self.radius = 60
        self.isActive = True
        
    def update(self):
        if not self.isActive: return
        
        vx = player.x - self.x
        vy = player.y - self.y
        magnitude = (vx*vx+vy*vy)**0.5
        if magnitude != 0:
            vx *= self.speed / magnitude
            vy *= self.speed / magnitude
        self.x += vx
        self.y += vy
        
    def bulletCollisionCheck(self, bullet):
        if not self.isActive or not bullet.isActive: return
        
        dx = self.x - bullet.x
        dy = self.y - bullet.y
        r = self.radius + bullet.radius
        if dx*dx+dy*dy <= r*r:
            self.isActive = False
            bullet.isActive = False
            
    def playerCollisionCheck(self, _player):
        if not self.isActive or not _player.isActive: return
        
        dx = self.x - _player.x
        dy = self.y - _player.y
        r = self.radius
        if dx*dx+dy*dy <= r*r:
            _player.isActive = False
        
    def draw(self):
        if not self.isActive: return
        
        pygame.draw.circle(screen, (255,0,0),
            (int(self.x), int(self.y)), self.radius)
        

def spawnEnemy():
    x = RES_X + 100
    y = random.randrange(0,RES_Y)
    enemies.append(Enemy(x,y))


def initialiseGame():
    global player, bullets, enemies, frameCount
    frameCount = 0
    player = Player(RES_X//2, RES_Y//2)
    bullets = []
    enemies = []


def update():
    global frameCount
    player.update()
    for bullet in bullets:
        bullet.update()
    for enemy in enemies:
        enemy.update()
        for bullet in bullets:
            enemy.bulletCollisionCheck(bullet)
        enemy.playerCollisionCheck(player)

    if frameCount % 40 == 0:
        spawnEnemy()
    frameCount += 1


def draw():
    player.draw()
    for bullet in bullets:
        bullet.draw()
    for enemy in enemies:
        enemy.draw()
    

def keyDown(key):
    global key_up, key_down, key_left, key_right
    if key == pygame.K_UP: key_up = True
    elif key == pygame.K_DOWN: key_down = True
    elif key == pygame.K_LEFT: key_left = True
    elif key == pygame.K_RIGHT: key_right = True
    elif key == pygame.K_z: player.shoot()
    elif key == pygame.K_r: initialiseGame()
    

def keyUp(key):
    global key_up, key_down, key_left, key_right
    if key == pygame.K_UP: key_up = False
    elif key == pygame.K_DOWN: key_down = False
    elif key == pygame.K_LEFT: key_left = False
    elif key == pygame.K_RIGHT: key_right = False

def processEvent(event):
    if event.type == FRAME_UPDATE_EVENT:
        update()
    if event.type == pygame.QUIT:
        sys.exit()
    elif event.type == pygame.KEYDOWN:
        keyDown(event.key)
    elif event.type == pygame.KEYUP:
        keyUp(event.key)


def main():
    pygame.init()
    global screen
    screen = pygame.display.set_mode((RES_X, RES_Y))
    
    frameTime = 1000//60 # in ms
    pygame.time.set_timer(FRAME_UPDATE_EVENT, frameTime)
    
    initialiseGame()
    while True:
        for event in pygame.event.get():
            processEvent(event)
        
        screen.fill((0,0,0))
        draw()
        pygame.display.flip()

if __name__ == '__main__':
    main()