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

  }
  changeStance(character, stance) {
    // 1: Idle; 2: Ready; 3: Attack; 4: Special;
    // 5: Defend; 6: Flinch;  7: Victory; 8: Fallen;
    for (i = 0; i < character.poses.length; i++) {
      if (character.poses[i][0] === stance) {
        character.characterModel.src = character.poses[i][1];
      }
    }
  }

  moveForward(character) {
    const startPosition = parseInt(character.characterModel.style.left, 10);
    character.characterModel.style.left = (startPosition + character.xMoveFactor) + "px";
  }

  commenceAttack(character) {
    setTimeout(function () {
      character.changeStance(character, 'attack');
    }, gameData.moveDuration / 3);
  }

  moveBack(character) {
    const startPosition = parseInt(character.characterModel.style.left, 10);
    character.characterModel.style.left = (startPosition - character.xMoveFactor) + "px";
  }

  attack(character) {
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
  }

  defend(character) {
    character.changeStance(character, 'defend');

    setTimeout(function () {
      character.changeStance(character, 'idle');
    }, gameData.moveDuration)
  }

  flinch(character) {
    character.changeStance(character, 'flinch');

    setTimeout(function () {
      character.changeStance(character, 'idle');
    }, gameData.moveDuration)
  }

  victory(character) {
    character.changeStance(character, 'victory');

    setTimeout(function () {
      character.changeStance(character, 'idle');
    }, gameData.moveDuration)
  }

  fall(character) {
    character.changeStance(character, 'fall');

    setTimeout(function () {
      character.changeStance(character, 'idle');
    }, gameData.moveDuration)
  }

  evade(character) {
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
  }

  moveHorizontal () {
    setInterval(function () {
      ctx.translate(-.5, 0);
    }, 1);
  }

  animateCharacter() {
    let currentFrame = 0;
    const frameWidth = 250;
    const frameHeight = 193.2;
    setInterval(function () {
  
      let numColumns = 4;
      let numRows = 1;
      currentFrame++;
  
      if (currentFrame > numColumns) {
        currentFrame = 0;
      }
  
      let column = currentFrame % numColumns;
      let row = Math.floor(currentFrame / numColumns);
  
      ctx.clearRect(10, 10, canvas.width, canvas.height);//clears previous animation frame
      ctx.drawImage(player.animations, column * frameWidth, (row + 5) * frameHeight, frameWidth, frameHeight, 10, 30, frameWidth, frameHeight);
  
    }, 200);
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

// const player = new Player('player', 50, 10, 5, gameData.playerModel, populateCharacterPoses('player'), []);
const player = new Player('player', 50, 10, 5, gameData.player, ['images/grayanim.png'], []);
// const enemy = new Enemy('enemy', 50, 10, 5, gameData.enemyModel, populateCharacterPoses('enemy1'), []);
// addCharactersToScreen();

//try position offset with constant setinterval update
// const animatePlayer = new SpriteAnimation({
//   element: "player",
//   frames: 4,
//   duration: 600,
//   columns: 4,
//   rows: 1,
//   iterations: 1
// });

// animatePlayer.animateSprite();




//location on canvas
ctx.translate(canvas.width / 7, canvas.height / 1.6);
//flip horizontal
ctx.scale(-1, 1);

player.animateCharacter();