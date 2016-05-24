import sys, pygame
FRAME_UPDATE_EVENT = pygame.USEREVENT+1

screen = None
RES_X = 800
RES_Y = 600

key_up = False
key_down = False
key_left = False
key_right = False

def initialiseGame():
    pass

def update():
    pass

def draw():
    pass
    

def keyDown(key):
    global key_up, key_down, key_left, key_right
    if key == pygame.K_UP: key_up = True
    elif key == pygame.K_DOWN: key_down = True
    elif key == pygame.K_LEFT: key_left = True
    elif key == pygame.K_RIGHT: key_right = True
    

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