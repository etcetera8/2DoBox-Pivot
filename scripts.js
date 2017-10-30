var TaskCard = function(title, task, id) {
  this.title = title;
  this.task = task;
  this.id = id;
  this.counter = 0;
  this.completed = false;
};

$(document).ready(retrieveCard);

function retrieveCard() {
  for (let i = 0; i < localStorage.length; i++) {
    var retrievedObject = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedObject);
    createCard(parsedObject.id, parsedObject.title, parsedObject.task, parsedObject.counter);
    if (parsedObject.completed === true) {
      var completedCardId = parsedObject.id
      $(`#${completedCardId}`).hide()
    }
  };
}
$('.show-completed-btn').on('click', showCompleted);

function showCompleted() {
  for (let i = 0; i < localStorage.length; i++) {
    var retrievedObject = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedObject);
    if (parsedObject.completed === true) {
      var completedCardId = parsedObject.id
    $('article:hidden').find('h1, p, h2').toggleClass('completed');
    $('article:hidden').show('fast');
    }
  }
}

$('.task-card-wrap').on('click', '.task-complete-btn', taskCompleted)

function taskCompleted() {
  var parsedTheObject = JSON.parse(localStorage.getItem($(this).parent('article').attr('id')));
  if (parsedTheObject.completed === false) {
    parsedTheObject.completed = true;
    $(this).siblings('h1, p, h2').toggleClass('completed');
  } else { 
    parsedTheObject.completed = false;
    $(this).siblings('h1, p, h2').toggleClass('completed');
  }
  localStorage.setItem($(this).parent('article').attr('id'), JSON.stringify(parsedTheObject));
}

function createCard(id,title,task,counter = 0) {
  var ratingArray = ['None', 'Low', 'Normal', 'High', 'Critical' ];

  $('.task-card-wrap').prepend(`<article id="${id}" class="task-card">
  <h1 class="user-task" contenteditable="true">${title}</h1>
    <button class="delete-button" aria-label="Delete Button"></button>
    <p class="user-task-details" contenteditable="true">${task}</p>
    <button class="upvote-button" aria-label="upvote button"></button>
    <button class="downvote-button" aria-label="downvote button"></button>
    <h2>quality: <span class="rating">${ratingArray[counter]}</span></h2>
    <button class="task-complete-btn ${id}">Task Completed</button>
  <hr>
  </article>`);
};

$('.save-button').on('click', saveCard);

function saveCard() {
  event.preventDefault();
  var titleInput = $('#title-input').val();
  var taskInput = $('#task-input').val();
  var dateNow = Date.now();
  createCard(dateNow, titleInput, taskInput);
  $('form')[0].reset();
  disableSaveButton();
  sendCardToLocalStorage(titleInput, taskInput, dateNow);
}

function disableSaveButton() {
  $('.save-button').attr('disabled', true);
};

$(window).on('keydown', saveButtonToggle);

function saveButtonToggle() {
  if (($('#title-input').val() !== '') && ($('#task-input').val() !== '')) {
    enableSaveButton();
  } else {
    disableSaveButton();
  };
}

$('.task-card-wrap').on('click', '.upvote-button', upVote);

function upVote() {
  var clickedCardId = $(this).parent('article').attr('id');
  var theObject = localStorage.getItem(clickedCardId);
  var parsedTheObject = JSON.parse(theObject);
  $(this).siblings('.downvote-button').removeAttr('disabled');
  upVoteToLocalStorage(clickedCardId, theObject, parsedTheObject, this);
}

function upVoteToLocalStorage(id, obj, parsedObj, thisEl) {
  var ratingArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
  $(thisEl).siblings('.downvote-button').removeAttr('disabled');
  if (parsedObj.counter === 4) {
    $(thisEl).attr('disabled', true);
  } else { parsedObj.counter++;
    $(thisEl).siblings('h2').find('.rating').text(ratingArray[parsedObj.counter]);
    localStorage.setItem(id, JSON.stringify(parsedObj));
  };
}

//OVER 8 LINES
$('.task-card-wrap').on('click', '.downvote-button', downVote);

function downVote() {
  var clickedCardId = $(this).parent('article').attr('id');
  var theObject = localStorage.getItem(clickedCardId);
  var parsedTheObject = JSON.parse(theObject);
  $(this).siblings('.upvote-button').removeAttr('disabled');
  downVoteToLocalStorage(clickedCardId, theObject, parsedTheObject, this);
}

function downVoteToLocalStorage(id, obj, parsedObj, thisEl) {
  var ratingArray = ['None', 'Low', 'Normal', 'High', 'Critical' ];
  if (parsedObj.counter === 0) {
    $(thisEl).attr('disabled', true);
  } else { parsedObj.counter--;
    $(thisEl).siblings('h2').find('.rating').text(ratingArray[parsedObj.counter]);
    localStorage.setItem(id, JSON.stringify(parsedObj));
  };
};

$('.task-card-wrap').on('click', '.delete-button', deleteCard)

function deleteCard() {
  var parentArticle = $(this).closest('article');
  var id = parentArticle.prop('id');
  parentArticle.remove();
  localStorage.removeItem(id);
};

$('.task-card-wrap').on('blur', 'p', persistTextEdit);

function persistTextEdit() {
  var parentArticle = $(this).closest('article');
  var id = parentArticle.prop('id');
  var newText = parentArticle.children('p').text();
  var objectFromLocal = localStorage.getItem(id);
  var object = JSON.parse(objectFromLocal);
  object.task = newText;
  var objectString = JSON.stringify(object);
  localStorage.setItem(id, objectString);
};

$('.task-card-wrap').on('blur', 'h1', persistTitleEdit);

function persistTitleEdit() {
  var parentArticle = $(this).closest('article');
  var id = parentArticle.prop('id');
  var newTitle = parentArticle.children('h1').text();
  var objectFromLocal = localStorage.getItem(id);
  var object = JSON.parse(objectFromLocal);
  object.title = newTitle;
  var objectString = JSON.stringify(object);
  localStorage.setItem(id, objectString);
};

$('#search-box').on('keyup', arrayOfLocalStorage);

function arrayOfLocalStorage() {
  var newArray = [];
  for (let i = 0; i < localStorage.length; i++) {
    var retrievedObject = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedObject);
    newArray.push(parsedObject);
  };
  $('article').remove();
  runSearch(newArray);
};

function runSearch(newArray) {
  var searchInput = $('#search-box').val().toUpperCase();
  var searchedArray = newArray.filter(function(card) {
    return card.title.toUpperCase().includes(searchInput) || card.task.toUpperCase().includes(searchInput);
  });
  printSearchResults(searchedArray);
};

function enableSaveButton() {
  $('.save-button').removeAttr('disabled');
};

function printSearchResults(searchedArray) {
  searchedArray.forEach(function(result) {
    createCard(result.id,result.title,result.task,result.counter);
  });
};

function sendCardToLocalStorage(titleInput, taskInput, dateNow){
  var taskCard = new TaskCard(titleInput, taskInput, dateNow);
  var stringTaskCard = JSON.stringify(taskCard);
  localStorage.setItem(dateNow, stringTaskCard);
};