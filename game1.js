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
document.addEventListener('touchstart', function(e){clickDetected();}, false)

var pressedPlay = false;

//Gameplay variables
var groundY = 2300;
var legY = 1500;
var leg_dY = 0;
var shuttleCockY = 50;
var shuttleCock_dY = 1;
var alreadyClicked = false;
var alreadyHitBall = false;
var gameOver = false;
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
	if(shuttleCockY+200 < groundY-50 && shuttleCockY+200 > groundY-250 && alreadyClicked && !alreadyHitBall){
		shuttleCock_dY = Math.floor(Math.random() * -30) - 30;
		score++;
		scoreboard.innerHTML = "Score: " + score;
		// alert("Score: " + score);
		// alert("JEE");
		alreadyHitBall = true;
		console.log("score is " + score);
	}
	shuttleCock_dY += 1;
	
	//Handles what happens when the shuttlecock falls to the floor and restarting the game
	if(shuttleCockY + 200 + shuttleCock_dY >= groundY){
		shuttleCockY = groundY-200;
		shuttleCock_dY = 0;
		
		gameOver = true;
		
		//Handles restarting the game
	}
	
	//Handles the game over screen
	if(gameOver){
		drawGameOverScreen()
	}
	

	//Handles leg falling back down after jumping up
	if(legY+800 + leg_dY <= groundY){
		leg_dY += 4;
	}else{
		legY = groundY-800;
		leg_dY = 0;
		alreadyClicked = false;
		alreadyHitBall = false;
	}
	legY += leg_dY;
	
	/*if(Math.abs(legY+600 - shuttleCockY) < 50){
		shuttleCock_dY = Math.floor(Math.random() * - 50) - 35;
	}*/
	
	//ctx.drawImage(leg, 0, legY);
	//ctx.drawImage(shuttleCock, 0, shuttleCockY);
	
}

function drawBall(){
	ctx.beginPath();
	ctx.rect(700,shuttleCockY,200,200);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

function drawLeg(){
	ctx.beginPath();
	ctx.rect(700,legY,200,800);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.rect(700,legY+600,200,200);
	ctx.fillStyle = "blue";
	ctx.fill();	
	ctx.closePath();
}

function clickDetected(){
	//If the leg is already up in the air, then don't do anything when the user clicks
	if(alreadyClicked){
		return;
	}
	
	if(tapToPlayScreenUp){
		tapToPlayScreenUp = false;
		return;
	}
	
	if(gameOver){
		legY = 1500;
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
	/*if(startingPlay){
		startingPlay = false;
		return;
	}*/
	
	
	leg_dY -= 55;
	alreadyClicked = true;
}

function drawTapToStart(){
	ctx.font = "64px avenir";
	ctx.fillStyle = "black";
	ctx.fillText("Tap anywhere to start!", canvas.width/8, canvas.height/2);
}

function drawGameOverScreen(){
	ctx.font = "128px avenir";
	ctx.fillStyle = "black";
	ctx.fillText("GAME OVER", canvas.width/5, canvas.height/4);
	ctx.font = "128px avenir";
	ctx.fillText("SCORE: " + score, canvas.width/4, canvas.height/3);
	ctx.font = "64px avenir";
	ctx.fillText("TAP ANYWHERE TO CONTINUE", canvas.width/8, canvas.height/2);
}

function drawLoadingMessage() {
	ctx.font = "32px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("LOADING...", canvas.width/2, canvas.height/2);
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






































