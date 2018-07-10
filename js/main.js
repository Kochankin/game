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
      localStorage.setItem('gameWin', 'null');
    }
    // if this is the first level
    if (parse(localStorage.level) === 1){
      localStorage.setItem('killedMonsters', '0');
      localStorage.setItem('userName', 'User');   
    }
   // update in any case
    localStorage.setItem('userHealth', '100'); 
    localStorage.setItem('monsterHealth', '100');
    localStorage.setItem('levelWin', 'null');
  }


// INIT container for requesting a user name
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
  document.querySelector('.spells-board').classList.add('no-click');
  documentFragment.appendChild(popUpWindow);
  document.querySelector('.container').before(documentFragment);
}

// Save user name (on button click)
function saveUserName(){
  let userNameRequestInput = _.trim(document.querySelector('.user-name-request>input').value);
  if (!userNameRequestInput) { 
    document.querySelector('.user-name-request>button+p').textContent = "Заполни пустое поле";
  } else {
    const userName = userNameRequestInput.toUpperCase();
    localStorage.setItem('userName', stringify(userName));
    document.querySelector('body').removeChild(document.querySelector('.user-name-request'));
    document.querySelector('.user-board>.name').textContent = userName;
    document.querySelector('.spells-board').classList.remove('no-click');
  }
}

// Call after win or "new game"-button click
function initLevel(){
  window.utils.restore();
  initLocalStorage();

  //audio
  document.addEventListener('load', window.utils.startAudio);
  if (parse(localStorage.level) === 1){
    renderUserNameRequest();
    document.addEventListener('change',  window.utils.startAudio);
  }   

  window.animation.initKaty();

  // generate monster name
  const monsterNameDiv = document.querySelector('.monster-board>.name');
  monsterNameDiv.textContent =  window.monsters.getMonsterName(window.monsters.monsterNames);
  // generate a monster appearance
  document.getElementById("monster").getContext("2d").clearRect(0, 0, 300, 300);
  window.monsters.generateMonster();

    // update health
  document.querySelector('.user-board .health>span').textContent = parse(localStorage.userHealth);
  document.querySelector('.monster-board .health>span').textContent = parse(localStorage.monsterHealth);
  document.querySelector('.user-board .health>div').style.width = "100%";
  document.querySelector('.monster-board .health>div').style.width = "100%";

  // show user name and level
  document.querySelector('.user-board>.name').textContent = localStorage.length ? localStorage.userName.substring(1, localStorage.userName.length-1) : "User";
  document.querySelector('.level>span').textContent = parse(localStorage.level);

  // set background-image
  document.querySelector('.container').style.backgroundImage = "url('img/bg" + parse(localStorage.level) + "-top.png')"; 
  document.querySelector('.bottom').style.backgroundImage = "url('img/bg" + parse(localStorage.level) + "-bottom.png')";
}

initLevel();

// Check solution correctness (for 1 task)
function isCorrect(condition, taskDiv, taskWrapper, currentTask){
  let win;
  const hideTaskWindowTimeout =  1500;
  const message = window.utils.createEl('p');
  message.classList.add('results-message');
  if (condition) { 
    localStorage.monsterHealth = parse(localStorage.monsterHealth) - 20;
    window.utils.hide(taskDiv);
    taskWrapper.removeChild(taskWrapper.lastChild);
    message.textContent = 'ВЕРНО!';
    window.utils.soundEffect('.correct-audio');
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
    window.utils.soundEffect('.wrong-audio');
    win = false;
  }  
  let promise = new Promise((resolve) => {
    taskWrapper.appendChild(message);
    setTimeout(() => {resolve();}, hideTaskWindowTimeout);
  });
  promise.then(() => {
    window.utils.hideTaskWindow();
    window.main.battleAnimation(win, currentTask);
  })   
  return win;
}

