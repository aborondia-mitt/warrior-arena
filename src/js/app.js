const gameData = {
  // ctx: canvas.getContext('2d'),
  // width: canvas.width = window.innerWidth,
  // height: canvas.height = window.innerHeight,
  // playerContainer: document.querySelector('player-container'),
  mainContainer: document.querySelector('.main'),
  player: document.getElementById('player'),
  // playerModel: document.getElementById('player'),
  enemyModel: document.getElementById('enemy'),
  attackButton: document.getElementById('attack'),
  defendButton: document.getElementById('defend'),
  evadeButton: document.getElementById('evade'),
  flinchButton: document.getElementById('flinch'),
  victoryButton: document.getElementById('victory'),
  fallButton: document.getElementById('fall'),
  moveSpeed: 30,
  moveDuration: 500,
}
canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let animator;

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
    this.animationTime = 300;
    this.currentFrame = 0;


  }

  determineAction() {
    if (this.currentAction === 1) {
      return 1;
    }
    return 0;
    // return for low health, etc.
  }


  moveForward(character) {
    // const startPosition = parseInt(character.characterModel.style.left, 10);
    // character.characterModel.style.left = (startPosition + character.xMoveFactor) + "px";
  }

  moveBack(character) {
    // const startPosition = parseInt(character.characterModel.style.left, 10);
    // character.characterModel.style.left = (startPosition - character.xMoveFactor) + "px";
  }

  attack(character) {
    character.currentFrame = -1;
    this.currentAction = 6;
  }

  defend(character) {
    character.currentFrame = -1;
    this.currentAction = 1;
  }

  flinch(character) {

  }

  victory(character) {

  }

  fall(character) {

  }

  evade(character) {
    // const moveBack = setInterval(function () {
    //   character.moveBack(character);
    // }, gameData.moveSpeed);

    // setTimeout(function () {
    //   clearInterval(moveBack);
    //   const moveForward = setInterval(function () {
    //     character.moveForward(character);
    //   }, gameData.moveSpeed);

    //   setTimeout(function () {
    //     clearInterval(moveForward);
    //   }, gameData.moveDuration)
    // }, gameData.moveDuration)
  }

  moveHorizontal(direction, speed) {
    setInterval(function () {
      ctx.translate(-.5, 0);
    }, 1);
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

const player = new Player('player', 50, 10, 5, gameData.player, ['images/adela.png'], []);
// const enemy = new Enemy('enemy', 50, 10, 5, gameData.enemyModel, populateCharacterPoses('enemy1'), []);


//location on canvas
ctx.translate(canvas.width / 7, canvas.height / 3);
//flip horizontal
ctx.scale(-1, 1);

// animateCharacter(player, 0);

function animateCharacter(character) {
  // Poses:
  // 0.Idle
  // 1.Defensive
  // 2.Low Health
  // 3.Hurt
  // 4.Normal Attack
  // 5.Raise Hand Up
  // 6.Special Attack
  // 7.Hold Weapon Up
  // 8.Dash Forward
  // 9.Dash Backward
  // 10.Victory Pose
  // 11.Challenge
  // 12.Fallen

  character.currentFrame = 0;
  const frameWidth = 96;
  const frameHeight = 96;

  const animate = setInterval(function () {
    let numColumns = 4;
    character.currentFrame++;

    if (character.currentFrame >= numColumns) {
      character.currentFrame = 0;
       character.currentAction = character.determineAction();
    }

    let column = character.currentFrame % numColumns;
    let row = Math.floor(character.currentFrame / numColumns);

    ctx.clearRect(10, 10, canvas.width, canvas.height);
    ctx.drawImage(character.animations, column * frameWidth, (row + character.currentAction) * frameHeight, frameWidth, frameHeight, 10, 30, frameWidth * 2, frameHeight * 2);

  }, character.animationTime);
}

animateCharacter(player);