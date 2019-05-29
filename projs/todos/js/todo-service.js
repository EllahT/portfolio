var gTodos = [];
var gFilterBy = 'all';

function createTodos() {
    var todos = loadFromStorage('todos')
    if (!todos || !todos.length) {
        todos = [
            createTodo('Learn JS',1),
            createTodo('Master CSS',1),
            createTodo('Live good',1),
        ]
    }
    
    gTodos = todos;
    saveTodos();
}

function createTodo(txt, importance) {
    return {
        id: makeId(),
        txt: txt,
        isDone: false,
        createdAt: getTimeStamp(),
        importance: importance,
    }
}

function getTodosForDisplay() {
    if (gFilterBy === 'all') return gTodos;
    return gTodos.filter(function (todo) {
        return (todo.isDone && gFilterBy === 'done') ||
            (!todo.isDone && gFilterBy === 'active')
    })
}

function addTodo(txt, importance) {
    var todo = createTodo(txt, importance);
    gTodos.unshift(todo);
    saveTodos();
}

function deleteTodo(todoId) {
    var todoIdx = gTodos.findIndex(function (todo) { return todo.id === todoId });
    gTodos.splice(todoIdx, 1);
    saveTodos();
}

function toggleTodo(todoId) {
    var todo = gTodos.find(function (todo) { return todo.id === todoId });
    todo.isDone = !todo.isDone;
    saveTodos();
}

function setFilter(txt) {
    gFilterBy = txt;
}

function getTotalCount() {
    return gTodos.length
}

function getActiveCount() {
    var activeTodos = gTodos.filter(function (todo) { return !todo.isDone })
    return activeTodos.length;
}

function saveTodos() {
    saveToStorage('todos', gTodos)
}

function setSort(str) {
    var txt = (str.split(','))[0];
    var op = (str.split(','))[1];
    var sortingFunc = creatSortFunc(txt,op);
    gTodos.sort(sortingFunc);
    saveTodos();
}

function creatSortFunc(txt,op) {
    function sorting(a,b) {
        if (op === '+') {
            if (a[txt] > b[txt]) {
                return 1;
            } else if (a[txt] < b[txt]) {
                return -1;
            } else {
                return 0;
            }    
        } else {
            if (a[txt] < b[txt]) {
                return 1;
            } else if (a[txt] > b[txt]) {
                return -1;
            } else {
                return 0;
            }    
        } 
    }
    return sorting;
}

function changeOrder(todoId,op) {
    var todo = gTodos.find(function (todo) { return todo.id === todoId });
    var todoIdx = gTodos.findIndex(function (todo) { return todo.id === todoId });

    if (((todoIdx === 0) && (op === '+')) || ((todoIdx === (gTodos.length-1)) && (op === '-' ))) return;

    if (op === '+') {
        gTodos.splice(todoIdx, 1);
        gTodos.splice(todoIdx-1, 0, todo);
    } else {
        gTodos.splice(todoIdx, 1);
        gTodos.splice(todoIdx+1, 0, todo);
    }
    saveTodos();
}
