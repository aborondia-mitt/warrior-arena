const gameData = {
  mainContainer: document.querySelector('.main'),
  playerModel: document.getElementById('player'),
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
  this.xMoveFactor = 10;
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
  this.xMoveFactor = -10;
}

Enemy.prototype = Object.create(Player.prototype);
Enemy.prototype.constructor = Enemy;

const playerMethods = [
  Player.prototype.changeStance = function (character, stance) {
    // 1: Idle; 2: Ready; 3: Attack; 4: Special;
    // 5: Defend; 6: Flinch;  7: Victory; 8: Fallen;
    for (i = 0; i < character.poses.length; i++) {
      if (character.poses[i][0] === stance) {
        character.characterModel.src = character.poses[i][1];
      }
    }
  },
  Player.prototype.moveForward = function (character) {
    const startPosition = parseInt(character.characterModel.style.left, 10);
    character.characterModel.style.left = (startPosition + character.xMoveFactor) + "px";
  },
  Player.prototype.commenceAttack = function (character) {
    setTimeout(function () {
      character.changeStance(character, 'attack');
    }, gameData.moveDuration / 3);
  },
  Player.prototype.moveBack = function (character) {
    const startPosition = parseInt(character.characterModel.style.left, 10);
    character.characterModel.style.left = (startPosition - character.xMoveFactor) + "px";
  },
  Player.prototype.attack = function (character) {
    character.changeStance(character, 'ready');

    const moveForward = setInterval(function () {
      character.moveForward(character);
    }, gameData.moveSpeed);

    character.commenceAttack(character);

    setTimeout(function () {
      character.changeStance(character, 'idle');
      clearInterval(moveForward);

      const moveBack = setInterval(function () {
        character.moveBack(character);
      }, gameData.moveSpeed);

      setTimeout(function () {
        clearInterval(moveBack);
      }, gameData.moveDuration)
    }, gameData.moveDuration)
  },
  Player.prototype.defend = function (character) {
    character.changeStance(character, 'defend');

    setTimeout(function () {
      character.changeStance(character, 'idle');
    }, gameData.moveDuration)
  },

  Player.prototype.flinch = function (character) {
    character.changeStance(character, 'flinch');

    setTimeout(function () {
      character.changeStance(character, 'idle');
    }, gameData.moveDuration)
  },

  Player.prototype.victory = function (character) {
    character.changeStance(character, 'victory');

    setTimeout(function () {
      character.changeStance(character, 'idle');
    }, gameData.moveDuration)
  },

  Player.prototype.fall = function (character) {
    character.changeStance(character, 'fall');

    setTimeout(function () {
      character.changeStance(character, 'idle');
    }, gameData.moveDuration)
  },

  Player.prototype.evade = function (character) {
    const moveBack = setInterval(function () {
      character.moveBack(character);
    }, gameData.moveSpeed);

    setTimeout(function () {
      clearInterval(moveBack);
      const moveForward = setInterval(function () {
        character.moveForward(character);
      }, gameData.moveSpeed);

      setTimeout(function () {
        clearInterval(moveForward);
      }, gameData.moveDuration)
    }, gameData.moveDuration)
  },
]

const createPlayerMethods = function () {
  for (method of playerMethods) {
    Player.prototype.method = method;
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
      case 8: return 'fall';
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
  if (target === gameData.attackButton) {
    player.attack(enemy);
  }

  if (target === gameData.defendButton) {
    player.defend(enemy);
  }

  if (target === gameData.evadeButton) {
    player.evade(enemy);
  }

  if (target === gameData.flinchButton) {
    player.flinch(enemy);
  }

  if (target === gameData.victoryButton) {
    player.victory(enemy);
  }

  if (target === gameData.fallButton) {
    player.fall(enemy);
  }
}

gameData.mainContainer.addEventListener('click', function (event) {
  const target = event.target;
  determineClickResult(target);
})

createPlayerMethods();
const player = new Player('player', 50, 10, 5, gameData.playerModel, populateCharacterPoses('player'), []);
const enemy = new Enemy('enemy', 50, 10, 5, gameData.enemyModel, populateCharacterPoses('enemy1'), []);
addCharactersToScreen();