// CHECK PLAYER STATUS (is the game over?)
function checkState() {
  const monsterCanvas = document.querySelector('#monster');
  const showNoticeTimeout = 1000;
  if (!parse(localStorage.userHealth) || !parse(localStorage.monsterHealth)){ 
    if (!parse(localStorage.userHealth)){ // Level loose
      localStorage.levelWin = "loose";
      localStorage.gameWin = "loose";
      let promise = new Promise((resolve) => {
        window.animation.initDead();
        window.utils.soundEffect('.scream-audio');
        setTimeout(() => {resolve();}, showNoticeTimeout);
      });
      promise.then(() => showNotice()); 
    } else if (!parse(localStorage.monsterHealth)) { //Level win
      localStorage.levelWin = "win";
      monsterCanvas.style.animationName = 'animateMonsterDeath';
      monsterCanvas.style.animationIterationCount = '1';
      monsterCanvas.addEventListener('animationstart', monsterFall);

      // update level
      let level = parse(localStorage.level);
      ++level;
      localStorage.setItem('level', stringify(level));
      localStorage.gameWin = (level > 4 ) ? 'win' : null;

      // update killed monsters count
      let killedMonsters = parse(localStorage.killedMonsters);
      killedMonsters++;
      localStorage.setItem('killedMonsters', stringify(killedMonsters));
    }

    // update results
    const results = parse(localStorage.results);
    results[parse(localStorage.userName)] = parse(localStorage.killedMonsters);
    localStorage.results = stringify(results);
    document.querySelector('.spells-board').classList.remove('no-click');
  } else { window.utils.restore();}
}

function monsterFall(){
  const monsterCanvas = document.querySelector('#monster');
  const fallSoundTimeout = 500;
  monsterCanvas.addEventListener('animationend', monsterDisappear);
  let promise = new Promise((resolve) => {
    setTimeout(() => {resolve();}, fallSoundTimeout);
  });
  promise.then(() => window.utils.soundEffect('.fall-audio'));
  monsterCanvas.removeEventListener ('animationstart', monsterFall);
}

function monsterDisappear(){
  const monsterCanvas = document.querySelector('#monster');
  const context = document.getElementById("monster").getContext("2d");
  context.clearRect(0, 0, 300, 300);
  showNotice();
  monsterCanvas.removeEventListener('animationend', monsterDisappear);
}

// Notice on loose or win
function showNotice() {
  const notice = window.utils.createEl('section');
  const removeNoticeTimeout = 2000;
  notice.classList.add('notice');
  document.querySelector('.container').after(notice);
  if (localStorage.levelWin === "win"){ 
    notice.textContent = localStorage.gameWin === "win" ? "ТЫ ВЫИГРАЛ!" : "УРОВЕНЬ ПРОЙДЕН!";
    window.utils.soundEffect('.game-win-audio');
  } else {
    notice.textContent = "ТЫ ПРОИГРАЛ!";
    window.utils.soundEffect('.game-lose-audio');
  }
  let promise = new Promise((resolve) => {
    setTimeout(() => {resolve();}, removeNoticeTimeout);
  });
  promise.then(function(){
    document.querySelector('body').removeChild(notice);
    let func = (localStorage.gameWin == "null") ? initLevel : showResultsTable;
    showSpinner(func);
  }); 
}

// Spinner for loading imitation
function showSpinner(func) {
  const page = window.utils.createEl('section');
  const spinner = window.utils.createEl('div');
  const removeSpinnerTimeout = 1500;
  page.classList.add('load-page');
  spinner.classList.add('spinner');
  page.appendChild(spinner);
  document.querySelector('.container').after(page);
  let promise = new Promise((resolve) => {
    setTimeout(() => {resolve();}, removeSpinnerTimeout);
  });
  promise.then(function() {
    document.querySelector('body').removeChild(page);
    func();
  }
   );
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
  localStorage.gameWin = null;
  localStorage.levelWin = null;
  localStorage.level = 1;
  button.addEventListener('click', function(){
    document.querySelector('body').removeChild(resultsPage); 
    showSpinner(initLevel);
  });
  
  fillTable(table);
  resultsPage.appendChild(heading);
  resultsPage.appendChild(table);
  resultsPage.appendChild(button);
  document.querySelector('.container').after(resultsPage);  
  let promise = new Promise((resolve) => {
    document.querySelector('.main-audio').pause();
    resolve();
  });
  promise.then(() => document.querySelector('.results-audio').play());
  document.querySelector('.spells-board').classList.remove('no-click');
}

function insertCells(el, cell) {
  for (let i = 0; i < 2; i++){
    const toInsert = window.utils.createEl(cell);  
    el.appendChild(toInsert);
  }
}

function fillTable(table){
  const results = parse(localStorage.results);
  const resultsArr = Object.entries(results); //transform to: [ ['katy', 2], ['max', 3] ]
  const sorted = resultsArr.sort(window.utils.compare); // to get the best results
  let rows = sorted.length >= 5 ? 6 : sorted.length + 1; // count number of table rows (6 or less)
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
}

