var player;
var powerup;
var cursors;
var jumpButton;
var bullets;
var bulletTime = 0;
var bullet;
var bullet1;
var enemy;
var facing = 'left';
var bg;
var aux=1;
var score = 0;
var scoreString = '';
var scoreText;
var aux;
var lives;
var enemyBullet;
var livingEnemies = [];
var firingTimer = 0;
var map;
var fuego;
var fuego1;
var angulo=0;
var jefecito;
var layer;
var h=0;
var aux1;
var i;
var ship;
var ship2;
var explosions;
var stateText;
var monedas;
var fx;

var game = new Phaser.Game(800,600,Phaser.AUTO,'phaser',{preload: preload, create: create, update:update});
function preload() {
    game.load.audio('sfx', 'fx_mixdown.ogg');
    game.load.audio('music', '1.mp3');
	game.load.spritesheet('player', 'boss1.png', 64, 69);
    game.load.image('platform', 'platform.png');
    game.load.image('bullet', 'bullet0.png');
    game.load.spritesheet('enemy', 'player1.png',89,90);
    game.load.image('background', 'bg1.png');
    game.load.image('ship', 'heart.png');
    game.load.spritesheet('fire2', 'fire1.png',32,44);
    game.load.spritesheet('fire1', 'fire1.png',32,44);

    game.load.image('enemyBullet', 'bullet1.png');
    game.load.image('bullet1', 'bullet1.png');
    game.load.tilemap('map', 'tiledmap1.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'sci-fi-tiles.png');
    game.load.spritesheet('kaboom', 'blood.png', 35, 40 );
    game.load.spritesheet('gonorrea', 'power.png',50,48);
    game.load.spritesheet('jefe', 'chief.png',237,249);

}



function create() {
    game.stage.backgroundColor = '#000000';
    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera=true;

      //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
      map = game.add.tilemap('map', 32, 32);

      //  Now add in the tileset
      map.addTilesetImage('tiles');
      
      //  Create our layer
      layer = map.createLayer(0);
  
      //  Resize the world
      layer.resizeWorld();
      map.setCollisionBetween(1,3);
      map.setCollisionBetween(6,6)

    player = game.add.sprite(64, 69, 'player');

    game.physics.arcade.enable(player);
    enemy = game.add.sprite(89, 90, 'enemy');
    jefecito = game.add.sprite(237, 249, 'jefe');
    

    fx = game.add.audio('sfx');
    fx.allowMultiple = true;

    fx.addMarker('alien death', 1, 1.0);
    fx.addMarker('death', 12, 4.2);
    fx.addMarker('shot', 17, 1.0);
    fx.addMarker('ping', 10, 1.0);
    fx.addMarker('boss hit', 3, 0.5);
    fx.addMarker('numkey', 9, 0.1);
    
    game.physics.arcade.enable(enemy);
    enemy.body.collideWorldBounds = true;
    enemy.body.gravity.y = 500;
    enemy.visible=false;
    game.physics.arcade.enable(jefecito);
    jefecito.body.collideWorldBounds = true;
    jefecito.body.gravity.y = 500;
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;
    
    createEnemy();
      //  The score
      scoreString = 'Score : ';
      scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });
      scoreText.fixedToCamera = true;
    
      //  Lives
      lives = game.add.group();
      aux=game.add.text(700, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });
      aux.fixedToCamera = true;
  
      //  Text
      stateText = game.add.text(game.world.centerX,game.world.centerY,'Perdiste ', { font: '84px Arial', fill: '#fff' });
      stateText.anchor.setTo(0.5, 0.5);
      stateText.visible = false;

      
      for (i = 0; i < 3; i++) 
    {
        ship = lives.create(700 + (30 * i), 60, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.fixedToCamera=true;
    

    }
    

    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);


    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;
    monedas = game.add.physicsGroup();
    player.animations.add('right', [0, 1, 2, 3], 10, true);
    
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    jefecito.animations.add('move', [0, 1, 2, 3], 10, true);
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;


    
    for (var i = 0; i < 20; i++)
    {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetBullet, this);
    }
    game.camera.follow(player);
    fuego= game.add.physicsGroup();
    fuego.enableBody=true;

    fuego1= game.add.physicsGroup();
    fuego1.enableBody=true;

    powerup = game.add.physicsGroup();
    powerup.enableBody=true;

    
    jefecito.x=3200;
    map.createFromTiles(5,-1,'ship',layer, monedas)
    map.createFromTiles(7,-1,'fire2',layer,fuego);
    map.createFromTiles(0,-1,'fire1',layer,fuego1);

    map.createFromTiles(4,-1,'gonorrea',layer,powerup);
    //map.createFromTiles(0,-1,'boss',layer,boss);
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fuego.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3], 10, true);
    fuego.callAll('animations.play', 'animations', 'spin');

    fuego1.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3], 10, true);
    fuego1.callAll('animations.play', 'animations', 'spin');
    fuego1.position.x=100;
    powerup.callAll('animations.add', 'animations', 'gono', [0, 1, 2, 3,4,5,6,7], 10, true);
    powerup.callAll('animations.play', 'animations', 'gono');
    music = game.add.audio('music');
        music.loop = true;  
        music.play();
    game.add.tween(jefecito).to( { x: 2700 }, 1500, Phaser.Easing.Linear.Out, true, 0, 1000, true);

    
}
function createEnemy (mn) {

    
    for (var y = 0; y < 2; y++)
    {
        for (var x = 0; x < 40; x++)
        {
            var alien = aliens.create(x * 60, y *10, 'enemy');
            alien.scale.x=-1;
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('left', [ 0, 1, 2, 3 ], 10, true);
            alien.play('left');
            alien.body.moves = true;
            alien.body.collideWorldBounds = true;
            alien.body.gravity.y = 500;
            game.physics.arcade.enable(alien);
        }
    }
    
    aliens.x = 0;
    aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to( { x: 200  }, 2000, Phaser.Easing.Linear.none, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(descend, this);


}
function descend() {

    aliens.x = +100;
    alien.y=-300;

}
function setupInvader (enemy) {

    enemy.anchor.x = -2;
    
    enemy.animations.add('kaboom');

}
function update () {

    //bg.tilePosition.x -= 2;
	//game.physics.arcade.collide(player, platforms);
    //game.physics.arcade.collide(aliens, platforms);
    game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
    game.physics.arcade.overlap(bullets, enemy, collisionHandler, null, this);
    game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(aliens, layer);
    game.physics.arcade.collide(jefecito, layer);
    angulo= angulo+0.04;


    game.physics.arcade.overlap(player, jefecito, morir2, null, this);

    game.physics.arcade.overlap(aliens, fuego, morir1, null, this);
    game.physics.arcade.overlap(player, monedas, pluslive, null, this);
    game.physics.arcade.overlap(player, fuego, morir, null, this);
    game.physics.arcade.overlap(player, fuego1, morir, null, this);

    game.physics.arcade.overlap(player, powerup, power1, null, this);
    game.physics.arcade.overlap(bullets, jefecito, collisionHandler1, null, this);
	player.body.velocity.x = 0;
    jefecito.animations.play('move');
    music.volume=0.1;
    mover();
if (cursors.left.isDown)
{
	player.body.velocity.x = -250;
    if (facing != 'left')
    {
        player.animations.play('left');
        facing = 'left';
        player.scale.x=-1;
        aux=1;


        
    
    }
}
else if (cursors.right.isDown)
{
	player.body.velocity.x = 250;
    if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
            player.scale.x=1;
            aux=2;

        }
}else
{
    if (facing != 'idle')
    {
        player.animations.stop();

        if (facing == 'left')
        {
            player.frame = 0;
            aux=1;
        }
        else
        {
            player.frame = 3;
            aux=2;
        }

        facing = 'idle';
    }
}

if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        fx.play('shot');
        fireBullet();

    }

