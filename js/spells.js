'use strict';

(function () { 
  
  function parse(value){
    return JSON.parse(value);
  }

  // DRAG-n-DROP (no text is inserted into droppable element)
  function dragAndDrop(draggable, droppable){
    const pairs = {};
    $( function() {
    $(draggable).draggable({
      containment: ".task-window", 
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
    $(droppable).droppable({
      accept: draggable,
      classes: {
        "ui-droppable-hover": "hover"
      },
      drop: function( event, ui ) {
        pairs[$(".active").text()] = $(this).text() ;
        $(".active").remove();
        $(this)
          .addClass( "highlight" )
        }
      });
    });
    return pairs;
  }

  // DRAG-n-DROP (text is inserted into droppable element)
  function dragAndDropFillText(draggable, droppable){
    const word = [];
    $( function() {
    $(draggable).draggable({
      containment: ".task-window", 
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
    $(droppable).droppable({
      accept: draggable,
      classes: {
        "ui-droppable-hover": "hover"
      },
      drop: function( event, ui ) {
       this.textContent = $(".active").text();
       word.push($(".active").text());
        $(".active").remove();
        $(this)
          .addClass( "highlight" )
        }
      });
    });
    return word;
  }

  // For drag and drop
  function checkPairs(pairs, source){
    let condition = [true];
    _.forEach(pairs, function(value, key) {
      if (!_.includes(source[value], key)) { condition.unshift(false);  }      
    });
    return condition[0];
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
          document.querySelector('.spells-board').classList.add('no-click');
          if (!_.includes(event.target.classList, 'freeze-spell') || parse(localStorage.level) ===4) { 
              document.querySelector('.battle-audio').play();
          }
          }, 300);
      }
      _.forEach(spellHandlers, function(func, spell) {
        if (event.target.classList.contains(spell) ) {func();} // call the appropriate func
      }); 
    }

    // Close button of task
    function onCloseButtonClick(event){
        if (event.target.classList.contains('close-button')){
            taskWindow.style.display = 'none';
            taskWrapper.removeChild(taskWrapper.lastChild);
            document.querySelector('.spells-board').classList.remove('no-click');
            document.querySelector('.battle-audio').pause();
            document.querySelector('.battle-audio').currentTime = 0;
            document.querySelector('.main-audio').play();
        }
    }

  // FIREBALL (math)
  //supportive function
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
  
  // handler
  function fireSpellHandler() { 
    if (parse(localStorage.level) === 4) {
      return sentencePartsHandler();
    } else { 
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
      _.forEach(taskDiv.querySelectorAll('input'), function(input) {input.setAttribute('type', 'text');});
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
  } 
  
  // SNOWBALL (utter-check)
  // supportive function
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
  
  //handler
  function freezeSpellHandler() { 
    if (parse(localStorage.level) === 4) {
      return phoneticAnalysisHandler();
    } else {
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
  } 
  
  // POISON (insert letter)
  //supportive function
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
  
  //handler
  function poisonSpellHandler() { 
    if(parse(localStorage.level) === 4) {
      return writeMonthHandler();
    } else {
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
  } 
  
  // ARROW (capitals)
  // handler
  function arrowSpellHandler() { 
    if (parse(localStorage.level) === 4) {
      return geographyHandler();
    } else {
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
  } 
  
  // LIGHTNING (translation)
  function lightningSpellHandler() { 
    if (parse(localStorage.level) === 4){
      return matchTranslationHandler();
    } else {
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
  } 
  
  // RAIN (speech part)
  // supportive function
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
   
  // handler
  function rainSpellHandler() { 
    if (parse(localStorage.level) === 4){
      return composeWordHandler();
    } else {
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
    
      const pairs = dragAndDrop(".word", ".speechPart");
      submitButton.addEventListener('click', checkAnswer);
      function checkAnswer(){
        let win;
        if (pWrapper.firstChild) { 
          warning.textContent = 'Выполни задание'
        } else {
          const condition = checkPairs(pairs, window.tasks.speechPart);
          win =  window.main.isCorrect(condition, taskDiv, taskWrapper);
          setTimeout(function(){window.utils.hideTaskWindow();}, 1500);
          window.main.battleAnimation(win, currentTask);
        }
      }
    }
  }

  // LEVEL 4 tasks

  // Phonetic analysis
  //handler
  function phoneticAnalysisHandler() { 
    const currentTask = "phonetic";
    const taskDiv = window.utils.createEl('div'), 
          taskHeading = window.utils.createEl('p'), 
          submitButton = window.utils.createEl('button'),
          warning = window.utils.createEl('p'),
          divWrapper = window.utils.createEl('section'),
          pWrapper = window.utils.createEl('section');
    const word = _.sample(window.tasks.phoneticAnalysis);
    for (let i = 0; i < word.length; i++){
      pWrapper.appendChild(window.utils.createEl('p'));
      pWrapper.lastChild.classList.add('word');
      pWrapper.lastChild.textContent = word[i];
    } 

    _.forEach(window.tasks.lettersTypes, function(value) {
      divWrapper.appendChild(window.utils.createEl('div'));
      divWrapper.lastChild.textContent = value;
      divWrapper.lastChild.classList.add('lettersType');
    });

    taskDiv.classList.add('task');
    taskDiv.classList.add('phonetic');
    taskHeading.classList.add('task-heading');
    pWrapper.classList.add('p-wrapper');
    divWrapper.classList.add('div-wrapper');
    submitButton.classList.add('submit-button');
    taskHeading.textContent = "Определи гласные и согласные буквы";
    submitButton.textContent = "Я сделал!";

    const storage = [];
    storage.push(taskHeading, divWrapper, pWrapper, submitButton, warning);
    storage.forEach(function(el){taskDiv.appendChild(el);});
    window.utils.addDocumentFragment(taskDiv, taskWrapper);

    const pairs = dragAndDrop(".word", ".lettersType");
    submitButton.addEventListener('click', checkAnswer);
    function checkAnswer(){
      let win;
      if (pWrapper.firstChild) { 
        warning.textContent = 'Выполни задание'
      } else {
        const condition = checkPairs(pairs, window.tasks.alphabet);
        win =  window.main.isCorrect(condition, taskDiv, taskWrapper);
        setTimeout(function(){window.utils.hideTaskWindow();}, 1500);
        window.main.battleAnimation(win, currentTask);
      }
    }
  }

  // Compose a word from letters
  // handler
  function composeWordHandler() { 
    const currentTask = "compose";
    const taskDiv = window.utils.createEl('div'), 
          taskHeading = window.utils.createEl('p'), 
          submitButton = window.utils.createEl('button'),
          warning = window.utils.createEl('p'),
          divWrapper = window.utils.createEl('section'),
          pWrapper = window.utils.createEl('section');
    const wordArr = _.sample(window.tasks.lettersToCompose);
    const word = wordArr[1];
    const solution = wordArr[0];
    for (let i = 0; i < word.length; i++){
      pWrapper.appendChild(window.utils.createEl('p'));
      pWrapper.lastChild.classList.add('letter');
      pWrapper.lastChild.textContent = word[i];
      divWrapper.appendChild(window.utils.createEl('div'));
      divWrapper.lastChild.classList.add('cell-for-letter');
    } 
    taskDiv.classList.add('task');
    taskDiv.classList.add('compose');
    taskHeading.classList.add('task-heading');
    pWrapper.classList.add('p-wrapper');
    divWrapper.classList.add('div-wrapper');
    submitButton.classList.add('submit-button');
    taskHeading.textContent = "Составь из букв слово";
    submitButton.textContent = "Я сделал!";

    const storage = [];
    storage.push(taskHeading, divWrapper, pWrapper, submitButton, warning);
    storage.forEach(function(el){taskDiv.appendChild(el);});
    window.utils.addDocumentFragment(taskDiv, taskWrapper);
    const composedWordArr = dragAndDropFillText(".letter", ".cell-for-letter");
    
    submitButton.addEventListener('click', checkAnswer);
    function checkAnswer(){
      let win;
      if (pWrapper.firstChild) { 
        warning.textContent = 'Выполни задание'
      } else {
        const composedWord = composedWordArr.reduce(function(a, b) { return a + b;});
        const condition = (composedWord === solution);
        win =  window.main.isCorrect(condition, taskDiv, taskWrapper);
        setTimeout(function(){window.utils.hideTaskWindow();}, 1500);
        window.main.battleAnimation(win, currentTask);
      }
    }
  }

  // Find a translation
  // handler
  function matchTranslationHandler() { 
    const currentTask = "translation";
    const taskDiv = window.utils.createEl('div'), 
          taskHeading = window.utils.createEl('p'), 
          submitButton = window.utils.createEl('button'),
          warning = window.utils.createEl('p'),
          divWrapper = window.utils.createEl('section'),
          pWrapper = window.utils.createEl('section');

    const solution = _.sample(Object.keys(window.tasks.translation));
      for (let i = 0; i < 3; i++){
        pWrapper.appendChild(window.utils.createEl('p'));
        pWrapper.lastChild.classList.add('word');
        pWrapper.lastChild.textContent = window.tasks.translation[solution][i];
      }  

      for (let i = 0; i < 2; i++){
        divWrapper.appendChild(window.utils.createEl('div'));
        let cl = (i === 0) ? "pic" : "solution-box";
        divWrapper.lastChild.classList.add(cl);
      }
 
    taskDiv.classList.add('task');
    taskDiv.classList.add('translation');
    taskHeading.classList.add('task-heading');
    pWrapper.classList.add('p-wrapper');
    divWrapper.classList.add('div-wrapper');
    submitButton.classList.add('submit-button');
    taskHeading.textContent = "Выбери верный перевод";
    submitButton.textContent = "Я сделал!";

    const storage = [];
    storage.push(taskHeading, divWrapper, pWrapper, submitButton, warning);
    storage.forEach(function(el){taskDiv.appendChild(el);});
    window.utils.addDocumentFragment(taskDiv, taskWrapper);
    document.querySelector('.pic').style.backgroundImage = "url('img/" + solution + ".png')";
    const pair = dragAndDropFillText(".word", ".solution-box");
    
    submitButton.addEventListener('click', checkAnswer);
    function checkAnswer(){
      let win;
      if (!divWrapper.textContent) { 
        warning.textContent = 'Выполни задание';
      } else {
        const answer = pair[pair.length-1];
        const condition = (answer === solution);
        win =  window.main.isCorrect(condition, taskDiv, taskWrapper);
        setTimeout(function(){window.utils.hideTaskWindow();}, 1500);
        window.main.battleAnimation(win, currentTask);
      }
    }
  }

  // Write the following month
  // handler
  function writeMonthHandler() { 
    const currentTask = "months";
    const taskDiv = window.utils.createEl('div'), 
          taskHeading = window.utils.createEl('p'), 
          monthDiv = window.utils.createEl('div'), 
          input = window.utils.createEl('input'),
          submitButton = window.utils.createEl('button'),
          warning = window.utils.createEl('p');
    taskDiv.classList.add('task');
    taskDiv.classList.add('months');
    taskHeading.classList.add('task-heading');
    submitButton.classList.add('submit-button');
    monthDiv.classList.add('month-div');
    taskHeading.textContent = "Напиши на английском следующий за указанным месяц";
    submitButton.textContent = "Я написал!";
    input.setAttribute('type', 'text');
    const storage = [];
    storage.push(taskHeading, monthDiv, input, submitButton, warning);
    storage.forEach(function(el){taskDiv.appendChild(el);});
    window.utils.addDocumentFragment(taskDiv, taskWrapper);
    const pickedMonth = _.sample(window.tasks.months);
    let index = window.tasks.months.indexOf(pickedMonth); 
    monthDiv.textContent = pickedMonth;
    
    submitButton.addEventListener('click', checkAnswer);
    function checkAnswer(){
      let win;
      if (input.value === "") { 
        warning.textContent = 'Заполни пустое поле'
      } else {
        function check(){
          index = (index === 11) ? -1 : index;
          return _.lowerCase(input.value) === window.tasks.months[index+1];
        }

        const condition = check();
        win =  window.main.isCorrect(condition, taskDiv, taskWrapper);
        setTimeout(function(){window.utils.hideTaskWindow();}, 1500);
        window.main.battleAnimation(win, currentTask);
      }
    }
  } 

  // Geographe facts
  // handler
  function geographyHandler() { 
    const currentTask = "geography";
    const taskDiv = window.utils.createEl('div'), 
          taskHeading = window.utils.createEl('p'), 
          submitButton = window.utils.createEl('button'),
          warning = window.utils.createEl('p'),
          divWrapper = window.utils.createEl('section'),
          pWrapper = window.utils.createEl('section');

    const solution = _.sample(Object.keys(window.tasks.geography));
      for (let i = 1; i < 4; i++){
        pWrapper.appendChild(window.utils.createEl('p'));
        pWrapper.lastChild.classList.add('word');
        pWrapper.lastChild.textContent = window.tasks.geography[solution][i];
      }  

    taskDiv.classList.add('task');
    taskDiv.classList.add('geography');
    taskHeading.classList.add('task-heading');
    pWrapper.classList.add('p-wrapper');
    divWrapper.classList.add('div-wrapper');
    submitButton.classList.add('submit-button');
    taskHeading.textContent = window.tasks.geography[solution][0];
    submitButton.textContent = "Я сделал!";

    const storage = [];
    storage.push(taskHeading, divWrapper, pWrapper, submitButton, warning);
    storage.forEach(function(el){taskDiv.appendChild(el);});
    window.utils.addDocumentFragment(taskDiv, taskWrapper);
    let answer;
    pWrapper.addEventListener('click', pickAnswer);
    // supportive function 
    function pickAnswer(event) {
      if (event.target.tagName === "P"){
        event.target.style.backgroundColor = "lightgreen";
        event.target.style.border = "2px solid #64227c";
        answer = event.target.textContent;
        document.querySelector('.geography .p-wrapper').removeEventListener('click', pickAnswer);
      }  
    }
  
  submitButton.addEventListener('click', checkAnswer);
  function checkAnswer(){
    let win;
    if (!answer) { 
     warning.textContent = 'Выполни задание'
    } else {
      const condition = (answer === solution);
      win =  window.main.isCorrect(condition, taskDiv, taskWrapper);
      setTimeout(function(){window.utils.hideTaskWindow();}, 1500);
      window.main.battleAnimation(win, currentTask);
    }
  }
}

//Define a subject and a predicate
// handler
function sentencePartsHandler() { 
  const currentTask = "sentence";
  const taskDiv = window.utils.createEl('div'), 
        taskHeading = window.utils.createEl('p'), 
        submitButton = window.utils.createEl('button'),
        warning = window.utils.createEl('p'),
        pWrapper = window.utils.createEl('p');

  const pickedObj = _.sample(window.tasks.sentenceParts);
  const splitted = pickedObj.sentence.split(' ');
    for (let i = 0; i < splitted.length; i++){
      pWrapper.appendChild(window.utils.createEl('span'));
      pWrapper.lastChild.classList.add('part');
      pWrapper.lastChild.textContent = (i === splitted.length-1) ? splitted[i] : splitted[i] + " ";   
    }  

  taskHeading.appendChild(window.utils.createEl('span'));
  taskHeading.appendChild(window.utils.createEl('span'));
  taskDiv.classList.add('task');
  taskDiv.classList.add('sentence');
  taskHeading.classList.add('task-heading');
  pWrapper.classList.add('p-wrapper');
  submitButton.classList.add('submit-button');
  taskHeading.firstChild.textContent = " Разбери предложение по составу";
  taskHeading.lastChild.textContent = "*1 клик - выбор подлежащего/очистить выбор, 2 - выбор сказуемого";
  submitButton.textContent = "Я сделал!";

  const storage = [];
  storage.push(taskHeading, pWrapper, submitButton, warning);
  storage.forEach(function(el){taskDiv.appendChild(el);});
  window.utils.addDocumentFragment(taskDiv, taskWrapper);
  
  pWrapper.addEventListener('click', pickSubject);
  pWrapper.addEventListener('dblclick', pickPredicate);
   // supportive function
  function pickSubject(event) {
    if (event.target.tagName === "SPAN"){ 
      if (event.target.classList.contains('predicate')) {event.target.classList.remove('predicate') }
      event.target.classList.toggle('subject');
    }  
  }

  function pickPredicate(event) {
    if (event.target.tagName === "SPAN"){
      if (event.target.classList.contains('subject')) {event.target.classList.remove('subject') }
      event.target.classList.toggle('predicate');
    }  
  }
  
  submitButton.addEventListener('click', checkAnswer);
  let subject = [], predicate = [];
  
  function checkAnswer(){
  _.forEach(pWrapper.querySelectorAll('.subject'), function(item){subject.push(_.trim(item.textContent));})
  _.forEach(pWrapper.querySelectorAll('.predicate'), function(item){predicate.push(_.trim(item.textContent));})
    let win;
    if (!predicate.length) { 
     warning.textContent = 'Выполни задание'
    } else {
      const condition = (_.isEqual(subject, pickedObj.subject)  && _.isEqual(predicate, pickedObj.predicate));
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