// BATTLE ANIMATION
function battleAnimation(win, currentTask){
    const monsterCanvas = document.querySelector('#monster');
    const shootSoundTimeout = 700;
    const exploseTimeout = 700;
    if (win) { // -WIN-
      let promise = new Promise((resolve) => { //shoot
        window.animation.initShoot();
        setTimeout(() => {resolve();}, shootSoundTimeout);
      });

      promise
      .then(() => {window.utils.soundEffect('.shoot-audio')})
      .then(() => {applySpell(currentTask)}) //spell
      .then(() => {setTimeout(explose, exploseTimeout)}); //explosion
            
      } else { // -LOOSE-
        monsterCanvas.style.animationName = 'attack';// attack
        monsterCanvas.style.animationIterationCount = '1';
        monsterCanvas.addEventListener('animationstart', monsterMove);
        monsterCanvas.addEventListener('animationend', monsterSpell);     
      }  
}

function applySpell(currentTask) {
  const spellImg = window.utils.createEl('div');
  spellImg.classList.add('spell-img');
  spellImg.classList.add(currentTask);
  document.querySelector('#katy').after(spellImg);
}

function explose() { 
  const removeExploseTimeout = 1000;
  const checkStateTimeout = 1000;
  const spellImg = document.querySelector('.spell-img');
  document.querySelector('.container').removeChild(spellImg);
  const canvasExpl = window.utils.createEl('canvas');
  canvasExpl.setAttribute('id', 'explosion');
  document.querySelector('#monster').after(canvasExpl);
  
  let promise = new Promise((resolve) => {
    window.animation.initExplosion();
    window.utils.soundEffect('.explode-audio')
    setTimeout(() => {resolve();}, removeExploseTimeout);
  });
  promise
  .then(() => {document.querySelector('.container').removeChild(canvasExpl)})
  .then(() => {window.utils.soundEffect('.monster-scream-audio')})
  .then(() => {setTimeout(reduceMonsterHealth, checkStateTimeout)})
  .then(() => {checkState()});
}  

  function reduceMonsterHealth() {
    const healthDiv = document.querySelector('.monster-board .health>div');
    let monsterHealth = parse(localStorage.monsterHealth);
    healthDiv.style.width = monsterHealth + '%';
    document.querySelector('.monster-board .health>span').textContent = monsterHealth;
  }

  function monsterMove(){
    const monsterCanvas = document.querySelector('#monster');
    window.utils.soundEffect('.moving-audio');
    monsterCanvas.removeEventListener('animationstart', monsterMove);
  }

  function monsterSpell() {
    const smokeTimeout = 700;
    const monsterCanvas = document.querySelector('#monster');
    const monsterSmoke = window.utils.createEl('div');
    monsterSmoke.classList.add('monster-smoke');
    document.querySelector('#katy').after(monsterSmoke);
    let promise = new Promise((resolve) => {
      setTimeout(() => {resolve();}, smokeTimeout);
    });
    promise.then(() => {smoke()});
    monsterCanvas.removeEventListener('animationend', monsterSpell);
  }

  function smoke() { 
    const removeSmokeTimeout = 1000;
    document.querySelector('.container').removeChild(document.querySelector('.monster-smoke'));
    const canvasSmoke = window.utils.createEl('canvas');
    canvasSmoke.setAttribute('id', 'smoke');
    document.querySelector('.container').appendChild(canvasSmoke);
    let promise = new Promise((resolve) => {
      window.animation.initSmoke();
      window.utils.soundEffect('.fireball-audio');
      window.utils.soundEffect('.hurt-audio');   
      setTimeout(() => {resolve();}, removeSmokeTimeout);
    });
    promise
    .then(() => {document.querySelector('.container').removeChild(canvasSmoke)})
    .then(() => {reduceUserHealth()})
    .then(() => {checkState()});
  }  

  // reduce health
  function reduceUserHealth() {
    const healthDiv = document.querySelector('.user-board .health>div');
    let userHealth = parse(localStorage.userHealth);
    healthDiv.style.width = userHealth + '%';
    document.querySelector('.user-board .health>span').textContent = userHealth;
  }

window.main = {
  saveUserName : saveUserName,
  isCorrect : isCorrect,
  battleAnimation : battleAnimation
}

})();




