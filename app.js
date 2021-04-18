const mainContainer = document.querySelector('.main');
const playerModel = document.getElementById('player');
const enemyModel = document.getElementById('enemy');
const attackButton = document.getElementById('attack');
const defendButton = document.getElementById('defend');
const evadeButton = document.getElementById('evade');
const moveSpeed = 30;
const moveDuration = 500;


const Player = function (name, health, attackPower, defense, model, poses, voiceSet) {
  this.name = name;
  this.health = health;
  this.attackPower = attackPower;
  this.defense = defense;
  this.characterModel = model;
  this.poses = poses;
  this.voiceSet = voiceSet;
  this.startingX = '400px';
  this.startingY = '100px';
  this.moveFrom = 'left';
}

const Enemy = function (name, health, attackPower, defense, model, poses, voiceSet) {
  Player.call(this);
  this.name = name;
  this.health = health;
  this.attackPower = attackPower;
  this.defense = defense;
  this.characterModel = model;
  this.poses = poses;
  this.voiceSet = voiceSet;
  this.startingX = '1000px';
  this.startingY = '100px';
  this.moveFrom = 'right';
}

Enemy.prototype = Object.create(Player.prototype);
Enemy.prototype.constructor = Enemy;

const createCharacterMethods = function () {
  Player.prototype.changeStance = function (character, stance) {
    // 1: Idle; 2: Ready; 3: Attack; 4: Special;
    // 5: Defend; 6: Flinch;  7: Victory; 8: Fallen;
    for (i = 0; i < character.poses.length; i++) {
      if (character.poses[i][0] === stance) {
        character.characterModel.src = character.poses[i][1];
      }
    }
  }

  Player.prototype.moveForward = function (character) {
    const startPosition = parseInt(character.characterModel.style[character.moveFrom], 10);
    character.characterModel.style[character.moveFrom] = (startPosition + 10) + "px";
  }

  Player.prototype.commenceAttack = function (character) {
    setTimeout(function () {
      character.changeStance(character, 'attack');
    }, moveDuration / 3);
  }

  Player.prototype.moveBack = function (character) {
    const startPosition = parseInt(character.characterModel.style[character.moveFrom], 10);
    character.characterModel.style[character.moveFrom] = (startPosition - 10) + "px";
  }

  Player.prototype.attack = function (character) {
    character.changeStance(character, 'ready');

    const moveForward = setInterval(function () {
      character.moveForward(character);
    }, moveSpeed);

    character.commenceAttack(character);

    setTimeout(function () {
      character.changeStance(character, 'idle');
      clearInterval(moveForward);

      const moveBack = setInterval(function () {
        character.moveBack(character);
      }, moveSpeed);

      setTimeout(function () {
        clearInterval(moveBack);
      }, moveDuration)
    }, moveDuration)
  }

  Player.prototype.defend = function (character) {
    character.changeStance(character, 'defend');

    setTimeout(function () {
      character.changeStance(character, 'idle');
    }, moveDuration)
  }

  Player.prototype.evade = function (character) {
    const moveBack = setInterval(function () {
      character.moveBack(character);
    }, moveSpeed);

    setTimeout(function () {
      clearInterval(moveBack);
      const moveForward = setInterval(function () {
        character.moveForward(character);
      }, moveSpeed);

      setTimeout(function () {
        clearInterval(moveForward);
      }, moveDuration)
    }, moveDuration)
  }
}

const populateCharacterPoses = function (character) {
  const namePose = function (i) {
    switch (i) {
      case 1: return 'idle';
      case 2: return 'ready';
      case 3: return 'attack';
      case 4: return 'special';
      case 5: return 'defend';
      case 6: return 'flinch';
      case 7: return 'victory';
      case 8: return 'fallen';
    }
  }

  const models = []
  for (i = 1; i <= 8; i++) {
    models.push([namePose(i), `${character}-assets/images/${i}.png`])
  }
  return models;
}

const addCharactersToScreen = function () {
  player.changeStance(player, 'idle');
  enemy.changeStance(enemy, 'idle');
  player.characterModel.style.left = player.startingX;
  player.characterModel.style.bottom = player.startingY;
  enemy.characterModel.style.left = enemy.startingX;
  enemy.characterModel.style.bottom = enemy.startingY;
}

const determineClickResult = function (target) {
  if (target === attackButton) {
    player.attack(player);
  }

  if (target === defendButton) {
    player.defend(player);
  }

  if (target === evadeButton) {
    player.evade(player);
  }
}

mainContainer.addEventListener('click', function (event) {
  const target = event.target;
  determineClickResult(target);
})

createCharacterMethods();
const player = new Player('player', 50, 10, 5, playerModel, populateCharacterPoses('player'), []);
const enemy = new Enemy('enemy', 50, 10, 5, enemyModel, populateCharacterPoses('enemy1'), []);
addCharactersToScreen();