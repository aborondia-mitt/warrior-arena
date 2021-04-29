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
    this.currentRoundAction = 'attack';
    this.currentRoundActionIndex = 0;
    this.moveSpeed = 2.5;
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(this.canvas.width / 2.25, this.canvas.height / 3);
    this.ctx.scale(-1, 1);
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

  attackVsAttack(character1, character2) {
    character1.animationSequence = [0, 8, 4, 0, 0, 3, 9];
    character2.animationSequence = [0, 0, 0, 3, 4, 0, 0];
  }

  attackVsDefend(character1, character2) {
    character1.animationSequence = [0, 8, 4, 9];
    character2.animationSequence = [1, 1, 1, 1];
  }

  attackVsSpecial(character1, character2) {
    character1.animationSequence = [0, 8, character1.currentRoundActionIndex, 0, 3, 9];
    character2.animationSequence = [0, 0, 3, 0, character2.currentRoundActionIndex, 0];
  }

  defendVsDefend(character1, character2) {
    character1.animationSequence = [0, 1, 1, 1, 1];
    character2.animationSequence = [0, 1, 1, 1, 1];
  }
  defendVsSpecial(character1, character2) {
    character1.animationSequence = [0, 0, 9, 8, 6, 0];
    character2.animationSequence = [0, 8, 6, 0, 3, 9];
  }
  specialVsSpecial(character1, character2) {
    character1.animationSequence = [0, 8, 6, 0, 3, 9];
    character2.animationSequence = [0, 8, 6, 0, 3, 9];
  }

  setEnemyAction() {
    const action = Math.floor(Math.random() * (3 + 1 - 1)) + 1;

    switch (action) {
      case 1: return 'attack';
      case 2: return 'special';
      case 3: return 'defend';
    }
  }

  characterWithHighestAdvantage() {
    if (enemy.advantage > player.advantage) {
      return enemy;
    }

    return player;
  }

  determineRoundEvents(playerAction) {
    let character1 = player;
    let character2 = enemy;

    // giveEnemyActionHint() goes before setEnemyAction
    const enemyAction = this.setEnemyAction();
    let roundActions = '';

    if (playerAction === 'attack' && enemyAction === 'attack') {
      character1 = player.characterWithHighestAdvantage();
      character2 = this.getOtherCharacter(character1);
      roundActions = 'attack-vs-attack';
    }

    if (playerAction === 'attack' && enemyAction === 'defend') {
      roundActions = 'attack-vs-defend';
    }

    if (playerAction === 'attack' && enemyAction === 'special') {
      character1 = player.characterWithHighestAdvantage();
      character2 = this.getOtherCharacter(character1);
      player.currentRoundActionIndex = 4;
      enemy.currentRoundActionIndex = 6;
      roundActions = 'attack-vs-special';
    }

    if (playerAction === 'defend' && enemyAction === 'attack') {
      character1 = enemy;
      character2 = player;
      roundActions = 'attack-vs-defend';
    }

    if (playerAction === 'defend' && enemyAction === 'defend') {
      roundActions = 'defend-vs-defend';
    }

    if (playerAction === 'defend' && enemyAction === 'special') {
      roundActions = 'defend-vs-special';
    }

    if (playerAction === 'special' && enemyAction === 'attack') {
      character1 = player.characterWithHighestAdvantage();
      character2 = this.getOtherCharacter(character1);
      player.currentRoundActionIndex = 6;
      enemy.currentRoundActionIndex = 4;
      roundActions = 'attack-vs-special';
    }

    if (playerAction === 'special' && enemyAction === 'defend') {
      character1 = enemy;
      character2 = player;
      roundActions = 'defend-vs-special';
    }

    if (playerAction === 'special' && enemyAction === 'special') {
      character1 = enemy;
      character2 = player;
      roundActions = 'special-vs-special';
    }

    animator.determineAnimationSequence(character1, character2, roundActions);
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
    player.determineRoundEvents('attack');
  }

  if (target === gameData.specialButton) {
    player.determineRoundEvents('special');
  }

  if (target === gameData.defendButton) {
    player.determineRoundEvents('defend');
  }

  if (target === gameData.evadeButton) {

  }
}

gameData.mainContainer.addEventListener('click', function (event) {
  const target = event.target;
  determineClickResult(target);
})
