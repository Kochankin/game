'use strict';

(function () {

  function stringify(value){
    return JSON.stringify(value);
  }
  
  function parse(value){
    return JSON.parse(value);
  }

  // LOCAL STORAGE init
  function initLocalStorage() {
    // if this is the first game
    if (!localStorage.length) {
      localStorage.setItem('level', '1');   
      localStorage.setItem('results', '{}');
    }
    // if this is the first level
    if (parse(localStorage.level) === 1){
      localStorage.setItem('killedMonsters', '0');
      localStorage.setItem('userName', 'User');
    }
   // update in any case
    localStorage.setItem('userHealth', '100'); 
    localStorage.setItem('monsterHealth', '100');
  }


// container for requesting a user name
function renderUserNameRequest() {
  const popUpWindow = window.utils.createEl('div'),
        p = window.utils.createEl('p'), 
        input = window.utils.createEl('input'),
        button = window.utils.createEl('button'),
        warning = window.utils.createEl('p');
  popUpWindow.classList.add('user-name-request'); 
  input.setAttribute('type', 'text');
  input.setAttribute('autofocus', '');
  p.textContent = "Как тебя зовут?";
  button.textContent = "Нажми меня";
  button.addEventListener('click', saveUserName);
  popUpWindow.appendChild(p);
  popUpWindow.appendChild(input);
  popUpWindow.appendChild(button);
  popUpWindow.appendChild(warning);
  const documentFragment = document.createDocumentFragment();
  documentFragment.appendChild(popUpWindow);
  document.querySelector('.container').before(documentFragment);
}

// save user name
function saveUserName(){
  let userNameRequestInput = _.trim(document.querySelector('.user-name-request>input').value);
  if (!userNameRequestInput) { 
    document.querySelector('.user-name-request>button+p').textContent = "Заполни пустое поле";
  } else {
    const userName = userNameRequestInput.toUpperCase();
    localStorage.setItem('userName', stringify(userName));
    document.querySelector('body').removeChild(document.querySelector('.user-name-request'));
    document.querySelector('.user-board>.name').textContent = userName;
  }
}

function initLevel(){
  document.addEventListener('click', function(){
    window.utils.soundEffect('.click-audio');
  });

  document.querySelector('.user-board>.name').textContent = localStorage.length ? localStorage.userName.substring(1, localStorage.userName.length-1) : "User";

  initLocalStorage();
  document.addEventListener('load', window.utils.startAudio);

  if (parse(localStorage.level) === 1){
    renderUserNameRequest();
    document.querySelector('.main-audio').currentTime = 0;
    document.addEventListener('change',  window.utils.startAudio);
  }   

  window.animation.initKaty();

  const context = document.getElementById("monster").getContext("2d");
  context.clearRect(0, 0, 300, 300);
  
  // generate monster name
  const monsterNameDiv = document.querySelector('.monster-board>.name');
  monsterNameDiv.textContent =  window.monsters.getMonsterName(window.monsters.monsterNames);
  // generate a monster appearance
   window.monsters.generateMonster();

  // update health
 document.querySelector('.user-board .health>span').textContent = parse(localStorage.userHealth);
 document.querySelector('.monster-board .health>span').textContent = parse(localStorage.monsterHealth);
 document.querySelector('.user-board .health>div').style.width = "100%";
 document.querySelector('.monster-board .health>div').style.width = "100%";

  // show level
  document.querySelector('.level>span').textContent = parse(localStorage.level);

  // set background-image
  document.querySelector('.container').style.backgroundImage = "url('img/bg" + parse(localStorage.level) + "-top.png')"; 
  document.querySelector('.bottom').style.backgroundImage = "url('img/bg" + parse(localStorage.level) + "-bottom.png')";
}

initLevel();

// Check solution correctness (for 1 task)
function isCorrect(condition, taskDiv, taskWrapper){
  const message = window.utils.createEl('p');
  message.classList.add('results-message');
  let win;
  if (condition) { 
    localStorage.monsterHealth = parse(localStorage.monsterHealth) - 20;
    window.utils.hide(taskDiv);
    taskWrapper.removeChild(taskWrapper.lastChild);
    message.textContent = 'ВЕРНО!';
    setTimeout(function(){window.utils.soundEffect('.correct-audio');}, 100);
    win = true;
  } else {
    if (parse(localStorage.userHealth) > 0) {
      if (parse(localStorage.userHealth) === 34) {
        localStorage.userHealth = parse(localStorage.userHealth) - 34;
      } else {
        localStorage.userHealth = parse(localStorage.userHealth) - 33;
      }
    }
    window.utils.hide(taskDiv);
    message.textContent = 'ТЫ ОШИБСЯ!';
    setTimeout(function(){window.utils.soundEffect('.wrong-audio');}, 80);
    win = false;
  }  
  taskWrapper.appendChild(message);  
  return win;
}

// CHECK PLAYER STATUS (is the game over?)
function checkState() {
  const monsterCanvas = document.querySelector('#monster');
  let win;
  // if user or monster was killed
  if (!parse(localStorage.userHealth) || !parse(localStorage.monsterHealth)){ 
    if (parse(localStorage.userHealth) === 0){ 
      win = false;
      window.animation.canvasKatyImage.addEventListener("load", window.animation.animateDead);
      window.animation.canvasKatyImage.src = "img/dead.png";   
      localStorage.setItem('level', "1");
      window.utils.soundEffect('.scream-audio');
    } else if (parse(localStorage.monsterHealth) === 0) { 
      win = true;
      monsterCanvas.style.animationName = 'animateMonsterDeath';
      monsterCanvas.style.animationIterationCount = '1';
      setTimeout(function() {window.utils.soundEffect('.fall-audio');}, 500);
       
      setTimeout(function(){
        const context = document.getElementById("monster").getContext("2d");
        context.clearRect(0, 0, 300, 300);
      }, 1000);

      // update level
      let level = parse(localStorage.level);
      if (level === 3) {   
        level = 1;
      } else {
        ++level;
      }
      localStorage.setItem('level', stringify(level));

      // update killed monsters count
      let killedMonsters = parse(localStorage.killedMonsters);
      killedMonsters++;
      localStorage.setItem('killedMonsters', stringify(killedMonsters));
    }

    // update results
    const results = parse(localStorage.results);
    results[parse(localStorage.userName)] = parse(localStorage.killedMonsters);
    localStorage.results = stringify(results);

    setTimeout(function(){showNotice(win);}, 1500); // show notice
    setTimeout(hideNotice, 3500); // window.utils.hide notice
    setTimeout(showSpinner, 3500); // show spinner
    setTimeout(hideSpinner, 5000); // window.utils.hide spinner
    if (win && parse(localStorage.level) !=1) { 
      setTimeout(function(){
        initLevel();
      },  5000);// load next level
      document.querySelector('.main-audio').play();
    } else {
      setTimeout(showResultsTable,  5000); // show results
    }
  // if user or monster are alive
  } else {
    document.querySelector('.main-audio').play();
  }
}

// Notice on loose or win
function showNotice(win) {
  const notice = window.utils.createEl('section');
  notice.classList.add('notice');
  document.querySelector('.container').after(notice);
  if (win){ 
    notice.textContent = parse(localStorage.level) === 1 ? "ТЫ ВЫИГРАЛ!" : "УРОВЕНЬ ПРОЙДЕН!";
    window.utils.soundEffect('.game-win-audio');
  } else{
    notice.textContent = "ТЫ ПРОИГРАЛ!";
    window.utils.soundEffect('.game-lose-audio');
  }
}

function hideNotice(){
  document.querySelector('body').removeChild(document.querySelector('.notice'));
}


// Spinner for loading imitation
function showSpinner() {
  const page = window.utils.createEl('section');
  const spinner = window.utils.createEl('div');
  page.classList.add('load-page');
  spinner.classList.add('spinner');
  page.appendChild(spinner);
  document.querySelector('.container').after(page);
}

function hideSpinner() {
  document.querySelector('body').removeChild(document.querySelector('.load-page'));
}


// RESULTS TABLE - TOP 5 results are only shown
function showResultsTable(){ 
  const resultsPage = window.utils.createEl('section'),
        heading = window.utils.createEl('p'),
        table = window.utils.createEl('table'),
        button = window.utils.createEl('button');
  resultsPage.classList.add('results-page');
  heading.textContent = "ТОП-5";
  button.textContent = "Новая игра";
  button.addEventListener('click', function(){
    document.querySelector('body').removeChild(resultsPage); 
    showSpinner(); // show spinner
    initLevel();
    setTimeout(function(){
      document.querySelector('.results-audio').pause();
      document.querySelector('.results-audio').currentTime = 0;
      hideSpinner();// window.utils.hide spinner
    }, 1500);});

    const results = parse(localStorage.results);
    const resultsArr= Object.entries(results);
    const sorted = resultsArr.sort(compare);
    let rows = sorted.length >= 5 ? 6 : sorted.length + 1;
    for (let j = 0; j < rows; j++ ){
      let tr = window.utils.createEl('tr');
      if (j === 0)  { 
        insertCells(tr, 'th');
        tr.firstChild.textContent = "ИГРОК";
        tr.lastChild.textContent = "Убитые монстры";
      } else {
        insertCells(tr, 'td'); 
        
        for (let i = 0; i < rows-1; i ++){
          if (i === j - 1) {
            tr.firstChild.textContent = sorted[i][0];
            tr.lastChild.textContent = sorted[i][1]; 
          }
        }
      }    
      table.appendChild(tr);
    }

  resultsPage.appendChild(heading);
  resultsPage.appendChild(table);
  resultsPage.appendChild(button);
  document.querySelector('.container').after(resultsPage);  

  document.querySelector('.main-audio').pause();
  setTimeout(function(){ document.querySelector('.results-audio').play();}, 200);
}

function insertCells(el, cell) {
  for (let i = 0; i < 2; i++){
    const toInsert = window.utils.createEl(cell);  
    el.appendChild(toInsert);
  }
}

function compare (arrA, arrB) {
  return arrB[1] - arrA[1];
}


// BATTLE ANIMATION
function battleAnimation(win, currentTask){
  const monsterCanvas = document.querySelector('#monster');
  window.utils.hide (window.spells.spellsBoard);
  setTimeout(animation, 1200);
  function animation() {
    if (win) { // -WIN-
      // shoot
     // window.animation.canvasKatyImage.addEventListener("load", window.animation.animateShoot);
      //window.animation.canvasKatyImage.src = "img/shoot.png";
      window.animation.initShoot();
     
      setTimeout( function(){
        window.utils.soundEffect('.shoot-audio');
        setTimeout(function(){window.utils.soundEffect('.explode-audio')}, 700);
        setTimeout(function(){window.utils.soundEffect('.monster-scream-audio')}, 1500);
      }, 700);
      setTimeout(applySpell, 1000);
      setTimeout(reduceMonsterHealth, 2700);

      //apply spell
        function applySpell() {
          const spellImg = window.utils.createEl('div');
          spellImg.classList.add('spell-img');
          spellImg.classList.add(currentTask);
          document.querySelector('#katy').after(spellImg);
          setTimeout(explose, 700);

          // explosion
          function explose() { 
            document.querySelector('.container').removeChild(spellImg);
            const canvasExpl = window.utils.createEl('canvas');
            canvasExpl.setAttribute('id', 'explosion');
            monsterCanvas.after(canvasExpl);
            canvasExpl.width = 100; 
            canvasExpl.height = 98;
            const canvasExplImage = new Image();	
            const contextExpl = canvasExpl.getContext("2d");
            canvasExplImage.src = "img/explosion.png"; 
            canvasExplImage.addEventListener("load", animateExplosion);

            const explosion = window.animation.sprite({
              width: 1000, 
              height: 98,
              image: canvasExplImage,
              numberOfFrames: 10, 
              ticksPerFrame: 6, 
            }, contextExpl);

            function animateExplosion () {
              window.requestAnimationFrame(animateExplosion);
              explosion.motion();
              explosion.render();
            }
            setTimeout( function() {document.querySelector('.container').removeChild(canvasExpl);}, 1000);
          }       
        }
      
        // reduce health
        function reduceMonsterHealth() {
          const healthDiv = document.querySelector('.monster-board .health>div');
          let monsterHealth = parse(localStorage.monsterHealth);
          healthDiv.style.width = monsterHealth + '%';
          document.querySelector('.monster-board .health>span').textContent = monsterHealth;
        }
        
      } else { // -LOOSE-
        // attack
        monsterCanvas.style.animationName = 'attack';
        monsterCanvas.style.animationIterationCount = '1';
        setTimeout( function(){
          window.utils.soundEffect('.moving-audio');
          setTimeout(function(){window.utils.soundEffect('.fireball-audio')}, 1200);
          setTimeout(function(){window.utils.soundEffect('.boom-audio')}, 1500);
          setTimeout(function(){window.utils.soundEffect('.hurt-audio')}, 1800);
        }, 100);
        setTimeout(monsterSpell, 1000);
        setTimeout(reduceUserHealth, 2700);

        //apply spell
        function monsterSpell() {
          const monsterSmoke = window.utils.createEl('div');
          monsterSmoke.classList.add('monster-smoke');
          document.querySelector('#katy').after(monsterSmoke);
          setTimeout(smokeAnimation, 700);
        }
        
        function smokeAnimation() { 
          document.querySelector('.container').removeChild(document.querySelector('.monster-smoke'));
          const canvasSmoke = window.utils.createEl('canvas');
          canvasSmoke.setAttribute('id', 'smoke');
          document.querySelector('.container').appendChild(canvasSmoke);
          canvasSmoke.width = 267; 
          canvasSmoke.height = 267;
          const canvasSmokeImage = new Image();	
          const contextSmoke = canvasSmoke.getContext("2d");
          canvasSmokeImage.src = "img/smoke.png"; 
          canvasSmokeImage.addEventListener("load", animateSmoke);

          const smoke = window.animation.sprite({
            width: 2670, 
            height: 267,
            image: canvasSmokeImage,
            numberOfFrames: 10, 
            ticksPerFrame: 6, 
          }, contextSmoke);

          function animateSmoke () {
            window.requestAnimationFrame(animateSmoke);
            smoke.motion();
            smoke.render();
          }
          setTimeout( function() {document.querySelector('.container').removeChild(canvasSmoke);}, 1000);
        }    
        // reduce health
        function reduceUserHealth() {
          const healthDiv = document.querySelector('.user-board .health>div');
          let userHealth = parse(localStorage.userHealth);
          healthDiv.style.width = userHealth + '%';
          document.querySelector('.user-board .health>span').textContent = userHealth;
        }
 
      }  
      setTimeout(window.utils.restore, 3000);
      setTimeout(checkState, 3500);
  }  
}

window.main = {
  saveUserName : saveUserName,
  isCorrect : isCorrect,
  battleAnimation : battleAnimation
}

})();


