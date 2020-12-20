// define constants and variables
const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world;
// objects
var backgroundImg
var ground, platform;
var box1, box2, box3, box4, box5, log1, log2, log3, log4, pig1, pig2;
var bird, bird2, bird3, bird4
var slingshot;
// birds array
var birds = [];
// sounds
var birdFlying, birdSelect, pigSnort;
// gameState
var gameState = "onSling";
// score
var score = 0;

function preload()
{
    // change background depending on time
    getTime();
    // load sounds
    birdFlying = loadSound("sounds/bird_flying.mp3");
    birdSelect = loadSound("sounds/bird_select.mp3");
    pigSnort = loadSound("sounds/pig_snort.mp3")
}

function setup()
{
    // create canvas
    var canvas = createCanvas(1200,400);
    // create engine and put inside world
    engine = Engine.create();
    world = engine.world;

    // make new ground and platform
    ground = new Ground(600,height,1200,20);
    platform = new Ground(150, 305, 300, 170);
    // first layer of tower
    box1 = new Box(700,320,70,70);
    box2 = new Box(920,320,70,70);
    pig1 = new Pig(810, 350);
    log1 = new Log(810,260,300, PI/2);
    // second layer of tower
    box3 = new Box(700,240,70,70);
    box4 = new Box(920,240,70,70);
    pig2 = new Pig(810, 220);
    log2 =  new Log(810,180,300, PI/2);
    // top layer of tower
    box5 = new Box(810,160,70,70);
    log3 = new Log(760,120,150, PI/7);
    log4 = new Log(870,120,150, -PI/7);

    // new birds
    bird1 = new Bird(200,50);
    bird2 = new Bird(150,180);
    bird3 = new Bird(100,180);
    bird4 = new Bird(50,180);
    // add birds to array
    birds.push(bird4, bird3, bird2, bird1);

    // make constraint with bird and slingshot
    slingshot = new SlingShot(bird1.body,{x:200, y:50});
}

function draw()
{
    // change the background depending on image
    if(backgroundImg)
    {
        background(backgroundImg);
    }
    else
    {
        background("cyan");
    }

    // update engine
    Engine.update(engine);

    // display everything
    ground.display();
    platform.display();

    box1.display();
    box2.display();
    pig1.display();
    log1.display();

    box3.display();
    box4.display();
    pig2.display();
    log2.display();

    box5.display();
    log3.display();
    log4.display();

    bird1.display();
    bird2.display();
    bird3.display();
    bird4.display();

    slingshot.display();
    
    // call score function in pigs
    pig1.score();
    pig2.score();

    // display score as text
    textSize(20);
    text("score: " + score, 1050, 20);

    // make pig sound every 300 frames
    pigSound();

    // if there is a bird left
    if (birds.length > 1)
    {
        // if the current bird is off screen
        if(birds[birds.length-1].body.position.x > 1200)
        {
            // remove bird from array
            birds.pop();
            // set position of new bird to sling and attach to constraint
            Matter.Body.setPosition(birds[birds.length-1].body, {x: 200 , y: 50});
            slingshot.attach(birds[birds.length-1].body);
            // set gameState to onSling
            gameState = "onSling";
            // sound
            birdSelect.play();
        }
    }
}

// if the mouse is dragged
function mouseDragged()
{
    // if the bird is on the sling and close to sling
    if (gameState!=="launched" && birds[birds.length-1].body.position.x < 250)
    {   
        // set position of current bird to mouseX and mouseY
        Matter.Body.setPosition(birds[birds.length-1].body, {x: mouseX , y: mouseY});
        // slight force in top right corner
        Matter.Body.applyForce(birds[birds.length-1].body,
        birds[birds.length-1].body.position, {x: 1, y: -1})
    }
}


function mouseReleased()
{
    // release bird
    slingshot.fly();
    // change gameState
    gameState = "launched";
    // sound
    birdFlying.play();
}

function keyPressed()
{
    // if space is pressed and the bird is launched
    if(keyCode === 32 && gameState === "launched")
    {
        // if there is a bird left
        if(birds.length > 1)
        {
            // remove bird from array
            birds.pop();
            // set position of bird to sling and attach to constraint
            Matter.Body.setPosition(birds[birds.length-1].body, {x: 200 , y: 50});
            slingshot.attach(birds[birds.length-1].body);
            // change gamestate
            gameState = "onSling";
            // sound
            birdSelect.play();
        }
    }
}

async function getTime()
{
    // get the hour from world clock api
    var response = await fetch("https://worldclockapi.com/api/json/est/now");
    var responseJSON = await response.json();
    var dt = responseJSON.currentDateTime;
    var hour = dt.slice(11, 13);
    // if the time is day
    if(hour >= 07 && hour < 20)
    {
        // have the day background
        backgroundImg = loadImage("sprites/bg.png");
    }
    else
    {
        // have the night background
        backgroundImg = loadImage("sprites/bg2.jpg");
    }
}

function pigSound()
{
    if(frameCount % 300 === 0)
    {
        pigSnort.play();
    }
}
