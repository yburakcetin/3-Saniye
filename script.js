// ============================================================
// 3 Saniye - Refleks Oyunu
// Dosya: script.js
// ============================================================

// Oyun ayarları
const CONFIG = {
  initialTimeLimit: 3000,
  minTimeLimit: 1500,
  difficultyStep: 500,
  scorePerDifficultyIncrease: 10,
  feedbackDuration: 300,
  endGameDelay: 500,
  maxSameTaskRepeat: 1,
  timerTickInterval: 50,
  timerWarningPercent: 60,
  timerDangerPercent: 30,
  swipeThreshold: 50,
  swipeDirectionRatio: 1.5,
  growingShapeBaseSpeed: 30,
  growingShapeFastMultiplier: 1.8,
  storageKey: '3saniye_highscore',
};

// ============================================================
// Ses Efektleri
// ============================================================
const SoundManager = {
  ctx: null,

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API desteklenmiyor');
    }
  },

  play(type) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const settings = {
        correct: { freq: 523, vol: 0.1, dur: 0.1 },
        wrong: { freq: 200, vol: 0.15, dur: 0.3 },
        tick: { freq: 800, vol: 0.05, dur: 0.05 },
      };

      const s = settings[type];
      if (!s) return;

      osc.frequency.value = s.freq;
      gain.gain.value = s.vol;
      osc.start();
      osc.stop(this.ctx.currentTime + s.dur);
    } catch (e) {
      // Ses çalma hatası
    }
  }
};

// ============================================================
// Yardımcı Fonksiyonlar
// ============================================================
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickRandom(array) {
  return array[randomInt(0, array.length - 1)];
}

