var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d");

let fps, fpsInterval, startTime, now, then, elapsed;
fps = 60;
fpsInterval = 1000 / fps;

//Handles images
var leg = new Image();
var shuttleCock = new Image();
var legLoaded = false;
var shuttleCockLoaded = false;
leg.src = "Spells.png";
shuttleCock.src = "SunsetFromACliff.png";

//Listeners
leg.addEventListener('load', function() {legLoaded = true;}, false);
shuttleCock.addEventListener('load', function() {shuttleCockLoaded = true;}, false);
document.addEventListener("click", function(){clickDetected();});
document.addEventListener('touchstart', function(e){clickDetected();}, false);

var pressedPlay = false;

//Gameplay variables
var groundY = 1300;
var legX = 350;
var legWidth = 200;
var legHeight = 800;
var legY = groundY-legHeight;
var leg_dY = 0;
var shuttleCockDiameter = 200;
var shuttleCockY = 50;
var shuttleCock_dY = 1;
var alreadyClicked = false;
var alreadyHitBall = false;
var gameOver = false;
var tappedToReplay = false;
var afterTappedToReplay = false;
var startingPlay = false;
var tapToPlayScreenUp = true;
var score = 0;
let scoreboard = document.getElementById("game1Score");





function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//Creates loading message when images aren't loaded yet
	if (!legLoaded || !shuttleCockLoaded){
		drawLoadingMessage();
		return;
	}
	
	//Draws leg and ball
	drawLeg();
	drawBall();
	
	if(tapToPlayScreenUp){
		drawTapToStart();
		return;
	}
	
	//Handles shuttlecock gravity
	shuttleCockY += shuttleCock_dY;
	
	//Handles shuttlecock bouncing
	if(shuttleCockY+shuttleCockDiameter < groundY-75 && shuttleCockY+shuttleCockDiameter > groundY-125 && alreadyClicked && !alreadyHitBall && leg_dY < 0){
		shuttleCock_dY = Math.floor(Math.random() * -30) - 30;
		score++;
		scoreboard.innerHTML = "Score: " + score;
		alreadyHitBall = true;
		console.log("score is " + score);
		
	}
	shuttleCock_dY += 1;
	
	//Handles what happens when the shuttlecock falls to the floor and restarting the game
	if(shuttleCockY + shuttleCockDiameter + shuttleCock_dY >= groundY){
		shuttleCockY = groundY-shuttleCockDiameter;
		shuttleCock_dY = 0;
		gameOver = true;
		
		//Handles restarting the game
	}
	
	//Handles the game over screen
	if(gameOver){
		drawGameOverScreen()
	}
	

	//Handles leg falling back down after jumping up
	if(legY+legHeight + leg_dY < groundY){
		leg_dY += 4;
	}else{
		legY = groundY-legHeight;
		leg_dY = 0;
		alreadyClicked = false;
		alreadyHitBall = false;
	}
	legY += leg_dY;
	
	//ctx.drawImage(leg, 0, legY);
	//ctx.drawImage(shuttleCock, 0, shuttleCockY);
	
}

function drawBall(){
	ctx.beginPath();
	ctx.rect(legX,shuttleCockY,shuttleCockDiameter,shuttleCockDiameter);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

function drawLeg(){
	ctx.beginPath();
	ctx.rect(legX,legY,legWidth,legHeight);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.rect(legX,legY+legHeight-shuttleCockDiameter,legWidth,legWidth);
	ctx.fillStyle = "blue";
	ctx.fill();	
	ctx.closePath();
}

function clickDetected(typeEvent){
	//If the leg is already up in the air, then don't do anything when the user clicks
	if(alreadyClicked){
		return;
	}
	
	if(tapToPlayScreenUp){
		
		if(tappedToReplay){
			tappedToReplay = false;
			if(typeEvent == "touch"){
				afterTappedToReplay = true;
				console.log("touchEvent detected");
			}
			return;
		}
			
		tapToPlayScreenUp = false;
		
		return;
	}
	
	if(afterTappedToReplay){
		afterTappedToReplay = false;
		console.log("touchEvent detected");
		return;
	}
	
	if(gameOver){
		if(typeEvent == "touch"){
			tappedToReplay = true;
		}
		
		legY = groundY-legHeight;
		leg_dY = 0;
		shuttleCockY = 50;
		shuttleCock_dY = 1;
		alreadyClicked = false;
		alreadyHitBall = false;
		gameOver = false;
		//pressedPlay = false;
		score = 0;
		scoreboard.innerHTML = "Score: 0";

		tapToPlayScreenUp = true;
		
		return;
	}
	
	
	leg_dY -= 45;
	alreadyClicked = true;
}

function drawTapToStart(){
	ctx.font = "64px avenir";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black"
	ctx.lineWidth = 1;
	
	ctx.fillText("Tap anywhere to start!", canvas.width/8, canvas.height/2);
	ctx.strokeText("Tap anywhere to start!", canvas.width/8, canvas.height/2);
}

function drawGameOverScreen(){
	ctx.font = "128px avenir";
	ctx.fillStyle = "white";
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.fillText("GAME OVER", canvas.width/15, canvas.height/4);
	ctx.strokeText("GAME OVER", Math.floor(canvas.width/13.3), canvas.height/4);
	
	ctx.font = "128px avenir";
	ctx.fillText("SCORE: " + score, canvas.width/8, canvas.height/3);
	ctx.strokeText("SCORE: " + score, Math.floor(canvas.width/7.5), canvas.height/3);
	
	ctx.lineWidth = 1;
	ctx.font = "64px avenir";
	ctx.fillText("TAP ANYWHERE TO CONTINUE", canvas.width/50, canvas.height/2);
	ctx.strokeText("TAP ANYWHERE TO CONTINUE", canvas.width/50, canvas.height/2);
	
	ctx.font = "30px avenir";
	ctx.fillText("Version 1.7", 50, 50);
}

function drawLoadingMessage() {
	ctx.font = "32px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("LOADING...", canvas.width/8, canvas.height/2);
}

function startAnimating(fps) {
	then = Date.now();
	startTime = then;
	animate();
}


function animate() {
	requestAnimationFrame(animate);

	now = Date.now();
	elapsed = now - then;

	if (elapsed > fpsInterval) {

		// Get ready for next frame by setting then=now, but also adjust for your
		// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
		then = now - (elapsed % fpsInterval);


		draw();
	}
}

startAnimating(fps);






































