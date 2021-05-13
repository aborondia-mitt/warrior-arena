let temporaryEnemyAction = 1;



class Player {
  constructor(name, health, attackPower, defense, animationSheet, voiceSet, canvas) {
    this.name = name;
    this.health = health;
    this.attack = attackPower;
    this.defense = defense;
    this.dead = false;
    this.victorious = false;
    this.voiceSet = voiceSet;
    this.animationSheet = animationSheet;
    this.animationColumns = 4;
    this.attackAction = 4;
    this.animations = new Image();
    this.animations.src = animationSheet;
    this.advantage = 0;
    this.currentAnimation = 0;
    this.currentAnimationSequence = '';
    this.animationSequence = [];
    this.currentSequenceStep = 0;
    this.currentFrame = 0;
    this.currentRoundAction = 'attack';
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

  setEnemyAction() {
    // const action = Math.floor(Math.random() * (3 + 1 - 1)) + 1;
    const action = temporaryEnemyAction;

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

  endFight(character1, character2) {
    if (character1.health <= 0) {
      character1.dead = true;
      character2.victorious = true;
    }

    if (character2.health <= 0) {
      character2.dead = true;
      character1.victorious = true;
    }

    if (character1.health <= 0 && character2.health <= 0) {
      player.characterWithHighestAdvantage().dead = false;
      player.characterWithHighestAdvantage().victorious = true;

      this.getOtherCharacter(player.characterWithHighestAdvantage()).dead = true;
      this.getOtherCharacter(player.characterWithHighestAdvantage()).victorious = false;
    }

    if (character1.dead === true) {
      character1.variableAction = 12;
      character2.variableAction = 10;
    }
  }

  fightIsOver() {
    if (player.health <= 0 || enemy.health <= 0) {
      return true;
    }

    return false;
  }

  dealDamage(playerDamageMultiplier, enemyDamageMultiplier) {
    const playerDamage = Math.abs((player.defense - enemy.attack) * playerDamageMultiplier);
    const enemyDamage = Math.abs((enemy.defense - player.attack) * enemyDamageMultiplier);

    if (playerDamage > 0) {
      player.health -= playerDamage;
    }

    if (enemyDamage > 0) {
      enemy.health -= enemyDamage;
    }
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
      roundActions = 'attackVsAttack';
      player.dealDamage(1, 1);
    }

    if (playerAction === 'attack' && enemyAction === 'defend') {
      roundActions = 'attackVsDefend';
      player.dealDamage(0, .5);
    }

    if (playerAction === 'attack' && enemyAction === 'special') {
      character1 = player.characterWithHighestAdvantage();
      character2 = this.getOtherCharacter(character1);
      player.attackAction = 4;
      enemy.attackAction = 6;
      roundActions = 'attackVsSpecial';
      player.dealDamage(1.5, 1);
    }

    if (playerAction === 'defend' && enemyAction === 'attack') {
      character1 = enemy;
      character2 = player;
      roundActions = 'attackVsDefend';
      player.dealDamage(.5, 0);
    }

    if (playerAction === 'defend' && enemyAction === 'defend') {
      roundActions = 'defendVsDefend';
    }

    if (playerAction === 'defend' && enemyAction === 'special') {
      roundActions = 'defendVsSpecial';
      player.dealDamage(0, 1.5);
    }

    if (playerAction === 'special' && enemyAction === 'attack') {
      character1 = player.characterWithHighestAdvantage();
      character2 = this.getOtherCharacter(character1);
      player.attackAction = 6;
      enemy.attackAction = 4;
      roundActions = 'attackVsSpecial';
      player.dealDamage(1, 1.5);
    }

    if (playerAction === 'special' && enemyAction === 'defend') {
      character1 = enemy;
      character2 = player;
      roundActions = 'defendVsSpecial';
      player.dealDamage(1.5, 0);
    }

    if (playerAction === 'special' && enemyAction === 'special') {
      roundActions = 'specialVsSpecial';
      player.dealDamage(2, 2);
    }

    if (player.fightIsOver()) {
      player.endFight(character1, character2);
    }

    // console.log("player " + player.health);
    // console.log("enemy " + enemy.health);
    // console.log("player " + player.dead);
    // console.log("enemy " + enemy.dead);
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


// work out the best way to handle setanimationsequence for death/victory in animation.js
// fix characters dashing back after fatal hit