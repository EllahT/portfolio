'use strict'
console.log('in-picture solution - Ellah')


// 1. gQuests = [{id: 1, opts:[], correctOptIndex:1 }]
// gCurrQuestIdx = 0
// 2. Note: It is convenient to have the images named by the quest
// id (e.g. : 1.jpg)
// 3. If the player is correct, move on to next quest
// 4. Some more functions:
// a. initGame()
// b. createQuests() – return an hard-coded (ready made)
// array for now with at least 3 questions
// c. renderQuest()
// d. checkAnswer(optIdx)

var gCurrQuestIdx = 1;
var gQuests;

function initGame() {
  //model
  gQuests = createQuest();
  gCurrQuestIdx = 1;
  //DOM
  renderQuest();

}

function createQuest() {
  var gQuests = [
    {},
    {id: 1,
    opts: ['ninja unicorns', 'ninja turtles'],
    correctOptIndex: 0},
    
    {id: 2,
      opts: ['batman', 'batcorn'],
      correctOptIndex: 1},

    {id: 3,
    opts: ['nyan unicorn', 'nyan cat'],
    correctOptIndex: 0}];
    
  return gQuests;

}

function renderQuest() {
  var sHtml = '';
  var elBoard = document.querySelector('.board');
  var currQuest = gQuests[gCurrQuestIdx];
  
  sHtml += '<div><img src="img/'+gCurrQuestIdx+'.jpg"></div>';
  sHtml += '<div><h2>Question number '+gCurrQuestIdx+' (out of '+(gQuests.length-1)+') <br> which of the following is true to the picture?</h2>';
  
  for (var i = 0; i < currQuest.opts.length; i++) { 
    sHtml +='<div class = "opt opt'+gCurrQuestIdx+'" onclick="checkAnswer('+i+')">'+currQuest.opts[i]+'</div>';
  }

  sHtml +='</div>';

  elBoard.innerHTML = sHtml;

}

function checkAnswer(optIdx) { 
  if (gCurrQuestIdx > gQuests.length-1) return;
  
  if (optIdx === gQuests[gCurrQuestIdx].correctOptIndex) {
    gCurrQuestIdx++
    var audioRight = new Audio('sounds/right.mp3');
    audioRight.play();
    if (gCurrQuestIdx < gQuests.length) {
      renderQuest();
    } else {
      setTimeout(clearBoard, 1000);
    }
  } else {
    console.log('wrong answer, try again');
    var audioWrong = new Audio('sounds/wrong.mp3');
    audioWrong.play();
  }

}

function clearBoard() {
  var sHtml = '';
  var elBoard = document.querySelector('.board');

  sHtml = '<h2> Congrats!! you won the game!</h2>'

  elBoard.innerHTML = sHtml;
}