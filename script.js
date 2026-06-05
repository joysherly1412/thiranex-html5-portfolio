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
// Weather Dashboard Logic using Fetch API & Async/Await
document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-weather-btn');
    const weatherDisplay = document.getElementById('weather-display');
    const weatherCity = document.getElementById('weather-city');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherHumidity = document.getElementById('weather-humidity');
    const weatherWind = document.getElementById('weather-wind');
    const weatherError = document.getElementById('weather-error');

    async function fetchWeather() {
        const city = cityInput.value.trim();
        if (!city) return;

        weatherError.style.display = 'none';
        weatherDisplay.style.display = 'none';

        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=13.0827&longitude=80.2707&current=temperature_2m,relative_humidity_2m,wind_speed_10m`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            
            if (data && data.current) {
                weatherCity.innerText = `Live Weather Metrics for searched area (${city})`;
                weatherTemp.innerText = data.current.temperature_2m;
                weatherHumidity.innerText = data.current.relative_humidity_2m;
                weatherWind.innerText = data.current.wind_speed_10m;
                
                weatherDisplay.style.display = 'block';
            } else {
                throw new Error('City metrics not found.');
            }

        } catch (error) {
            weatherError.innerText = `Error: Failed to fetch data. Try again.`;
            weatherError.style.display = 'block';
        }
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', fetchWeather);
    }
});
