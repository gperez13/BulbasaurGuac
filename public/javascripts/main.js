

let player;
let controls = {};
let playerSpeed = 150;
let map;
let layer;
let enemy;
let shootTime = 0;
let bullets;
let fireButton;
let mewtwo;
let cursors;
let score = 0;
let scoreString = '';
let scoreText;
let pokeballs;
let psychic;
let firingTimer = 0;
let enemybullet
let wildPokemon = [];
let pokeCenter = '';
let nurseJoy;
let squish;
let moltres;



EnemyMewtwo = function(){

	for (let y = 0; y <4; y++){
		for(let x = 0; x < 7; x++){
			let enemy = mewtwo.create(x * 70, y * 40, 'mewtwo');
			mewtwo.callAll('scale.setTo', 'scale', .5, .5);

		}
	}

	mewtwo.x = 100;
	mewtwo.y = 50;

	let tween = game.add.tween(mewtwo).to({x:200},2000,Phaser.Easing.Linear.None,true,0,1000,true)
	tween.onLoop.add(descend,this);
}






function descend(){
	enemies +=10;
}








function collisionHandler(bullet, enemies){
	bullet.kill();
	enemies.kill();
	score += 10;
	scoreText.text = scoreString + score;
	if(mewtwo.countLiving() === 0){
		score += 1000;
		scoreText.text = scoreString + score;
		pokeCenter = 'Mewtwo is defeated!! \n Do it again?';
		nurseJoy = this.add.text(150, 150, pokeCenter, {font: '34px Arial', fill: 'white', backgroundColor: 'black', wordWrap: 'true', wordWrapWidth: 550});
		game.input.onTap.addOnce(gameRestart, this);
	}

}







function createMoltres(){
	moltres = game.add.sprite(100, 100, 'moltres');
	moltres.scale.setTo(0.50, 0.50);
	game.physics.arcade.enable(moltres);
	moltres.body.velocity.setTo(100, 100);
	moltres.body.collideWorldBounds = true;
	moltres.body.bounce.set(1);
}


function  fireBullet(){
	if(game.time.now > shootTime){
		bullet = bullets.getFirstExists(false);
		if(bullet){
			bullet.reset(player.x, player.y);
			bullet.body.velocity.y = - 400;
			shootTime = game.time.now + 200;
			squish.play()
	    	}
	   	}
}



function enemyFires(){
	enemybullet = psychic.getFirstExists(false);
	wildPokemon.length = 0;
	mewtwo.forEachAlive(function(mewtwo){
	wildPokemon.push(mewtwo);
	});

	if(enemybullet && wildPokemon.length > 0){
		let random = game.rnd.integerInRange(0, wildPokemon.length -1);
		let shooter = wildPokemon[random];
		console.log(shooter.body.x);
		enemybullet.reset(shooter.body.x, shooter.body.y);
		game.physics.arcade.moveToObject(enemybullet, player ,120);
		firingTimer = game.time.now + 2000;
	}
}






function enemyHitsPlayer(player, bullet){
	bullet.kill();
	pokeball =pokeballs.getFirstAlive();
	if(pokeball){
		pokeball.kill();

		if(pokeballs.countLiving() <1){
			player.kill();
			psychic.callAll('kill');
			pokeCenter = 'Bulbasaur has fainted\n Would you like to heal your Pokemon?';
			nurseJoy = this.add.text(150, 150, pokeCenter, {font: '34px Arial', fill: 'white', backgroundColor: 'black', wordWrap: 'true', wordWrapWidth: 550});
			game.input.onTap.addOnce(gameRestart, this);
		}
	}
}







function moltresHitsPlayer(player, moltres){
	// game.state.restart();
	pokeball = pokeballs.getFirstAlive();
	if(pokeball){
		pokeball.kill();
		if(pokeballs.countLiving() <1){
			player.kill();
			moltres.kill();
			pokeCenter = 'Bulbasaur has fainted\n Would you like to heal your Pokemon?';
			nurseJoy = this.add.text(150, 150, pokeCenter, {font: '34px Arial', fill: 'white', backgroundColor: 'black', wordWrap: 'true', wordWrapWidth: 550});
			game.input.onTap.addOnce(gameRestart, this);
		}
	}
}





