var WALL 	= 'WALL';
var FLOOR 	= 'FLOOR';
var BALL 	= 'BALL';
var GAMER 	= 'GAMER';
var GLUE 	= 'GLUE';
var ROWS = 10;
var COLS = 12;
var gWindowsPos = [
	{name: 'left', pos: {i:((COLS/2)-1), j:0,            matchI: ((COLS/2)-1), matchJ: COLS-1 }},
	{name: 'right', pos: {i:((COLS/2)-1), j:COLS-1,       matchI: ((COLS/2)-1), matchJ: 0 }},
	{name: 'up',    pos: {i:0,            j:((ROWS/2)-1), matchI: ROWS-1,       matchJ: ((ROWS/2)-1)}},
	{name: 'down',  pos: {i:ROWS-1,       j:((ROWS/2)-1), matchI: 0 ,           matchJ: ((ROWS/2)-1)}}
	];

var GAMER_IMG = '<img src="img/gamer.png">';
var GLUED_GAMER_IMG = '<img src="img/gamer-purple.png">';
var BALL_IMG = '<img src="img/ball.png">';
var GLUE_IMG = '<img src ="img/glue.png">';

var gGamerPos = {i: 5, j: 5};
var gBoard;
var gBallsInterval;
var gGlueInterval;

var gBallCounter;
var gBallsColected;

var gIsGlued;


function initGame() {
	var elMessage = document.querySelector('#message');
	elMessage.innerHTML = 'Balls Colected: ';
	
	var elBtn = document.querySelector('#restartbtn');
	elBtn.style.display='none';
	
	gBoard = buildBoard();
	renderBoard(gBoard);

	gBallCounter = 0;
	gBallsColected = 0;
	gIsGlued = false;
	
	gBallsInterval = setInterval(addingBalls, 1000);
	gGlueInterval = setInterval(addingGules, 5000);
}

// Add passages that take the gamer from left/right or top/bottom:
function buildBoard() {
	// DONE: Create the Matrix 10 * 12
	var board = [];
	for(var i = 0; i< ROWS; i++) {
		board[i] = [];
		for(var j = 0; j< COLS; j++) {
			// DONE: Put FLOOR everywhere and WALL at edges
			var cell = {type: FLOOR, gameElement: null};
			if(i === 0 || j === 0 || i === ROWS - 1 || j === COLS -1 ) {
				cell.type = WALL;
			}
			board[i][j] = cell;
		}
	}
	
	// DONE: Place the gamer
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	
	for (var i = 0; i < gWindowsPos.length; i++) {
		var currWindow = gWindowsPos[i].pos;
		board[currWindow.i][currWindow.j].type = FLOOR;
	}

	// console.log(board);
	return board;
}

// Render the board to an HTML table

function renderBoard(board) {
	var elBoard = document.querySelector('.board');
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];
			
			var cellClass = getClassName({i:i, j:j});

			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	// console.log('strHTML is:');
	// console.log(strHTML);
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location

