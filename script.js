let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task
function addTask() {
    const text = document.getElementById("taskInput").value.trim();
    const due = document.getElementById("dueDate").value;

    if (text === "") {
        alert("Enter task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text,
        due,
        completed: false
    });

    saveTasks();

    document.getElementById("taskInput").value = "";
    document.getElementById("dueDate").value = "";

    renderTasks();
}

// Delete
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Toggle
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) task.completed = !task.completed;
        return task;
    });
    saveTasks();
    renderTasks();
}

// Edit
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt("Edit task:", task.text);

    if (newText && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

// Due status logic
function getDueStatus(dueDate) {
    if (!dueDate) return "";

    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    const diffDays = (due - today) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "⚠️ Due Today";
    if (diffDays === 1) return "⏰ Due Tomorrow";
    if (diffDays < 0) return "❌ Overdue";

    return "";
}

// Render
function renderTasks() {
    const list = document.getElementById("taskList");
    const filter = document.getElementById("filter").value || "all";
    const search = document.getElementById("search").value.toLowerCase();

    list.innerHTML = "";

    let filtered = tasks.filter(task =>
        task.text.toLowerCase().includes(search)
    );

    if (filter === "completed") {
        filtered = filtered.filter(t => t.completed);
    } else if (filter === "pending") {
        filtered = filtered.filter(t => !t.completed);
    }

    if (filtered.length === 0) {
        list.innerHTML = "<p style='text-align:center;'>No tasks found</p>";
        return;
    }

    filtered.forEach(task => {
        const div = document.createElement("div");
        div.className = "task";

        const status = getDueStatus(task.due);

        let statusClass = "";
        if (status.includes("Overdue")) statusClass = "overdue";
        else if (status.includes("Today")) statusClass = "today";
        else if (status.includes("Tomorrow")) statusClass = "tomorrow";

        div.innerHTML = `
            <div class="${task.completed ? 'completed' : ''}">
                <strong>${task.text}</strong><br>
                <small>Due: ${task.due || "No date"}</small><br>
                <span class="due-status ${statusClass}">${status}</span>
            </div>

            <div class="actions">
                <button onclick="toggleTask(${task.id})">✔</button>
                <button onclick="editTask(${task.id})">✏</button>
                <button onclick="deleteTask(${task.id})">❌</button>
            </div>
        `;

        list.appendChild(div);
    });
}

// Initial load
renderTasks();