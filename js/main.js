'use strict';

document.addEventListener('DOMContentLoaded', ()=>{

    const form =  document.querySelector('.todo-control');
    const headerInput = document.querySelector('.header-input');
    const toDo = document.querySelector('#todo');
    const toDoCompleted = document.querySelector('#completed');

    //Создание объекта для хранения
    let data = {
        todo: [],
        completed: []
    };

    //Проверка имеются ли данные в локале
    if(localStorage.getItem('localData')){
        data = JSON.parse(localStorage.getItem('localData'));
    }
    
    //Создание или выгрузка данных из докала
    const renderItemsForUpdate = () => {
        if(!data.todo.length && !data.completed.length){
            return;
        }

        for(let i=0;i<data.todo.length;i++){
            renderItem(data.todo[i]);
        }
        for(let i=0;i<data.completed.length;i++){
            renderItem(data.completed[i],true);
        }

    };

     //Функция которая пишет в локал
    const dataUpdateToLocalS = () => {
        localStorage.setItem('localData', JSON.stringify(data));
    };

    //Фкнция удаляет элемент из родителя
    const itemRemove = (elem) => {
        const item = elem.parentNode.parentNode;
        const itemParent = item.parentNode;
        const id = itemParent.id;
        const text = item.textContent;

        if(id === 'todo'){
            data.todo.splice(data.todo.indexOf(text),1);
        }else {
            data.completed.splice(data.completed.indexOf(text),1);
        }

        itemParent.removeChild(item);
        dataUpdateToLocalS();
        
    };
    //Функция переносит из 1 блока в другой  и обратно
    const itemComplete = (elem) => {
        const item = elem.parentNode.parentNode;
        const itemParent = item.parentNode;
        const id = itemParent.id;
        const text = item.textContent;

        let target;

        if(id === 'todo'){
            target = toDoCompleted;
        }else{
            target = toDo;
        }

        if(id === 'todo'){
            data.todo.splice(data.todo.indexOf(text),1);
            data.completed.push(text);
        }else {
            data.completed.splice(data.completed.indexOf(text),1);
            data.todo.push(text);
        }

        itemParent.removeChild(item);
        target.insertBefore(item, target.childNodes[0]);

        dataUpdateToLocalS();

    };

    //Фкнция рендаринга одного элемента
    const renderItem = function(text, completed = false){
        const item = document.createElement('li');
        const btnblock = document.createElement('div');
        const btnRemove = document.createElement('button');
        const btnComplete = document.createElement('button');

        item.classList.add('todo-item');
        btnblock.classList.add('todo-buttons');
        btnRemove.classList.add('todo-remove');
        btnComplete.classList.add('todo-complete');

        let list;
        if(completed){
            list = toDoCompleted;
        }else{
            list = toDo;
        }

        item.textContent = text;

        btnRemove.addEventListener('click', (event) => {
            itemRemove(event.target);
        });

        btnComplete.addEventListener('click', (event) => {
            itemComplete(event.target);
        });

        btnblock.appendChild(btnRemove);
        btnblock.appendChild(btnComplete);
        item.appendChild(btnblock);

        list.insertBefore(item, list.childNodes[0]);

    };
    
    //Добавляет на страницу
    const addItem = (text) => {
        renderItem(text);
        headerInput.value = '';
        data.todo.push(text);

        dataUpdateToLocalS();
    };
    //обработчик сабмит
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if(headerInput.value !== ''){
            addItem(headerInput.value.trim());
        }
    });
    //Фкнци которая при наличии данных если там что-то есть рендарит
    renderItemsForUpdate();

});



