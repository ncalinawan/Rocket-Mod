class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('specialship', './assets/specialship.png')
        this.load.image('starfield', './assets/starwave.png');
        //new tile sprite
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
      
        //Add music
        this.load.audio('bg_music', './assets/purrple-cat-wild-strawberry.wav');
        /*Wild Strawberry by Purrple Cat | https://purrplecat.com
        Music promoted by https://www.free-stock-music.com
        Creative Commons Attribution-ShareAlike 3.0 Unported
        https://creativecommons.org/licenses/by-sa/3.0/deed.en_US */
    }

    create() {
        this.bgSound = this.sound.add("bg_music");
        this.bgSound.play();
        // creates tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);

        // green UI background
        this.add.rectangle(37,42,566,64,0x00FF00).setOrigin(0.0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2-8, 431, 'rocket').setScale(0.5,0.5).setOrigin(0,0);
  
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0,0);
        
        //special ship
        this.specialship = new Specialship(this, game.config.width, 170, 'specialship', 0, 50).setOrigin(0,0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        this.p1Score = 0;
        this.highScore = 0;

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 1,
                bottom: 1,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        this.scoreRight = this.add.text(470, 54, 'HS:'  + this.highScore, scoreConfig);
       
        //Fire UI
        this.fireText = this.add.text(200, 54, 'FIRE', scoreConfig);
        this.fireText.visible = false;

        //Display time remaining by converting milliseconds to seconds
        this.timer = game.settings.gameTimer;
        this.timeRemaining = this.add.text(340, 54, this.msToSeconds(this.timer), scoreConfig);
    
        this.gameOver = false;

        //speed doubles after 30 seconds
        this.speedIncrease = this.time.delayedCall(30000, () => {
            game.settings.spaceshipSpeed = game.settings.spaceshipSpeed * 2;
            game.settings.specialSpeed = game.settings.specialSpeed * 2;
        }, null, this);
        

        // 60 second timer
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 +64, '(F)ire to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            this.bgSound.stop();
        }, null, this);

        
        }

    update() {
          
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)){
            this.scene.restart(this.p1Score);
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.scene.start("menuScene");
        }

        // makes starfield move
        this.starfield.tilePositionX -= 4;

        if(!this.gameOver){
            this.p1Rocket.update();
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.specialship.update();
        }

        //Fire UI
        if(this.p1Rocket.isFiring == true){
            this.fireText.visible = true;  
        } else{
            this.fireText.visible = false;
        } 

        this.timer -= 16.65;
        this.timeRemaining.text = this.msToSeconds(this.timer);
        if (this.timer <= 0){
            this.timer = 0;
        }  

        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.specialship)) {
            this.p1Rocket.reset();
            this.shipExplode(this.specialship);
        }
        
        //Tracks highscore
        this.scoreRight.text = 'HS:' + localStorage.getItem("highscore");
        {
            if (this.p1Score > localStorage.getItem("highscore")){ 
            localStorage.setItem("highscore", this.p1Score);
            }
        }
    }
    
    checkCollision(rocket, ship) {
        if(rocket.x < ship.x + ship.width &&
           rocket.x + rocket.width > ship.x &&
           rocket.y < ship.y + ship.height &&
           rocket.height + rocket.y > ship.y){
               return true;
           } else {
               return false;
           }
    }

    shipExplode(ship) {
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }

    //convert milliseconds to seconds
    msToSeconds (milliseconds){
        var seconds;
        seconds = milliseconds/1000;
        seconds = seconds % 60;
        return seconds;
    }
}