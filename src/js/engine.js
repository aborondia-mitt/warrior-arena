const animator = new Animator();
const player = new Player('player', 50, 10, 5, ['images/Adela.png'], [], gameData.playerCanvas);
const enemy = new Enemy('enemy', 50, 10, 5, ['images/Elicia.png'], [], gameData.enemyCanvas);

animator.beginAnimation(player);
animator.beginAnimation(enemy);