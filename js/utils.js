'use strict';

(function () {
  //KEYBOARD CONTROLS
  const ESC_KEY = 27;
  const ENTER_KEY = 13;

  addEventListener('keydown', onKeyPress);
  function onKeyPress(event) {
    if (document.querySelector('.task-window').style.display === "block" && event.keyCode === ESC_KEY){
        hideTaskWindow();
    } else if (document.querySelector('.user-name-request') && event.keyCode === ENTER_KEY){
      window.main.saveUserName();
    }
  }

  function createEl(el) {
    return document.createElement(el);
  }

  function stringify(value){
      return JSON.stringify(value);
    } 
  function parse(value){
      return JSON.parse(value);
    }

  function addDocumentFragment(content, container) {
    const documentFragment = document.createDocumentFragment();
    documentFragment.appendChild(content);
    container.appendChild(documentFragment);
  }

  function hide(el){
    el.style.display = "none";
  }
  function show(el){
    el.style.display = "block";
  }

  function hideTaskWindow(){
      hide(document.querySelector('.task-window'));
      document.querySelector('.task-wrapper').removeChild(document.querySelector('.task-wrapper').lastChild);
      document.querySelector('.battle-audio').pause();
      document.querySelector('.battle-audio').currentTime = 0;
  }

  function initUtterance(word){
    const u = new SpeechSynthesisUtterance();
      u.text = word;
      u.lang = 'ru-RU';
      u.rate = 0.9;
      u.pitch = 1.2;
      u.volume = 1;
    return u;
  }

  function restore() {
    window.animation.initKaty();
    document.querySelector('.task-window').style.display = 'none';
    show(document.querySelector('.spells-board'));
    document.querySelector('.spells-board').classList.remove('no-click');
    document.querySelector('#monster').style.animationName = 'bounce';
    document.querySelector('#monster').style.animationIterationCount = 'infinite';  
    const audios = document.querySelectorAll('audio');
    audios.forEach(function(audio){
      audio.pause();
      audio.currentTime = 0;
    });
    document.querySelector('.main-audio').play();
  } 

  function soundEffect(sound){
    document.querySelector(sound).play();
  }

  function startAudio(){
    document.querySelector('.main-audio').play();
    document.removeEventListener('change',  startAudio);
    document.addEventListener('click', function(){
      window.utils.soundEffect('.click-audio');
    });
  }

  function compare (arrA, arrB) {
    return arrB[1] - arrA[1];
  }

  window.utils = {
    ESC_KEY : ESC_KEY,
    ENTER_KEY : ENTER_KEY,
    createEl : createEl,
    stringify : stringify,
    parse : parse,
    addDocumentFragment : addDocumentFragment,
    hide : hide,
    show : show,
    hideTaskWindow : hideTaskWindow,
    onKeyPress : onKeyPress,
    initUtterance : initUtterance,
    restore : restore,
    soundEffect : soundEffect,
    startAudio : startAudio,
    compare : compare
  }

})();

