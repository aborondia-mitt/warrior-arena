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

    return 0;
  }

  determineAnimationSequence(animationSequence, initiativeMatters) {
    let character1 = player;
    let character2 = player.getOtherCharacter(character1);

    if (initiativeMatters) {
      character1 = player.getFirstCharacter();
      character2 = player.getOtherCharacter(character1);
    }

    animator.resetAnimation(character1, character2);
    animator.setAnimationSequence(character1, character2, animationSequence);
  }

  setAnimationSequence(character1, character2, animationSequence) {
    if (animationSequence === 'attack-vs-attack') {
      player.attackVsAttack(character1, character2);
    }

    if (animationSequence === 'attack-vs-defend') {
      player.attackVsDefend(character1, character2);
    }

    if (animationSequence === 'special-vs-attack') {
      player.specialVsAttack(character1, character2);
    }

    if (animationSequence === 'defend-vs-defend') {
      player.defendVsDefend(character1, character2);
    }

    if (animationSequence === 'defend-vs-special') {
      player.defendVsSpecial(character1, character2);
    }

    if (animationSequence === 'special-vs-special') {
      player.specialVsSpecial(character1, character2);
    }
  }
}

