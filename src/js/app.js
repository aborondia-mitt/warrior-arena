const gameData = {
  mainContainer: document.querySelector('.main'),
  player: document.getElementById('player'),
  enemyModel: document.getElementById('enemy'),
  attackButton: document.getElementById('attack'),
  specialButton: document.getElementById('special'),
  defendButton: document.getElementById('defend'),
  evadeButton: document.getElementById('evade'),
  playerCanvas: document.getElementById('player-canvas'),
  enemyCanvas: document.getElementById('enemy-canvas'),
}

const animationData = {
  animationSpeed: 150,
  animationDuration: 520,
}


class Player {
  constructor(name, health, attackPower, defense, animationSheet, voiceSet, canvas) {
    this.name = name;
    this.health = health;
    this.attackPower = attackPower;
    this.defense = defense;
    this.voiceSet = voiceSet;
    this.animationSheet = animationSheet;
    this.animationColumns = 4;
    this.animations = new Image();
    this.animations.src = animationSheet;
    this.advantage = 0;
    this.currentAnimation = 0;
    this.currentAnimationSequence = '';
    this.animationSequence = [];
    this.currentSequenceStep = 0;
    this.currentFrame = 0;
    this.moveSpeed = 2.5;
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(this.canvas.width / 2.25, this.canvas.height / 3);
    this.ctx.scale(-1, 1);
  }

  drawCharacter() {
    const character = this;
    const frameWidth = 96;
    const frameHeight = 96;

    character.ctx.clearRect(0, 0, character.canvas.width, character.canvas.height);
    character.currentFrame++;

    if (character.currentFrame >= character.animationColumns) {
      character.currentFrame = 0;
      character.currentSequenceStep++;
      character.currentAnimation = character.getNextAnimation();

      if (character.currentAnimation === 8) {
        character.moveForward(character.moveSpeed);
      }

      if (character.currentAnimation === 9) {
        character.moveBackward(character.moveSpeed);
      }
    }

    let currentColumn = character.currentFrame % character.animationColumns;
    let row = Math.floor(character.currentFrame / character.animationColumns);

    character.ctx.clearRect(-100, -100, character.canvas.width, character.canvas.height);
    character.ctx.drawImage(
      character.animations,
      currentColumn * frameWidth,
      (row + character.currentAnimation) * frameHeight,
      frameWidth,
      frameHeight,
      10,
      100,
      frameWidth * 3,
      frameHeight * 3);
  }

  beginAnimation() {
    let win = window;
    player.drawCharacter();
    enemy.drawCharacter();

    setTimeout(function () {
      win.requestAnimationFrame(player.beginAnimation);
    }, animationData.animationSpeed);
  }

  getOtherCharacter(character) {
    if (character instanceof Enemy) {
      return player;
    }

    return enemy;
  }

  getFirstCharacter() {
    if (enemy.advantage > player.advantage) {
      return enemy;
    }

    return player;
  }

  getNextAnimation() {
    if (this.animationSequence[this.currentSequenceStep] !== undefined) {
      return this.animationSequence[this.currentSequenceStep];
    }

    return 0;
  }

  setSequence(character1, character2, animationSequence) {
    if (animationSequence === 'attack-vs-attack') {
      character1.animationSequence = [0, 8, 4, 0, 0, 3, 9];
      character2.animationSequence = [0, 0, 0, 3, 4, 0, 0];
    }

    if (animationSequence === 'attack-vs-defend') {
      character1.animationSequence = [0, 8, 4, 9];
      character2.animationSequence = [1, 1, 1, 1];
    }

    if (animationSequence === 'special-vs-attack') {
      character1.animationSequence = [0, 8, 6, 0, 3, 9];
      character2.animationSequence = [0, 0, 0, 3, 4, 0];
    }

  }

  resetAnimation() {
    player.currentAnimation = 0;
    player.currentFrame = 0;
    player.currentSequenceStep = 0;
    enemy.currentAction = 0;
    enemy.currentFrame = 0;
    enemy.currentSequenceStep = 0;
  }

  determineAnimationSequence(animationSequence, initiativeMatters) {
    enemy.advantage = 99;
    let character1 = this;
    let character2 = this.getOtherCharacter(character1);

    if (initiativeMatters) {
      character1 = this.getFirstCharacter();
      character2 = this.getOtherCharacter(character1);
    }

    this.resetAnimation(character1, character2);
    this.setSequence(character1, character2, animationSequence);
  }

  moveForward(moveSpeed) {
    const character = this;
    const moveForward = setInterval(function () {
      character.ctx.translate(0 - moveSpeed, 0);
    }, 1);

    setTimeout(function () {
      clearInterval(moveForward)
    }, animationData.animationDuration);
  }

  moveBackward(moveSpeed) {
    const character = this;
    const moveBackward = setInterval(function () {
      character.ctx.translate(0 + moveSpeed, 0);
    }, .5);

    setTimeout(function () {
      clearInterval(moveBackward);
    }, animationData.animationDuration);
  }
}

class Enemy extends Player {
  constructor(name, health, attackPower, defense, animations, voiceSet, canvas) {
    super(name, health, attackPower, defense, animations, voiceSet, canvas);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.translate(this.canvas.width / 1.75, this.canvas.height / 3);
  }
}

const determineClickResult = function (target) {
  if (target === gameData.attackButton) {
    player.determineAnimationSequence('special-vs-attack', true);
  }

  if (target === gameData.specialButton) {

  }

  if (target === gameData.defendButton) {
    animationData.animationSpeed += 100;
  }

  if (target === gameData.evadeButton) {
    animationData.animationSpeed -= 100;
  }
}

gameData.mainContainer.addEventListener('click', function (event) {
  const target = event.target;
  determineClickResult(target);
})

const player = new Player('player', 50, 10, 5, ['images/Adela.png'], [], gameData.playerCanvas);
const enemy = new Enemy('enemy', 50, 10, 5, ['images/Elicia.png'], [], gameData.enemyCanvas);

player.beginAnimation();
enemy.beginAnimation();