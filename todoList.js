const taskInput      = document.getElementById("task-input");
const taskButton     = document.getElementById("task-btn");
const taskContainer  = document.getElementById("task-list");
const taskData       = [];
const storageName    = "TODOLIST";

function createElement(userInput){
    const elementContainer = document.createElement("div");
    elementContainer.setAttribute("class","task-container");

    const taskElement = document.createElement("h3");
    taskElement.setAttribute("class","task-item");
    taskElement.innerText = userInput;

    const taskBtn = document.createElement("button");
    taskBtn.setAttribute("class","task-delete-btn");
    taskBtn.innerText = 'Delete';

    const taskStatus = document.createElement("button");
    taskStatus.setAttribute("class","task-status-btn");
    taskStatus.innerText = 'isComplete';

    elementContainer.appendChild(taskElement);
    elementContainer.appendChild(taskBtn);
    elementContainer.appendChild(taskStatus);

    taskBtn.addEventListener("click",() => deleteTask(userInput,elementContainer));
    taskStatus.addEventListener("click",() => handleTask(userInput,taskElement));

    taskContainer.append(elementContainer);
    
}

function onEnterAddTask(event){
    if(event.keyCode == 13) addTask();
}

function addTask(){
    const userInput = taskInput.value.trim();
    if(userInput == "" || userInput == " ") return "";
    const result = taskHasDuplicate(userInput);
    if(result) return alert("Task Already Exist");
    saveTask(userInput);
    taskInput.value = "";
    const noDataFoundElement = document.getElementById("no-data-found");
    if(noDataFoundElement) noDataFoundElement.remove();
}

function saveTask(userInput){
    createElement(userInput);
    const sessionData = localStorage.getItem(storageName);
    const userItem    = {taskName:userInput,isCompleted : false};
    if(sessionData){
        const fetchData = JSON.parse(sessionData);
        fetchData.push(userItem);
        storeData(fetchData);
    }
    else{
        taskData.push(userItem);
        storeData(taskData);
    }
}

function handleTask(userInput,taskElement){
    taskElement.classList.toggle("success");
    updateTask(userInput);
}

function updateTask(userInput){
    const fetchData = JSON.parse(localStorage.getItem(storageName));
    const taskList  = fetchData.map((val,index) => {
        if(val.taskName == userInput){
            val.isCompleted = !val.isCompleted;
        }
        return val;
    });
    storeData(taskList);
}

function deleteTask(userInput,elementContainer){
    const fetchData = JSON.parse(localStorage.getItem(storageName));
    const taskList  = fetchData.filter((val,index) => (val?.taskName != userInput));
    storeData(taskList);
    elementContainer.remove();
    if(JSON.parse(localStorage.getItem(storageName))?.length === 0){
        noDataFound();
    }
}

function getTask(){
    const sessionData = localStorage.getItem(storageName);
    if(sessionData && JSON.parse(sessionData)?.length > 0){
        const fetchData = JSON.parse(sessionData);
        fetchData.forEach((data,index) => createElement(data?.taskName));
    }
    else{ 
        noDataFound();
    }
}

function taskHasDuplicate(userInput){
    const sessionData = localStorage.getItem(storageName);
    if(sessionData){
        const fetchData = JSON.parse(sessionData);
        return fetchData.find((data,index) => data?.taskName == userInput);
    }
}

function storeData(data){
    localStorage.setItem(storageName,JSON.stringify(data));
}

function noDataFound(){
    const element = document.createElement("b");
    element.setAttribute("class","no-data-found");
    element.setAttribute("id","no-data-found");
    element.innerText = "No Data Found";
    taskContainer.append(element);
}

getTask();

taskInput.addEventListener("keyup",onEnterAddTask);
taskButton.addEventListener("click",addTask);

