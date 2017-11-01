var TaskCard = function(title, task, id) {
  this.title = title;
  this.task = task;
  this.id = id;
  this.counter = 2;
  this.completed = false;
};

$(document).ready(retrieveCard);
$('.save-button').on('click', saveCard);
$('.show-more-btn').on('click', showMoreTasks);
$('.show-completed-btn').on('click', showCompleted);
$('.task-card-wrap').on('click', '.task-complete-btn', taskCompleted)
$(window).on('keydown', saveButtonToggle);
$('.task-card-wrap').on('click', '.upvote-button', upVote);
$('.task-card-wrap').on('click', '.downvote-button', downVote);
$('#search-box').on('keyup', arrayOfLocalStorage);
$('.task-card-wrap').on('blur', 'h1', persistTitleEdit);
$('.none-btn').on('click', filterNone);
$('.low-btn').on('click', filterLow);
$('.normal-btn').on('click', filterNormal);
$('.high-btn').on('click', filterHigh);
$('.critical-btn').on('click', filterCritical);
$('.task-card-wrap').on('click', '.delete-button', deleteCard)
$('.task-card-wrap').on('blur', 'p', persistTextEdit);

function retrieveCard() {
  for (let i = 0; i < localStorage.length; i++) {
    var retrievedObject = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedObject);
    createCard(parsedObject.id, parsedObject.title, parsedObject.task, parsedObject.counter);  
  };
  topTen();
  hideMore();
}

function topTen() {
  for (let i = 0; i < localStorage.length; i++) {
    var retrievedObject = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedObject);
  if (parsedObject.completed === true) {
      var completedCardId = parsedObject.id
      $(`#${completedCardId}`).hide()
    }
  }
}

function hideMore() {
  var objArr = Array.from($('article:visible'));
  $('article:visible').hide();
  for (var j = 0 ; j < 10; j++) {
    console.log(objArr[j].id)
    $(`#${objArr[j].id}`).show()
  }
}

function showMoreTasks() {
  console.log($('article:hidden'))
  var hiddenEls = Array.from($('article:hidden'))
  for (var i = 0; i < 10; i++) {
    var id =hiddenEls[i].id;
    $(`#${id}`).show();
  }
}

function showCompleted() {
  for (let i = 0; i < localStorage.length; i++) {
    var retrievedObject = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedObject);
    if (parsedObject.completed === true) {
      var completedCardId = parsedObject.id
    $(`#${completedCardId}`).find('h1, p, h2').addClass('completed');
    $(`#${completedCardId}`).show('fast');
    }
  }
}

function loopThroughStorage(countNum) {
  event.preventDefault();
  for (let i = 0; i < localStorage.length; i++) {
    var retrievedObject = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedObject);
    var cardId = parsedObject.id;
    $(`#${cardId}`).show();
    if (parsedObject.counter != countNum) {
      $(`#${cardId}`).hide();
   } 
  }
}

function filterNone() {
  loopThroughStorage(0);
}

function filterLow() {
  loopThroughStorage(1);
}

function filterNormal() {
  loopThroughStorage(2);
}

function filterHigh() {
  loopThroughStorage(3);
}

function filterCritical() {
  loopThroughStorage(4);
}

function taskCompleted() {
  var parsedTheObject = JSON.parse(localStorage.getItem($(this).parent('article').attr('id')));
  if (parsedTheObject.completed === false) {
    parsedTheObject.completed = true;
  } else { 
    parsedTheObject.completed = false;
  }
      $(this).siblings('h1, p, h2').toggleClass('completed');

  localStorage.setItem($(this).parent('article').attr('id'), JSON.stringify(parsedTheObject));
}

function createCard(id,title,task,counter = 2, completed) {
  var ratingArray = ['None', 'Low', 'Normal', 'High', 'Critical' ];
  var completedClass = completed ? "completed" : "";
  $('.task-card-wrap').prepend(`<article id="${id}" class="task-card">
  <h1 class="user-task ${completedClass}" contenteditable="true">${title}</h1>
    <button class="delete-button svg" aria-label="Delete Button"></button>
    <p class="user-task-details ${completedClass}" contenteditable="true">${task}</p>
    <button class="upvote-button svg" aria-label="upvote button"></button>
    <button class="downvote-button svg" aria-label="downvote button"></button>
    <h2 class = ${completedClass}>Importance: <span class="rating">${ratingArray[counter]}</span></h2>
    <button class="task-complete-btn ${id}">Task Completed</button>
  <hr>
  </article>`);
};

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

function saveButtonToggle() {
  if (($('#title-input').val() !== '') && ($('#task-input').val() !== '')) {
    enableSaveButton();
  } else {
    disableSaveButton();
  };
}

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

function deleteCard() {
  var parentArticle = $(this).closest('article');
  var id = parentArticle.prop('id');
  parentArticle.remove();
  localStorage.removeItem(id);
};

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
    return (card.title.toUpperCase().includes(searchInput) || card.task.toUpperCase().includes(searchInput)) && !card.completed;
  });
  printSearchResults(searchedArray);
};

function enableSaveButton() {
  $('.save-button').removeAttr('disabled');
};

function printSearchResults(searchedArray) {
  searchedArray.forEach(function(result) {
    createCard(result.id,result.title,result.task,result.counter, result.completed);
  });
};

function sendCardToLocalStorage(titleInput, taskInput, dateNow){
  var taskCard = new TaskCard(titleInput, taskInput, dateNow);
  var stringTaskCard = JSON.stringify(taskCard);
  localStorage.setItem(dateNow, stringTaskCard);
};