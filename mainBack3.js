var mainState = {
    preload: function(){
        game.load.spritesheet('ship', '/assets/landerFull.png', 38, 37, 15);
        game.load.image('death', '/assets/rocktile.png');
        game.load.image('landing', '/assets/landingtile.png');
        game.load.image('back', '/assets/back.png');
		game.load.spritesheet('fuelBar', '/assets/fuelBar.png', 200, 20, 100);
		game.load.image('bonusMet','/assets/bonusMeter.png');
		game.load.spritesheet('bonusMark','/assets/bonusMark.png',22, 9, 2);
    },
    create: function(){
        game.add.sprite(0,0,'back');
		game.world.setBounds(0, 0, 800, 490);
        this.ship = game.add.sprite(50,50,'ship');	//The ship now exists!
		this.ship.animations.add('explode', [8,9,10,11,12,13, 14],1,false);
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
		this.bonusMark = game.add.sprite(759, 240, 'bonusMark');
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
					var landTile = game.add.sprite(corX, corY, 'landing'); //While inspecting the terrain generation array, 2 marks where landing tiles go.
					this.landings.add(landTile);
					game.physics.arcade.enable(landTile);
					landTile.body.immovable = true;
					landTile.health = Math.floor((Math.random() * 10) + 2);
				}
				if(terrainMap[axisY][axisX] == 3){
					game.add.text(corX, corY, 'x2', { font: "12px Arial", fill: "#FFFFFF" }); //3 marks where the x2 multiplier text goes.
				}
				if(terrainMap[axisY][axisX] == 4){
					game.add.text(corX, corY, 'x5', { font: "12px Arial", fill: "#FFFFFF" }); //4 marks where the x5 multiplier text goes.
				}
				if(terrainMap[axisY][axisX] == 5){
					game.add.text(corX, corY, 'x10', { font: "12px Arial", fill: "#FFFFFF" });//5 marks where the x5 multiplier text goes.
				}
            }
        }//Actual generation of the terrain,
        this.ship.body.gravity.y = 10;  									//Gravity of the ship itself.
		up = game.input.keyboard.addKey(Phaser.Keyboard.S);					//Adding controls for the ship.
		left = game.input.keyboard.addKey(Phaser.Keyboard.D);
		right = game.input.keyboard.addKey(Phaser.Keyboard.A);
		
		this.fuelBar = game.add.sprite(25, 460, 'fuelBar');
		this.fuel = 1000; //Starting fuel
		this.labelFuel = game.add.text(25, 460, this.fuel + '☢', { font: "20px Arial", fill: "#FFFFFF" }); //The visual for remaining fuel.
		this.fuelBar.frame = Math.floor(((this.fuel/2000)*100));
		
		this.score = 0; //Your score!
		this.scoreLabel = game.add.text(650, 460, 'Score: ' + this.score, { font: "20px Arial", fill: "#FFFFFF" }); //Visual keeping track of the score
		
		this.highscore = 0; //Your highscore!
		this.highLabel = game.add.text(650, 435, 'HIGH: ' + this.highscore, { font: "20px Arial", fill: "#FFFFFF" }); //Visual for highscore!
		
		//this.xVelLabel = game.add.text(125, 460, 'xVel: ' + this.ship.body.velocity.x, { font: "20px Arial", fill: "#FFFFFF" }); //X Velocity tracking label
		//this.yVelLabel = game.add.text(525, 460, 'yVel: ' + this.ship.body.velocity.y, { font: "20px Arial", fill: "#FFFFFF" }); //Y Velocity tracking label
		this.isLanded = false; //Has the ship landed?
		this.controlsOn = true; //Can the player control the ship?
		
		this.endText = game.add.text(50, 25, '', { font: "50px Arial", fill: "#FF0711" }); //Game over text placeholder
		this.infoText = game.add.text(200, 25, '', { font: "30px Arial", fill: "#6070F7" }); //Information text placeholder
		this.yVelTrack = 0; //Tracks the Y Velocity to use when checking how hard the ship landed.
    },
    update: function(){
        game.physics.arcade.collide(this.ship, this.terrain, this.deathShip, null, this); //Collision with terrain.
		game.physics.arcade.collide(this.ship, this.landings, this.landShip, null, this); //Collision with the landing tiles.
		if(up.isDown && left.isDown && right.isDown && this.fuel > 0 && this.controlsOn){ //All three control keys are down.
			this.ship.body.velocity.y -= 0.4;
			this.ship.body.velocity.x -= 0.2;
			this.ship.body.velocity.x += 0.2;
			this.fuel -= 3;
			this.ship.frame = 5;
		}else if(right.isDown && left.isDown && this.fuel > 0 && this.controlsOn){ //A and D are down
			this.ship.body.velocity.x -= 0.2;
			this.ship.body.velocity.x += 0.2;
			this.fuel -= 2;
			this.ship.frame = 7;
		}else if(right.isDown && up.isDown && this.fuel > 0 && this.controlsOn){ //A and S are down
			this.ship.body.velocity.y -= 0.4;
			this.ship.body.velocity.x += 0.2;
			this.fuel -= 2;
			this.ship.frame = 4;
		}else if(up.isDown && left.isDown && this.fuel > 0 && this.controlsOn){ //D and S are down
			this.ship.body.velocity.y -= 0.4;
			this.ship.body.velocity.x -= 0.2;
			this.fuel -= 2;
			this.ship.frame = 6;
		}else if(up.isDown && this.fuel > 0 && this.controlsOn){ //S is down
			this.ship.body.velocity.y -= 0.4;
			this.fuel -= 1;
			this.ship.frame = 1;
		}else if(left.isDown && this.fuel > 0 && this.controlsOn){ //D is down
			this.ship.body.velocity.x -= 0.2;
			this.fuel -= 1;
			this.ship.frame = 3;
		}else if(right.isDown && this.fuel > 0 && this.controlsOn){ //A is down
			this.ship.body.velocity.x += 0.2;
			this.fuel -= 1;
			this.ship.frame = 2;
		}else{
			this.ship.frame = 0; //Idle frame
		}
		if(this.fuel > 0){ //Changes fuel remaining counter to "No Fuel" if none remain!
			this.labelFuel.text = this.fuel + '☢';
		}else if(this.fuel <= 0 && this.labelFuel.text != "No Fuel!"){
			this.labelFuel.text = "No Fuel!";
		}
		//this.xVelLabel.text = 'xVel: ' + Math.floor(this.ship.body.velocity.x); //X & Y velocity trackers are updated each frame.
		//this.yVelLabel.text = 'yVel: ' + Math.floor(this.ship.body.velocity.y);
		this.yVelTrack = this.ship.body.velocity.y;
		if(this.ship.body.velocity.x <= 15 &&  this.ship.body.velocity.x >= -15){
			this.bonusMark.frame = 1;
		}else{
			this.bonusMark.frame = 0;
		}
		if(this.yVelTrack < 150 && this.yVelTrack > -150){	
			this.bonusMark.body.y = 245 + this.yVelTrack;
    	}else if(this.yVelTrack > 150){
			this.bonusMark.body.y = 95;
		}else if(this.yVelTrack < -150){
			this.bonusMark.body.y = 395;
		}
		if(this.fuel <=2000 && this.fuel > 0){
			this.fuelBar.frame = Math.floor(((this.fuel/2000)*100));
		}else if(this.fuel > 2000){
			this.fuelBar.frame = 99;
		}
	},
	landShip: function(){ //Function that is run when the ship lands.
		if(((this.yVelTrack <= 15) && (this.yVelTrack >= 0)) && ((this.ship.body.velocity.x >= -15) && (this.ship.body.velocity.x <= 15))){
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
		}else if((((this.yVelTrack < 0) && (this.yVelTrack >= -10))) || ((this.yVelTrack > 15) && (this.yVelTrack <= 25)) && ((this.ship.body.velocity.x >= -15) && (this.ship.body.velocity.x <= 15))){
				this.isLanded = true;
				this.ship.body.velocity.x = 0;
				this.ship.body.velocity.y = 0;
				this.controlsOn = false;
				this.ship.kill();
				game.time.events.add(Phaser.Timer.SECOND * 5, this.resetRound, this);
				this.infoText.fill = "#6070F7";
				this.infoText.text = 'You landed, but no bonus. :I';
		}else{
			this.infoText.fill = "#FF0711";
			this.deathShip();
			if(this.fuel>0){
				this.infoText.text = "You landed too hard. :(";
			}
		}
	},
	deathShip: function(){
		this.ship.frame = 12;
		this.ship.animations.play("explode");
		if(this.infoText.text != "You landed too hard. :(" && this.fuel>0){
			this.infoText.fill = "#FF0711";
			this.infoText.text = "You crashed! D:";
		}
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