/* Noel Calinawan
   CMPM 120
   Track a high score that persists across scenes and display it in the UI (10)
   Implement the 'FIRE' UI text from the original game (10)
   Add your own (copyright-free) background music to the Play scene (10)
   Implement the speed increase that happens after 30 seconds in the original game (10)
   Create a new scrolling tile sprite for the background (10)
   Allow the player to control the Rocket after it's fired (10)
   Display the time remaining (in seconds) on the screen (15)
   Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (25)
*/
   let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play]
}

let game = new Phaser.Game(config);

game.settings = {
    spaceshipSpeed: 3,
    specialSpeed: 5,
    gameTimer: 60000
}

let keyF, keyLEFT, keyRIGHT;