if(player.position.x>=2600){
    
fireBullet1();
}

if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down))
{
	player.body.velocity.y = -400;
}

if (game.time.now > firingTimer)
        {
            enemyFires();
            
        }
}
function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
                bullet.reset(player.x-45, player.y+20);
                    bullet.body.velocity.x = -300;
                    bulletTime = game.time.now + 150; 
                    if(aux==2){
                        bullet.reset(player.x, player.y+20);
                        bullet.body.velocity.x=+300;
                    }   
        }
    }

}

function fireBullet1 () {

    if (game.time.now > bulletTime)
    {
        enemyBullet = enemyBullets.getFirstExists(false);

        if (enemyBullet)
        {
            enemyBullet.reset(jefecito.x+50, jefecito.y+50);
            enemyBullet.body.velocity.x = -300;
            game.physics.arcade.moveToObject(enemyBullet,player,100);
            fx.play('shot');
            bulletTime = game.time.now + 2050; 
                       
        }
    }

}
function mover(){
    const x = 120* Math.cos(angulo);
    fuego1.position.set(x,0);    
}
function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    
    explosion.play('kaboom', 30, false, true);
    fx.play('alien death');
}
function collisionHandler1 (bullet, jefecito) {

    
    //  When a bullet hits an alien we kill them both
    jefecito.kill();
    
    fx.play('boss hit')
    score += 200;
    scoreText.text = scoreString + score;
    if(score>=3000){
        bullet.kill();
        fx.play('ping');

         aux1=game.add.text(100, 100, ' You WON', { font: '100px Arial', fill: '#fff' });
        aux1.fixedToCamera=true;
        player.kill();
        aliens.kill();
        enemyBullets.kill();

    }
}

