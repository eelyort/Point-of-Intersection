var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d");

let fps, fpsInterval, startTime, now, then, elapsed;
fps = 30;
fpsInterval = 1000 / fps;

//Handles images
var leg = new Image();
var shuttleCock = new Image();
var legLoaded = false;
var shuttleCockLoaded = false;
var background1 = new Image();
var background1_loaded = false;
var background2 = new Image();
var background2_loaded = false;
var shuttlecockImgSrcArray = ["shuttlecockflutter_0000_Group-3-copy-3.png", "shuttlecockflutter_0001_Group-3-copy-5.png", "shuttlecockflutter_0002_Group-3-copy-4.png", "shuttlecockflutter_0003_Group-3-copy-2.png", "shuttlecockflutter_0004_Group-3-copy.png", "shuttlecockflutter_0005_Group-3.png"];
var shuttlecockImages = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
var shuttlecockArrayIterator = 0;
var framesPassed = 0;


leg.src = "Spells.png";
shuttleCock.src = "sc/shuttlecockflutter_0000_Group-3-copy-3.png";
background1.src = "gamebkgd.png";
background2.src = "gamebuilding.png";

//Listeners
leg.addEventListener('load', function() {legLoaded = true;}, false);
shuttleCock.addEventListener('load', function() {shuttleCockLoaded = true;}, false);
background1.addEventListener('load', function() {background1_loaded = true;}, false);
background2.addEventListener('load', function() {background2_loaded = true;}, false);
document.addEventListener("click", function(){clickDetected("click");});
document.addEventListener('touchstart', function(e){clickDetected("touch");}, false);

var pressedPlay = false;

//Gameplay variables
var groundY = 1600;
var legX = 400;
var legWidth = 100;
var legHeight = 600;
var legY = groundY-legHeight;
var leg_dY = 0;
var shuttleCockDiameter = 300;
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
var isMobile = false;



let scoreboard = document.getElementById("game1Score");
let questionUp = false;
let resetScore = true;
let resetUsed = false;
let waitingOnReset = false;

for(var i = 0; i < shuttlecockImgSrcArray.length; i++){
	shuttlecockImages[i].src = shuttlecockImgSrcArray[i];
}


function drawTimesTouched(){
	ctx.font = "64px avenir";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.strokeText("Times touched: " + tT, canvas.width/8, canvas.height/3);
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//Creates loading message when images aren't loaded yet
	if (!legLoaded || !shuttleCockLoaded || !background1_loaded || !background2_loaded){
		drawLoadingMessage();
		return;
	}
	
	framesPassed++;
	if(framesPassed == 2){
		if(shuttlecockArrayIterator < 5){
			shuttlecockArrayIterator++;
		}
		else{
			shuttlecockArrayIterator = 0;
		}
		framesPassed = 0;
	}
	

	
	//Draws leg, ball, and background
	ctx.drawImage(background1, 0, 0,965,1680);
	ctx.drawImage(background2, 0, 0,965,1680);
	drawLeg();
	drawBall();
	//drawTimesTouched();
	
	if(tapToPlayScreenUp && !isMobile){
		drawTapToStart();
		return;
	}
	
	//Handles shuttlecock gravity
	shuttleCockY += shuttleCock_dY;
	
	//Handles shuttlecock bouncing
	if(shuttleCockY+shuttleCockDiameter < groundY-75 && shuttleCockY+shuttleCockDiameter > groundY-125 && alreadyClicked && !alreadyHitBall && leg_dY < 0){
		shuttleCock_dY = Math.floor(Math.random() * -20) - 30;
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
		// -----------------------------------------Multiple choice code here - Troy
		if(!questionUp && !resetUsed && !waitingOnReset) {
			// alert("reseting");

			function callback(correct) {
				waitingOnReset = true;
				if (correct) {
					// reset variables except for score
					resetScore = false;
					questionUp = false;
				}
				else{
					resetScore = true;
					questionUp = false;
				}
			}

			questionUp = true;
			startMultipleChoice(callback);
		}
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
	ctx.drawImage(shuttlecockImages[shuttlecockArrayIterator],legX-65,shuttleCockY);
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
	if(questionUp){
		return;
	}
	//If the leg is already up in the air, then don't do anything when the user clicks
	if(alreadyClicked){
		return;
	}
	
	if(gameOver){
		if(typeEvent == "touch"){
			tappedToReplay = true;
			
		}
		
		if (typeEvent == "touch"){
			isMobile = true;
		}
		
		legY = groundY-legHeight;
		leg_dY = 0;
		shuttleCockY = 50;
		shuttleCock_dY = 1;
		alreadyClicked = false;
		alreadyHitBall = false;
		gameOver = false;
		//pressedPlay = false;

		waitingOnReset = false;
		// alert(resetScore);
		if(resetScore) {
			score = 0;
			scoreboard.innerHTML = "Score: 0";
			resetUsed = false;
			// resetScore = false;
		}
		else{
			resetScore = true;
			resetUsed = true;
		}

		tapToPlayScreenUp = true;
		
		return;
	}
	
	if(afterTappedToReplay){
		afterTappedToReplay = false;
		return;
	}
	
	if(tapToPlayScreenUp){
		
		if(tappedToReplay){
			tappedToReplay = false;
			if(typeEvent == "touch"){
				afterTappedToReplay = true;
			}
			return;
		}
			
		tapToPlayScreenUp = false;
		
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
	
	ctx.fillText("Tap anywhere to start!", canvas.width/6, canvas.height/2);
	ctx.strokeText("Tap anywhere to start!", canvas.width/6, canvas.height/2);
}

function drawGameOverScreen(){
	ctx.font = "128px avenir";
	ctx.fillStyle = "white";
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.fillText("GAME OVER", canvas.width/12, canvas.height/4);
	ctx.strokeText("GAME OVER", Math.floor(canvas.width/12), canvas.height/4);
	
	ctx.font = "128px avenir";
	ctx.fillText("SCORE: " + score, canvas.width/5, canvas.height/3);
	ctx.strokeText("SCORE: " + score, Math.floor(canvas.width/5), canvas.height/3);
	
	ctx.lineWidth = 1;
	ctx.font = "60px avenir";
	ctx.fillText("TAP ANYWHERE TO CONTINUE", canvas.width/30, canvas.height/2);
	ctx.strokeText("TAP ANYWHERE TO CONTINUE", canvas.width/30, canvas.height/2);
	
	ctx.font = "30px avenir";
	ctx.fillStyle = "black";
	ctx.fillText("Version 1.8", 50, 50);
}

function drawLoadingMessage() {
	ctx.font = "128px Arial";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.fillText("LOADING...", canvas.width/5, canvas.height/2);
	ctx.strokeText("LOADING...", canvas.width/5, canvas.height/2);
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






































