import numpy as np
import random
from enum import Enum
from collections import namedtuple
import numpy as np

# font = pygame.font.Font('snake/arial.ttf', 25)


class Direction(Enum):
    RIGHT = 1
    LEFT = 2
    UP = 3
    DOWN = 4


Point = namedtuple('Point', 'x, y')

# rgb colors
WHITE = (255, 255, 255)
RED = (200, 0, 0)
GREEN1 = (0, 255, 0)
GREEN2 = (0, 255, 100)
BLACK = (0, 0, 0)

BLOCK_SIZE: int = 20
SPEED: int = 40


class SnakeGameAI:

    def __init__(self, w=640, h=480):
        self.w = w
        self.h = h
        self.frames_list = []
        self.reset()

    def reset(self):
        # init game state
        self.direction = Direction.RIGHT

        self.head = Point(int(self.w//2), int(self.h//2))
        self.snake = [self.head,
                      Point(self.head.x-BLOCK_SIZE, self.head.y),
                      Point(self.head.x-(2*BLOCK_SIZE), self.head.y)]

        self.score = 0
        self.food = None
        self._place_food()
        self.frames_list = []
        self.frame_iteration = 0

    def _place_food(self):
        x = random.randint(0, (self.w-BLOCK_SIZE)//BLOCK_SIZE)*BLOCK_SIZE
        y = random.randint(0, (self.h-BLOCK_SIZE)//BLOCK_SIZE)*BLOCK_SIZE
        self.food = Point(int(x), int(y))
        if self.food in self.snake:
            self._place_food()

    def get_frames(self):
        return self.frames_list

    def play_step(self, action):
        self.frame_iteration += 1

        # 2. move
        self._move(action)  # update the head
        self.snake.insert(0, self.head)

        # 3. check if game over
        reward = 0
        game_over = False
        if self.is_collision() or self.frame_iteration > 100*len(self.snake):
            game_over = True
            reward = -10
            return reward, game_over, self.score

        # 4. place new food or just move
        if self.head == self.food:
            self.score += 1
            reward = 10
            self._place_food()
        else:
            self.snake.pop()

        # 5. update ui and clock
        self._update_ui()
        # 6. return game over and score
        return reward, game_over, self.score

    def is_collision(self, pt=None):
        if pt is None:
            pt = self.head
        # hits boundary
        if pt.x > self.w - BLOCK_SIZE or pt.x < 0 or pt.y > self.h - BLOCK_SIZE or pt.y < 0:
            return True
        # hits itself
        if pt in self.snake[1:]:
            return True

        return False

    def _update_ui(self):
        # create new frame using numpy
        # by default the frame is black
        img = np.zeros((self.h, self.w, 3),
                       dtype=np.uint8)  # RGB color

        # draw snake
        for pt in self.snake:
            draw_rectangle(img, (pt.x, pt.y),
                           (pt.x+BLOCK_SIZE, pt.y+BLOCK_SIZE), GREEN1, -1)
            draw_rectangle(img, (pt.x+4, pt.y+4),
                           (pt.x+BLOCK_SIZE-4, pt.y+BLOCK_SIZE-4), GREEN2, -1)

        # draw food
        draw_rectangle(img, (self.food.x, self.food.y),
                       (self.food.x+BLOCK_SIZE, self.food.y+BLOCK_SIZE), RED, -1)

        # draw score
        text = "Score: " + str(self.score)
        # cv2.putText(img=img, text=text, org=(
        #     3, 30), fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=1, color=WHITE, thickness=2)
        # add frame to list of frames
        self.frames_list.append(img)

    def _move(self, action):
        # [straight, right, left]

        clock_wise = [Direction.RIGHT, Direction.DOWN,
                      Direction.LEFT, Direction.UP]
        idx = clock_wise.index(self.direction)

        if np.array_equal(action, [1, 0, 0]):
            new_dir = clock_wise[idx]  # no change
        elif np.array_equal(action, [0, 1, 0]):
            next_idx = (idx + 1) % 4
            new_dir = clock_wise[next_idx]  # right turn r -> d -> l -> u
        else:  # [0, 0, 1]
            next_idx = (idx - 1) % 4
            new_dir = clock_wise[next_idx]  # left turn r -> u -> l -> d

        self.direction = new_dir

        x = self.head.x
        y = self.head.y
        if self.direction == Direction.RIGHT:
            x += BLOCK_SIZE
        elif self.direction == Direction.LEFT:
            x -= BLOCK_SIZE
        elif self.direction == Direction.DOWN:
            y += BLOCK_SIZE
        elif self.direction == Direction.UP:
            y -= BLOCK_SIZE

        self.head = Point(int(x), int(y))


def draw_rectangle(img, pt1, pt2, color, dummy):
    # draw rectangle on image without using opencv
    # pt1: top left point
    # pt2: bottom right point
    # color: rgb tuple
    # fill rectangle
    for i in range(pt1[1], pt2[1]):
        for j in range(pt1[0], pt2[0]):
            img[i][j] = color
