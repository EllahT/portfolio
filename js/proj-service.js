'use strict'
var gProjects;

function createProjects() {
    var projects = [
        createProject('ballboard','Ball Board', 'get all the balls and don\'t be glued!'),        
        createProject('bookshop', 'Book Shop','manage your books'),
        createProject('chess', 'Chess',),
        createProject('guessme', 'Guess Me','think of someone, and i\'ll guess it'),
        createProject('inpicture', 'In Picture', 'pick the right sentence for the picture'),
        createProject('minesweeper', 'Mine Sweeper','sweep all the mines without getting exploded'),
        createProject('pacman','Pacman','eat all the food without getting eaten first'),
        createProject('todos', 'Todos','manage your todo list'),
        createProject('touchnums', 'Touch Nums','push the numbers one by one, the fast as you can')
    ]
    
    gProjects = projects;
}

function createProject(name,title='',desc='') {
    return {
        id: name.toLowerCase(),
        name: name,
        title: title,
        desc: desc,
        url: 'projs/'+name.toLowerCase()+'/index.html',
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

