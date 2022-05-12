let addButton = document.getElementById('add-task-button');
let listdiv = document.getElementById('listdiv');
let nav = document.getElementById('navbar');
let listTitle = document.getElementById('list-title');
let taskInput = document.getElementById('input-task');
let wholeListDiv = document.getElementById('task-list');
let pages = document.getElementById('pages');
let toDoList = [];
let title = [];
let pageLastShown = [];
const tasksEachPage = 3;
let countPages = 0;
let pageToShow;



function loadLocalStorage() {
  //We will use local storage to store the tasks. The localStorage 
  //property allows saving key/value pairs right in a web browser.
  if (localStorage.getItem("tasks")) {
    toDoList = JSON.parse(localStorage.getItem("tasks")) || [];
    for (let i = 0; i < toDoList.length; i++) {
      showTask(i, toDoList[i]);
    }
  };

  if (localStorage.getItem("title")) {
    title = JSON.parse(localStorage.getItem("title")) || [];
    //if title is not entitled while refreshing "undefined" is written insead of
    //placeholder, I check to avoid it
    if (title[0] !== undefined) {
      showTitle(title[0]);
    }
  };

  if (localStorage.getItem("page")) {
    //page last shown is saved as `page1` `page2`.., the exact page and coloration must be shown after refreshing
    pageLastShown = JSON.parse(localStorage.getItem("page")) || [];
    if (pageLastShown[0] !== undefined) {
      let pageNum = pageLastShown[0][pageLastShown[0].length - 1];
      let allPages = getChildren(pages);
      allPages[pageNum - 1].style.color = "darkkhaki"
      pageToShow = document.getElementById(pageLastShown);
      pageToShow.classList.remove('hide');
      let siblings = getSiblings(pageToShow);
      siblings.forEach((item) => {
        item.classList.add('hide');
      });

    };
  }

}

loadLocalStorage();

function addTask() {
  addButton.addEventListener("click", function () {
    let newTask = {
      taskName: taskInput.value,
      checked: false

    };

    if (taskInput.value !== "") {
      toDoList.push(newTask);
      showTask(toDoList.indexOf(newTask), newTask);
      updateLocalStorage();
    };
    // when new task is added the page on which this task was added should be on screen and others should be hidden
    pageToShow = document.getElementById(`page${countPages}`);
    pageToShow.classList.remove('hide');
    let siblings = getSiblings(pageToShow);
    siblings.forEach((item) => {
      item.classList.add('hide');
    });
    //so that the last updated page stays tuned on
    let oldPages = getChildren(pages);
    oldPages.forEach((page) => {
      page.style.color = null;
    })
    pages.lastChild.style.color = "darkkhaki";
    //remember last shown page
    pageLastShown = [];
    pageLastShown.push(`page${countPages}`);
    updateLocalStorage();
  });

  listTitle.addEventListener("change", function () {
    let newTitle = listTitle.value;
    if (listTitle.value !== "") {
      title = [];
      title.push(newTitle);
      updateLocalStorage();
    }
  })
};

addTask();

function showTask(index, task) {
  //remove display:none class in order to unhide it
  listTitle.classList.remove("hide");
  listdiv.classList.add("list");
  nav.classList.add("navbar");

  //determine when to create new ul list for new page
  if (index % tasksEachPage === 0) {
    countPages++;
    let ul = document.createElement("ul");
    ul.setAttribute('id', `page${countPages}`);
    wholeListDiv.appendChild(ul);
    //show new page
    showPage(countPages);
    //when new page is added (except for the first one) hide the previous page
    if (countPages > 1) {
      ul.previousElementSibling.classList.add("hide");
    }
  };

  let li = document.createElement("li");
  //add new task to the newly created ul as a last child
  wholeListDiv.lastChild.appendChild(li);
  //create checkbox
  let box = document.createElement('input');
  box.setAttribute('type', 'checkbox');
  li.appendChild(box);
  box.onclick = function () {
    task['checked'] = !task['checked']
    updateLocalStorage();
  }
  box.checked = task['checked'];

  //create task name
  let span = document.createElement("span");
  li.appendChild(span);
  span.innerHTML = task['taskName'];
  span.classList.add("task");

  //create delete button
  let dltbtn = document.createElement("button");
  li.appendChild(dltbtn);
  dltbtn.classList.add("delete-btn");
  dltbtn.innerHTML = 'x';

  dltbtn.onclick = function () {
    handleDeleteClick(dltbtn, task)
  }



  taskInput.value = "";

};

function handleDeleteClick(dltbtn, task) {
  let deletedLi = dltbtn.parentElement;
  let currentUl = deletedLi.parentElement;
  deletedLi.remove();

  if (currentUl.nextSibling !== null) {
    currentUl.appendChild(currentUl.nextSibling.firstChild);
  }
  //if the last item on the current/showing page (not the first) is deleted 
  //previous page should be highlighted
  if (currentUl.children.length === 0) {
    if (countPages > 1) {
      let removedPage = pageLastShown[0][pageLastShown[0].length - 1];
      pageLastShown = [];
      pageLastShown.push(`page${removedPage - 1}`)
    } else {
      pageLastShown = [];
      title = [];
      listTitle.value = "";
    }
  }

  toDoList.splice(toDoList.indexOf(task), 1);
  updateLocalStorage();
  location.reload();

};




function showTitle(title) {
  listTitle.value = title;
}


function showPage(page) {
  let a = document.createElement('a');
  a.innerHTML = page;
  a.classList.add('page');
  a.classList.add('underline-animation');
  pages.appendChild(a);


  //click function
  a.onclick = function () {
    pageToShow = document.getElementById(`page${page}`);
    pageToShow.classList.remove('hide');
    let siblings = getSiblings(pageToShow);
    siblings.forEach((item) => {
      item.classList.add('hide');
    })
    //add color to the clicked/current page numeration
    let aSiblings = getSiblings(a);
    aSiblings.forEach((item) => {
      item.style.color = null;
    });
    a.style.color = "darkkhaki";
    //remember last shown page
    pageLastShown = [];
    pageLastShown.push(`page${page}`);
    updateLocalStorage();
  }
}

function getSiblings(ul) {
  let siblings = [];
  let sibling = ul.parentElement.firstChild;
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== ul) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
};

function getChildren(pagesDiv) {
  let children = [];
  let child = pagesDiv.firstChild;
  while (child) {
    if (child.nodeType === 1) {
      children.push(child);
    }
    child = child.nextSibling;
  }
  return children;
};



function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(toDoList));
  localStorage.setItem("title", JSON.stringify(title));
  localStorage.setItem("page", JSON.stringify(pageLastShown));

}

function clearAll() {
  localStorage.clear();
  while (wholeListDiv.firstChild) {
    wholeListDiv.removeChild(wholeListDiv.firstChild);
  }

  while (pages.firstChild) {
    pages.removeChild(pages.firstChild);
  }

  toDoList = [];
  title = [];
  pageLastShown = [];
  countPages = 0;
  listdiv.classList.remove("list");
  nav.classList.remove("navbar");
  listTitle.classList.add("hide");
  listTitle.value = "";
  taskInput.value = "";

};
