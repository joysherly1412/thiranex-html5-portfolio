// To-Do List Application Logic & State Management
document.addEventListener('DOMContentLoaded', () => {
    // 1. App State & LocalStorage Persistence
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    const todoContainer = document.getElementById('projects'); // Reusing projects section dynamically
    
    // Injecting To-Do UI dynamically inside the main content
    const todoWrapper = document.createElement('div');
    todoWrapper.style.marginTop = '40px';
    todoWrapper.innerHTML = `
        <h2 style="border-bottom: 2px solid var(--accent-color); padding-bottom: 10px;">Task 3: Interactive To-Do List</h2>
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <input type="text" id="todo-input" placeholder="Add a new task..." style="flex: 1; margin: 0;">
            <button id="add-todo-btn" style="padding: 10px 20px;">Add</button>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <button class="filter-btn" data-filter="all" style="background:#555;">All</button>
            <button class="filter-btn" data-filter="active" style="background:#555;">Active</button>
            <button class="filter-btn" data-filter="completed" style="background:#555;">Completed</button>
        </div>
        <ul id="todo-list" style="list-style: none; padding: 0;"></ul>
    `;
    todoContainer.parentNode.insertBefore(todoWrapper, todoContainer.nextSibling);

    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // 2. Render Function (Read)
    function renderTodos() {
        todoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.padding = '10px';
            li.style.marginBottom = '10px';
            li.style.background = 'var(--card-bg)';
            li.style.borderRadius = '5px';
            li.style.borderLeft = '4px solid var(--accent-color)';

            li.innerHTML = `
                <span style="text-decoration: ${todo.completed ? 'line-through' : 'none'}; cursor: pointer;" class="todo-text">${todo.text}</span>
                <div>
                    <button class="toggle-btn" style="background: green; margin-right: 5px; padding: 5px 10px;">✓</button>
                    <button class="delete-btn" style="background: red; padding: 5px 10px;">X</button>
                </div>
            `;

            // 3. Delegated Event Listeners (Update & Delete)
            li.querySelector('.todo-text').addEventListener('click', () => toggleTodo(todo.id));
            li.querySelector('.toggle-btn').addEventListener('click', () => toggleTodo(todo.id));
            li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));

            todoList.appendChild(li);
        });
    }

    // 4. Create Function
    function addTodo() {
        const text = input.value.trim();
        if (text) {
            todos.push({ id: Date.now(), text, completed: false });
            saveAndRender();
            input.value = '';
        }
    }

    // 5. Update Function
    function toggleTodo(id) {
        todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
        saveAndRender();
    }

    // 6. Delete Function
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveAndRender();
    }

    // Helper to save state
    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    // Event Listeners for Adding
    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTodo(); });

    // Filter Buttons Logics
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentFilter = e.target.getAttribute('data-filter');
            filterBtns.forEach(b => b.style.opacity = '0.6');
            e.target.style.opacity = '1';
            renderTodos();
        });
    });

    // Initial Load
    renderTodos();
});
