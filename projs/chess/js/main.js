'use strict'

// Pieces Types
var KING_WHITE = '♔';
var QUEEN_WHITE = '♕';
var ROOK_WHITE = '♖';
var BISHOP_WHITE = '♗';
var KNIGHT_WHITE = '♘';
var PAWN_WHITE = '♙';
var KING_BLACK = '♚';
var QUEEN_BLACK = '♛';
var ROOK_BLACK = '♜';
var BISHOP_BLACK = '♝';
var KNIGHT_BLACK = '♞';
var PAWN_BLACK = '♟';

var SIZE = 8

// The Chess Board
var gBoard;
var gSelectedElCell = null;

function restartGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function buildBoard() {
    // DONE: build the board 8 * 8
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board[i] = []
        for (var j = 0; j < SIZE; j++) {
            var piece = ''
            if (i === 1) piece = PAWN_BLACK
            if (i === 6) piece = PAWN_WHITE
            board[i][j] = piece
        }
    }

    board[0][0] = board[0][7] = ROOK_BLACK;
    board[0][1] = board[0][6] = KNIGHT_BLACK;
    board[0][2] = board[0][5] = BISHOP_BLACK;
    board[0][3] = QUEEN_BLACK;
    board[0][4] = KING_BLACK;

    board[7][0] = board[7][7] = ROOK_WHITE;
    board[7][1] = board[7][6] = KNIGHT_WHITE;
    board[7][2] = board[7][5] = BISHOP_WHITE;
    board[7][3] = QUEEN_WHITE;
    board[7][4] = KING_WHITE;

    // console.table(board);
    return board;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            // DONE: figure class name
            var className = (i + j) % 2 === 0 ? 'white' : 'black';
            var tdId = 'cell-' + i + '-' + j;
            strHtml += '<td id="' + tdId + '" onclick="cellClicked(this)" ' +
                'class="    ' + className + '">' + cell + '</td>';
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}

function cellClicked(elCell) {
    // DONE: if the target is marked - move the piece!
    if(elCell.classList.contains('mark')) {
        movePiece(gSelectedElCell, elCell)
        cleanBoard();
        return
    }
    
    cleanBoard();

    elCell.classList.add('selected');
    gSelectedElCell = elCell;

    var cellCoord = getCellCoord(elCell.id);

    var piece = gBoard[cellCoord.i][cellCoord.j];

    var possibleCoords = [];
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord);
            break;
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord);
            break;
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord);
            break;
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE);
            break;
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord);
            break;
        case KING_BLACK:
        case KING_WHITE:
            possibleCoords = getAllPossibleCoordsKing(cellCoord);
            break;

    }
    markCells(possibleCoords);
}

function movePiece(elFromCell, elToCell) {
    // DONE: use: getCellCoord to get the coords, move the piece
    // update the MODEl, update the DOM
    var fromCoords = getCellCoord(elFromCell.id)
    var toCoords = getCellCoord(elToCell.id)

    var piece = gBoard[fromCoords.i][fromCoords.j]
    gBoard[fromCoords.i][fromCoords.j] = ''
    gBoard[toCoords.i][toCoords.j] = piece
    
    elFromCell.innerText = ''
    elToCell.innerText = piece
}

function markCells(coords) {
    // DONE: query select them one by one and add mark 
    for(var i = 0; i < coords.length; i++) {
        var cellId = getSelector(coords[i])
        var currCell = document.querySelector(cellId);
        currCell.classList.add('mark')
        
    }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    var strs = strCellId.split('-')
    coord.i = +strs[1];
    coord.j = +strs[2];
    // console.log('coord', coord);
    return coord;
}

function cleanBoard() {
    var tds = document.querySelectorAll('.mark, .selected');
    for (var i = 0; i < tds.length; i++) {
        tds[i].classList.remove('mark', 'selected');
    }
}

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}

function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    var res = [];
    // DONE: handle PAWN
    var diff = isWhite ? -1 : 1
    var nextPos = { i: pieceCoord.i + diff, j: pieceCoord.j }
    if (isEmptyCell(nextPos)) res.push(nextPos)
    else return res

    if ((pieceCoord.i === 1 && !isWhite) || (pieceCoord.i === 6 && isWhite)) {
        diff *= 2
        var nextPos = { i: pieceCoord.i + diff, j: pieceCoord.j }
        if (isEmptyCell(nextPos)) res.push(nextPos)
    }
    return res;
}

