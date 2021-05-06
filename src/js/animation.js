const animationSequences = {
  character1: {
    attackAction: 4,
    attackVsAttack: [0, 8, 4, 0, 0, 3, 9],
    attackVsDefend: [0, 8, 4, 9],
    attackVsSpecial: [0, 8, undefined, 0, 0, 3, 9],
    defendVsDefend: [0, 1, 1, 1, 1],
    defendVsSpecial: [0, 0, 9, 8, 6, 0],
    specialVsSpecial: [0, 8, 6, 0, 3, 9],

    // ifDead: {
    //   attackVsAttack: [0, 8, 4, 0, 0, 3, 9],
    //   attackVsDefend: [0, 8, 4, 9],
    //   attackVsSpecial: [0, 8, undefined, 0, 0, 3, 9],
    //   defendVsDefend: [0, 1, 1, 1, 1],
    //   defendVsSpecial: [0, 0, 9, 8, 6, 0],
    //   specialVsSpecial: [0, 8, 6, 0, 3, 9],
    // },
  },

  character2: {
    attackAction: 4,
    attackVsAttack: [0, 0, 0, 3, 4, 0, 0],
    attackVsDefend: [1, 1, 1, 1],
    attackVsSpecial: [0, 0, 0, 3, undefined, 0, 0],
    defendVsDefend: [0, 1, 1, 1, 1],
    defendVsSpecial: [0, 8, 6, 0, 3, 9],
    specialVsSpecial: [0, 8, 6, 0, 3, 9],

    // ifDead: {
    //   attackVsAttack: [0, 0, 0, 3, 4, 0, 0],
    //   attackVsDefend: [1, 1, 1, 1],
    //   attackVsSpecial: [0, 0, 0, 3, undefined, 0, 0],
    //   defendVsDefend: [0, 1, 1, 1, 1],
    //   defendVsSpecial: [0, 8, 6, 0, 3, 9],
    //   specialVsSpecial: [0, 8, 6, 0, 3, 9],
    // },
  },
}

class Animator {
  constructor() {
    this.animationSpeed = 175;
    this.animationDuration = 520;
  }

  beginAnimation() {
    let win = window;
    animator.drawCharacter(player);
    animator.drawCharacter(enemy);

    setTimeout(function () {
      win.requestAnimationFrame(animator.beginAnimation);
    }, animator.animationSpeed);
  }

  drawCharacter(character) {
    const frameWidth = 96;
    const frameHeight = 96;

    character.ctx.clearRect(0, 0, character.canvas.width, character.canvas.height);
    character.currentFrame++;

    if (character.currentFrame >= character.animationColumns) {
      character.currentFrame = 0;
      character.currentSequenceStep++;
      character.currentAnimation = animator.getNextAnimation(character);

      if (character.currentAnimation === 8) {
        animator.moveForward(character);
      }

      if (character.currentAnimation === 9) {
        animator.moveBackward(character);
      }
    }

    let currentColumn = character.currentFrame % character.animationColumns;
    let row = Math.floor(character.currentFrame / character.animationColumns);

    character.ctx.clearRect(-100, -100, character.canvas.width, character.canvas.height);
    character.ctx.drawImage(
      character.animations,
      currentColumn * frameWidth,
      (row + character.currentAnimation) * frameHeight,
      frameWidth,
      frameHeight,
      10,
      100,
      frameWidth * 3,
      frameHeight * 3);
  }

  moveForward(character) {
    const moveForward = setInterval(function () {
      character.ctx.translate(0 - character.moveSpeed, 0);
    }, 1);

    setTimeout(function () {
      clearInterval(moveForward)
    }, animator.animationDuration);
  }

  moveBackward(character) {
    const moveBackward = setInterval(function () {
      character.ctx.translate(0 + character.moveSpeed, 0);
    }, .5);

    setTimeout(function () {
      clearInterval(moveBackward);
    }, animator.animationDuration);
  }

  resetAnimation() {
    player.currentAnimation = 0;
    player.currentFrame = 0;
    player.currentSequenceStep = 0;
    enemy.currentAction = 0;
    enemy.currentFrame = 0;
    enemy.currentSequenceStep = 0;
  }

  getNextAnimation(character) {
    if (character.animationSequence[character.currentSequenceStep] !== undefined) {
      return character.animationSequence[character.currentSequenceStep];
    }

    if (character.dead) {
      return 12;
    }

    return 0;
  }

  determineAnimationSequence(character1, character2, animationSequence) {
    animator.resetAnimation(character1, character2);
    animator.setAnimationSequence(character1, character2, animationSequence);
  }

  setAnimationSequence(character1, character2, animationSequence) {
    // add if dead check somewhere here or beforehand
    if (animationSequence === 'attack-vs-attack') {
      character1.animationSequence = animationSequences.character1.attackVsAttack;
      character2.animationSequence = animationSequences.character2.attackVsAttack;
    }

    if (animationSequence === 'attack-vs-defend') {
      character1.animationSequence = animationSequences.character1.attackVsDefend;
      character2.animationSequence = animationSequences.character2.attackVsDefend;
    }

    if (animationSequence === 'attack-vs-special') {
      animationSequences.character1.attackVsSpecial[2] = character1.attackAction;
      animationSequences.character2.attackVsSpecial[4] = character2.attackAction;

      character1.animationSequence = animationSequences.character1.attackVsSpecial;
      character2.animationSequence = animationSequences.character2.attackVsSpecial;
    }

    if (animationSequence === 'defend-vs-defend') {
      character1.animationSequence = animationSequences.character1.defendVsDefend;
      character2.animationSequence = animationSequences.character2.defendVsDefend;
    }

    if (animationSequence === 'defend-vs-special') {
      character1.animationSequence = animationSequences.character1.defendVsSpecial;
      character2.animationSequence = animationSequences.character2.defendVsSpecial;
    }

    if (animationSequence === 'special-vs-special') {
      character1.animationSequence = animationSequences.character1.specialVsSpecial;
      character2.animationSequence = animationSequences.character2.specialVsSpecial;
    }
  }
}

