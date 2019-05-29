'use strict';

var MINE = '💣';
var EMPTY = ' ';
var MARK = '🏴';
var WIN = '😎';
var LOST = '😵';
var LIVE = '😊';
var HINT = '👓';
var HINTS = 3;
var LIVES = 2;

var gBoard = []

var gLevel = {
  beginner: {SIZE: 4, MINES: 2},
  medium: {SIZE: 8, MINES: 12},
  expert: {SIZE: 12, MINES: 30},
  currLevel: {SIZE: 4, MINES: 2, name: 'beginner'}
 };

var gGame = {
  isWin: false,
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  minesPos: [],
  livesLeft: LIVES,
  isHintMode: false,
  hintsLeft: HINTS
}

var gTimerInterval = null;

var gIsFisrtClick = true;

function initGame() {
  disableRightClick();
  console.clear();

  gGame = {
    isWin: false,
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    minesPos: [],
    livesLeft: LIVES,
    isHintMode: false,
    hintsLeft: HINTS
  }

  updatedLives(LIVES);
  updatedHints(HINTS);
  
  clearInterval(gTimerInterval);
  gTimerInterval = null;
  gIsFisrtClick = true;

  var elResetBtn = document.querySelector('#resetBtn');
  elResetBtn.innerHTML = LIVE;

  var elTimer = document.querySelector('#timer');
  elTimer.innerHTML = '0';

  var elBoard = document.querySelector('.board-container');
  elBoard.classList.remove('hinted');
  elBoard.classList.remove('distres');

  gBoard = buildBoard();
  console.table(gBoard);
  renderBoard();
  isThereBestTime();

}

function buildBoard() {
  var board = []
  for (var i = 0; i < gLevel.currLevel.SIZE; i++) {
    board[i] = [];
    for (var j = 0; j < gLevel.currLevel.SIZE; j++) {
      board[i][j] = {minesAroundCount: 0, isShown: false, isMine: false, isMarked: false}
    }
  }

  return board;
}

function setMines(firstClickedI,firstClickedJ) {
  var minesCreatedCount = 0; 
  
  while (minesCreatedCount < gLevel.currLevel.MINES) {
    var randI = getRandomIntInclusive(0, (gLevel.currLevel.SIZE-1))
    var randJ = getRandomIntInclusive(0, (gLevel.currLevel.SIZE-1))
    if ((!gBoard[randI][randJ].isMine) && (!(randI === firstClickedI && randJ === firstClickedJ))) {
      gBoard[randI][randJ].isMine = true;
      minesCreatedCount++;
      gGame.minesPos.push({i:randI,j:randJ});
      updateNegsCount(gBoard, {i: randI,j: randJ});
    }
  }
  
  return gBoard;
}

function updateNegsCount(board, location) {
  var iIdx = location.i;
  var jIdx = location.j;
  for (var i = (iIdx-1); i <= (iIdx+1) ; i++) {
    if (!(i < 0 || i > (gLevel.currLevel.SIZE-1))) {
      for (var j = (jIdx -1); j <= (jIdx +1); j++) {
        if (!(j < 0 || j > (gLevel.currLevel.SIZE-1))) {
          if (!(i === iIdx && j === jIdx)) {
            var currNeg = board[i][j];
            currNeg.minesAroundCount++;
          }
        }
      }
    }  
  }    
}
  
function renderBoard() {
  var elBoard = document.querySelector('#board');
  
  var sHtml = '';
  
  for (var i = 0; i < gBoard.length; i++) {
    sHtml +='<tr>';
    for (var j = 0; j <gBoard[i].length; j++) {
      var cellClass = getClassName ({i: i, j: j});
      var spanClass = 'counter'+ gBoard[i][j].minesAroundCount;
      var value = (gBoard[i][j].minesAroundCount)? gBoard[i][j].minesAroundCount : EMPTY;
      if (gBoard[i][j].isMine) value = MINE;
      sHtml +='<td><span class="cell '+cellClass+' '+spanClass+' hide">'+value+'</span><button class="cellBtn '+cellClass+'" onclick="cellClicked('+i+','+j+')" onContextMenu="cellMarked('+i+','+j+')"></button></td>';
    }
  }

  elBoard.innerHTML = sHtml;
}

function cellClicked(i, j) { 
  var cell = gBoard[i][j];
  var elCell = document.querySelectorAll('.'+getClassName({i: i, j: j}));
  if (gIsFisrtClick) fisrtClick(i,j);

  if (!gGame.isOn) return;
  if (cell.isMarked) return;
  if (gGame.isHintMode) {
    hintMeFor(elCell,i,j);
    return;
  }

  showCell(elCell,i,j);
  
  (cell.isMine)? clickedAMine(): expandShownRec(i,j);

  checkWin();
  updateTime();
}

