const gameData = {
  mainContainer: document.querySelector('.main'),
  player: document.getElementById('player'),
  enemyModel: document.getElementById('enemy'),
  attackButton: document.getElementById('attack'),
  specialButton: document.getElementById('special'),
  defendButton: document.getElementById('defend'),
  evadeButton: document.getElementById('evade'),
}

const animationData = {
  animationSpeed: 150,
  animationDuration: 520,
  lastTime: 0,
  animating: true,
}


class Player {
  constructor(name, health, attackPower, defense, model, animationSheet, voiceSet, canvas) {
    this.name = name;
    this.health = health;
    this.attackPower = attackPower;
    this.defense = defense;
    this.characterModel = model;
    this.animationSheet = animationSheet;
    this.voiceSet = voiceSet;
    this.animations = new Image();
    this.animations.src = animationSheet;
    this.advantage = 0;
    this.currentAnimation = 0;
    this.currentAnimationSequence = '';
    this.currentFrame = 0;
    this.tickCount = 0;
    this.animationSequence = [];
    this.currentSequenceStep = 0;
    this.moveSpeed = 2.5;
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(this.canvas.width / 2.25, this.canvas.height / 3);
    this.ctx.scale(-1, 1);
    this.animate;
  }

  drawCharacter() {
    let numColumns = 4;
    const character = this;
    const frameWidth = 96;
    const frameHeight = 96;

    character.ctx.clearRect(0, 0, character.canvas.width, character.canvas.height);
    character.currentFrame++;

    if (character.currentFrame >= numColumns) {
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

    let column = character.currentFrame % numColumns;
    let row = Math.floor(character.currentFrame / numColumns);

    character.ctx.clearRect(-100, -100, character.canvas.width, character.canvas.height);
    character.ctx.drawImage(
      character.animations,
      column * frameWidth,
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
    let now = Date.now();
    let dt = (now - animationData.lastTime) / 1000.0;
    player.drawCharacter();
    enemy.drawCharacter();

    setTimeout(function () {
      win.requestAnimationFrame(player.beginAnimation);
    }, animationData.animationSpeed);
  }

  changeAnimationSpeed(speedMultiplier) {
    animationData.animationSpeed = animationData.animationSpeed / speedMultiplier;
    animationData.animationDuration = animationData.animationDuration * 1.2;
  }

  resetAnimationSpeed() {
    animationData.animationDuration = 420
    animationData.animationSpeed = 150;
    clearInterval(player.animate);
    clearInterval(enemy.animate);
    // this.resetAnimation(player, enemy);
    player.drawCharacter()
    enemy.drawCharacter()
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

    // this.resetAnimationSpeed();
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

    animationData.animating = true;
  }

  resetAnimation(character1, character2) {
    clearInterval(player.animate);
    clearInterval(enemy.animate);
    animationData.animationSpeed = animationData.animationSpeed;
    animationData.animating = false;
    character1.currentAnimation = 0;
    character1.currentFrame = 0;
    character1.currentSequenceStep = 0;
    character2.currentAction = 0;
    character2.currentFrame = 0;
    character2.currentSequenceStep = 0;
    animationData.animating = true;
    player.drawCharacter();
    enemy.drawCharacter();
  }

  determineAnimationSequence(animationSequence, initiativeMatters) {
    enemy.advantage = 99;
    let character1 = this;
    let character2 = this.getOtherCharacter(character1);

    if (initiativeMatters) {
      character1 = this.getFirstCharacter();
      character2 = this.getOtherCharacter(character1);
    }

    // this.changeAnimationSpeed(2);
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
  constructor(name, health, attackPower, defense, model, animations, voiceSet, canvas) {
    super(name, health, attackPower, defense, model, animations, voiceSet, canvas);
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

const player = new Player('player', 50, 10, 5, gameData.player, ['images/Adela.png'], [], document.getElementById('player-canvas'));
const enemy = new Enemy('enemy', 50, 10, 5, gameData.player, ['images/Elicia.png'], [], document.getElementById('enemy-canvas'));

player.beginAnimation();
enemy.beginAnimation();