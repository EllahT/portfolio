'use strict'
const KEY = 'books'
var gBooks;

function getBooks(start,end) {
    return gBooks.slice(start,end);
}

function createBooks() {
    var books = loadFromStorage(KEY)
    if (!books || !books.length) {
        books = []
        var names = ['The Guernsey Literary and Potato Peel Pie Society', 'Belong to Me', 'The Brutal Telling', 'The Girl with the Dragon Tattoo', 'Garden Spells','Half Broke Horses', 'The Thirteenth Tale', 'The Light Between Oceans']
        for (var i = 0; i < names.length; i++) {
            var name = names[i]
            books.push(createBook(name))
        }
    }
    gBooks = books;
    saveBooks();
}

function createBook(bookName, price) {
    return {
        id: makeId(),
        name: bookName,
        price: (price)? price : getRandomIntInclusive(20,100),
        imgUrl: getImgUrl(bookName),
        rate: 0
    }
}

function deleteBook(bookId) {
    var bookIdx = gBooks.findIndex(function (book) {
        return bookId === book.id
    })
    gBooks.splice(bookIdx, 1);
    saveBooks();
}

function addBook(name,price) {
    var book = createBook(name,price)
    gBooks.unshift(book);
    saveBooks();
}

function updateBook(bookId, newPrice) {
    var bookIdx = gBooks.findIndex(function(book){
        return book.id === bookId;
    })
    gBooks[bookIdx].price = newPrice;
    saveBooks();
}

function getImgUrl(bookName) {
    var url = 'img/'+bookName+'.jpg';
    return url;
}

function getBookById(bookId) {
    var book = gBooks.find(function (book) {
        return bookId === book.id
    })
    return book
}

function updateRate(bookId, newRate) {
    if (newRate < 0 || newRate > 10) return;
    var bookIdx = gBooks.findIndex(function(book){
        return book.id === bookId;
    })
    gBooks[bookIdx].rate = newRate;
}

function changeRate(bookId,op) {
    var book = getBookById(bookId);
    if ((book.rate === 0 && op === '-') || (book.rate === 10 && op === '+')) return;
    (op === '+')? book.rate++: book.rate--;
}

function saveBooks() {
    saveToStorage(KEY, gBooks)
}

function sortBooks(sortingParam,currSymbol) {
    var sortingFunc = creatSortFunc(sortingParam,currSymbol);
    gBooks.sort(sortingFunc);
    saveBooks();
}

function creatSortFunc(param,op) {
    function sorting(a,b) {
        if (op === '⬆') {
            if (a[param] > b[param]) {
                return 1;
            } else if (a[param] < b[param]) {
                return -1;
            } else {
                return 0;
            }    
        } else {
            if (a[param] < b[param]) {
                return 1;
            } else if (a[param] > b[param]) {
                return -1;
            } else {
                return 0;
            }    
        } 
    }
    return sorting;
}

function getBooksCount() {
    return gBooks.length-1;
}