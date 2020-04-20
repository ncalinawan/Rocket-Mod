//new spaceship that is smaller, moves faster, and is worth more points
class Specialship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
    }

    update() {
        // moves spaceship left
        this.x += game.settings.specialSpeed;
        // wraparound from left to right edge
        if(this.x >= game.config.width) {
            this.x = 0;
        }
    
    }
    reset() {
        this.x = 0;
    }
}