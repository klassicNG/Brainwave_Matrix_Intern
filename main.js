document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const tasksCounter = document.getElementById('tasks-counter');
    const clearCompletedBtn = document.getElementById('clear-completed');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateTasksCounter();
    }

    function updateTasksCounter() {
        const remainingTasks = todos.filter(todo => !todo.completed).length;
        tasksCounter.textContent = `${remainingTasks} task${remainingTasks !== 1 ? 's' : ''}`;
    }

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn">×</button>
        `;

        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        return li;
    }

    function addTodo(text) {
        const todo = {
            id: Date.now(),
            text: text.trim(),
            completed: false
        };

        todos.unshift(todo);
        todoList.prepend(createTodoElement(todo));
        saveTodos();
    }

    function toggleTodo(id) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            const todoElement = todoList.querySelector(`[data-id="${id}"]`);
            todoElement.classList.toggle('completed');
            saveTodos();
        }
    }

    function deleteTodo(id) {
        const todoElement = todoList.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                todos = todos.filter(t => t.id !== id);
                todoElement.remove();
                saveTodos();
            }, 300);
        }
    }

    function clearCompleted() {
        const completedTodos = todos.filter(todo => todo.completed);
        completedTodos.forEach(todo => {
            const todoElement = todoList.querySelector(`[data-id="${todo.id}"]`);
            if (todoElement) {
                todoElement.style.animation = 'slideIn 0.3s ease reverse';
            }
        });

        setTimeout(() => {
            todos = todos.filter(todo => !todo.completed);
            renderTodos();
            saveTodos();
        }, 300);
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            todoList.appendChild(createTodoElement(todo));
        });
        updateTasksCounter();
    }

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            addTodo(text);
            todoInput.value = '';
        }
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Initial render
    renderTodos();
});