
var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
//create an array with all the win cobom
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
const boxes = document.querySelectorAll('.box');

document.querySelector("#finish").style.display = "none";
document.querySelector("#player1").className = "players active"
// eventlistener to the 'startGame' and 'newGame' botton
document.querySelector("#start button").addEventListener("click", function() {
	let nameInput = document.querySelector("input").value
	//the board will show 'Player 1' if there is no input value
	if (nameInput === "") {
	document.querySelector("#playername").innerHTML = "Player 1";
} else {
	document.querySelector("#playername").innerHTML = nameInput;
}
  document.querySelector("#start").style.display = "none";
}, false);
document.querySelector("#finish a").addEventListener("click", function() {
	document.querySelector("#finish").style.display = "none"
	startGame()
})


startGame()

function mouseover(box) {
	box.target.style.backgroundImage = 'url("img/o.svg")'
}

function startGame() {
	// create an array with 9 elements with value from 0 to 8, each of them represents one box
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].className = "box";
		boxes[i].addEventListener('click', turnClick, false);
		boxes[i].addEventListener("mouseover", mouseover,false);
		boxes[i].addEventListener("mouseout", event => {
		  event.target.style.backgroundImage = '';
		});
	}
}

function turnClick(box) {
	// check if the box on origBoard is occupied by "x" or "o"
	if (typeof origBoard[box.target.id] == 'number') {
		turn(box.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(boxId, player) {
	//set the box value to "x" or "o" and remove event handlers
	origBoard[boxId] = player;
  boxes[boxId].removeEventListener('click', turnClick, false);
	boxes[boxId].removeEventListener("mouseover", mouseover,false);

  if (player === huPlayer) {
  	document.getElementById(boxId).className = "box box-filled-1";
  } else {
    document.getElementById(boxId).className = "box box-filled-2";
    document.querySelector("#player2").className = "players active";
    setTimeout(function() {
      document.querySelector("#player2").className = "players"
    }, 500);
		document.querySelector("#player1").className = "players";
		setTimeout(function() {
      document.querySelector("#player1").className = "players active"
    }, 500);
  }

	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	//collect player move indexes to an array
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	//if the any of the win combo is the same as the collected move indexes, the player wins
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].removeEventListener('click', turnClick, false);
	}
  if (gameWon.player === huPlayer) {
		let nameInput = document.querySelector("input").value
		//the screen will print out the player's name if player wins, but the AI will never let this happen.
    document.querySelector(".message").innerText = `${nameInput} is the winner!`;
    document.querySelector("#finish").className = "screen screen-win screen-win-one"
		setTimeout(function() {
      document.querySelector("#finish").style.display = "block";
    }, 1500);
  } else {
    document.querySelector(".message").innerText = "Winner";
    document.querySelector("#finish").className = "screen screen-win screen-win-two"
		setTimeout(function() {
      document.querySelector("#finish").style.display = "block";
    }, 1500);
  }
}

function emptyBoxes() {
	return origBoard.filter(s => typeof s == 'number');
}

function checkTie() {
	if (emptyBoxes().length == 0) {
    document.querySelector(".message").innerText = "Tie Game!";
    document.querySelector("#finish").className = "screen screen-win screen-win-tie"
    document.querySelector("#finish").style.display = "block";
		return true;
	}
	return false;
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}


function minimax(newBoard, player) {
	var availSpots = emptyBoxes();
  //according to minimax algorithm, aiPlayer always wants to maximize the score
	//while humanPlayer wants to minimize the score
		if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	//collect every available moves and final score in an array
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;
		// This is the recursion function to reach the terminal state and collect the score.
		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		//aiPlayer will choose the move with largest score
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		//humanPlayer will choose the move with smallest score
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
