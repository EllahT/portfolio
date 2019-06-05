'use strict'
var gProjects;

function createProjects() {
    var projects = [
        createProject('ball-board','Ball Board', 'get all the balls and don\'t be glued!'),        
        createProject('book-shop', 'Book Shop','manage your books'),
        createProject('chess-moves', 'Chess Moves','check the possible moves for each chess piece'),
        createProject('guess-who', 'Guess Who','think of someone, and i\'ll guess it'),
        createProject('in-picture', 'In Picture', 'pick the right sentence for the picture'),
        createProject('mine-sweeper', 'Mine Sweeper','sweep all the mines without getting exploded'),
        createProject('pacman','Pacman','eat all the food without getting eaten first'),
        createProject('todos', 'Todos','manage your todo list'),
        createProject('touch-nums', 'Touch Nums','push the numbers one by one, the fast as you can'),
        createProject('login-page', 'Login Page','user and admin login page (users saved on local storage)'),
        createProject('designed-page', 'Designed Page','designed page from a psd file design'),
        createProject('designed-page-grid', 'Designed Page Grid','designed page from a psd file design, with css grid')
    ]
    
    gProjects = projects;
}

function createProject(name,title='',desc='') {
    return {
        id: name.toLowerCase(),
        name: name,
        title: title,
        desc: desc,
        url: 'https://ellaht.github.io/'+name,
        publishedAt: getTimeStamp(),
        labels: [],
        img: getImgUrl(name.toLowerCase())
    }
}

function getImgUrl(projName) {
    var imgUrl = 'img/portfolio/'+projName.toLowerCase()+'.jpg';
    return imgUrl;
}

function getProjById(projId) {
    var proj = gProjects.find(function (proj) {
        return projId === proj.id
    })
    return proj
}