// ============================================================
// Mini Görev Tanımları
// ============================================================
const Tasks = {

  redTouch: {
    id: 'redTouch',
    title: 'Kırmızıya dokunma!',
    render(container) {
      const colors = [
        { name: 'red', bg: '#e74c3c', isTarget: true },
        { name: 'blue', bg: '#3498db', isTarget: false },
        { name: 'green', bg: '#2ecc71', isTarget: false },
        { name: 'yellow', bg: '#f1c40f', isTarget: false },
        { name: 'purple', bg: '#9b59b6', isTarget: false },
        { name: 'orange', bg: '#e67e22', isTarget: false },
      ];

      const nonTarget = colors.filter(c => !c.isTarget);
      const selected = shuffle([colors[0], ...shuffle(nonTarget).slice(0, randomInt(3, 4))]);

      this._targetMap = new Map();

      selected.forEach(color => {
        const box = document.createElement('div');
        box.className = 'task-box';
        box.style.backgroundColor = color.bg;
        box.dataset.color = color.name;
        this._targetMap.set(box, color.isTarget);
        container.appendChild(box);
      });
    },

    validate(element) {
      return !this._targetMap.get(element);
    },

    cleanup() {
      this._targetMap = null;
    }
  },

  smallestNumber: {
    id: 'smallestNumber',
    title: 'En küçük sayıyı seç!',
    render(container) {
      const count = randomInt(3, 4);
      const numbers = new Set();
      while (numbers.size < count) {
        numbers.add(randomInt(1, 99));
      }
      this._answer = Math.min(...numbers);

      [...numbers].sort((a, b) => a - b).forEach(num => {
        const el = document.createElement('div');
        el.className = 'task-number';
        el.textContent = num;
        el.dataset.value = num;
        container.appendChild(el);
      });
    },

    validate(element) {
      return parseInt(element.dataset.value) === this._answer;
    },

    cleanup() {
      this._answer = null;
    }
  },

  largestNumber: {
    id: 'largestNumber',
    title: 'En büyük sayıyı seç!',
    render(container) {
      const count = randomInt(3, 4);
      const numbers = new Set();
      while (numbers.size < count) {
        numbers.add(randomInt(1, 99));
      }
      this._answer = Math.max(...numbers);

      [...numbers].sort((a, b) => a - b).forEach(num => {
        const el = document.createElement('div');
        el.className = 'task-number';
        el.textContent = num;
        el.dataset.value = num;
        container.appendChild(el);
      });
    },

    validate(element) {
      return parseInt(element.dataset.value) === this._answer;
    },

    cleanup() {
      this._answer = null;
    }
  },

  misspelledWord: {
    id: 'misspelledWord',
    title: 'Yanlış yazılmış kelimeyi bul!',
    wordPairs: [
      { correct: 'Kitap', wrong: 'Kiapt' },
      { correct: 'Bilgisayar', wrong: 'Blgisayar' },
      { correct: 'Telefon', wrong: 'Telfon' },
      { correct: 'Araba', wrong: 'Aarba' },
      { correct: 'Masa', wrong: 'Maas' },
      { correct: 'Kalem', wrong: 'Kalemn' },
      { correct: 'Okul', wrong: 'Oukl' },
      { correct: 'Ev', wrong: 'Eev' },
      { correct: 'Kapı', wrong: 'Kpaı' },
      { correct: 'Pencere', wrong: 'Penceree' },
      { correct: 'Bahçe', wrong: 'Bahçee' },
      { correct: 'Çiçek', wrong: 'Çiçkek' },
      { correct: 'Güneş', wrong: 'Güneşş' },
      { correct: 'Deniz', wrong: 'Dneiz' },
      { correct: 'Dağ', wrong: 'Dğa' },
    ],

    render(container) {
      const pair = pickRandom(this.wordPairs);
      const otherPair = pickRandom(this.wordPairs.filter(p => p.correct !== pair.correct));
      const words = shuffle([
        { text: pair.correct, isWrong: false },
        { text: pair.wrong, isWrong: true },
        { text: otherPair.correct, isWrong: false },
      ]);

      words.forEach(w => {
        const el = document.createElement('div');
        el.className = 'task-word';
        el.textContent = w.text;
        el.dataset.wrong = w.isWrong;
        container.appendChild(el);
      });
    },

    validate(element) {
      return element.dataset.wrong === 'true';
    },

    cleanup() {}
  },

  swipeLeft: {
    id: 'swipeLeft',
    title: 'Ekranı sola kaydır!',
    _startX: 0,
    _startY: 0,
    _handlers: null,
    _processed: false,

    render(container) {
      this._processed = false;
      const area = document.createElement('div');
      area.className = 'swipe-area swipe-hint';
      area.textContent = '← Sola Kaydır →';
      container.appendChild(area);

      const touchStart = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        this._startX = touch.clientX;
        this._startY = touch.clientY;
      };

      const handleMove = (e) => {
        if (this._processed) return;
        const touch = e.touches ? e.touches[0] : e;
        const dx = touch.clientX - this._startX;
        const dy = touch.clientY - this._startY;

        if (Math.abs(dx) > CONFIG.swipeThreshold && Math.abs(dx) > Math.abs(dy) * CONFIG.swipeDirectionRatio) {
          this._processed = true;
          GameManager.checkAnswer(dx < 0);
        }
      };

      container.addEventListener('touchstart', touchStart, { passive: true });
      container.addEventListener('touchmove', handleMove, { passive: true });
      container.addEventListener('mousedown', touchStart);
      container.addEventListener('mousemove', (e) => {
        if (e.buttons === 1) handleMove(e);
      });

      this._handlers = [
        () => container.removeEventListener('touchstart', touchStart),
        () => container.removeEventListener('touchmove', handleMove),
        () => container.removeEventListener('mousedown', touchStart),
        () => container.removeEventListener('mousemove', handleMove),
      ];
    },

    validate() {
      return true;
    },

    cleanup() {
      if (this._handlers) {
        this._handlers.forEach(fn => fn());
        this._handlers = null;
      }
      this._processed = false;
    }
  },

  evenNumber: {
    id: 'evenNumber',
    title: 'Çift sayıya dokun!',
    render(container) {
      const numbers = [];
      const used = new Set();

      while (numbers.length < 4) {
        const num = randomInt(1, 50);
        if (!used.has(num)) {
          used.add(num);
          numbers.push(num);
        }
      }

      numbers.forEach(num => {
        const el = document.createElement('div');
        el.className = 'task-number';
        el.textContent = num;
        el.dataset.value = num;
        container.appendChild(el);
      });
    },

    validate(element) {
      return parseInt(element.dataset.value) % 2 === 0;
    },

    cleanup() {}
  },

  notBlue: {
    id: 'notBlue',
    title: 'Mavi olmayanı seç!',
    render(container) {
      const colors = [
        { name: 'blue', bg: '#3498db', isTarget: true },
        { name: 'red', bg: '#e74c3c', isTarget: false },
        { name: 'green', bg: '#2ecc71', isTarget: false },
        { name: 'yellow', bg: '#f1c40f', isTarget: false },
        { name: 'purple', bg: '#9b59b6', isTarget: false },
      ];

      const nonTarget = colors.filter(c => !c.isTarget);
      const selected = shuffle([colors[0], ...shuffle(nonTarget).slice(0, randomInt(3, 4))]);

      this._targetMap = new Map();

      selected.forEach(color => {
        const box = document.createElement('div');
        box.className = 'task-box';
        box.style.backgroundColor = color.bg;
        box.style.borderRadius = randomInt(0, 1) ? '50%' : '12px';
        box.dataset.color = color.name;
        this._targetMap.set(box, color.isTarget);
        container.appendChild(box);
      });
    },

    validate(element) {
      return !this._targetMap.get(element);
    },

    cleanup() {
      this._targetMap = null;
    }
  },

  fastestGrowing: {
    id: 'fastestGrowing',
    title: 'En hızlı büyüyen şekli yakala!',
    _animationId: null,
    _shapes: [],
    _correctIndex: null,

    render(container) {
      const shapeTypes = ['circle', 'square', 'triangle'];
      const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
      const count = 4;
      this._correctIndex = randomInt(0, count - 1);
      this._shapes = [];

      for (let i = 0; i < count; i++) {
        const shape = document.createElement('div');
        shape.className = 'task-shape';
        const size = 40;
        const color = colors[i % colors.length];
        const type = shapeTypes[i % shapeTypes.length];
        const speed = i === this._correctIndex ? CONFIG.growingShapeFastMultiplier : 1;

        applyShapeStyle(shape, type, size, color);
        shape.dataset.index = i;
        container.appendChild(shape);

        this._shapes.push({ element: shape, baseSize: size, speed, type, color });
      }

      let startTime = performance.now();

      const animate = (time) => {
        const elapsed = (time - startTime) / 1000;
        this._shapes.forEach(s => {
          const newSize = s.baseSize + elapsed * CONFIG.growingShapeBaseSpeed * s.speed;
          if (s.type === 'triangle') {
            s.element.style.borderLeftWidth = `${newSize / 2}px`;
            s.element.style.borderRightWidth = `${newSize / 2}px`;
            s.element.style.borderBottomWidth = `${newSize}px`;
          } else {
            s.element.style.width = newSize + 'px';
            s.element.style.height = newSize + 'px';
          }
        });
        this._animationId = requestAnimationFrame(animate);
      };

      this._animationId = requestAnimationFrame(animate);
    },

    validate(element) {
      return parseInt(element.dataset.index) === this._correctIndex;
    },

    cleanup() {
      if (this._animationId) {
        cancelAnimationFrame(this._animationId);
        this._animationId = null;
      }
      this._shapes = [];
      this._correctIndex = null;
    }
  },

  matchShape: {
    id: 'matchShape',
    title: '',
    _targetType: null,
    _shapeDefs: [
      { name: 'Daire', type: 'circle' },
      { name: 'Kare', type: 'square' },
      { name: 'Üçgen', type: 'triangle' },
    ],

    render(container) {
      const target = pickRandom(this._shapeDefs);
      this._targetType = target.type;
      this.title = `${target.name} şeklini seç!`;

      const shuffled = shuffle([...this._shapeDefs]);
      const colors = ['#e74c3c', '#3498db', '#2ecc71'];

      shuffled.forEach((shape, i) => {
        const el = document.createElement('div');
        el.className = 'task-shape';
        const size = 70;
        applyShapeStyle(el, shape.type, size, colors[i]);
        el.dataset.type = shape.type;
        container.appendChild(el);
      });
    },

    validate(element) {
      return element.dataset.type === this._targetType;
    },

    cleanup() {
      this._targetType = null;
    }
  },

  matchColor: {
    id: 'matchColor',
    title: '',
    _targetColor: null,
    _colorDefs: [
      { name: 'Kırmızı', value: '#e74c3c' },
      { name: 'Mavi', value: '#3498db' },
      { name: 'Yeşil', value: '#2ecc71' },
      { name: 'Sarı', value: '#f1c40f' },
      { name: 'Mor', value: '#9b59b6' },
    ],

    render(container) {
      const target = pickRandom(this._colorDefs);
      this._targetColor = target.value;
      this.title = `${target.name} rengi seç!`;

      const others = this._colorDefs.filter(c => c.value !== target.value);
      const selected = shuffle([target, ...shuffle(others).slice(0, 3)]);
      const shapeTypes = ['50%', '12px', '0'];

      selected.forEach((color, i) => {
        const el = document.createElement('div');
        el.className = 'task-shape';
        const size = 70;
        const type = shapeTypes[i % shapeTypes.length];

        if (type === '0') {
          el.style.width = '0';
          el.style.height = '0';
          el.style.backgroundColor = 'transparent';
          el.style.borderLeft = `${size / 2}px solid transparent`;
          el.style.borderRight = `${size / 2}px solid transparent`;
          el.style.borderBottom = `${size}px solid ${color.value}`;
        } else {
          el.style.width = size + 'px';
          el.style.height = size + 'px';
          el.style.backgroundColor = color.value;
          if (type === '50%') {
            el.style.borderRadius = '50%';
          }
        }

        el.dataset.color = color.value;
        container.appendChild(el);
      });
    },

    validate(element) {
      return element.dataset.color === this._targetColor;
    },

    cleanup() {
      this._targetColor = null;
    }
  }
};

