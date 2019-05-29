'use strict'
const KEY = 'books'
var gBooks;

function getBooks(start,end) {
    return gBooks.slice(start,end);
}

function createBooks() {
    var books = loadFromStorage(KEY)
    if (!books || !books.length) {
        books = [];
        var names = [{en:'The Guernsey Literary and Potato Peel Pie Society',he:'מועדון גרנזי לספרות ופלאי קליפות תפודים'}, 
                     {en:'Belong to Me',he:'שתהיה שלי'}, 
                     {en:'The Girl with the Dragon Tattoo',he:'נערה עם קעקוע דרקון'}, 
                     {en:'Garden Spells',he:'מתכונים מכושפים'}, 
                     {en:'The Thirteenth Tale',he:'הסיפור השלושה עשר'}, 
                     {en:'The Light Between Oceans',he:'אור בין האוקיינוסים'}];

        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            books.push(createBook(name));
        }
    }
    gBooks = books;
    saveBooks();
}

function createBook(bookName, price) {
    return {
        id: makeId(),
        name: bookName.en,
        nameHe: bookName.he,
        price: (price)? price : getRandomIntInclusive(20,100),
        imgUrl: getImgUrl(bookName.en,'en'),
        imgUrlHe: getImgUrl(bookName.en,'he'),
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

function getImgUrl(bookName,lang) {
    var url;
    if (lang === 'en') {
        url = 'img/'+bookName+'.jpg';
    } else {
        url = 'img/'+bookName+'-he.jpg';
    }
    
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