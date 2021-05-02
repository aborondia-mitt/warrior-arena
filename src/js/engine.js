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

  if (target === gameData.playerAdvantageButton) {
    player.advantage = 99;
    enemy.advantage = 0;
  }

  if (target === gameData.enemyAdvantageButton) {
    player.advantage = 0;
    enemy.advantage = 99;
  }

  if (target === gameData.enemyAttack) {
    temporaryEnemyAction = 1;
  }

  if (target === gameData.enemySpecial) {
    temporaryEnemyAction = 2;
  }

  if (target === gameData.enemyDefend) {
    temporaryEnemyAction = 3;
  }
}

gameData.mainContainer.addEventListener('click', function (event) {
  const target = event.target;
  determineClickResult(target);
})