function getAllPossibleCoordsRook(pieceCoord) {
    var res = [];
    var i, j, currCoord;
    //up
    j = pieceCoord.j;
    for (var idx = pieceCoord.i - 1; idx >= 0; idx--) {
        currCoord = { i: idx, j: j };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }

    //down
    j = pieceCoord.j;
    for (var idx = pieceCoord.i + 1; idx < 8; idx++) {
        currCoord = { i: idx, j: j };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }
    
    //left
    i = pieceCoord.i
    for (var idx = pieceCoord.j - 1; idx >= 0; idx--) {
        currCoord = { i: i, j: idx };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }

    //rigth
    i = pieceCoord.i
    for (var idx = pieceCoord.j + 1; idx < 8; idx++) {
        currCoord = { i: i, j: idx };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }
    
    return res;
}

function getAllPossibleCoordsBishop(pieceCoord) {
    var res = [];
    var i, currCoord;
    
    //sec diag - up
    i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        currCoord = { i: i--, j: idx };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }

    //main diag - up
    i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j - 1; i >= 0 && idx >= 0; idx--) {
        currCoord = { i: i--, j: idx };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }

    //sec diag - down
    i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j - 1; i < 8 && idx >= 0; idx--) {
        currCoord = { i: i++, j: idx };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }

    //main diag - down
    i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j + 1; i < 8 && idx < 8; idx++) {
        currCoord = { i: i++, j: idx };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }
    
    return res;
}

function getAllPossibleCoordsKnight(pieceCoord) {
    var res = [];
    
    var posArr = [
        {iPos: pieceCoord.i -2 , jPos: pieceCoord.j -1},
        {iPos: pieceCoord.i -2, jPos: pieceCoord.j +1},
        {iPos: pieceCoord.i -1, jPos: pieceCoord.j -2},
        {iPos: pieceCoord.i -1, jPos: pieceCoord.j +2},
        {iPos: pieceCoord.i +1, jPos: pieceCoord.j -2},
        {iPos: pieceCoord.i +1, jPos: pieceCoord.j +2},
        {iPos: pieceCoord.i +2, jPos: pieceCoord.j -1},
        {iPos: pieceCoord.i +2, jPos: pieceCoord.j +1}]

        for (var i = 0; i < posArr.length; i++) {
            var currCoord = { i: posArr[i].iPos, j: posArr[i].jPos };
            if (currCoord.i < 0 || currCoord.i >= SIZE || currCoord.j < 0 || currCoord.j >= SIZE) continue;
            if (!isEmptyCell(currCoord)) continue;
            res.push(currCoord);
        }
    return res;
}

function getAllPossibleCoordsKing (pieceCoord) {
    var res = [];
    
    for (var i = pieceCoord.i-1; i <= pieceCoord.i+1 ; i++) {
        if (i < 0 || i > SIZE-1) continue;
        for (var j = pieceCoord.j -1; j <= pieceCoord.j +1; j++) {
            if (j < 0 || j > SIZE-1) continue;
            if (i === pieceCoord.i && j === pieceCoord.j) continue;
            var currCoord = { i: i, j: j };
            if (!isEmptyCell(currCoord)) continue;
            res.push(currCoord);
        }
    }
        
    return res;
}

function getAllPossibleCoordsQueen (pieceCoord) {
    var res = [];
    
    //sec diag - up
    var i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        var currCoord = { i: i--, j: idx };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }

    //main diag - up
    i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j - 1; i >= 0 && idx >= 0; idx--) {
        var currCoord = { i: i--, j: idx };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }

    //sec diag - down
    i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j - 1; i < 8 && idx >= 0; idx--) {
        var currCoord = { i: i++, j: idx };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }

    //main diag - down
    i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j + 1; i < 8 && idx < 8; idx++) {
        var currCoord = { i: i++, j: idx };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }
    
    //up
    var j = pieceCoord.j
    for (var idx = pieceCoord.i - 1; idx >= 0; idx--) {
        var currCoord = { i: idx, j: j };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }

    //down
    var j = pieceCoord.j
    for (var idx = pieceCoord.i + 1; idx < 8; idx++) {
        var currCoord = { i: idx, j: j };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }
    
    //left
    var i = pieceCoord.i
    for (var idx = pieceCoord.j - 1; idx >= 0; idx--) {
        var currCoord = { i: i, j: idx };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }

    //rigth
    var i = pieceCoord.i
    for (var idx = pieceCoord.j + 1; idx < 8; idx++) {
        var currCoord = { i: i, j: idx };
        if (!isEmptyCell(currCoord)) break;
        res.push(currCoord);
    }
    
    return res;
}
