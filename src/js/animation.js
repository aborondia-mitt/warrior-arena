const animationSequences = {
  character1: {
    attackVsAttack: [0, 8, 4, 0, 0, 3, 9],
    attackVsDefend: [0, 8, 4, 9],
    attackVsSpecial: [0, 8, undefined, 0, 0, 3, 9],
    defendVsDefend: [0, 1, 1, 1, 1],
    defendVsSpecial: [0, 0, 9, 8, 6, 0],
    specialVsSpecial: [0, 8, 6, 0, 3, 9],

    ifDead: {
      attackVsAttack: [0, 8, 4, 0, 0, 3, 12],
      attackVsSpecial: [0, 8, undefined, 0, 0, 3, 12],
      specialVsSpecial: [0, 8, 6, 0, 3, 12],
    },
  },

  character2: {
    attackVsAttack: [0, 0, 0, 3, 4, 0, 0],
    attackVsDefend: [1, 1, 1, 1],
    attackVsSpecial: [0, 0, 0, 3, undefined, 0, 0],
    defendVsDefend: [0, 1, 1, 1, 1],
    defendVsSpecial: [0, 8, 6, 0, 3, 9],
    specialVsSpecial: [0, 8, 6, 0, 3, 9],

    ifDead: {
      attackVsAttack: [0, 0, 0, 3, 12, 12, 12],
      attackVsDefend: [1, 1, 1, 12],
      attackVsSpecial: [0, 0, 0, 3, 12, 12, 12],
      defendVsSpecial: [0, 8, 6, 0, 3, 12],
      specialVsSpecial: [0, 8, 6, 0, 3, 12],
    },
  },
}


class Animator {
  constructor() {
    this.animationSpeed = 175;
    this.animationDuration = 520;
  }

  beginAnimation() {
    animator.drawCharacter(player);
    animator.drawCharacter(enemy);

    setTimeout(function () {
      gameData.win.requestAnimationFrame(animator.beginAnimation);
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

    if (character.victorious) {
      animator.animationSpeed = 300;
      return 10;
    }

    return 0;
  }

  determineAnimationSequence(character1, character2, animationSequence) {
    animator.resetAnimation(character1, character2);
    animator.setAnimationSequence(character1, character2, animationSequence);
  }

  setvariableSequenceSteps(character1, character2, animationSequence) {
    let character1Sequence = animationSequences.character1[animationSequence].map((step) => step);
    let character2Sequence = animationSequences.character2[animationSequence].map((step) => step);

    for (let i = 0; i < character1Sequence.length; i++) {
      if (character1Sequence[i] === undefined) {
        character1Sequence[i] = character1.attackAction;
      }
    }

    for (let i = 0; i < character2Sequence.length; i++) {
      if (character2Sequence[i] === undefined) {
        character2Sequence[i] = character2.attackAction;
      }
    }

    if (character1.dead) {
      character1Sequence = animationSequences.character1.ifDead[animationSequence];
    }

    if (character2.dead) {
      character2Sequence = animationSequences.character2.ifDead[animationSequence];
      for (let i = 0; i < character1Sequence.length; i++) {
        if (character1Sequence[i] === 3) {
          character1Sequence[i] = 0;
        }
      }
    }

    return [character1Sequence, character2Sequence];
  }

  setAnimationSequence(character1, character2, animationSequence) {
    const characterSequences = this.setvariableSequenceSteps(character1, character2, animationSequence);

    character1.animationSequence = characterSequences[0];
    character2.animationSequence = characterSequences[1];
  }
}