// Şekil stillerini uygula (tekrar eden kod)
function applyShapeStyle(el, type, size, color) {
  if (type === 'circle') {
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.backgroundColor = color;
    el.style.borderRadius = '50%';
  } else if (type === 'triangle') {
    el.style.width = '0';
    el.style.height = '0';
    el.style.backgroundColor = 'transparent';
    el.style.borderLeft = `${size / 2}px solid transparent`;
    el.style.borderRight = `${size / 2}px solid transparent`;
    el.style.borderBottom = `${size}px solid ${color}`;
  } else {
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.backgroundColor = color;
  }
}

// Görev listesi (dizi olarak erişim için)
const TASK_LIST = Object.values(Tasks);

// ============================================================
// GameManager
// ============================================================
const GameManager = {
  score: 0,
  highScore: 0,
  timeLeft: 0,
  maxTime: CONFIG.initialTimeLimit,
  timerInterval: null,
  currentTask: null,
  isPlaying: false,
  isProcessing: false,
  lastTaskIds: [],

  // DOM referansları
  dom: {},

  init() {
    this.dom.taskArea = document.getElementById('task-area');
    this.dom.taskText = document.getElementById('task-text');
    this.dom.scoreEl = document.getElementById('score');
    this.dom.timerBar = document.getElementById('timer-bar');
    this.dom.feedbackEl = document.getElementById('feedback');
    this.dom.gameMain = document.getElementById('game-main');

    this.dom.screens = {
      start: document.getElementById('start-screen'),
      game: document.getElementById('game-screen'),
      end: document.getElementById('end-screen'),
    };

    this.highScore = parseInt(localStorage.getItem(CONFIG.storageKey) || '0');

    document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    document.getElementById('retry-btn').addEventListener('click', () => this.startGame());

    SoundManager.init();
  },

  // Ekran değiştir
  showScreen(name) {
    Object.values(this.dom.screens).forEach(s => s.classList.remove('active'));
    this.dom.screens[name].classList.add('active');
  },

  // Skora göre süre limiti hesapla
  calculateTimeLimit() {
    const steps = Math.floor(this.score / CONFIG.scorePerDifficultyIncrease);
    const reduced = CONFIG.initialTimeLimit - steps * CONFIG.difficultyStep;
    return Math.max(reduced, CONFIG.minTimeLimit);
  },

  // Skoru güncelle
  updateScore() {
    this.score++;
    this.dom.scoreEl.textContent = this.score;
  },

  // Oyunu başlat
  startGame() {
    this.score = 0;
    this.isPlaying = true;
    this.isProcessing = false;
    this.lastTaskIds = [];
    this.dom.scoreEl.textContent = '0';
    this.showScreen('game');
    this.nextTask();
  },

  // Oyunu sıfırla
  resetGame() {
    this.stopTimer();
    this.cleanupCurrentTask();
    this.score = 0;
    this.isPlaying = false;
    this.isProcessing = false;
    this.lastTaskIds = [];
    this.currentTask = null;
    this.dom.taskArea.innerHTML = '';
  },

  // Sonraki görev
  nextTask() {
    if (!this.isPlaying) return;

    this.isProcessing = false;
    this.cleanupCurrentTask();
    this.dom.taskArea.innerHTML = '';

    // Son 2 görevi takip et, aynı görev tekrarını azalt
    const available = TASK_LIST.filter(t => !this.lastTaskIds.includes(t.id));
    const pool = available.length > 0 ? available : TASK_LIST;
    this.currentTask = pickRandom(pool);

    this.lastTaskIds.push(this.currentTask.id);
    if (this.lastTaskIds.length > CONFIG.maxSameTaskRepeat + 1) {
      this.lastTaskIds.shift();
    }

    // Görev metnini ayarla
    this.dom.taskText.textContent = this.currentTask.title || '';

    // Görevi oluştur
    this.currentTask.render(this.dom.taskArea);

    // Dinamik başlık varsa güncelle
    if (this.currentTask.title) {
      this.dom.taskText.textContent = this.currentTask.title;
    }

    // Olay dinleyicilerini ekle
    this.addTaskListeners();

    // Süreyi başlat
    this.maxTime = this.calculateTimeLimit();
    this.timeLeft = this.maxTime;
    this.startTimer();
  },

  // Görev tıklama/dokunma dinleyicileri
  addTaskListeners() {
    const handler = (e) => {
      if (!this.isPlaying || this.isProcessing) return;

      // Swipe görevi kendi handler'ını kullanır
      if (this.currentTask.id === 'swipeLeft') return;

      let target = e.target;
      while (target && target !== this.dom.taskArea && !target.hasAttribute('data-value') && !target.hasAttribute('data-wrong') && !target.hasAttribute('data-color') && !target.hasAttribute('data-type') && !target.hasAttribute('data-index')) {
        target = target.parentElement;
      }

      if (target === this.dom.taskArea || !target) return;
      if (!this.currentTask) return;

      e.preventDefault();
      this.checkAnswer(this.currentTask.validate(target));
    };

    this.dom.taskArea.addEventListener('touchend', handler, { passive: false });
    this.dom.taskArea.addEventListener('click', handler);

    this._listenerHandler = handler;
  },

  // Cevap kontrolü
  checkAnswer(isCorrect) {
    if (!this.isPlaying || this.isProcessing) return;

    this.isProcessing = true;
    this.stopTimer();

    if (isCorrect) {
      this.updateScore();
      SoundManager.play('correct');
      this.showFeedback('correct');

      setTimeout(() => {
        if (this.isPlaying) this.nextTask();
      }, CONFIG.feedbackDuration);
    } else {
      SoundManager.play('wrong');
      this.showFeedback('wrong');
      this.shakeGameArea();

      setTimeout(() => {
        this.endGame();
      }, CONFIG.endGameDelay);
    }
  },

  // Geri bildirim göster
  showFeedback(type) {
    this.dom.feedbackEl.className = 'feedback ' + type;
    setTimeout(() => {
      this.dom.feedbackEl.className = 'feedback';
    }, CONFIG.feedbackDuration);
  },

  // Oyun alanını sars
  shakeGameArea() {
    this.dom.gameMain.classList.add('shake');
    setTimeout(() => this.dom.gameMain.classList.remove('shake'), CONFIG.endGameDelay);
  },

  // Zamanlayıcı başlat
  startTimer() {
    this.updateTimerBar();

    this.timerInterval = setInterval(() => {
      this.timeLeft -= CONFIG.timerTickInterval;
      this.updateTimerBar();

      if (this.timeLeft <= 0) {
        this.stopTimer();
        if (this.isPlaying && !this.isProcessing) {
          this.isProcessing = true;
          SoundManager.play('wrong');
          this.showFeedback('wrong');
          this.shakeGameArea();

          setTimeout(() => {
            this.endGame();
          }, CONFIG.endGameDelay);
        }
      }
    }, CONFIG.timerTickInterval);
  },

  // Zamanlayıcı durdur
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  // Süre çubuğunu güncelle
  updateTimerBar() {
    const percent = Math.max(0, (this.timeLeft / this.maxTime) * 100);
    this.dom.timerBar.style.width = percent + '%';

    this.dom.timerBar.classList.remove('warning', 'danger');
    if (percent < CONFIG.timerDangerPercent) {
      this.dom.timerBar.classList.add('danger');
    } else if (percent < CONFIG.timerWarningPercent) {
      this.dom.timerBar.classList.add('warning');
    }
  },

  // Mevcut görevi temizle
  cleanupCurrentTask() {
    this.stopTimer();

    if (this._listenerHandler) {
      this.dom.taskArea.removeEventListener('touchend', this._listenerHandler);
      this.dom.taskArea.removeEventListener('click', this._listenerHandler);
      this._listenerHandler = null;
    }

    if (this.currentTask && this.currentTask.cleanup) {
      this.currentTask.cleanup();
    }
  },

  // Oyunu bitir
  endGame() {
    this.isPlaying = false;
    this.isProcessing = false;
    this.cleanupCurrentTask();

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(CONFIG.storageKey, this.highScore.toString());
    }

    document.getElementById('final-score').textContent = this.score;
    document.getElementById('high-score').textContent = this.highScore;

    this.showScreen('end');
  }
};

// ============================================================
// Oyunu Başlat
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  GameManager.init();
});
