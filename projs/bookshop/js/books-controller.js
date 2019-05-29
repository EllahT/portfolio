'use strict'

var gBooksPerPage = 4; 
var gCurrPage = 0;

function init() {
    createBooks()
    renderBooks()
}

function renderBooks() {
    var books = getBooks(gCurrPage*gBooksPerPage,gCurrPage*gBooksPerPage+gBooksPerPage)
    var strHtmls = books.map(function (book) {
        var name = (gCurrLang === "en")? book.name : book.nameHe;
        return `<tr class="${book.id}"><td>${book.id}</td><td>${name}</td><td><span class="bookPrice">${book.price}</span><span data-trans="currency">$</span></td>
        <td><button type="button" class="btn btn-outline-success" onclick="onReadBook('${book.id}')" data-trans="actionRead">Read</button>
        <button type="button" class="btn btn-outline-info" onclick="onOpenUpdateModal('${book.id}')" data-trans="actionUpdate">Update</button>
        <button type="button" class="btn btn-outline-danger" onclick="onDeleteBook('${book.id}')" data-trans="actionDelete">Delete</button></td></tr>`
    })
    $('.books-tbody').html(strHtmls.join(''))
    $('.curr-page').text(gCurrPage+1);
}

function onReadBook(bookId) {
    var book = getBookById(bookId);
    var name = (gCurrLang === 'en')? book.name : book.nameHe;
    var img = (gCurrLang === 'en')? book.imgUrl : book.imgUrlHe;
    $('.name').text(name);
    $('.rate').text(book.rate);
    $('.price').text(book.price+'$');
    $('.buttonUp').click({param1: bookId, param2: '+'},onChangeRate);
    $('.buttonDown').click({param1: bookId, param2: '-'},onChangeRate);
    $('.modal-img').attr('src',img);
    $('.modal-img').attr('onerror',"onImgError()");
    $('.modal').show();
}

function onCloseModal() {
    $('.modal').hide()
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
}

function onOpenAddBookModal() {
    $('.addBtn').after(`<div class="inlineModal">
    <input name ="name" type="txt" placeholder="what\'s the new book\'s name?"/>
    <input name ="price" type="number" placeholder="what\'s the new book\'s price?"/>
    <button onclick="onAddBook()">update</button>
    <button onclick="onCloseInlineModal()">X</button></div>`);
}

function onAddBook() {
    var name = $('[name="name"]').val();
    var capitlizedName = name.charAt(0).toUpperCase() + name.slice(1);
    var price = $('[name="price"]').val();
    addBook(capitlizedName,price)
    renderBooks()
}

function onOpenUpdateModal(bookId) {
    $('.'+bookId).after(`<tr class="inlineModal"><td colspan="4">
    <input name ="newPrice" type="number" placeholder="what\'s the new price?"/>
    <button onclick="onUpdateBook('${bookId}')">update</button>
    <button onclick="onCloseInlineModal()">X</button></td></tr>`);
}

function onUpdateBook(bookId) {
    var newPrice = $('[name="newPrice"]').val();
    updateBook(bookId, newPrice);
    var book = getBookById(bookId);
    $('.'+bookId+' .bookPrice').text(book.price);
}

function onChangeRate(event) {
    var bookId = event.data.param1;
    var op = event.data.param2;
    changeRate(bookId,op);
    renderRate(bookId);
}

function renderRate(bookId) {
    var book = getBookById(bookId);
    $('.rate').text(book.rate);
}

function onImgError() {
    $('.modal-img').attr('src','img/default.jpg');
}

function onCloseInlineModal() {
    $('.inlineModal').remove();
}

function onSort(sortingParam) {
    var currSymbol = $('.'+sortingParam+'Sort').text();
    (currSymbol === '⬇')? $('.'+sortingParam+'Sort').text('⬆') : $('.'+sortingParam+'Sort').text('⬇');
    sortBooks(sortingParam,currSymbol);
    renderBooks();
}

function onChangePage(op) {
    if ((gCurrPage === 0 && op === '-') || (gCurrPage === Math.floor((getBooksCount()/gBooksPerPage)) && op === '+')) return;
    (op === '+')? gCurrPage++ :gCurrPage--;
    renderBooks();
    doTrans();
}

function onSetLang(lang) {
    setLang(lang);
    var currLangImg = 'img/'+lang+'.png';
    document.querySelector('.langImg').setAttribute('src',currLangImg);
    if (lang === 'he') document.body.classList.add('rtl');
    else document.body.classList.remove('rtl');
    
    renderBooks();
    doTrans();
    
}


