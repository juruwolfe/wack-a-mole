$(document).ready(function($) {
	//Create the variables we'll need acces to throughout our code. GameTimer will be our interval, we need to name it so that we can 'clear' it later, but if we set it here the game will start before the user hits 'play', so we'll start by setting it to zero
	var gameTimer = 0;
	var score = 0;

	//Creating our own functions allows us to break this complex thing into multiple pieces, and give names that make sense to us, like 'startGame' to trigger the moles and mice!
	var startGame = function(){

		//Now we overwrite the 'gameTimer' and use JavaScript's 'setInterval' function to create a mole or a mouse every second (that's what the 1000 is, try changing that to create moles faster or slower)
		gameTimer = setInterval(function(){
			// This is inside the first argument (which is a function) of setInterval, which is the thing we want to happen over and over

			//We'll create a variable 'mouse' and using Math.round() and Math.random(), set it to either 1 or 0. Don't remember Math.round() or Math.random()? Try playing with them in the console to see what they do
			var mouse = Math.round( Math.random() );
			
			//Create our moleOrMouse variable, and as a default have it be a cute little mole. 
			var moleOrMouse = "mole";

			//This line could be if(mouse == 1), which would check if the mouse had a 1 instead of a zero (50% odds). It could _also_ be if(mouse == true), because to JavaScript, 1 = true. Because of that, we can write it as simply as if(mouse)
			if(mouse){
				//If, and only if, mouse == 1, set our moleOrMouse variable to "mouse," otherwise it will stay as it's default: mole
				moleOrMouse = "mouse";
			}

			//call our createRodent function, and *pass* it the information we've stored in moleOrMouse, so half the time, it will get the string "mouse," and half the time it will get "mole"  
			createRodent(moleOrMouse);
		}, 1000)
	};

	//Create a new function, createRodent, that accepts one *argument* and calls that moleOrMouse. 
	var createRodent = function(moleOrMouse){
		//Get a random number, 0-5 (because the first item as far as jQuery is concerned is the zero item)
		var randomCircle =  Math.round( Math.random()*5 );

		//Create a new variable called $moleHole. I put the $ in the variable name just to remind myself that this is an element on my page selected by jQuery. Using the 'eq' function in jQuery, select the specific item on the pagebased on whatever my random number was. So if it's 0, grab the first one. If it's 5: grab the last.
		var $moleHole = $(".mole-hole").eq( randomCircle );

		//In whichever of the mole holes we've selected, add a new div inside using jQuery's 'append.' Using string concatination, set the class to be that moleOrMouse variable, so we can determine the color with css. 
		$moleHole.append('<div class='+ moleOrMouse +'> </div>');

		//Using jQuery, find the active mole-hill, and get it's (new!) child, the div we just created that's either a mouse or a mole. Animate it so it grows to the full width of it's parent (150px) in 600 milliseconds
		$moleHole.children('div').animate({
			"width":"150px",
			"height":"150px"
		}, 600, function(){
			//The last argument animate takes is a function, which gets called after the animation function finishes. So let's call another animate function, this one to scale it back down to zero 
			$moleHole.children('div').animate({
				"width":"0px",
				"height":"0px"
			}, 600, function(){
				//Once that's finished, remove the bugger
				$moleHole.children('div').remove();
			})
		});
	}
	//WOAH! Look up at all those brackets and parentheses. That is a great place to miss one, and break everything. 

	//Set up jQuery to pay attention anytime any "mole-hole" is clicked
	$(".mole-hole").click(function(){
		//Check if the clicked on "mole-hole" has a child with a class of mole
		if( $(this).children("div").hasClass("mole") ){
			//That means they've clicked on a blue circle! Give them a point
			score ++;
		}
		//check if instead it has a child with a class of "mouse"
		else if( $(this).children("div").hasClass("mouse") ){
			//If so, they've hit a red circle, they should lose a point
			score --;
			//Using jQuery, look at everything with a class of "full" and find the 'length', that will tell you how many are on the page, or how many lives the user has left
			if( $(".full").length > 0){
				//If they have any lives (more than zero), knock the first (of the remaining) one [0] off by removing its 'full' class
				$(".full").eq(0).removeClass('full');
			}
			else{
				//If they have no lives left, trigger the game over function
				gameOver();
			}
		};

		//at the end of all this, good or bad, update the text inside our number to reflect the latest score, so the user can see how they're doing
		$(".number").text(score);
	})
	

	var gameOver = function(){
		//Bring back the play button, but change the text to reflect that it's a game over, then fade it back in
		$(".play").text("Game over! Play again?").fadeIn(200);
		//Clear the interaval that was generating moles and mice
		clearInterval(gameTimer);
	}

	//Write a function to reset the game so folks can play again after losing
	var resetGame = function(){
		//Score back to zero
		score = 0;
		//All the lives get the 'full' class again
		$(".life").addClass('full');
		//Reflect on the page that the score is zero by updating the text
		$(".number").text(score);
	}

	//Pay attention to that play button and listen for any clicks
	$(".play").click(function(){
		//Reset the game anytime it's clicked, so you know it will always be a fresh start
		resetGame();
		//Fade out the button, and pass a function as a second argument to fade it out
		$(".play").fadeOut(500, function(){
			// Gets called after fadeOut
			startGame();
		});
	});


});