function moveTo(i, j) {
	var isLegal = false;
	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to ake sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	for (var k = 0; k < gWindowsPos.length; k++) {
		var currWindow = gWindowsPos[k].pos;
		if (currWindow.i === gGamerPos.i && currWindow.matchI === i && currWindow.j === gGamerPos.j && currWindow.matchJ === j) {
			isLegal = true;
			break;
		}
	}
	
	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
		isLegal = true;
	}
	
	if ((isLegal === true) && (gIsGlued === false)) {
		// Play sound when collecting a ball
		if (targetCell.gameElement === BALL) {
			gBallsColected++;
			var collectSound = new Audio('sounds/collect.mp3');
    		collectSound.play();
			updateScore();
			isGameOver();
		}
		
		// when user steps  on GLUE he cannot move for 3 seconds
		if (targetCell.gameElement === GLUE) {
			gIsGlued = true;
			gluedMessage();

			setTimeout (function () {
				gIsGlued = false;
				gluedMessage();
				
			}, 3000);
		}

		// DONE: Move the gamer
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		renderCell(gGamerPos, '');
		
		gGamerPos.i = i;
		gGamerPos.j = j;
		
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		(gIsGlued)? renderCell(gGamerPos, GLUED_GAMER_IMG): renderCell(gGamerPos, GAMER_IMG);
	}
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location);
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
	var i = gGamerPos.i;
	var j = gGamerPos.j;

	var leftWindow = gWindowsPos[0].pos;
	var rightWindow = gWindowsPos[1].pos;
	var upWindow = gWindowsPos[2].pos;
	var downWindow = gWindowsPos[3].pos;

	//arrowLeft
	if (event.key === 'ArrowLeft') {
		if (leftWindow.i === i && leftWindow.j === j) {
			moveTo(leftWindow.matchI,leftWindow.matchJ);
		} else {
			moveTo(i, j - 1);
		}
	}

	//arrowRight
	if (event.key === 'ArrowRight') {
		if (rightWindow.i === i && rightWindow.j === j) {
			moveTo(rightWindow.matchI,rightWindow.matchJ);
		} else {
				moveTo(i, j + 1);
		}
	}
	
	//arrowUp
	if (event.key === 'ArrowUp') {
		if (upWindow.i === i && upWindow.j === j) {
			moveTo(upWindow.matchI,upWindow.matchJ);
		} else {	
			moveTo(i - 1, j);
		}
	}

	//arrowDown
	if (event.key === 'ArrowDown') {
		if (downWindow.i === i && downWindow.j === j) {
			moveTo(downWindow.matchI,downWindow.matchJ);
		} else {
			moveTo(i + 1, j);
		}
	}
}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

//Every few seconds a new ball is added in a random empty cell
function addingBalls() {
	var randI = Math.floor(Math.random()* (ROWS-1));
	var randJ = Math.floor(Math.random()* (COLS-1));

	if ((gBoard[randI][randJ].type === FLOOR) && (gBoard[randI][randJ].gameElement === null)) {
		gBoard[randI][randJ].gameElement = BALL;
		var currPos = {i: randI, j: randJ};
		renderCell(currPos, BALL_IMG);
		gBallCounter++;
	}	
}

//Add support for gameElement GLUE. GLUE is added to board every 5 seconds and gone after 3 seconds.
function addingGules() {
	var randI = Math.floor(Math.random()* (ROWS-1));
	var randJ = Math.floor(Math.random()* (COLS-1));

	if ((gBoard[randI][randJ].type === FLOOR) && (gBoard[randI][randJ].gameElement === null)) {
		gBoard[randI][randJ].gameElement = GLUE;
		var currPos = {i: randI, j: randJ};
		renderCell(currPos, GLUE_IMG);
		setTimeout (function deleteGlue() {
			if (gBoard[randI][randJ].gameElement === GLUE) {
				gBoard[randI][randJ].gameElement = '';
				renderCell(currPos, '');
			}
		}, 3000);
		
	}	
}

// Show how many balls were collected
function updateScore() {
	var elScore = document.querySelector('#score');
	var sHTML = (gBallsColected === 1)? gBallsColected +' ball' : gBallsColected +' balls';
	
	elScore.innerHTML = sHTML;
}

// When gamer collects all balls – game over - let the user restart the game by clicking a Restart button
function isGameOver() {
	if ((gBallCounter === gBallsColected) && (gBallCounter !== 0)) {
		clearInterval(gBallsInterval);
		clearInterval(gGlueInterval);
		
		var elMessage = document.querySelector('#message');
		elMessage.innerHTML = 'You collected all the balls! game over';

		var elMessage = document.querySelector('#score');
		elMessage.innerHTML = '';

		var elBtn = document.querySelector('#restartbtn');
		elBtn.style.display='block';
	}
}

function gluedMessage() {
	var elHGlued = document.querySelector('#glued');
	var sHTML = (gIsGlued)? 'you\'re glued!!' : '';
	
	elHGlued.innerHTML = sHTML;
}
