import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

const main = document.querySelector(".main")
const checkbox = document.querySelector(".checkbox")
const taskInput = document.querySelector(".task-input")
const addTaskBtn = document.querySelector(".add-task-btn")
const costDropDown = document.querySelector(".cost-drop-down")
const mainContainer = document.querySelector(".container")
const items = document.querySelector(".items")
const totalDiv = document.querySelector(".total")
const sendBtn = document.querySelector(".send-btn")
const warningMsg = document.querySelector(".warning-msg")

// event listeners 
addTaskBtn.addEventListener('click', handleAddTask)
sendBtn.addEventListener('click', handleSendInvoice)
checkbox.addEventListener('click', handleThemeChange)

items.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-btn')) {
        handleRemoveTask(e.target.id)
    }
})

function handleAddTask() {
    if (!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks', '[]')
    }

    if (!taskInput.value) {
        insertWarningMessage(taskInput.value)
    } else if (checkIfTaskExists(taskInput.value).length > 0) {
        insertWarningMessage(taskInput.value)
    } else {
        const newTask = { 
            task: taskInput.value, 
            cost: costDropDown.value,
            id: uuidv4()
        }
        addItemToLocalStorage(newTask)
        renderTasks()
    }
    taskInput.value = ""
}

// gets any existing tasks in local storage
function getTasksArray() {
    const storedTasksString = localStorage.getItem('tasks')
    return JSON.parse(storedTasksString) || []
}

function addItemToLocalStorage(task) {
    const updatedObjectsArray = getTasksArray()
    updatedObjectsArray.push(task)
    updateLocalStorage(updatedObjectsArray) 
}

function handleRemoveTask(taskId) {
    const objectsArray = getTasksArray()
    const updatedObjectsArray = objectsArray.filter(object => object.id != taskId)
    updateLocalStorage(updatedObjectsArray) 
    renderTasks() 
}

function updateLocalStorage(objectsArray) {
    localStorage.setItem('tasks', JSON.stringify(objectsArray))
}

function buildInvoiceItem(task, cost, id) {
    return `
            <div class="item-container justify-space-between">
                <div class="item">
                    <h3>${task}</h3>
                    <p class="remove-btn" id="${id}">remove</p>
                </div>
                <div class="item-cost">
                    <h2 class="dollar">$</h2>
                    <h2>${cost}</h2>
                </div>
            </div>
            `
    const removeBtn = document.querySelector(".remove-btn")
}

function renderTasks() {
    const retrievedObjectsArray = getTasksArray()
    items.innerHTML = retrievedObjectsArray.map(task =>  
        buildInvoiceItem(task.task, task.cost, task.id)
        ).join("")
    renderTotal(getTotal())
}

function getTotal() {
    let total = 0
    const retrievedObjectsArray = getTasksArray() 
    retrievedObjectsArray.forEach(task => total += Number(task.cost))
    return total
}

function renderTotal(total) {
    let totalText = `
                        <h2 class="total">
                            $${getTotal()}
                        </h2>
                        `
    if (total > 0) { 
        totalText = 
                    `<p>
                        We accept cash, credit card, or PayPal
                    </p>` + totalText 
    }
    totalDiv.innerHTML = totalText
}

// checks for duplicate tasks on submission
function checkIfTaskExists(newTask) {
    const retrievedObjectsArray = getTasksArray()
    return retrievedObjectsArray.filter(task => task.task === newTask)
}

// shows user a message
function insertWarningMessage(task) {
    if (task && task != 'sent') {
        warningMsg.textContent = 'Task already exists!'
        setTimeout(function() { 
            warningMsg.textContent = ''
        }, 2500)
    } else if (!task && (task != 'sent')) {
        warningMsg.textContent = 'Please enter a task!'
        setTimeout(function() { 
            warningMsg.textContent = ''
        }, 2500)
    } else {
        warningMsg.textContent = 'Invoice was sent!'
        setTimeout(function() { 
            warningMsg.textContent = ''
        }, 2500) 
    }
}

// resets invoice
function handleSendInvoice() {
    if (getTasksArray().length === 0) {
        taskInput.value = ""
        insertWarningMessage()
    } else {
        insertWarningMessage('sent')
        localStorage.clear()
        items.innerHTML = ""
        renderTotal(0)
    }
}

// toggles light and dark themes
function handleThemeChange() {
    main.classList.toggle('light-mode')
    mainContainer.classList.toggle('container-light-mode')
}

renderTasks()