'use strict';

var gameOverMessage = [['#','#','#','#','#','#','','','','','#','#','#','#','','','','','','#','','','','#','','','','','#','#','#','#','#','#'],
['#','','','','','','','','','#','','','','','#','','','','#','','#','','#','','#','','','','#','','','','',''],
['#','','','','#','#','','','','#','#','#','#','#','#','','','','#','','','#','','','#','','','','#','#','#','#','#',''],
['#','','','','','#','','','','#','','','','','#','','','','#','','','#','','','#','','','','#','','','','',''],
['#','#','#','#','#','#','','','','#','','','','','#','','','','#','','','#','','','#','','','','#','#','#','#','#','#'],
['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''],
['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''],
['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''],
['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''],
['','#','#','#','#','','','','','#','','','','','#','','','#','#','#','#','#','#','','','','#','#','#','#','#','','',''],
['#','','','','', '#','','','','#','','','','','#','','','#','','','','','','','','#','','','','','#','','',''],
['#','','','','','#','','','','','#','','','#','','','','#','#','#','#','#','#','','','#','#','#','#','#','','','',''],
['#','','','','','#','','','','','#','','','#','','','','#','','','','','','','','#','','','','#','','','',''],
['','#','#','#','#','','','','','','','#','#','','','','','#','#','#','#','#','#','','','#','','','','','#','','','']];

var WALL = '#';
var FOOD = '.';
var EMPTY = ' ';
var SUPERFOOD = '🏋';
var CHERRY = '🍒';

var CHERRYVALUE = 10;
var NORMALFOODVALUE = 1;
var GHOSTVALUE = 15;

var gEmptyCells = [];
var gCherryInterval;
var gBoard;
var gState = {
  score: 0,
  isGameDone: false,
  collectedNoramlFood: 0
};

function init() {
  var elGameStatus = document.querySelector('#gameStatus');
  elGameStatus.innerHTML = "Game is On";
  
  gState.score = 0;
  gState.collectedNoramlFood = 0;
  gState.isGameDone = false;

  var elScore = document.querySelector('h3 span');
  elScore.innerText = gState.score
  
  clearInterval(gIntervalGhosts);
  clearInterval(gCherryInterval);

  var elResetBtn = document.querySelector('#resetBtn');
  elResetBtn.classList.toggle('hide');

  gBoard = buildBoard();

  printMat(gBoard, '.board-container');
  
  console.table(gBoard)

  createPacman(gBoard);
  createGhosts(gBoard);
  gCherryInterval = setInterval (addingCherry, 1000);
}

function buildBoard() {
  var SIZE = 10;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD;

      if (i === 0 || i === SIZE - 1 ||
        j === 0 || j === SIZE - 1 ||
        (j == 3 && i > 4 && i < SIZE - 2)) {

        board[i][j] = WALL;
      }

      if ((i === 1 && j === 1) || (i === 1 && j === SIZE -2) || (i === SIZE -2 && j === SIZE -2) || (i === SIZE -2 && j === 1)) {
        board[i][j] = SUPERFOOD;
      
      }
    }
  }
  return board;
}

function updateScore(foodType) {
  // TODO: update both the model and the dom for the score
  if (foodType === FOOD) {
    gState.collectedNoramlFood++;
    gState.score += NORMALFOODVALUE;
  } else if (foodType === CHERRY) {
    gState.score += CHERRYVALUE;  
  } else if (foodType === GHOST) {
    gState.score += GHOSTVALUE;
  }
  
  var elScore = document.querySelector('h3 span');
  elScore.innerText = gState.score
  checkGameOver()
}

function printMat(mat, selector) {

  var elContainer = document.querySelector(selector);

  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell' + i + '-' + j;
      if (mat[i][j] === WALL) className+= ' wall';
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>';
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  
  elContainer.innerHTML = strHTML;
}

function renderCell(location, value, color) {
  // DONE: select the elCell and set the value  
  var cellSelector = '.' + getClassName(location)
  var elCell = document.querySelector(cellSelector);

  if (value === PACMAN) {
    console.log(gPacman.turn)
    switch (gPacman.turn) {
      case 'right':
          value = '<div id= "pacman"><div class="top topRight"></div><div class="bottom bottomRight"></div></div>';
          break;
      case 'left': 
          value = '<div id= "pacman"><div class="top topLeft"></div><div class="bottom bottomLeft"></div></div>';
          break;
      case 'up': 
          value = '<div id= "pacman"><div class="right rightTop"></div><div class="left leftTop"></div></div>';
          break;
      case 'down': 
          value = '<div id= "pacman"><div class="right rightBottom"></div><div class="left leftBottom"></div></div>';
          break;
    }
    
  }
  
  elCell.innerHTML = value;

  (value === GHOST)? elCell.classList.add('ghost'): elCell.classList.remove('ghost');
  
  if (gPacman.isSuper && elCell.classList.contains('ghost')) {
    elCell.style.color = 'blue';
  } else elCell.style.color = color;
}

function checkEngage() {
  var location = gPacman.location
  for (var i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i]
    if (location.i === ghost.location.i && location.j === ghost.location.j) {
      if (gPacman.isSuper === false) {
        doGameOver(false)
      } else { 
        gGhosts.splice(i,1);
        updateScore(GHOST);

      }
    }
  }
}

function doGameOver(isWin) {
  var elGameStatus = document.querySelector('#gameStatus');
  if(isWin) elGameStatus.innerHTML = "You WON the game!";
  else elGameStatus.innerHTML = "You lost... try again";
  gState.isGameDone = true;
  clearInterval(gIntervalGhosts);
  clearInterval(gCherryInterval);
  var elResetBtn = document.querySelector('#resetBtn');
  elResetBtn.classList.toggle('hide');
  printMat(gameOverMessage,'.board-container')
}

function checkGameOver() {
  if (gState.collectedNoramlFood === 56) doGameOver(true);
}

function addingCherry() {
  if (gState.collectedNoramlFood === 0) return;
  var randI = Math.floor(Math.random()* (gEmptyCells.length));
  var randCell = gEmptyCells[randI];

  if ((gPacman.location.i !== randCell.i) && (gPacman.location.j !== randCell.j)) {
    gBoard[randCell.i][randCell.j] = CHERRY;
		renderCell(randCell, CHERRY, 'red');
  }	
}