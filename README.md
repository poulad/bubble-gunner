# Bubble Gunner

A CreateJS game

## ToDo

### Animations

- When Bubble catches the animal, it swings as it goes up
- Control speed of fall(animal, lava) or rise(bubble)
- When a bubble containing an animal pops, animal should continue the fall with the same speed  

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