'use strict';

(function () {

    // katy animation
  function initKaty(){
    const toReturn =[];
    // Get canvas for katy
    const canvasKaty = document.getElementById("katy");
    const canvasKatyImage = new Image();	
    const contextKaty = canvasKaty.getContext("2d");
    canvasKaty.width = 300; 
    canvasKaty.height = 250;
    
    // Create sprite
    const iddle = sprite({
      width: 3000, 
      height: 250,
      image: canvasKatyImage,
      numberOfFrames: 10, 
      ticksPerFrame: 6, 
    }, contextKaty);

    // Load sprite sheet
    canvasKatyImage.addEventListener("load", animateIddle);
    canvasKatyImage.src = "img/iddle.png"; 

    function animateIddle () {
      window.requestAnimationFrame(animateIddle);
      iddle.loop();
      iddle.render();
    }
    toReturn.push(canvasKatyImage, contextKaty)
    return toReturn;
  }

  function initShoot(){
    const canvasKaty = document.getElementById("katy");
    const canvasKatyImage = new Image();	
    const contextKaty = canvasKaty.getContext("2d");
    canvasKaty.width = 300; 
    canvasKaty.height = 250;

      // shoot
    const shoot = sprite({
      width: 1240, 
      height: 250,
      image: canvasKatyImage,
      numberOfFrames: 4, 
      ticksPerFrame: 30, 
    }, contextKaty);

    // Load sprite sheet
    canvasKatyImage.addEventListener("load", animateShoot);
    canvasKatyImage.src = "img/shoot.png"; 

    function animateShoot () {
      window.requestAnimationFrame(animateShoot);
      shoot.motion();
      shoot.render();
    }
  }  

  const arr = initKaty();
  let canvasKatyImage = arr[0];
  let contextKaty = arr[1];
 
  // dead
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

  function sprite (options, context) {
    let that = {},
        frameIndex = 0,
        tickCount = 0,
        ticksPerFrame = options.ticksPerFrame || 0,
        numberOfFrames = options.numberOfFrames || 1;
        
    //that.context = options.context;
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
      // Draw the animation
      context.drawImage( that.image, frameIndex * that.width / numberOfFrames, 0, that.width / numberOfFrames, that.height, 0, 0, that.width / numberOfFrames, that.height);
    };	
    return that;
  }

  window.animation = {
    initKaty : initKaty,
    canvasKatyImage: canvasKatyImage,
    animateDead : animateDead,
    sprite : sprite,
    initShoot : initShoot
  };

})();


  