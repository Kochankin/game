'use strict';

(function () {

   const canvasKaty = document.getElementById("katy");
   const contextKaty = canvasKaty.getContext("2d");
   const canvasKatyImage = new Image();
   canvasKaty.width = 300; 
   canvasKaty.height = 250;

   const monsterCanvas = document.querySelector('#monster');


    //  -INIT FUNCTION- /
  function initKaty(){
    canvasKatyImage.addEventListener("load", animateIddle);
    canvasKatyImage.src = "img/iddle.png"; 

    const iddle = sprite({
      width: 3000, 
      height: 250,
      image: canvasKatyImage,
      numberOfFrames: 10, 
      ticksPerFrame: 6, 
    }, contextKaty);

    function animateIddle () {
      window.requestAnimationFrame(animateIddle);
      iddle.loop();
      iddle.render();
    }
  }

  //  / -SHOOT- /
  function initShoot(){
    canvasKatyImage.addEventListener("load", animateShoot);
    canvasKatyImage.src = "img/shoot.png"; 

    const shoot = sprite({
      width: 1240, 
      height: 250,
      image: canvasKatyImage,
      numberOfFrames: 4, 
      ticksPerFrame: 30, 
    }, contextKaty);

    function animateShoot () {
      window.requestAnimationFrame(animateShoot);
      shoot.motion();
      shoot.render();
    }
  }  

  // / -DEAD- / 
  function initDead() {
    canvasKatyImage.addEventListener("load", animateDead);
    canvasKatyImage.src = "img/dead.png"; 

    const dead = sprite({
      width: 3000, 
      height: 250,
      image: canvasKatyImage,
      numberOfFrames: 10, 
      ticksPerFrame: 6, 
   }, contextKaty);

    function animateDead () {
      window.requestAnimationFrame(animateDead);
      dead.motion();
      dead.render();
    }
  }

  // / -EXPLOSION- /
  function initExplosion() {
    const canvasExpl = document.querySelector('#explosion');
    canvasExpl.width = 100; 
    canvasExpl.height = 98;
    const canvasExplImage = new Image();	
    const contextExpl = canvasExpl.getContext("2d");

    canvasExplImage.addEventListener("load", animateExplosion);
    canvasExplImage.src = "img/explosion.png"; 

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
  }

  // / -SMOKE- /
  function initSmoke() {
    const canvasSmoke = document.querySelector('#smoke');
    canvasSmoke.width = 267; 
    canvasSmoke.height = 267;
    const canvasSmokeImage = new Image();	
    const contextSmoke = canvasSmoke.getContext("2d");
    canvasSmokeImage.addEventListener("load", animateSmoke);
    canvasSmokeImage.src = "img/smoke.png"; 

    const smoke = window.animation.sprite({
      width: 2670, 
      height: 267,
      image: canvasSmokeImage,
      numberOfFrames: 10, 
      ticksPerFrame: 6, 
    }, contextSmoke);

    function animateSmoke() {
      window.requestAnimationFrame(animateSmoke);
      smoke.motion();
      smoke.render();
    }
}

  // / -SPRITE FUNCTION- /
  function sprite (options, context) {
    let that = {},
        frameIndex = 0,
        tickCount = 0,
        ticksPerFrame = options.ticksPerFrame || 0,
        numberOfFrames = options.numberOfFrames || 1;
        
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
        
    that.loop = function () {
      tickCount += 1;
      if (tickCount > ticksPerFrame) {
        tickCount = 0;			
        if (frameIndex < numberOfFrames - 1) { // If the current frame index is in range	   
          frameIndex += 1; // Go to the next frame
        } else {
          frameIndex = 0; // begin from the first image
        }
      } 
    };

    that.motion = function () {
      tickCount += 1;
      if (tickCount > ticksPerFrame) {
        tickCount = 0;			
        if (frameIndex < numberOfFrames - 1) { // If the current frame index is in range	   
          frameIndex += 1; // Go to the next frame
        } 
      }
    };
        
    that.render = function () {	
      context.clearRect(0, 0, that.width, that.height);	 // Clear the canvas 
      context.drawImage( that.image, frameIndex * that.width / numberOfFrames, 0, that.width / numberOfFrames, that.height, 0, 0, that.width / numberOfFrames, that.height);
    };	
    return that;
  }

  window.animation = {
    initKaty : initKaty,
    canvasKatyImage: canvasKatyImage,
    sprite : sprite,
    initShoot : initShoot,
    initDead : initDead,
    initExplosion : initExplosion,
    initSmoke : initSmoke
  };

})();


  