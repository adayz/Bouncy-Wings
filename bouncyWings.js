var fps = 1000/120, score = 0;
var canvas = function(width, height, color){
	this.width = width;
	this.height = height;
	this.color = color;
	var instance = document.createElement('canvas');
	document.body.appendChild(instance);
	instance.width = this.width;
	instance.height = this.height;
	var ctx = instance.getContext('2d');
	
	this.changeBackground = function(color){
		ctx.fillStyle = color;
	}
	
	this.clear = function(){
		ctx.clearRect(0, 0, this.width, this.height);
	}
	
	this.context = function(){
		return ctx;
	}
	
	this.draw = function(){
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, this.width, this.height);
	}
}

var obstacle = function(x, y, width, height, color, canvas){
	this.x = x;
	this.y = y;
	this.speedX = 0;
	this.speedY = 0;
	this.width = width;
	this.height = height;
	this.color = color;
	var ctx = canvas.context();
	this.color = color;
	this.gravity = 0;
	
	this.changeColor = function(color){
		this.color = color;
	}
	
	this.applyGravity = function(){
		if(this.speedY < 9) this.speedY += this.gravity;
	}
	
	this.draw = function(){
		ctx.fillStyle = color;
		ctx.fillRect(this.x += this.speedX, this.y += this.speedY, this.width, this.height);
	}
	
	this.checkCollision = function(obstacle){
		var myTop = this.y;
		var myLeft = this.x;
		var myBottom = this.y + this.height;
		var myRight = this.x + this.width;
		var oTop = obstacle.y;
		var oLeft = obstacle.x;
		var oBottom = obstacle.y + obstacle.height;
		var oRight = obstacle.x + obstacle.width;
		if(myTop > oBottom || myLeft > oRight || myRight < oLeft || myBottom < oTop) return false;
		return true;
	}
}

var obsArrayTop = new Array();
var obsArrayDown = new Array();
var obsCounter;

var gameCanvas = new canvas(800, 600, '#C5E1A5');
var player = new obstacle(200, gameCanvas.height/2, 40, 40, '#006064', gameCanvas);
player.gravity = 0.15;
var count = 360;
var kPress = false;

window.addEventListener('keypress', function(evt){
	if(evt.keyCode == 32) player.speedY = -5;
	kPress =true;
});

window.addEventListener('keyup', function(evt){
	kPress =false;
});

window.addEventListener('touchstart', function(evt){
	if(evt.keyCode == 32) player.speedY = -5;
	kPress =true;
});

window.addEventListener('touchend', function(evt){
	kPress =false;
});

var interval = setInterval(function(){
	obsCounter = obsArrayTop.length;
	gameCanvas.draw();
	if(!kPress) player.applyGravity();
	player.draw();
	if(count == 360){
		score++;
		var height = Math.random()*400;
		obsArrayTop[obsCounter] = new obstacle(gameCanvas.width, 0, 100, height, '#1B5E20', gameCanvas);
		obsArrayTop[obsCounter].speedX = -1;
		//obsCounter++;
		obsArrayDown[obsCounter] = new obstacle(gameCanvas.width, height+200, 100, gameCanvas.height-(height+200), '#1B5E20', gameCanvas);
		obsArrayDown[obsCounter].speedX = -1;
		obsCounter++;
		count = 0;
	}
	count++;
	for(var i = 0; i < obsCounter; i++){
		
		if(player.checkCollision(obsArrayTop[i]) || player.checkCollision(obsArrayDown[i]) || player.y > gameCanvas.height){
			alert("Your Score: "+score);
			clearInterval(this);
			location.reload();
		}
		
		if(player.y < 1) player.y =1;
		
		if(obsArrayTop[i].x == -obsArrayTop[i].width){
			obsArrayTop.splice(i,1);
			obsArrayDown.splice(i,1);
			break;
		}
		else{
			obsArrayTop[i].draw();
			obsArrayDown[i].draw();
		}
	}
	
	drawscore(gameCanvas, player.x+20, player.y+20);
	
},fps);

function drawscore(canvas, x, y){
	var ctx = canvas.context();
	ctx.fillStyle = 'white';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = '25pt Impact';
	ctx.fillText(score,x,y);
}

interval();
