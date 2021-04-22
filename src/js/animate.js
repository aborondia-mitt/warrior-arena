//from https://www.npmjs.com/package/novicell-sprite-animation
const SpriteAnimation = class {
  constructor({
    element,
    frames,
    duration = 600,
    columns,
    rows,
    startingPosition = null,
    iterations = Infinity
  }) {
    this.element = element;
    this.frames = frames;
    this.duration = duration / frames;
    this.columns = columns;
    this.rows = rows;
    this.startingPosition = startingPosition;
    this.iterations = iterations;
    this.animateSprite = function () {
      // Get all this' properties through object destructuring
      // This allows for their use in the nested function animation()
      let {
        element,
        startingPosition,
        columns,
        rows,
        duration,
        iterations
      } = this;
      // Elements are passed according to querySelector syntax.
      const el = document.querySelector(`.${element}`);
      const src = el.dataset.animationSrc;
      let lastTime = 0; // Variable used to compare time inside animation function
      let positionX = 0; // Start posX for the image slicer
      let positionY = 0; // Start posY for the image slicer
      if (startingPosition === "bottom-right") {
        positionX = 100;
        positionY = 100;
      }
      el.style.background = `url(${src}) ${positionX}% ${positionY}%`;
      el.style.backgroundSize = `${columns * 100}% ${rows * 100}%`; // Scale up size by 100% to focus on one frame
      requestAnimationFrame(animation);

      function animation(now) {
        // The now parameter passed to animation gives us the current time
        if (now - lastTime < duration) {
          // This if statement ensures that animation() in relation to the total duration. Otherwise it would fire at 60fps
          requestAnimationFrame(animation);
          return;
        }
        lastTime = now; // Update the last time, so we can compare now with it in next iteration
        el.style.backgroundPosition = `${positionX}% ${positionY}%`; // We use the ES6 template literal to insert the variable "position" on the el
        // If no startingPosition has been set, run the default algorithm (from top left -> bottom right)
        if (startingPosition === null) {
          if (positionX < 100) {
            /*  
                        Percent increment to Use = 100% / (Discrete images in your sprite – 1)
                        So if you have 6 images in your sprite: 100% / (6-1) = 100% / (5) = 20% 
                        The same is used for the positionY (rows in sprite)
                        */
            positionX = positionX + 100 / (columns - 1);
          } else {
            // Reset positionX to 0
            positionX = 0;
            if (positionY >= 100) {
              // If positionY is 100, reset it as well
              positionY = 0;
              if (iterations && iterations > 0) {
                /* 
                                The default animation will loop, but if an iteration parameter
                                has been passed, we will run the animation the desired number
                                of times specified by the parameter
                                */
                iterations--;
              }
            } else {
              // Else increment positionY by 100%/(4-1)
              positionY = positionY + 100 / (rows - 1);
            }
          }
          if (iterations > 0) {
            requestAnimationFrame(animation);
          }
        } else if (startingPosition === "bottom-right") {
          // Same algorithm but opposite logic, going from 100 -> 0 on both axes instead of decreasing
          if (positionX > 0) {
            positionX = positionX - 100 / (columns - 1);
          } else {
            positionX = 100;
            if (positionY > 0) {
              positionY = positionY - 100 / (rows - 1);
            } else {
              positionY = 100;
              if (iterations && iterations > 0) {
                iterations--;
              }
            }
          }
          if (iterations > 0) {
            requestAnimationFrame(animation);
          }
        }
      }
    };
  }
}


// let animationOnes = new SpriteAnimation({
//   element: 'image', // The class name of the div with the sprite you wish to animate
//   frames: 8, // The total amount of frames in your spritesheet
//   duration: 600, // *OPTIONAL The amount of time in ms it should take to finish one iteration of your sprite animation. defaults to 600
//   columns: 4, // The amount of columns in your spritesheet
//   rows: 15, // The amount of rows in your spritesheet
//   iterations: 10, // *OPTIONAL How many iterations it should run.
//   // startingPosition: 'bottom-right' // OPTIONAL* If omitted, the spritesheet will animate from top left to bottom right by default.
// });


window.onload = function () {
  let animationOne = new SpriteAnimation({
    element: "image",
    frames: 4,
    duration: 600,
    columns: 4,
    rows: 15,
    iterations: 10
  });
  animationOne.animateSprite();
};