function gameRestart(){
	pokeballs.callAll('revive');
	mewtwo.removeAll();
	EnemyMewtwo();
	player.revive();
	moltres.kill();
	createMoltres();
	nurseJoy.visible = false;
}















const GameState = {
	preload: function() {
		this.load.image('background', '/images/trees.png');
		this.load.image('bulbasaur', '/images/bulbasaur.gif');
		this.load.image('bullet', '/images/avocado.png', 16, 16);
		this.load.image('mewtwo', '/images/mewtwo.gif');
		this.load.image('enemyBullet', '/images/zubat.gif');
		this.load.image('moltres', '/images/moltres.gif');
		this.load.image('articuno', '/images/articuno.gif')
		this.load.image('live', '/images/live.png');
		this.load.tilemap('map', '/Tiles/new.csv');
		this.load.image('tileset', '/images/trees.png');
		this.load.audio('squish', '/sounds/squish.mp3');
		this.load.spritesheet('mummy', '/images/articunoSprite.png',37, 45, 40)
	},
	
	



	create: function create() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.background = this.game.add.tileSprite(0, 0, 800, 600, 'background');
		this.background.scale.setTo(1.75);


		player = this.game.add.sprite(420, 420, 'bulbasaur');
	    player.anchor.setTo(0.5, 0.5);
		player.scale.setTo(0.80, 0.80);
		player.animations.add('idle', [0, 1], 1, true);
		game.physics.arcade.enable(player); 
		player.body.collideWorldBounds = true;

		mewtwo = game.add.group();
		mewtwo.enableBody = true;
		mewtwo.physicsBodyType = Phaser.Physics.ARCADE;
		EnemyMewtwo()

		moltres = this.game.add.sprite(100, 100, 'moltres');
		moltres.scale.setTo(0.50, 0.50);
		game.physics.arcade.enable(moltres);
		moltres.body.velocity.setTo(200, 200);
		moltres.body.collideWorldBounds = true;
		moltres.body.bounce.set(1);



		squish = game.add.audio('squish');
		game.sound.setDecodedCallback([squish], fireBullet, this);

		cursors = game.input.keyboard.createCursorKeys();


		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodytype = Phaser.Physics.ARCADE;
		bullets.createMultiple(30, 'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 0.5);
		// bullets.scale.setTo(0.80, 0.80);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);
	
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


		scoreString = 'Score: ';
		scoreText = this.add.text(10, 10, scoreString + score, {font: '34px Arial', fill: 'white', backgroundColor: 'black'});


		pokeballs = this.add.group();
		this.add.text(this.world.width - 175, 10, 'Pokeballs: ', { font: '34px Comic-sans', fill: 'red' , backgroundColor: 'black'})
		for(let i = 0; i <3; i++){
			let iChooseYou = pokeballs.create(this.world.width - 100 + (30 * i), 75, 'live');
			iChooseYou.anchor.setTo(0.5, 0.5);
			iChooseYou.alpha = 0.9;
			pokeballs.callAll('scale.setTo', 'scale', .1, .1);
		}


		psychic = game.add.group();
	    psychic.enableBody = true;
	    psychic.physicsBodyType = Phaser.Physics.ARCADE;
	    psychic.createMultiple(30, 'enemyBullet');
	    psychic.callAll('scale.setTo', 'scale', .6, .6);
	    psychic.setAll('anchor.x', 0.5);
	    psychic.setAll('anchor.y', 0.5);
	    psychic.setAll('outOfBoundsKill', true);
	    psychic.setAll('checkWorldBounds', true);

},







	update: function() {

		this.physics.arcade.collide(player, layer)
		this.physics.arcade.overlap(bullets, mewtwo, collisionHandler, null, this);
		this.physics.arcade.overlap(psychic, player, enemyHitsPlayer, null, this);
		this.physics.arcade.overlap(moltres, player, moltresHitsPlayer, null, this);

		player.body.velocity.x =  0;
		player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown) {
            player.body.velocity.x = -200;

        } else if (cursors.right.isDown){

            player.body.velocity.x = 200;

        } if (fireButton.isDown){
            fireBullet();
        } if(this.time.now > firingTimer){
        	enemyFires();
        }

    },






}; 



const game = new Phaser.Game(740, 460, Phaser.AUTO);
game.state.add('GameState', GameState);
game.state.start('GameState');