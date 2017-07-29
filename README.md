# Bubble Gunner

A CreateJS game

## Features

### Animations

- Dragon aims gun at the point user clicks/moves his mouse
- Bubbles always fire from gun muzzle 
- All tweens at the same speed(about 200 pixels per second)

### Scores

- Scores on top middle
  - Each animal rescued is +1 score
  - Player does not loose score
  - Shown as a bar that fills up and score number below it
  - When filled up, next level begins
  - In the final level(3), bar stays filled and only number increases 

### Obstacles

A piece of Lava is the only obstacle and it falls down the sky in levels higher than 1. They goe directly to the sea of lava on the ground. During the fall, if a piece of lava hits a bubble, bubble blows and lava continues the fall. If that bubble contained an animal, animal again falls down.

#### Level 1:

- No Lavas

#### Level 2:

- One piece of lava falls every 4 seconds

#### Level 3:

- two pieces of lava fall every 4 seconds 

## ToDo

### Object Scales

- Scale objects relative to the canvas size so proportions are consistent

### Scores

- Use proper font
- Center text to bar
- Bar should be a round rect with white stroke

### Power Ups

- A bubble bomb
  - Player gets bomb after each 10 rescues
  - Player cannot have more than one bomb at any time
  - Bomb could be blown when player clicks on dragon
  - Animals and lava come down again after a short pause
  - Bomb Rescues all animals visible on scene
  - All pieces of lava would be gone

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

### Performance

- Implement 2D Spacial Partitioning to find collisions
- Reuse animals that fall down to lava(instead of creating a new Animal each time)
