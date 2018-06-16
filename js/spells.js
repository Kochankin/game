'use strict';

(function () {

    function stringify(value){
        return JSON.stringify(value);
      }
      
    function parse(value){
        return JSON.parse(value);
      }

    // Spells-click handlers
    const spellHandlers = {
        'fire-spell': fireSpellHandler,
        'arrow-spell': arrowSpellHandler,
        'freeze-spell': freezeSpellHandler,
        'lightning-spell': lightningSpellHandler,
        'poison-spell': poisonSpellHandler,
        'rain-spell': rainSpellHandler
    }

    // Spells on click
    const taskWindow = document.querySelector('.task-window');
    const taskWrapper = document.querySelector('.task-wrapper');
    const spellsBoard = document.querySelector('.spells-board');
    spellsBoard.addEventListener('click', onSpellClick);
    taskWindow.addEventListener('click', onCloseButtonClick);

    function onSpellClick(event) {
    if (event.target.tagName === 'DIV' || event.target.tagName === 'SPAN') {
        setTimeout(function(){
        taskWindow.style.display = 'block';
        document.querySelector('.main-audio').pause();
        if (!_.includes(event.target.classList, 'freeze-spell')) {
            document.querySelector('.battle-audio').play();
        }
        }, 300);
    }

    _.forEach(spellHandlers, function(func, spell) {
        if (event.target.classList.contains(spell) ) {
        func();
        } 
    }); 
    }

    // Close button of task
    function onCloseButtonClick(event){
        if (event.target.classList.contains('close-button')){
            taskWindow.style.display = 'none';
            taskWrapper.removeChild(taskWrapper.lastChild);
            document.querySelector('.battle-audio').pause();
            document.querySelector('.battle-audio').currentTime = 0;
            document.querySelector('.main-audio').play();
        }
    }

    // Таск - огненный шар - математика
// для основной функции - генерация примера
function generateMathTask(exercise){
    let task;
    switch (parse(localStorage.level)) {
    case 1:
    task = _.random(1, 10) + _.sample(window.tasks.mathOperations.simple) + _.random(1, 10);
      break;
    case 2:
    task = _.random(1, 10) + _.sample(window.tasks.mathOperations.difficult) + _.random(1, 10);
      break;
    case 3:
    task = "(" + _.random(1, 10) + _.sample(window.tasks.mathOperations.simple) + _.random(1, 10) + ")" + _.sample(window.tasks.mathOperations.difficult) + _.random(1, 10);
      break;
    }
    exercise.textContent = task;
    return task;
  }
  
  // основная функция
  function fireSpellHandler() { 
    const currentTask = "fire";
    const taskDiv = window.utils.createEl('div'), 
          taskHeading = window.utils.createEl('p'), 
          exercise = window.utils.createEl('p'), 
          equal = window.utils.createEl('p'),
          wrapper = window.utils.createEl('div'),
          input1 = window.utils.createEl('input'), 
          input2 = window.utils.createEl('input'),
          submitButton = window.utils.createEl('button'),
          warning = window.utils.createEl('p');
    taskDiv.classList.add('task');
    taskDiv.classList.add('fire');
    taskHeading.classList.add('task-heading');
    exercise.classList.add('exercise');
    equal.classList.add('equal');
    submitButton.classList.add('submit-button');
    wrapper.classList.add('wrapper');
    _.forEach(taskDiv.querySelectorAll('input'), function(input) {
      input.setAttribute('type', 'text');
    });
    input2.value = '1';
    equal.textContent = "=";
    taskHeading.textContent = "Реши пример";
    submitButton.textContent = "Я решил!";
    wrapper.appendChild(exercise);
    wrapper.appendChild(equal);
    wrapper.appendChild(input1);
    wrapper.appendChild(input2);
  
    const storage = [];
    storage.push(taskHeading, wrapper, submitButton, warning);
    storage.forEach(function(el){taskDiv.appendChild(el);});
    window.utils.addDocumentFragment(taskDiv, taskWrapper);
    const mathTask = generateMathTask(exercise);
  
    submitButton.addEventListener('click', checkAnswer);
    function checkAnswer(event){
      let win;
      warning.textContent = "";
      if (input1.value === "" || input2.value === "") { 
       warning.textContent = 'Заполни пустые поля!'; 
      } else if (isNaN(Number(input1.value)) || isNaN(Number(input2.value))) {
        warning.textContent = 'Ты должен ввести число!'; 
      } else {
        const condition = (eval(mathTask) === eval(Number(input1.value) + "/" + Number(input2.value)));
        win =  window.main.isCorrect(condition, taskDiv, taskWrapper);
        setTimeout(function(){window.utils.hideTaskWindow();}, 1500);
         window.main.battleAnimation(win, currentTask);
      }
    }   
  } 
  
  // Таск - ледяной шар - аудирование
  // для основной функции - генерируем произнесение слова
  function generateUtterTask() {
    let word;
  switch (parse(localStorage.level)) {
    case 1:
      word = _.sample(window.tasks.spellСheck.level1);
      break;
    case 2:
      word = _.sample(window.tasks.spellСheck.level2);
      break;
    case 3:
      word = _.sample(window.tasks.spellСheck.level3);
      break;
    }
    const toReturn = [word];
    toReturn.push(window.utils.initUtterance(word));
    return toReturn;
  }
  
  //основная функция
  function freezeSpellHandler() { 
    const currentTask = "freeze";
    const taskDiv = window.utils.createEl('div'), 
          taskHeading = window.utils.createEl('p'), 
          playButton = window.utils.createEl('button'), 
          input = window.utils.createEl('input'),
          submitButton = window.utils.createEl('button'),
          warning = window.utils.createEl('p');
    taskDiv.classList.add('task');
    taskDiv.classList.add('freeze');
    taskHeading.classList.add('task-heading');
    submitButton.classList.add('submit-button');
    playButton.classList.add('play-button');
    taskHeading.textContent = "Введи продиктованное слово";
    submitButton.textContent = "Я написал!";
    input.setAttribute('type', 'text');
    const storage = [];
    storage.push(taskHeading, playButton, input, submitButton, warning);
    storage.forEach(function(el){taskDiv.appendChild(el);});
    window.utils.addDocumentFragment(taskDiv, taskWrapper);
    
    const generated = generateUtterTask(),
          word = generated[0],
          u = generated[1];
    playButton.addEventListener('click', utterWord);
    function utterWord(){
      speechSynthesis.speak(u);
    }
  
    submitButton.addEventListener('click', checkAnswer);
    function checkAnswer(){
      let win;
      if (input.value === "") { 
       warning.textContent = 'Заполни пустое поле'
      } else {
        const condition = (_.lowerCase(input.value)=== word);
        win =  window.main.isCorrect(condition, taskDiv, taskWrapper);
        setTimeout(function(){window.utils.hideTaskWindow();}, 1500);
         window.main.battleAnimation(win, currentTask);
      }
    }
  } 
  
  // Таск - проклинающее зелье - вставка буквы
  //для основной функции - выбор и вставка слова 
  function pickWord(task) {
    const temp = [];
    let word, solution;
  switch (parse(localStorage.level)) {
    case 1:
      _.forEach(task.level1, function(value, key) {
        temp.push(key);
      });
      word = _.sample(temp);
      solution = task.level1[word];
      break;
    case 2:
      _.forEach(task.level2, function(value, key) {
        temp.push(key);
      });
      word = _.sample(temp);
      solution = task.level2[word];
      break;
    case 3:
      _.forEach(task.level3, function(value, key) {
        temp.push(key);
      });
      word = _.sample(temp);
      solution = task.level3[word];
      break;
    } 
    const toReturn = [word, solution];
    return toReturn;
  }
  
  //основная функция
  function poisonSpellHandler() { 
    const currentTask = "poison";
    const taskDiv = window.utils.createEl('div'), 
          taskHeading = window.utils.createEl('p'), 
          exercise = window.utils.createEl('p'), 
          input = window.utils.createEl('input'),
          submitButton = window.utils.createEl('button'),
          warning = window.utils.createEl('p');
    taskDiv.classList.add('task');
    taskDiv.classList.add('poison');
    taskHeading.classList.add('task-heading');
    exercise.classList.add('exercise');
    submitButton.classList.add('submit-button');
    taskHeading.textContent = "Вставь пропущенную букву";
    submitButton.textContent = "Я сделал!";
    input.setAttribute('type', 'text');
    const storage = [];
    storage.push(taskHeading, exercise, input, submitButton, warning);
    storage.forEach(function(el){taskDiv.appendChild(el);});
    window.utils.addDocumentFragment(taskDiv, taskWrapper);
  
    const picked = pickWord(window.tasks.insertLetter),
          word = picked[0],
          missedLetter = picked[1];
    exercise.textContent = word;
  
    submitButton.addEventListener('click', checkAnswer);
    function checkAnswer(){
      let win;
      if (input.value === "") { 
       warning.textContent = 'Заполни пустое поле'
      } else {
       const condition = (_.lowerCase(input.value) === missedLetter);
        win =  window.main.isCorrect(condition, taskDiv, taskWrapper);
        setTimeout(function(){window.utils.hideTaskWindow();}, 1500);
         window.main.battleAnimation(win, currentTask);
      }
    }
  } 
  
  // Таск - стрела поражения - написать столицу
  function arrowSpellHandler() { 
    const currentTask = "arrow";
    const taskDiv = window.utils.createEl('div'), 
          taskHeading = window.utils.createEl('p'), 
          exercise = window.utils.createEl('p'), 
          input = window.utils.createEl('input'),
          submitButton = window.utils.createEl('button'),
          warning = window.utils.createEl('p');
    taskDiv.classList.add('task');
    taskDiv.classList.add('arrow');
    taskHeading.classList.add('task-heading');
    exercise.classList.add('exercise');
    submitButton.classList.add('submit-button');
    taskHeading.textContent = "Напиши столицу страны";
    submitButton.textContent = "Я написал!";
    input.setAttribute('type', 'text');
    const storage = [];
    storage.push(taskHeading, exercise, input, submitButton, warning);
    storage.forEach(function(el){taskDiv.appendChild(el);});
    window.utils.addDocumentFragment(taskDiv, taskWrapper);
  
    const picked = pickWord(window.tasks.capitals),
          country = picked[0],
          capital = picked[1];
    exercise.textContent = country;
  
    submitButton.addEventListener('click', checkAnswer);
    function checkAnswer(){
      let win;
      if (input.value === "") { 
       warning.textContent = 'Заполни пустое поле'
      } else {
       const condition = (_.lowerCase(input.value) === capital);
        win =  window.main.isCorrect(condition, taskDiv, taskWrapper);
        setTimeout(function(){window.utils.hideTaskWindow();}, 1500);
         window.main.battleAnimation(win, currentTask);
      }
    }
  } 
  
  // Таск - небесная кара - перевод слова
  function lightningSpellHandler() { 
    const currentTask = "lightning";
    const taskDiv = window.utils.createEl('div'), 
          taskHeading = window.utils.createEl('p'), 
          exercise = window.utils.createEl('p'), 
          input = window.utils.createEl('input'),
          submitButton = window.utils.createEl('button'),
          warning = window.utils.createEl('p');
    taskDiv.classList.add('task');
    taskDiv.classList.add('lightning');
    taskHeading.classList.add('task-heading');
    exercise.classList.add('exercise');
    submitButton.classList.add('submit-button');
    taskHeading.textContent = "Напиши перевод слова";
    submitButton.textContent = "Я написал!";
    input.setAttribute('type', 'text');
    const storage = [];
    storage.push(taskHeading, exercise, input, submitButton, warning);
    storage.forEach(function(el){taskDiv.appendChild(el);});
    window.utils.addDocumentFragment(taskDiv, taskWrapper);
  
    const picked = pickWord(window.tasks.dictionary), 
          word = picked[0],
          translations = picked[1];
    exercise.textContent = word;
  
    submitButton.addEventListener('click', checkAnswer);
    function checkAnswer(){
      let win;
      if (input.value === "") { 
       warning.textContent = 'Заполни пустое поле'
      } else {
       const condition = (_.includes(translations, _.lowerCase(input.value)));
        win =  window.main.isCorrect(condition, taskDiv, taskWrapper);
        setTimeout(function(){window.utils.hideTaskWindow();}, 1500);
         window.main.battleAnimation(win, currentTask);
      }
    }
  } 
  
  // Таск - ливень остолбенения - часть речи
  // для основной функции - выбрать слова
  function chooseWords(pWrapper){
    let x;
    switch (parse(localStorage.level)) {
      case 1:
      x = 2;
        break;
      case 2:
        x = 3;
        break;
      case 3:
        x = 5;
        break;
      }
  
    for (let i = 0; i < x; i++){
      pWrapper.appendChild(window.utils.createEl('p'));
      pWrapper.lastChild.classList.add('word');
      pWrapper.lastChild.textContent = _.sample(_.sample(window.tasks.speechPart));
    }  
    return x;
  }
  // перетаскивание элементов
  function dragAndDrop(){
    const pairs = {};
    $( function() {
    $( ".word" ).draggable({
      containment: ".task.rain", 
      scroll: false,
      revert: "invalid",
      start: function() {
        $(this).css("background-color","white");
        $(this).css("border","1px solid lightgrey");
        $(this).addClass("active");
    },
    stop: function() {
      $(this).css("background-color","lightgrey");
      $(this).removeClass("active");
    }
    });
    $( ".speechPart" ).droppable({
      accept: ".word",
      classes: {
        "ui-droppable-hover": "hover"
      },
      drop: function( event, ui ) {
        pairs[$(".word.active").text()] = $(this).text() ;
        $(".word.active").remove();
        $(this)
          .addClass( "highlight" )
      }
      });
    });
    return pairs;
  }
  
  function checkPairs(pairs){
    let condition = [true];
    _.forEach(pairs, function(value, key) {
      if (!_.includes(window.tasks.speechPart[value], key)) { condition.unshift(false);  }      
    });
    return condition[0];
  }
  
  // основная функция
  function rainSpellHandler() { 
    const currentTask = "rain";
    const taskDiv = window.utils.createEl('div'), 
          taskHeading = window.utils.createEl('p'), 
          submitButton = window.utils.createEl('button'),
          warning = window.utils.createEl('p'),
          divWrapper = window.utils.createEl('section'),
          pWrapper = window.utils.createEl('section');
    const speechParts = [];
    _.forEach(window.tasks.speechPart, function(value, key) {
      speechParts.push(key);
      divWrapper.appendChild(window.utils.createEl('div'));
      divWrapper.lastChild.textContent = key;
      divWrapper.lastChild.classList.add('speechPart');
    });
    chooseWords(pWrapper);
    taskDiv.classList.add('task');
    taskDiv.classList.add('rain');
    taskHeading.classList.add('task-heading');
    pWrapper.classList.add('p-wrapper');
    divWrapper.classList.add('div-wrapper');
    submitButton.classList.add('submit-button');
    taskHeading.textContent = "Определи часть речи";
    submitButton.textContent = "Я сделал!";
  
    const storage = [];
    storage.push(taskHeading, divWrapper,pWrapper, submitButton, warning);
    storage.forEach(function(el){taskDiv.appendChild(el);});
    window.utils.addDocumentFragment(taskDiv, taskWrapper);
  
    const pairs = dragAndDrop();
    submitButton.addEventListener('click', checkAnswer);
    function checkAnswer(){
      let win;
      if (pWrapper.firstChild) { 
       warning.textContent = 'Выполни задание'
      } else {
        const condition = checkPairs(pairs);
        win =  window.main.isCorrect(condition, taskDiv, taskWrapper);
        setTimeout(function(){window.utils.hideTaskWindow();}, 1500);
         window.main.battleAnimation(win, currentTask);
      }
    }
  }
    
    window.spells = {
        spellsBoard : spellsBoard,
    }
      
  })();