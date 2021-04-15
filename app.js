const mainContainer = document.querySelector('.main');
const player = document.getElementById('player');
const attackButton = document.getElementById('attack');
const defendButton = document.getElementById('defend');
const evadeButton = document.getElementById('evade');
const moveSpeed = 30;
const moveDuration = 500;

player.style.left = '45%';
player.style.top = '75%';

const attack = function () {
  player.src = 'player-assets/images/P4.png';

  const moveForward = setInterval(function () {
    const leftVal = parseInt(player.style.left, 10);
    player.style.left = (leftVal + 1) + "%";
  }, moveSpeed);

  setTimeout(function () {
    player.src = 'player-assets/images/P6.png';
  }, moveDuration / 3);

  setTimeout(function () {
    player.src = 'player-assets/images/P1.png';
    clearInterval(moveForward);

    const moveBack = setInterval(function () {
      const leftPos = parseInt(player.style.left, 10);
      player.style.left = (leftPos - 1) + "%";
    }, moveSpeed);

    setTimeout(function () {
      clearInterval(moveBack);
    }, moveDuration)
  }, moveDuration)
}

const defend = function () {
  player.src = 'player-assets/images/P2.png';

  setTimeout(function(){
    player.src = 'player-assets/images/P1.png';
  }, moveDuration)
}

const evade = function () {
  const moveBack = setInterval(function () {
    const leftPos = parseInt(player.style.left, 10);
    player.style.left = (leftPos - 1) + "%";
  }, moveSpeed);
  setTimeout(function () {
    clearInterval(moveBack);
    const moveForward = setInterval(function () {
      const leftVal = parseInt(player.style.left, 10);
      player.style.left = (leftVal + 1) + "%";
    }, moveSpeed);
    setTimeout(function () {
      clearInterval(moveForward);
    }, moveDuration)
  }, moveDuration)
}


const determineClickResult = function (target) {
  if (target === attackButton) {
    attack();
  }

  if (target === defendButton) {
    defend();
  }

  if (target === evadeButton) {
    evade();
  }
}

mainContainer.addEventListener('click', function (event) {
  const target = event.target;
  determineClickResult(target);
})


