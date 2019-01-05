var mainState = {
    preload: function(){
        game.load.image('ship', '/assets/landerB.png');
        game.load.image('death', '/assets/rocktile.png');
        game.load.image('landing', '/assets/landingtile.png');
        game.load.image('back', '/assets/back.png');
		game.load.image('fuelBar', '/assets/fuelBar.png');
		game.load.image('bonusMet','/assets/bonusMeter.png');
		game.load.image('bonusMark','/assets/bonusMark.png');
    },
    create: function(){
        game.add.sprite(0,0,'back');
		game.world.setBounds(0, 0, 800, 490);
        this.ship = game.add.sprite(50,50,'ship');	//The ship now exists!
		game.physics.startSystem(Phaser.Physics.ARCADE); 					//Physics now exists in this world!
        game.physics.arcade.enable(this.ship); 								//The ship sprite has actual physics!
		this.ship.body.collideWorldBounds = true;
        this.terrain = game.add.group();
		this.landings = game.add.group();
        var terrainMap = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
						  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
                          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
                          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
                          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1],
                          [1,1,1,1,0,0,0,0,0,0,0,1,2,3,0,1,0,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1],
                          [1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1],//125 Pixels
                          [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1],
                          [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1],
                          [1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1],
						  [1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1],
						  [1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
                          [1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
                          [1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],
                          [1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                          [1,1,1,2,4,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
                          [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],//400 Pixels
                          [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
                          [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
                          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,5,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],//475 Pixels
                          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
						 ]; 												//Double array used for generated the terrain tile by tile.
		game.add.sprite(760, 94, 'bonusMet');
		this.bonusMark = game.add.sprite(760, 240, 'bonusMark');
		game.physics.arcade.enable(this.bonusMark);
        for(axisY = 0, corY = 0; axisY < terrainMap.length; axisY++, corY = corY+25){
            for(axisX = 0, corX = 0; axisX < terrainMap[axisY].length; axisX++, corX = corX+25){
                if(terrainMap[axisY][axisX] == 1){
                    var deathTile = game.add.sprite(corX,corY,'death');
                    this.terrain.add(deathTile);
                    game.physics.arcade.enable(deathTile);
                    deathTile.body.immovable = true;//The terrain DOES NOT MOVE.
				}
				if(terrainMap[axisY][axisX] == 2){
					var landTile = game.add.sprite(corX, corY, 'landing');
					this.landings.add(landTile);
					game.physics.arcade.enable(landTile);
					landTile.body.immovable = true;
					landTile.health = Math.floor((Math.random() * 10) + 2);
				}
				if(terrainMap[axisY][axisX] == 3){
					game.add.text(corX, corY, 'x2', { font: "12px Arial", fill: "#FFFFFF" });
				}
				if(terrainMap[axisY][axisX] == 4){
					game.add.text(corX, corY, 'x5', { font: "12px Arial", fill: "#FFFFFF" });
				}
				if(terrainMap[axisY][axisX] == 5){
					game.add.text(corX, corY, 'x10', { font: "12px Arial", fill: "#FFFFFF" });
				}
            }
        }//Actual generation of the terrain,
        this.ship.body.gravity.y = 10;  									//Gravity of the ship itself.
		up = game.input.keyboard.addKey(Phaser.Keyboard.S);
		left = game.input.keyboard.addKey(Phaser.Keyboard.D);
		right = game.input.keyboard.addKey(Phaser.Keyboard.A);
		
		this.fuel = 1000;
		this.labelFuel = game.add.text(25, 460, this.fuel + '☢', { font: "20px Arial", fill: "#FFFFFF" });
		
		this.score = 0;
		this.scoreLabel = game.add.text(650, 460, 'Score: ' + this.score, { font: "20px Arial", fill: "#FFFFFF" });
		
		this.highscore = 0;
		this.highLabel = game.add.text(650, 435, 'HIGH: ' + this.highscore, { font: "20px Arial", fill: "#FFFFFF" });
		
		this.xVelLabel = game.add.text(125, 460, 'xVel: ' + this.ship.body.velocity.x, { font: "20px Arial", fill: "#FFFFFF" });
		this.yVelLabel = game.add.text(525, 460, 'yVel: ' + this.ship.body.velocity.y, { font: "20px Arial", fill: "#FFFFFF" });
		this.isLanded = false;
		this.isReset = false;
		this.controlsOn = true;
		
		this.endText = game.add.text(50, 25, '', { font: "50px Arial", fill: "#FF0711" });
		this.infoText = game.add.text(200, 25, '', { font: "30px Arial", fill: "#6070F7" });
		this.yVelTrack = 0;
    },
    update: function(){
        game.physics.arcade.collide(this.ship, this.terrain, this.deathShip, null, this); //Collision with terrain.
		game.physics.arcade.collide(this.ship, this.landings, this.landShip, null, this);
		if(up.isDown && this.fuel > 0 && this.controlsOn){
			this.ship.body.velocity.y -= 0.4;
			this.fuel -= 1;
		}
		if(left.isDown && this.fuel > 0 && this.controlsOn){
			this.ship.body.velocity.x -= 0.2;
			this.fuel -= 1;
		}
		if(right.isDown && this.fuel > 0 && this.controlsOn){
			this.ship.body.velocity.x += 0.2;
			this.fuel -= 1;
		}
		if(this.fuel > 0){
			this.labelFuel.text = this.fuel + '☢';
		}else if(this.fuel <= 0 && this.labelFuel.text != "No Fuel!"){
			this.labelFuel.text = "No Fuel!";
		}
		this.xVelLabel.text = 'xVel: ' + Math.floor(this.ship.body.velocity.x);
		this.yVelLabel.text = 'yVel: ' + Math.floor(this.ship.body.velocity.y);
		this.yVelTrack = this.ship.body.velocity.y;
		if(this.yVelTrack < 150 && this.yVelTrack > -150){	
			this.bonusMark.body.y = 245 + this.yVelTrack;
    	}else if(this.yVelTrack > 150){
			this.bonusMark.body.y = 95;
		}else if(this.yVelTrack < -150){
			this.bonusMark.body.y = 395;
		}
		console.log(this.ship.body.velocity);
	},
	landShip: function(){
		if(((this.yVelTrack >= -15) && (this.yVelTrack <= 15)) && ((this.ship.body.velocity.x >= -15) && (this.ship.body.velocity.x <= 15))){
			if(!this.isLanded){
				if(this.ship.body.y < 125){
					this.fuel *= 2;
				}else if(this.ship.body.y > 125 && this.ship.body.y < 400){
					this.fuel *= 5;

				}else if(this.ship.body.y > 400){
					this.fuel *= 10;
				}
				this.labelFuel.text = this.fuel + '☢';
				this.score = (this.score + this.fuel);
				this.scoreLabel.text = 'Score: ' + this.score;
				this.isLanded = true;
				this.ship.body.velocity.x = 0;
				this.ship.body.velocity.y = 0;
				this.controlsOn = false;
				this.ship.kill();
				game.time.events.add(Phaser.Timer.SECOND * 5, this.resetRound, this);
				this.infoText.fill = "#6070F7";
				this.infoText.text = 'Yay! You landed! :D';
			}
		}else{
			this.infoText.fill = "#FF0711";
			this.deathShip();
			if(this.fuel>0){
				this.infoText.text = "You landed too hard. :(";
			}
		}
	},
	deathShip: function(){
		this.controlsOn = false;
		this.fuel = Math.floor(this.fuel/2);
		if(this.fuel <= 0){
			this.gameOver();
		}else{
			this.ship.kill();
			game.time.events.add(Phaser.Timer.SECOND * 5, this.resetRound, this);
		}
	},
	resetRound: function(){
		this.ship = game.add.sprite(50,50,'ship');
		game.physics.arcade.enable(this.ship); 
		this.controlsOn = true;
		this.isLanded = false;
		this.ship.body.collideWorldBounds = true;
		this.ship.body.gravity.y = 10;
		this.infoText.fill = "#6070F7";
		this.infoText.text = '';
	},
	gameOver: function(){
		this.endText.text = "GAME OVER";
		this.ship.kill();
		if(this.score > this.highscore){
		   this.highscore = this.score;
			this.highLabel.text = 'HIGH: ' + this.highscore;
		}
		this.score = 0;
		this.scoreLabel.text = 'Score: ' + this.score;
		game.time.events.add(Phaser.Timer.SECOND * 5, this.restartGame, this);
	},
	restartGame: function(){
		this.endText.text = "";
		this.ship = game.add.sprite(50,50,'ship');
		game.physics.arcade.enable(this.ship); 
		this.controlsOn = true;
		this.isLanded = false;
		this.ship.body.collideWorldBounds = true;
		this.ship.body.gravity.y = 10;
		this.fuel = 1000;
	},
}
																			// Start Phaser, set the game size.
var game = new Phaser.Game(800, 490);

																			// There's a mainstate called "main".
game.state.add('main', mainState); 

																			//Let's make sure the game actually starts.
game.state.start('main');