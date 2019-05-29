'use strict'
console.log('touch nums solution - Ellah')

// User sees a board with 16 cells, containing numbers 1..16, in a random order
    // o Hint: use an HTML table
    // o Hint: Nice technique for building the board: place the 16 numbers in a simple array, shuffle it, then build the <table> by popping a number 
    // from the nums array.
    // o Note: there is no need to use as matrix in this exercise
// • User should click the buttons in a sequence (1, 2, 3,… 16)
// • When user clicks the a button - call a function cellClicked(clickedNum)
    // o If right – the button changes its color
    // o When user clicks the wrong button noting happen
// • When user clicks the first number, game time starts and presented (3 digits after the dot, like in: 12.086)
// • Add difficulties (larger boards: 25, 36)


//TODO -  fix the timer

var gMatSize = 4;
var gNums = [];
var gBoard = [];
var gCounter = 1;
var gStartTime;
var gEndTime;
var gTimerInterval;
var gBestTime = Infinity;

function createNumsArray() {
    var nums = []
    for (var i = 0; i < gMatSize*gMatSize; i++) {
        nums[i] = i+1; 
    }

    return nums;
}

function initGame() {
    gStartTime =null;
    gEndTime = null;
    gTimerInterval = null;
    gNums = createNumsArray();
    gCounter = 1;
    //model 
    gBoard = createBoard();
    //DOM
    renderBoard(); 
  }
  
function createBoard() {
    var board = [];

    for (var i = 0; i < gMatSize*gMatSize; i++) {
        var randIdx = Math.floor(Math.random() * (gNums.length));
        var num = gNums.splice(randIdx, 1);
        board[i] = num[0];
    }

    return board;
  
  }
  
function renderBoard() {
    var sHtml = '';
    var elTableBoard = document.querySelector('#mat');
    var elLevelSpan = document.querySelector('#level');
    var elBoard = document.querySelector('.board');

    if (gMatSize) {
        sHtml += gMatSize+'*'+gMatSize;
        elLevelSpan.innerText = sHtml;
    }
    

    sHtml =''
    
    for (var i = 0; i < gMatSize; i++) { 
        sHtml +='<tr>';

        for (var j = 0; j < gMatSize; j++) {
            var num = gBoard.pop()
            sHtml +='<td><button class="num" onclick="cellClicked(this)">'+ num+'</button></td>';
        }
        
        sHtml +='</tr>';
    }
  
    elTableBoard.innerHTML = sHtml;

    elBoard.classList = 'board';
    elBoard.classList.add('level'+gMatSize);
}
  
function renderBottom() {
    var sHtml = '';
    var elTimer = document.querySelector('#timer');
    var elBestTime = document.querySelector('#bestTime');
    var elapsedTime = gEndTime- gStartTime;
    
    sHtml += '';
    
    elTimer.innerHTML = sHtml;

    sHtml = '';

    if (elapsedTime < gBestTime) {
        gBestTime = elapsedTime;
        sHtml += 'Best time: ' +(gBestTime/1000) + ' seconds';
        elBestTime.innerText = sHtml;   
    }
}

function cellClicked(elBtn) {
    var numClicked = elBtn.innerHTML;
    if (elBtn.classList.contains('clicked')) return;
    if (+numClicked === gCounter) {
        updateTime();
        elBtn.classList.add('clicked');
        gCounter++;
    } else {
        var audioWrong = new Audio('sounds/wrong.mp3');
        audioWrong.play();
    }

    if (gCounter === gMatSize*gMatSize) setTimeout(clearBoard, 2000)
  }

function updateTime() {
    var sHtml = '';

    //fisrt num clicked
    if (!gTimerInterval) {
        gStartTime = Date.now();
        gTimerInterval = setInterval(function() {

            var elTimer = document.querySelector('#timer');
            var time = (Date.now() - gStartTime) / 1000;
            elTimer.innerText = time.toFixed(3);

        }, 10)
	    
    //last num clicked
    } else if (gCounter === (gMatSize*gMatSize)) {
        
        gEndTime = Date.now();
        sHtml+= '<h3>final time is :' +(gEndTime-gStartTime)/1000+ ' seconds</h3>';
        clearInterval(gTimerInterval);
        setTimeout(renderBottom(), 5000);
    }
}

function clearBoard() {
    var sHtml = '';
    var elBoard = document.querySelector('#mat');
  
    sHtml = '<h2> Congrats!! you won the game!</h2>'
  
    elBoard.innerHTML = sHtml;
} 

function resetGame() {
    initGame();
}

function changeLevel(val) {
    gMatSize = val;
    initGame();
}