function clickedAMine() {
  if (!gGame.livesLeft) {
    endGame(false)
  } else {
      var elBoard = document.querySelector('.board-container');
      elBoard.classList.add('distres');
      setTimeout(function() {
        var elBoard = document.querySelector('.board-container');
        elBoard.classList.remove('distres');
      }, 1000);
      updatedLives(gGame.livesLeft-1);
  }
}

function cellMarked(i,j) {
  if (!gGame.isOn) return;

  if (gIsFisrtClick) fisrtClick();
  
  var elCell = document.querySelectorAll('.'+getClassName({i: i, j: j}));
  var elBtn = elCell[1];
  var elMarkedCounter = document.querySelector('#flagCounter');

  var cell = gBoard[i][j];
  if (cell.isMarked) {
    cell.isMarked = false;
    elBtn.innerHTML = EMPTY;
    gGame.markedCount--;
  } else {
    cell.isMarked = true;
    elBtn.innerHTML = MARK;
    gGame.markedCount++;
  } 

  elMarkedCounter.innerHTML = gGame.markedCount;

  checkWin();
  updateTime();
}

function checkWin() {
  var playedCells = gGame.shownCount+gGame.markedCount;
  var minesMarkedOrExposed = gGame.markedCount+(LIVES-gGame.livesLeft);
  if ((playedCells === gLevel.currLevel.SIZE*gLevel.currLevel.SIZE) && (minesMarkedOrExposed === gLevel.currLevel.MINES)) {
    gGame.isWin = true;
    endGame();
  } 
}
  
function endGame() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  gGame.isOn = false;
  if (gGame.isWin) {
    setTimeout(function () {alert('you won game!')},1000);
    isBestTime();
  } else {
    setTimeout(function () {alert('you lost that one... try again')},1000);
    for (var i = 0; i < gGame.minesPos.length; i++) {
      var minePos = gGame.minesPos[i];
      var elCell = document.querySelectorAll('.'+getClassName(minePos));
      showCell(elCell, minePos.i, minePos.j);
    }
  }

  var elResetBtn = document.querySelector('#resetBtn');
  elResetBtn.innerHTML = (gGame.isWin)? WIN : LOST ;
}

function showCell(elCell, i,j) {
  if (gBoard[i][j].isMarked) return;
  
  var elSpan = elCell[0];
  var elBtn = elCell[1];

  var cell = gBoard[i][j];

  if (!cell.isShown) {
    cell.isShown = true;
    gGame.shownCount++;
  } 
  
  if (!elBtn.classList.contains('hide')) elBtn.classList.add('hide');
  if (elSpan.classList.contains('hide')) elSpan.classList.remove('hide');
}

function updateTime() {
  var sHtml = '';
  var elTimer = document.querySelector('#timer');

  //fisrt num clicked
  if (!gTimerInterval) {
      gTimerInterval = setInterval(function() {
          var time = gGame.secsPassed++;
          elTimer.innerText = time;
      }, 1000)
    
  //last num clicked
  } else if (!gGame.isOn) { 
      clearInterval(gTimerInterval);
  }
}

function isThereBestTime() {
  var sHtml = '';
  var elBestTime = document.querySelector('#bestTime');
  var level = gLevel.currLevel.name;
  var localStorageName = level+'BestTime';

  if (localStorage.getItem(localStorageName)) {
    sHtml += localStorage.getItem(localStorageName);
    sHtml +=' seconds';
  } else {
    sHtml+='this is the first time you\'re playing that level';
  }

  elBestTime.innerText = sHtml;
}

function isBestTime() {
  if (gGame.isOn) return;

  var sHtml = '';
  var elBestTime = document.querySelector('#bestTime');
  var currTime = gGame.secsPassed;

  var level = gLevel.currLevel.name;
  var localStorageName = level+'BestTime';

  if (!(localStorage.getItem(localStorageName)) || (currTime < localStorage.getItem(localStorageName))) {
    localStorage.setItem(localStorageName, currTime);
    setTimeout(function () {alert('you\'re faster than all the others (so far)! well done!');}, 1000);
  
    sHtml += localStorage.getItem(localStorageName);
    sHtml +=' seconds';
    elBestTime.innerText = sHtml;   
  }
}

