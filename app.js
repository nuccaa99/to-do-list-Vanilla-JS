let addButton = document.getElementById('add-task-button');
let listdiv = document.getElementById('listdiv');
let nav = document.getElementById('navbar');
let listTitle = document.getElementById('list-title');
let taskInput = document.getElementById('input-task');
let listUl = document.getElementById('task-list');
let toDoList = [];
let title = [];

function loadLocalStorage() {
    //We will use local storage to store the tasks. The localStorage property allows saving key/value pairs right in a web browser.
    if (localStorage.getItem("tasks")) {
        toDoList = JSON.parse(localStorage.getItem("tasks")) || [];
        toDoList.forEach((task) => {
          showTask(task);
        })
    };
  
  if(localStorage.getItem("title")) {
    title = JSON.parse(localStorage.getItem("title")) || [];
    //თუ არაფერი მაქ დარქმეული 0ზე არაფერია და undefined-ს აგდებს დარეფრეშებისას, ამიტო ვამოწმებ
    if(title[0]!==undefined) {
     showTitle(title[0]);
    } 
  }
}

loadLocalStorage();

function addTask() {  
addButton.addEventListener("click", function (){
  let newTask = {
    taskName: taskInput.value,
    checked: false
  }
 
  if(taskInput.value!=="") {
    toDoList.push(newTask);
    showTask(newTask);
    updateLocalStorage();
  }  
});
  
listTitle.addEventListener("change", function() {
  let newTitle = listTitle.value;
  if(listTitle.value!=="") {
    title=[];
    title.push(newTitle);
    updateLocalStorage();
  } 
})
};
  
  function showTask(task) {  
    //ეს კლასი არის display:none და ვაშორებ იმისთვის რო გამოჩნდეს
    listTitle.classList.remove("list-title");
    listdiv.classList.add("list");
    nav.classList.add("navbar");
        
    let li = document.createElement("li");
    listUl.appendChild(li);

    let box = document.createElement('input');
    box.setAttribute('type','checkbox');  
    li.appendChild(box);
    box.onclick = function() {
      task['checked']=!task['checked']
      updateLocalStorage();
    }
    box.checked = task['checked'];

    let span = document.createElement("span");
    li.appendChild(span);
    span.innerHTML=task['taskName'];
    span.classList.add("task");
    
    
    let dltbtn = document.createElement("button");
    li.appendChild(dltbtn);
    dltbtn.classList.add("delete-btn");
    dltbtn.innerHTML = 'x';
    dltbtn.onclick = function () {
       dltbtn.parentElement.remove();
      /*აქ აუცილებლად უნდა გავითვალისწინო რომ 
      <ul id="task-list"></ul> იყოს ცარიელი კომენტარიც არუნდა ეწეროს*/
      if(listUl.childNodes.length===0) {
        listdiv.classList.remove("list");
        nav.classList.remove("navbar");
        listTitle.classList.add("list-title");
        title=[];
        listTitle.value="";
        
      } 
        toDoList.splice(toDoList.indexOf(task), 1);
        updateLocalStorage();
      };
    
    taskInput.value="";
    
  }

addTask();


function showTitle(title) {
  listTitle.value=title;
}


function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(toDoList));
    localStorage.setItem("title", JSON.stringify(title));
}

function clearAll() {
    localStorage.clear();
    while (listUl.firstChild) {
        listUl.removeChild(listUl.firstChild);
    }
    toDoList = [];
    title=[];
  listdiv.classList.remove("list");
  nav.classList.remove("navbar");  
  listTitle.classList.add("list-title");
  listTitle.value="";
}