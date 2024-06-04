"use strict";

function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function getTask(index){
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    return tasks ? tasks[index] : null;
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(done = false) {
    const taskContainer = document.querySelector('.list-tasks');
    taskContainer.innerHTML = '';

    const tasks = getTasks();
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('card', 'card-outside', 'my-1');
        taskElement.innerHTML = `
            <div class="card-body container ms-2" style="color:#1C2135" aria-label="Задача: ${task.title}">
                <div class="d-flex align-items-center">
                    <i class="bi ${task.done ? 'bi-check-circle' : 'bi-circle'} task-icon me-2"
                    title="Отметка о выполнении" aria-label="Отметка о выполнении" style="color: ${done ? '#5A9460' : '#5A6794'}"></i>
                    <div class="d-flex row px-2">
                        <h5 class="card-title ${task.done ? 'done' : ''} mb-0">${task.title}</h5>
                        <div class="d-flex align-items-center">
                            <small class="text-muted me-2">${task.creationTime}</small>
                            ${task.updateTime ? `<small class="text-muted">| Ред.: ${task.updateTime}</small>` : ''}
                        </div>
                        <div class="collapse" id="description${index}">
                            <div class="card card-body card-inside mt-3">
                                ${task.description}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="icon-group">                    
                    <button class="btn custom-button-description mb-0" type="button" data-bs-toggle="collapse" title="Описание" aria-label="Описание задачи"
                    data-bs-target="#description${index}" aria-expanded="false" aria-controls="collapseExample${index}">
                        <i class="bi bi-sticky"></i>
                    </button>

                    <a class="edit-task me-3" title="Редактировать" data-bs-toggle="modal" data-bs-target="#task-edit" aria-label="Редактировать задачу">
                        <i class="bi bi-pencil"></i>
                    </a>

                    <a class="delete-task" title="Удалить" aria-label="Удалить задачу" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </a>
                </div>
            </div>
        `;
        taskContainer.appendChild(taskElement);

        taskElement.querySelector('.task-icon').addEventListener('click', function () {
            markTask(index);
        });

        taskElement.querySelector('.delete-task').addEventListener('click', function () {
            deleteTask(index);
        });

        taskElement.querySelector('.edit-task').addEventListener('click', function () {
            editTask(index);
        });
    });
}

function markTask(index) {
    const tasks = getTasks();
    tasks[index].done = !tasks[index].done;
    saveTasks(tasks);
    renderTasks();
}

function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
}

function editTask(index) {
    const task = getTask(index);
    const title = task.title
    const description = task.description

    document.getElementById('title-edit').value = title;
    document.getElementById('description-edit').value = description;

    document.getElementById('form-edit').setAttribute('data-index', index);

    const modalElement = document.querySelector('#task-edit');
    const modalInstance = bootstrap.Modal(modalElement);
    modalInstance.show();
}


function handleFormSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (title.trim() === "") {
        alert("Поле 'Заголовок' не может быть пустым!");
        return;
    }

    if (description.trim() === "") {
        alert("Поле 'Описание' не может быть пустым!");
        return;
    }
    
    const tasks = getTasks();
    const creationTime = new Date().toLocaleString();
    tasks.push({ title, description, done: false, creationTime, updateTime: null });
    saveTasks(tasks);

    document.getElementById('title').value = '';
    document.getElementById('description').value = '';

    renderTasks();

    const modalElement = document.querySelector('#task');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
}

function handleEditFormSubmit(e) {
    e.preventDefault();
    const index = document.getElementById('form-edit').getAttribute('data-index');
    const title = document.getElementById('title-edit').value;
    const description = document.getElementById('description-edit').value;

    if (title.trim() === "") {
        alert("Поле 'Заголовок' не может быть пустым!");
        return;
    }

    if (description.trim() === "") {
        alert("Поле 'Описание' не может быть пустым!");
        return;
    }

    const tasks = getTasks();
    const updateTime = new Date().toLocaleString();
    tasks[index] = { title, description, done: tasks[index].done, creationTime: tasks[index].creationTime, updateTime};
    saveTasks(tasks);

    renderTasks();

    const modalElement = document.querySelector('#task-edit');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
}

document.getElementById('form-add').addEventListener('submit', handleFormSubmit);
document.getElementById('form-edit').addEventListener('submit', handleEditFormSubmit);
renderTasks();