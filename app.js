const mainContainer = document.querySelector('.main');
const playerModel = document.getElementById('player');
const attackButton = document.getElementById('attack');
const defendButton = document.getElementById('defend');
const evadeButton = document.getElementById('evade');
const moveSpeed = 30;
const moveDuration = 500;


const Character = function (name, health, attackPower, defense, model, poses, voiceSet) {
  this.name = name;
  this.health = health;
  this.attackPower = attackPower;
  this.defense = defense;
  this.moveFrom = 'left';
  this.characterModel = model;
  this.poses = poses;
  this.voiceSet = voiceSet;
  this.isPlayer = true;
}

const createCharacterMethods = function () {
  Character.prototype.changeStance = function (character, stance) {
    // 1: Idle; 2: Ready; 3: Attack; 4: Special;
    // 5: Defend; 6: Flinch;  7: Victory; 8: Fallen;
    for (i = 0; i < character.poses.length; i++) {
      if (character.poses[i][0] === stance) {
        character.characterModel.src = character.poses[i][1];
      }
    }
  }

  Character.prototype.moveForward = function (character) {
    const startPosition = parseInt(player.characterModel.style[character.moveFrom], 10);
    character.characterModel.style[character.moveFrom] = (startPosition + 10) + "px";
  }

  Character.prototype.commenceAttack = function (character) {
    setTimeout(function () {
      character.changeStance(character, 'attack');
    }, moveDuration / 3);
  }

  Character.prototype.moveBack = function (character) {
    const startPosition = parseInt(playerModel.style[character.moveFrom], 10);
    playerModel.style[character.moveFrom] = (startPosition - 10) + "px";
  }

  Character.prototype.attack = function (character) {
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

  Character.prototype.defend = function (character) {
    const characterToMove = player;
    characterToMove.characterModel.src = 'player-assets/images/P2.png';

    setTimeout(function () {
      characterToMove.characterModel.src = 'player-assets/images/P1.png';
    }, moveDuration)
  }

  Character.prototype.evade = function (character) {
    const characterToMove = player;

    const moveBack = setInterval(function () {
      const characterToMove = player;
      const basePosition = parseInt(player.characterModel.style[characterToMove.moveFrom], 10);
      player.characterModel.style[characterToMove.moveFrom] = (basePosition - 10) + "px";
    }, moveSpeed);
    setTimeout(function () {
      clearInterval(moveBack);
      const moveForward = setInterval(function () {
        const movedToPosition = parseInt(player.characterModel.style[characterToMove.moveFrom], 10);
        player.characterModel.style[characterToMove.moveFrom] = (movedToPosition + 10) + "px";
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
const player = new Character('player', 50, 10, 5, playerModel, populateCharacterPoses('player'), []);
playerModel.style.left = '400px';
playerModel.style.top = '400px';