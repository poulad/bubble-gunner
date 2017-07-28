# Bubble Gunner

A CreateJS game

## Features

### Animations

- All tweens at the same speed(about 200 pixels per second)

## ToDo

### Scores

- Scores on top middle
  - Each animal rescued is +1 score
  - Player does not loose score
  - Shown as a bar that fills up and score number below it
  - When filled up, next level begins 

### Power Ups

- A bubble bomb

### Scenes

- Menu
  - Might be used on gamePause as well(a button for resume or new game should be shown)
- Controls
- Game
- GameOver
  - shows score
  - a button to start new game
  - a button to get back to Menu
  
### Spritesheets

- Add spritesheets

### Animations

- When Bubble catches the animal, it swings as it goes up
- When a bubble containing an animal pops, animal should continue the fall with the same speed  
- Fancy loading... image

### Obstacles

A piece of Lava is the only obstacle and it falls down the sky in levels higher than 1. It goes directly to the sea of lava on the ground. During its fall, if a piece of lava hits a bubble, bubble blows and lava continues its fall. If that bubble contained an animal, animal again falls down.

#### Level 1:

- No Lava

#### Level 2:

- One lava falls every 4 seconds

#### Level 3:

- two lavas fall every 4 seconds 

### Performance

- Implement 2D Spacial Partitioning to find collisions
- Reuse animals that fall down to lava(instead of creating a new Animal each time)