function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();
    fx.play('boss hit')
    if (live)
    {
        live.kill();
    }
if (lives.countLiving() <1)
    {
        player.kill();
        fx.play('death');

        aux1=game.add.text(100, 100, ' GAME OVER', { font: '100px Arial', fill: '#fff' });
        aux1.fixedToCamera=true;
        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }
    

}


function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x+20, shooter.body.y+40);

        game.physics.arcade.moveToObject(enemyBullet,player,250);
        //fx.play('shot');
        firingTimer = game.time.now + 2000;
    }

}



function resetBullet (bullet) {

    bullet.kill();

}
function render () {

}
function pluslive(bullet, veg) {

    //bullet.kill();
    h++;
    veg.kill();
    fx.play('ping');
    for (var j = 0; j < h; j++) {
    ship2 = lives.create(700+(30 * -j), 70, 'ship');
    
    ship2.fixedToCamera=true;
    }
}

function morir(bullet){
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }
if (lives.countLiving() <1)
    {
        player.kill();
        fx.play('death');
        aux1=game.add.text(100, 100, ' GAME OVER ', { font: '100px Arial', fill: '#fff' });
        aux1.fixedToCamera=true;
        

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }
}
function morir1(bullet){
    bullet.kill();
  

}
function morir2(bullet){
   
    player.kill();
    fx.play('death');
    aux1=game.add.text(100, 100, ' GAME OVER ', { font: '100px Arial', fill: '#fff' });
    aux1.fixedToCamera=true;
    //the "click to restart" handler
    game.input.onTap.addOnce(restart,this);
}
function power1(){
    var x=Math.floor((Math.random() * (3000 - 0 + 1)) + 0);
    var y=Math.floor((Math.random() * (0 - 400 + 1)) + 400);
    fx.play('numkey');
    player.position.set(x,y);
}
function restart(){
    //  A new level starts
    
    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createEnemy();
    score=0;
    scoreText.text = scoreString + score;
    music.restart();
    //revives the player
    player.position.set(100, 100);
    player.revive();
    game.camera.follow(player);
    //hides the text
    aux1.visible = false;

}

preload();
create();
update();