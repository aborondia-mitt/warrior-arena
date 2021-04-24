const gameData = {
  mainContainer: document.querySelector('.main'),
  player: document.getElementById('player'),
  enemyModel: document.getElementById('enemy'),
  attackButton: document.getElementById('attack'),
  defendButton: document.getElementById('defend'),
  evadeButton: document.getElementById('evade'),
  // flinchButton: document.getElementById('flinch'),
  // victoryButton: document.getElementById('victory'),
  // fallButton: document.getElementById('fall'),
}
canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
  constructor(name, health, attackPower, defense, model, animationSheet, voiceSet) {
    this.name = name;
    this.health = health;
    this.attackPower = attackPower;
    this.defense = defense;
    this.characterModel = model;
    this.animationSheet = animationSheet;
    this.voiceSet = voiceSet;
    this.startingX = '400px';
    this.startingY = '100px';
    this.xMoveFactor = 10;
    this.animations = new Image();
    this.animations.src = animationSheet;
    this.currentAction = 0;
    this.currentActionSequence = '';
    this.animationTime = 100;
    this.moveDuration = 420;
    this.animationSequence = [];
    this.moveSpeed = 2;
  }

  determineAction() {
    if (this.defending()) {
      return 1;
    }

    if (this.attacking()) {
      switch (this.currentAction) {
        case 8: return 4;
        case 4: return 9;
      }
    }

    if (this.evading()) {
      switch (this.currentAction) {
        case 9: return 0;
        case 0: return 8;
      }

    }


    this.currentActionSequence = '';
    return 0;
    // return for low health, etc.
  }

  attack(character) {
    character.currentFrame = -1;
    character.currentAction = 8;
    character.currentActionSequence = 'attacking';
    character.moveHorizontal(character, character.moveSpeed);
  }

  attacking() {
    if (this.currentActionSequence === 'attacking') {
      return true;
    }
  }

  defend(character) {
    character.currentFrame = -1;
    character.currentAction = 1;
    character.currentActionSequence = 'defending';
  }

  defending() {
    if (this.currentActionSequence === 'defending') {
      return true;
    }

    return false;
  }

  flinch(character) {

  }

  victory(character) {

  }

  fall(character) {

  }

  evade(character) {
    character.currentFrame = -1;
    character.currentAction = 9;
    character.currentActionSequence = 'evading';
    character.moveHorizontal(character, -character.moveSpeed);
  }

  evading() {
    if (this.currentActionSequence === 'evading') {
      return true;
    }

    return false;
  }

  moveHorizontal(character, directionMagnifier) {
    const moveForward = setInterval(function () {
      ctx.translate(0 - directionMagnifier, 0);
    }, 1);

    setTimeout(function () {
      clearInterval(moveForward)
      setTimeout(function () {

        const moveBackward = setInterval(function () {
          ctx.translate(0 + directionMagnifier, 0);
        }, .05);

        setTimeout(function () {
          clearInterval(moveBackward);
        }, character.moveDuration);


      }, character.moveDuration);
    }, character.moveDuration);
  }
}

class Enemy extends Player {
  constructor(name, health, attackPower, defense, model, animations, voiceSet) {
    super(name, health, attackPower, defense, model, animations, voiceSet);
    this.name = name;
    this.startingX = '1000px';
    this.startingY = '100px';
  }
}

const determineClickResult = function (target) {
  if (target === gameData.attackButton) {
    player.attack(player);
  }

  if (target === gameData.defendButton) {
    player.defend(player);
  }

  if (target === gameData.evadeButton) {
    player.evade(player);
  }

  if (target === gameData.flinchButton) {
    player.flinch(player);
  }

  if (target === gameData.victoryButton) {
    player.victory(player);
  }

  if (target === gameData.fallButton) {
    player.fall(player);
  }
}

gameData.mainContainer.addEventListener('click', function (event) {
  const target = event.target;
  determineClickResult(target);
})


//location on canvas
ctx.translate(canvas.width / 4, canvas.height / 3);
//flip horizontal
ctx.scale(-1, 1);

function animateCharacter(character) {
  character.currentFrame = 0;
  const frameWidth = 96;
  const frameHeight = 96;

  setInterval(function () {
    let numColumns = 4;
    character.currentFrame++;

    if (character)

      if (character.currentFrame >= numColumns) {
        character.currentFrame = 0;
        character.currentAction = character.determineAction();
      }

    let column = character.currentFrame % numColumns;
    let row = Math.floor(character.currentFrame / numColumns);

    ctx.clearRect(-50, -50, canvas.width, canvas.height);
    ctx.drawImage(character.animations, column * frameWidth, (row + character.currentAction) * frameHeight, frameWidth, frameHeight, 10, 30, frameWidth * 2, frameHeight * 2);

  }, character.animationTime);
}

const player = new Player('player', 50, 10, 5, gameData.player, ['images/Adela.png'], []);
// const enemy = new Enemy('enemy', 50, 10, 5, gameData.player, ['images/Elicia.png'], []);

animateCharacter(player);
// animateCharacter(enemy);