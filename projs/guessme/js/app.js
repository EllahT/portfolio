'use strict';
$(document).ready(init);

function init() {
    createQuestsTree();
    $('.btnReady').click(onStartGuessing);
}

function onStartGuessing() {
    // DONE: hide the game-start section
    $('.game-start').hide();
    renderQuest();
    // DONE: show the quest section
    $('.quest').show();
}

function renderQuest() {
    // DONE: select the <h2> inside quest and update its text by the currQuest text
    $('.quest h2').text(getCurrQuest().txt);
}

function onUserResponse(res) {
    // If this node has no children
    if (isChildless(gCurrQuest)) {
        if (res === 'yes') {
            $('.modal').show();
            $('.btnReset').click(onRestartGame);
            $('.btnHideModal').click(function () {
                $('.modal').hide();
            })
            // DONE: improve UX

        } else {
            $('.quest').hide();
            $('.alert').show();
            $('.close').click(function() {
                $('.new-quest').show();
                $('.alert').hide();
            })
            // DONE: hide and show new-quest section
            
        }
    } else {
        // DONE: update the lastRes global var
        updateRes(res);
        moveToNextQuest(res);
        renderQuest();
    }
}

function onAddGuess() {
    // DONE: Get the inputs' values
    var guess = $('input[name="newGuess"]').val();
    var quest = $('input[name="newQuest"]').val();
    
    // DONE: Call the service addGuess
    addGuess(quest,guess);
    $('input[name="newGuess"]').val(' ');
    $('input[name="newQuest"]').val(' ');
    onRestartGame();
}

function onRestartGame() {
    $('.modal').hide();
    $('.new-quest').hide();
    $('.quest').hide();
    $('.game-start').show();
    restartQuests();
}

