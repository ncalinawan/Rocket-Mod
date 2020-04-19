class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
    }

    update() {
        // moves spaceship left
        this.x -= game.settings.spaceshipSpeed;
        // wraparound from left to right edge
        if(this.x <= 0-this.width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width;
    }
}