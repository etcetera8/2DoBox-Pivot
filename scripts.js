var IdeaCard = function(title, idea, id) {
  this.title = title;
  this.idea = idea;
  this.id = id;
  this.counter = 0;
};
var ratingArray = ['Swill', 'Plausible', 'Genius'];

$(document).ready(retrieveCard);

function retrieveCard() {
  for (let i = 0; i < localStorage.length; i++) {
  var retrievedObject = localStorage.getItem(localStorage.key(i));
  var parsedObject = JSON.parse(retrievedObject);
  createCard(parsedObject.id, parsedObject.title, parsedObject.idea, parsedObject.counter);
  };
}

$('.save-button').on('click', saveCard);

function saveCard() {
  event.preventDefault();
  var titleInput = $('#title-input').val();
  var ideaInput = $('#idea-input').val();
  var dateNow = Date.now();
  createCard(dateNow, titleInput, ideaInput);
  $('form')[0].reset();
  disableSaveButton();
  sendCardToLocalStorage(titleInput, ideaInput, dateNow);
}

function createCard(id,title,idea,counter = 0) {
  $('.idea-card-wrap').prepend(`<article id="${id}" class="idea-card">
  <h1 class="user-idea" contenteditable="true">${title}</h1>
    <button class="delete-button" aria-label="Delete Button"></button>
    <p class="user-idea-details" contenteditable="true">${idea}</p>
    <button class="upvote-button" aria-label="upvote button"></button>
    <button class="downvote-button" aria-label="downvote button"></button>
    <h2>quality: <span class="rating">${ratingArray[counter]}</span></h2>
  <hr>
  </article>`);
};

function disableSaveButton() {
  $('.save-button').attr('disabled', true);
};

$(window).on('keydown', saveButtonToggle);

function saveButtonToggle() {
  if (($('#title-input').val() !== '') && ($('#idea-input').val() !== '')) {
    enableSaveButton();
  } else {
    disableSaveButton();
  };
}

$('.idea-card-wrap').on('click', '.upvote-button', upVote);

function upVote() {
  var clickedCardId = $(this).parent('article').attr('id');
  var theObject = localStorage.getItem(clickedCardId);
  var parsedTheObject = JSON.parse(theObject);
  $(this).siblings('.downvote-button').removeAttr('disabled');
  qualityToLocalStorage(clickedCardId, theObject, parsedTheObject, this);
}

function qualityToLocalStorage(id, obj, parsedObj, thisEl) {
  $(thisEl).siblings('.downvote-button').removeAttr('disabled');
  if (parsedObj.counter === 2) {
    $(thisEl).attr('disabled', true);
  } else {
    parsedObj.counter++;
    $(thisEl).siblings('h2').find('.rating').text(ratingArray[parsedObj.counter]);
    var stringifiedTheObject = JSON.stringify(parsedObj);
    localStorage.setItem(id, stringifiedTheObject);
  };
}


//ANON FUNCTION
//OVER 8 LINES
$('.idea-card-wrap').on('click', '.downvote-button', downVote);

function downVote() {
  var clickedCardId = $(this).parent('article').attr('id');
  var theObject = localStorage.getItem(clickedCardId);
  var parsedTheObject = JSON.parse(theObject);
  $(this).siblings('.upvote-button').removeAttr('disabled');
  if (parsedTheObject.counter === 0) {
    $(this).attr('disabled', true);
  } else {
    parsedTheObject.counter--;
    $(this).siblings('h2').find('.rating').text(ratingArray[parsedTheObject.counter]);
    var stringifiedTheObject = JSON.stringify(parsedTheObject);
    localStorage.setItem(clickedCardId, stringifiedTheObject);
  };
}

$('.idea-card-wrap').on('click', '.delete-button', deleteCard)

function deleteCard() {
  var parentArticle = $(this).closest('article');
  var id = parentArticle.prop('id');
  parentArticle.remove();
  localStorage.removeItem(id);
};

$('.idea-card-wrap').on('blur', 'p', persistTextEdit);

function persistTextEdit() {
  var parentArticle = $(this).closest('article');
  var id = parentArticle.prop('id');
  var newText = parentArticle.children('p').text();
  var objectFromLocal = localStorage.getItem(id);
  var object = JSON.parse(objectFromLocal);
  object.idea = newText;
  var objectString = JSON.stringify(object);
  localStorage.setItem(id, objectString);
};

$('.idea-card-wrap').on('blur', 'h1', persistTitleEdit);

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
    return card.title.toUpperCase().includes(searchInput) || card.idea.toUpperCase().includes(searchInput);
  });
  printSearchResults(searchedArray);
};






function enableSaveButton() {
  $('.save-button').removeAttr('disabled');
};

function printSearchResults(searchedArray) {
  searchedArray.forEach(function(result) {
    createCard(result.id,result.title,result.idea,result.counter);
  });
};

function sendCardToLocalStorage(titleInput, ideaInput, dateNow){
  var ideaCard = new IdeaCard(titleInput, ideaInput, dateNow);
  var stringIdeaCard = JSON.stringify(ideaCard);
  localStorage.setItem(dateNow, stringIdeaCard);
};