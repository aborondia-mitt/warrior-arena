const animator = new Animator();
const player = new Player('player', 50, 10, 5, ['images/Adela.png'], [], gameData.playerCanvas);
const enemy = new Enemy('enemy', 50, 10, 5, ['images/Elicia.png'], [], gameData.enemyCanvas);

animator.beginAnimation(player);
animator.beginAnimation(enemy);

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