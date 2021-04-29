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

  specialVsAttack(character1, character2) {
    character1.animationSequence = [0, 8, 6, 0, 3, 9];
    character2.animationSequence = [0, 0, 3, 0, 4, 0];
  }

  defendVsDefend(character1, character2) {
    character1.animationSequence = [0, 1, 1, 1, 1];
    character2.animationSequence = [0, 1, 1, 1, 1];
  }
  defendVsSpecial(character1, character2) {
    character1.animationSequence = [0, 1, 9, 8, 6, 0];
    character2.animationSequence = [0, 8, 6, 0, 3, 9];
  }
  specialVsSpecial(character1, character2) {
    character1.animationSequence = [0, 8, 6, 0, 3, 9];
    character2.animationSequence = [0, 8, 6, 0, 3, 9];
  }

  determineRoundEvents(character1, character2) {
    //Put arguments here when player vs enemy action functionality implemented
    animator.determineAnimationSequence('special-vs-special', 'false');
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
    player.determineRoundEvents();
  }

  if (target === gameData.specialButton) {

  }

  if (target === gameData.defendButton) {

  }

  if (target === gameData.evadeButton) {

  }
}

gameData.mainContainer.addEventListener('click', function (event) {
  const target = event.target;
  determineClickResult(target);
})

