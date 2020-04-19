let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play]
}

let game = new Phaser.Game(config);

game.settings = {
    spaceshipSpeed: 3,
    gameTImer: 60000
}

let keyF, keyLEFT, keyRIGHT;