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
}

const createCharacterMethods = function () {
  Character.prototype.attack = function () {
    const characterToMove = player;
    characterToMove.characterModel.src = 'player-assets/images/P4.png';
    const moveForward = setInterval(function () {
      const basePosition = parseInt(player.characterModel.style[characterToMove.moveFrom], 10);
      player.characterModel.style[characterToMove.moveFrom] = (basePosition + 10) + "px";
    }, moveSpeed);

    setTimeout(function () {
      characterToMove.characterModel.src = 'player-assets/images/P6.png';
    }, moveDuration / 3);

    setTimeout(function () {
      characterToMove.characterModel.src = 'player-assets/images/P1.png';
      clearInterval(moveForward);

      const moveBack = setInterval(function () {
        const movedToPosition = parseInt(playerModel.style[characterToMove.moveFrom], 10);
        playerModel.style[characterToMove.moveFrom] = (movedToPosition - 10) + "px";
      }, moveSpeed);

      setTimeout(function () {
        clearInterval(moveBack);
      }, moveDuration)
    }, moveDuration)
  }

  Character.prototype.defend = function () {
    const characterToMove = player;
    characterToMove.characterModel.src = 'player-assets/images/P2.png';

    setTimeout(function () {
      characterToMove.characterModel.src = 'player-assets/images/P1.png';
    }, moveDuration)
  }

  Character.prototype.evade = function () {
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


const determineClickResult = function (target) {
  if (target === attackButton) {
    player.attack();
  }

  if (target === defendButton) {
    player.defend();
  }

  if (target === evadeButton) {
    player.evade();
  }
}

mainContainer.addEventListener('click', function (event) {

  const target = event.target;
  determineClickResult(target);
})

createCharacterMethods();
const player = new Character('Player', 50, 10, 5, playerModel, [], []);
playerModel.style.left = '400px';
playerModel.style.top = '400px';