const gameData = {
  mainContainer: document.querySelector('.main'),
  player: document.getElementById('player'),
  enemyModel: document.getElementById('enemy'),
  attackButton: document.getElementById('attack'),
  specialButton: document.getElementById('special'),
  defendButton: document.getElementById('defend'),
  evadeButton: document.getElementById('evade'),
  // flinchButton: document.getElementById('flinch'),
  // victoryButton: document.getElementById('victory'),
  // fallButton: document.getElementById('fall'),
}

const backGround = document.getElementById('background-canvas');
const backCtx = backGround.getContext('2d');

class Player {
  constructor(name, health, attackPower, defense, model, animationSheet, voiceSet, canvas) {
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
    this.animationTime = 150;
    this.moveDuration = 520;
    this.animationSequence = [];
    this.moveSpeed = 2.5;
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(this.canvas.width / 2.25, this.canvas.height / 3);
    this.ctx.scale(-1, 1);
  }

  animateCharacter() {
    this.currentFrame = 0;
    const character = this;
    const frameWidth = 96;
    const frameHeight = 96;

    setInterval(function () {
      character.ctx.clearRect(0, 0, character.canvas.width, character.canvas.height);
      let numColumns = 4;
      character.currentFrame++;

      if (character.currentFrame >= numColumns) {
        character.currentFrame = 0;
        character.currentAction = character.determineAction();
      }

      let column = character.currentFrame % numColumns;
      let row = Math.floor(character.currentFrame / numColumns);

      character.ctx.clearRect(-100, -100, character.canvas.width, character.canvas.height);
      character.ctx.drawImage(character.animations, column * frameWidth, (row + character.currentAction) * frameHeight, frameWidth, frameHeight, 10, 100, frameWidth * 3, frameHeight * 3);

    }, character.animationTime);
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

    if (this.specialAttacking()) {
      switch (this.currentAction) {
        case 8: return 6;
        case 6: return 9;
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

  attack() {
    this.currentFrame = -1;
    this.currentAction = 8;
    this.currentActionSequence = 'attacking';
    this.moveHorizontal(this.moveSpeed);
  }

  attacking() {
    if (this.currentActionSequence === 'attacking') {
      return true;
    }
  }

  specialAttack() {
    this.currentFrame = -1;
    this.currentAction = 8;
    this.currentActionSequence = 'special-attacking';
    this.moveHorizontal(this.moveSpeed);
  }

  specialAttacking() {
    if (this.currentActionSequence === 'special-attacking') {
      return true;
    }
  }

  defend() {
    this.currentFrame = -1;
    this.currentAction = 1;
    this.currentActionSequence = 'defending';
  }

  defending() {
    if (this.currentActionSequence === 'defending') {
      return true;
    }

    return false;
  }

  flinch() {

  }

  victory() {

  }

  fall() {

  }

  evade() {
    this.currentFrame = -1;
    this.currentAction = 9;
    this.currentActionSequence = 'evading';
    this.moveHorizontal(-this.moveSpeed);
  }

  evading() {
    if (this.currentActionSequence === 'evading') {
      return true;
    }

    return false;
  }

  moveHorizontal(moveSpeed) {
    const character = this;
    const moveForward = setInterval(function () {
      character.ctx.translate(0 - moveSpeed, 0);
    }, 1);

    setTimeout(function () {
      clearInterval(moveForward)
      setTimeout(function () {

        const moveBackward = setInterval(function () {
          character.ctx.translate(0 + moveSpeed, 0);
        }, .05);

        setTimeout(function () {
          clearInterval(moveBackward);
        }, character.moveDuration);


      }, character.moveDuration);
    }, character.moveDuration);
  }


}

class Enemy extends Player {
  constructor(name, health, attackPower, defense, model, animations, voiceSet, canvas) {
    super(name, health, attackPower, defense, model, animations, voiceSet, canvas);
    this.name = name;
    this.startingX = '1000px';
    this.startingY = '100px';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.translate(this.canvas.width / 1.75, this.canvas.height / 3);
  }
}

const determineClickResult = function (target) {
  if (target === gameData.attackButton) {
    // player.attack();
    enemy.attack();
  }

  if (target === gameData.specialButton) {
    // player.specialAttack();
    enemy.specialAttack();
  }

  if (target === gameData.defendButton) {
    // player.defend(player);
    enemy.defend();
  }

  if (target === gameData.evadeButton) {
    // player.evade(player);
    enemy.evade();
  }

  // if (target === gameData.flinchButton) {
  //   player.flinch(player);
  // }

  // if (target === gameData.victoryButton) {
  //   player.victory(player);
  // }

  // if (target === gameData.fallButton) {
  //   player.fall(player);
  // }
}

gameData.mainContainer.addEventListener('click', function (event) {
  const target = event.target;
  determineClickResult(target);
})

const player = new Player('player', 50, 10, 5, gameData.player, ['images/Adela.png'], [], document.getElementById('player-canvas'));
const enemy = new Enemy('enemy', 50, 10, 5, gameData.player, ['images/Elicia.png'], [], document.getElementById('enemy-canvas'));

// name, health, attackPower, defense, model, animationSheet, voiceSet, canvas
player.animateCharacter();
enemy.animateCharacter();

backCtx.drawImage(player.animations, 0, 0);