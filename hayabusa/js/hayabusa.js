(function () {
  var root = document.documentElement;

  function tokyoHour() {
    return Number(new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tokyo',
      hour: 'numeric',
      hourCycle: 'h23'
    }).format(new Date()));
  }

  function applyTheme() {
    var hour = tokyoHour();
    root.dataset.theme = hour >= 5 && hour < 17 ? 'day' : 'night';
  }

  applyTheme();
  setInterval(applyTheme, 60000);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stars = document.getElementById('sky-stars');
  var streaks = document.getElementById('sky-streaks');

  if (stars) {
    for (var i = 0; i < 56; i += 1) {
      var star = document.createElement('span');
      star.className = 'star';
      star.style.left = (Math.random() * 100) + '%';
      star.style.top = (Math.random() * 72) + '%';
      star.style.animationDelay = (Math.random() * 4) + 's';
      stars.appendChild(star);
    }
  }

  if (streaks && !reduceMotion) {
    for (var j = 0; j < 8; j += 1) {
      var streak = document.createElement('span');
      streak.className = 'streak';
      streak.style.top = (6 + Math.random() * 68) + '%';
      streak.style.animationDuration = (4.5 + Math.random() * 6) + 's';
      streak.style.animationDelay = (-Math.random() * 8) + 's';
      streaks.appendChild(streak);
    }
  }

  var textEl = document.getElementById('buzzer-text');
  var answerEl = document.getElementById('buzzer-answer');
  var lamp = document.getElementById('buzzer-lamp');
  if (!textEl || !answerEl || !lamp) return;

  var question = 'この鳥は時速300キロで急降下する、日本最速の猛禽で、その名は';
  var answer = 'ハヤブサ';
  var pressAt = 12;

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  async function playOnce() {
    textEl.textContent = '';
    answerEl.textContent = '';
    lamp.classList.remove('is-on');

    var limit = Math.min(pressAt, question.length);
    for (var n = 0; n < limit; n += 1) {
      textEl.textContent += question.charAt(n);
      if (!reduceMotion) await wait(85);
    }

    lamp.classList.add('is-on');
    answerEl.textContent = '押した！';
    if (!reduceMotion) await wait(260);
    answerEl.textContent = '押した！ ' + answer;
  }

  async function loop() {
    if (reduceMotion) {
      await playOnce();
      return;
    }
    while (true) {
      await playOnce();
      await wait(2400);
    }
  }

  loop();
})();
