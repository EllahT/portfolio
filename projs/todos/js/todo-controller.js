function onInit() {
   createTodos();
   renderTodos();
}

function renderTodos() {
    var todos = getTodosForDisplay();
    var elList = document.querySelector('.todo-list');
    var strHtml;
    
    if (todos.length === 0) {
        
        switch(gFilterBy) {
            case 'all': 
                strHtml = 'No todos';
                break;
            case 'active': 
                strHtml = 'No Active Todos';
                break;
            case 'done': 
                strHtml = 'No Done Todos';
                break;
        }
        
        elList.innerHTML = strHtml;
    } else {

        var strHtmls = todos.map(function(todo){
        var className = (todo.isDone)? 'done ' : '';
        var hideClass = (gFilterBy === 'all')? '' : ' hide';
        var importanceLevel = 'importance'+todo.importance;

        return `<li class="${className} ${importanceLevel}" onclick="onToggleTodo('${todo.id}')">
            <button class="${hideClass}" onclick="onChangeOrder(event, '${todo.id}','+')">⬆</button>
            <button class="${hideClass}" onclick="onChangeOrder(event, '${todo.id}','-')">⬇</button>
            <div class="importanceStat">${todo.importance}</div> ${todo.txt} <span class="timeStamp"> created at: ${todo.createdAt} </span>
            <button onclick="onDeleteTodo(event, '${todo.id}')">✖</button>
            </li>`
    })
    
    elList.innerHTML = strHtmls.join('');

    document.querySelector('li:nth-of-type(1) > button:nth-of-type(1)').setAttribute('disabled', true);;
    document.querySelector('li:nth-last-of-type(1) > button:nth-of-type(2)').setAttribute('disabled', true);;
    
    }
    renderStats();

    // console.table(gTodos)
}

function renderStats() {
    document.querySelector('.total-count').innerText = getTotalCount();
    document.querySelector('.active-count').innerText = getActiveCount()
}

function onAddTodo() {
    var txt = document.querySelector('[name="txt"]').value;
    var importance = getCheckedRadioValue('importance');
    (!txt)? alert('you can not add an empty todo'): addTodo(txt, importance);
    document.querySelector('[name="txt"]').value = '';
    renderTodos();
}

function onDeleteTodo(ev, todoId){
    ev.stopPropagation();
    var isSure = confirm('are you sure you want to delete the todo? \npress OK to delete and cancel to keep the todo');
    if (isSure) {
        deleteTodo(todoId);
        renderTodos();
    }
}

function onToggleTodo(todoId) {
    toggleTodo(todoId);
    renderTodos();
}

function onSetFilter(txt) {
    var elOptions = document.querySelectorAll('[id^=option]');
    console.log('elOptions', elOptions)
    elOptions.forEach(function(elOption){
        (elOption.value === txt)? elOption.checked = true : elOption.checked = false;
    })
    setFilter(txt);
    renderTodos();
}

function onSetSort(txt) {
    setSort(txt);
    renderTodos();
}

function onChangeOrder(ev, todoId, op) {
    ev.stopPropagation();
    changeOrder(todoId,op);
    renderTodos();
}
