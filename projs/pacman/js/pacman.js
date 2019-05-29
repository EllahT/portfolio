'use strict'

var gPacman;
var PACMAN = newFunction()

function newFunction() {
    return '<div id= "pacman"><div class="top topRight"></div><div class="bottom bottomRight"></div></div>';
}

function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 5
        },
        isSuper: false,
        turn: 'right'
    };

    renderCell(gPacman.location, PACMAN, '#FFFFFF');
}

function movePacman(eventKeyboard) {
    // console.log('eventKeyboard:', eventKeyboard);

    if (gState.isGameDone) return;

    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    };

    switch (eventKeyboard.code) {

        case 'ArrowUp':
            //console.log('Arrow Up!');
            gPacman.turn = 'up';
            nextLocation.i--;
            break;
        case 'ArrowDown':
            //console.log('Arrow Down!');
            gPacman.turn = 'down';
            nextLocation.i++;
            break;
        case 'ArrowLeft':
                //console.log('Arrow Left!');
                gPacman.turn = 'left';
                nextLocation.j--;
                break;
        case 'ArrowRight':
                //console.log('Arrow Right!');
                gPacman.turn = 'right';
                nextLocation.j++;
                break;
    }

    var nextCell = gBoard[nextLocation.i][nextLocation.j];

    // console.log('Heading: row:', newLocation.i , ' col: ', newLocation.j );
    // console.log('Whats there:', gBoard[newLocation.i][newLocation.j]);

    // DONE: hitting a wall, not moving anywhere
    if (nextCell === WALL) return;
    if (nextCell === SUPERFOOD && gPacman.isSuper === true) return;


    // DONE: update the model to reflect movement
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    gEmptyCells.push({ i: gPacman.location.i, j: gPacman.location.j });
    // DONE: render updated model to the DOM (set EMPTY)
    renderCell(gPacman.location, EMPTY, '#FFFFFF');

    // DONE: Update the pacman MODEL to new location 
    gPacman.location.i = nextLocation.i;
    gPacman.location.j = nextLocation.j;


    // DONE: render updated model to the DOM
    gBoard[nextLocation.i][nextLocation.j] = PACMAN
    renderCell(nextLocation, PACMAN, '#FFFFFF');


    checkEngage(nextLocation)

    // DONE: hitting FOOD? update score
    if (nextCell === FOOD) updateScore(FOOD);
    if (nextCell === SUPERFOOD) superFoodEffect();
    if (nextCell === CHERRY) updateScore(CHERRY);

}

function superFoodEffect() {
    gPacman.isSuper = true;
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        renderCell(ghost.location, GHOST, 'blue');
    }

    var elGameStatus = document.querySelector('#gameStatus');
    var sHtml = 'Pacman is SUPER!';
    elGameStatus.innerHTML = sHtml;

    setTimeout(function() {
        gPacman.isSuper = false;
        for (var i = 0; i < gGhosts.length; i++) {
            var ghost = gGhosts[i];
            renderCell(ghost.location, GHOST, ghost.color);
        }

        for (var i = 0; i < GHOSTNUMBER; i++) {
            if (gGhosts[i]) continue;
            createGhost(gBoard);
        }

        var elGameStatus = document.querySelector('#gameStatus');
        if (gState.isGameDone === false) {
            var sHtml = "Game is On- collect all the food!";
            elGameStatus.innerHTML = sHtml;
        }
    }, 5000);
}