function changeLevel(value) {
  var elBoard = document.querySelector('.board-container');
  var elHeader = document.querySelector('.header');
  var elBottom = document.querySelector('.bottom');
  var levelBeforeChange = gLevel.currLevel.name;
  gLevel.currLevel.SIZE = gLevel[value].SIZE;
  gLevel.currLevel.MINES = gLevel[value].MINES;
  gLevel.currLevel.name = value;

  elBoard.classList.remove(levelBeforeChange);
  elBoard.classList.add(value);

  elHeader.classList.remove(levelBeforeChange.slice(0,3));
  elHeader.classList.add(value.slice(0,3));
  
  elBottom.classList.remove(levelBeforeChange.slice(0,3));
  elBottom.classList.add(value.slice(0,3));

  initGame(); 
}

function fisrtClick(i,j) {
  setMines(i,j);
  gIsFisrtClick = false;
  updateTime();
  renderBoard();

  if ((!gBoard[i][j].isShown)) {
    if (!gGame.isHintMode) {
      var elCell = document.querySelectorAll('.'+getClassName({i: i, j: j}));
      gBoard[i][j].isShown = true;
      showCell (elCell,i,j);
      gGame.shownCount++;
    }
  }
}

function updatedLives(currLives) {
  gGame.livesLeft = currLives;
  var elLives = document.querySelector('#lives');
  var sHtml ='';
  for (var i = 0; i <= currLives; i++) {
    sHtml+=LIVE;
  }
  
  elLives.innerHTML = sHtml;
}

function hintMe() {
  if (!gGame.isOn) return;
  
  var elBoard = document.querySelector('.board-container');
  elBoard.classList.add('hinted');
  gGame.isHintMode = true;
} 

function hintMeFor(elCell,iIdx,jIdx) {
  
  var cells =[];
  for (var i = (iIdx-1); i <= (iIdx+1) ; i++) {
    if (!(i < 0 || i > (gLevel.currLevel.SIZE-1))) {
      for (var j = (jIdx -1); j <= (jIdx +1); j++) {
        if (!(j < 0 || j > (gLevel.currLevel.SIZE-1))) {
          var elCell = document.querySelectorAll('.'+getClassName({i: i, j: j}));
          cells.push({cell: elCell, i: i, j: j});
        }
      }
    }
  }

  console.log(cells)

  for (var k = 0; k < cells.length; k++) {
    var currElCell = cells[k].cell;
    var currElSpan = currElCell[0];
    var currElBtn = currElCell[1];
    if (!gBoard[cells[k].i][cells[k].j].isShown) {
      currElSpan.classList.remove('hide');
      currElBtn.classList.add('hide');
    }
  }

  setTimeout(hidePicked, 1000, cells);
}

function hidePicked(cells) {
  updatedHints(gGame.hintesLeft-1);
  var elBoard = document.querySelector('.board-container');
  elBoard.classList.remove('hinted');
  
  for (var k = 0; k < cells.length; k++) {
    var currElCell = cells[k].cell;
    var currElSpan = currElCell[0];
    var currElBtn = currElCell[1];
    if (!gBoard[cells[k].i][cells[k].j].isShown) {
      currElSpan.classList.add('hide');
      currElBtn.classList.remove('hide');
    }
  }
}

function updatedHints(currHints) {
  
  gGame.isHintMode = false;
  gGame.hintesLeft = currHints;
  var elHints = document.querySelector('#hints');
  var sHtml ='';
  
  for (var i = 0; i < gGame.hintesLeft; i++) {
    sHtml+='<button  onclick="hintMe()">👓</button>';
  }
  
  elHints.innerHTML = sHtml;
}

function expandShownRec(iIdx,jIdx) {
  // number- open only it
  // mine - not posible because he'll be a number first
  // empty and not shown, show and try neigboors

  var elCell = document.querySelectorAll('.'+getClassName({i: iIdx, j: jIdx}));
  if (gBoard[iIdx][jIdx].minesAroundCount) {
    showCell(elCell,iIdx,jIdx); 

  } else {
    for (var i = (iIdx-1); i <= (iIdx+1) ; i++) {
      if (!(i < 0 || i > (gLevel.currLevel.SIZE-1))) {
        for (var j = (jIdx -1); j <= (jIdx +1); j++) {
          if (!(j < 0 || j > (gLevel.currLevel.SIZE-1))) {
            elCell = document.querySelectorAll('.'+getClassName({i: i, j: j}));
            if (!gBoard[i][j].isShown) {
            showCell(elCell,i,j);
            expandShownRec(i,j)
            }
          }
        }
      }
    }
  }
}
