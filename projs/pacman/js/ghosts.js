'use strict'

var GHOST = '&#9781;';
var GHOSTNUMBER = 3;

var gIntervalGhosts;
var gGhosts;

function createGhost(board) {
    var ghost = {
        color: getRandomColor(),
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD
    };
    gGhosts.push(ghost);
    renderCell(ghost.location, GHOST, ghost.color);
}


function createGhosts(board) {
    // DONE: empty the gGhosts array, create some ghosts
    //  and run the interval to move them
    gGhosts = []
    for(var i = 0; i < GHOSTNUMBER; i++) {
        createGhost(board)
    }

    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        
        // DONE: create the nextLocation = getMoveDiff();
        var iDiff = getRandomIntInclusive(-1,1)
        var jDiff = getRandomIntInclusive(-1,1)

        var nextLocation = {
            i: ghost.location.i + iDiff,
            j: ghost.location.j + jDiff,
        }
        
        // console.log('nextLocation', nextLocation);

        // DONE: if WALL return
        if(gBoard[nextLocation.i][nextLocation.j] === WALL) return
        
        // DONE: if GHOST return
        if(gBoard[nextLocation.i][nextLocation.j] === GHOST) return

        // DONE: move the ghost
        // DONE: set back what we stepped on: update Model, DOM
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
        renderCell(ghost.location, ghost.currCellContent, '#FFFFFF');
        
        ghost.location.i = nextLocation.i;
        ghost.location.j = nextLocation.j;
        // DONE: keep the contnet of the cell we are going to
        ghost.currCellContent = gBoard[nextLocation.i][nextLocation.j];
        
        // DONE: move the ghost model and update dom
        gBoard[nextLocation.i][nextLocation.j] = GHOST;
        renderCell(nextLocation, GHOST, ghost.color);

        checkEngage()
    }
}

function getGhostHTML(ghost) {
    return `<span>${GHOST}</span>`
}




