// ============================================================
// 3 Saniye - Refleks Oyunu
// Dosya: script.js
// Açıklama: Ana oyun mantığı, GameManager ve tüm mini görevler
// ============================================================

// ============================================================
// Ses Efektleri (Web Audio API ile basit bip sesleri)
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

      switch (type) {
        case 'correct':
          osc.frequency.value = 523;
          gain.gain.value = 0.1;
          osc.start();
          osc.stop(this.ctx.currentTime + 0.1);
          break;
        case 'wrong':
          osc.frequency.value = 200;
          gain.gain.value = 0.15;
          osc.start();
          osc.stop(this.ctx.currentTime + 0.3);
          break;
        case 'tick':
          osc.frequency.value = 800;
          gain.gain.value = 0.05;
          osc.start();
          osc.stop(this.ctx.currentTime + 0.05);
          break;
      }
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

  // 1. Kırmızıya Dokunma
  redTouch: {
    id: 'redTouch',
    title: 'Kırmızıya dokunma!',
    render(container) {
      const colors = [
        { name: 'red', bg: '#e74c3c', isRed: true },
        { name: 'blue', bg: '#3498db', isRed: false },
        { name: 'green', bg: '#2ecc71', isRed: false },
        { name: 'yellow', bg: '#f1c40f', isRed: false },
        { name: 'purple', bg: '#9b59b6', isRed: false },
        { name: 'orange', bg: '#e67e22', isRed: false },
      ];

      const nonRed = colors.filter(c => !c.isRed);
      const selected = shuffle([colors[0], ...shuffle(nonRed).slice(0, randomInt(3, 4))]);

      this.correctColor = null;
      this.isRedMap = new Map();

      selected.forEach(color => {
        const box = document.createElement('div');
        box.className = 'task-box';
        box.style.backgroundColor = color.bg;
        box.dataset.color = color.name;
        this.isRedMap.set(box, color.isRed);
        if (!color.isRed && !this.correctColor) {
          this.correctColor = box;
        }
        container.appendChild(box);
      });
    },

    validate(element) {
      return !this.isRedMap.get(element);
    },

    cleanup() {
      this.correctColor = null;
      this.isRedMap = null;
    }
  },

  // 2. En Küçük Sayıyı Seç
  smallestNumber: {
    id: 'smallestNumber',
    title: 'En küçük sayıyı seç!',
    render(container) {
      const count = randomInt(3, 4);
      const numbers = new Set();
      while (numbers.size < count) {
        numbers.add(randomInt(1, 99));
      }
      const sorted = [...numbers].sort((a, b) => a - b);
      this.smallest = sorted[0];

      sorted.forEach(num => {
        const el = document.createElement('div');
        el.className = 'task-number';
        el.textContent = num;
        el.dataset.value = num;
        container.appendChild(el);
      });
    },

    validate(element) {
      return parseInt(element.dataset.value) === this.smallest;
    },

    cleanup() {
      this.smallest = null;
    }
  },

  // 3. En Büyük Sayıyı Seç
  largestNumber: {
    id: 'largestNumber',
    title: 'En büyük sayıyı seç!',
    render(container) {
      const count = randomInt(3, 4);
      const numbers = new Set();
      while (numbers.size < count) {
        numbers.add(randomInt(1, 99));
      }
      const sorted = [...numbers].sort((a, b) => a - b);
      this.largest = sorted[sorted.length - 1];

      sorted.forEach(num => {
        const el = document.createElement('div');
        el.className = 'task-number';
        el.textContent = num;
        el.dataset.value = num;
        container.appendChild(el);
      });
    },

    validate(element) {
      return parseInt(element.dataset.value) === this.largest;
    },

    cleanup() {
      this.largest = null;
    }
  },

  // 4. Yanlış Yazılmış Kelimeyi Bul
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
      const words = shuffle([
        { text: pair.correct, isWrong: false },
        { text: pair.wrong, isWrong: true },
        { text: pickRandom(this.wordPairs.filter(p => p.correct !== pair.correct)).correct, isWrong: false },
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

  // 5. Ekranı Sola Kaydır
  swipeLeft: {
    id: 'swipeLeft',
    title: 'Ekranı sola kaydır!',
    startX: 0,
    startY: 0,
    handler: null,

    render(container) {
      const area = document.createElement('div');
      area.className = 'swipe-area swipe-hint';
      area.textContent = '← Sola Kaydır →';
      container.appendChild(area);

      this.handler = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        const dx = touch.clientX - this.startX;
        const dy = touch.clientY - this.startY;

        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          if (dx < 0) {
            GameManager.checkAnswer(true);
          } else {
            GameManager.checkAnswer(false);
          }
        }
      };

      const touchStart = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        this.startX = touch.clientX;
        this.startY = touch.clientY;
      };

      container.addEventListener('touchstart', touchStart, { passive: true });
      container.addEventListener('touchmove', this.handler, { passive: true });
      container.addEventListener('mousedown', touchStart);
      container.addEventListener('mousemove', (e) => {
        if (e.buttons === 1) this.handler(e);
      });

      this.cleanupFns = [
        () => container.removeEventListener('touchstart', touchStart),
        () => container.removeEventListener('touchmove', this.handler),
        () => container.removeEventListener('mousedown', touchStart),
        () => container.removeEventListener('mousemove', this.handler),
      ];
    },

    validate() {
      return true;
    },

    cleanup() {
      if (this.cleanupFns) {
        this.cleanupFns.forEach(fn => fn());
        this.cleanupFns = null;
      }
      this.handler = null;
    }
  },

  // 6. Sadece Çift Sayılara Dokun
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

  // 7. Mavi Olmayanı Seç
  notBlue: {
    id: 'notBlue',
    title: 'Mavi olmayanı seç!',
    render(container) {
      const colors = [
        { name: 'blue', bg: '#3498db', isBlue: true },
        { name: 'red', bg: '#e74c3c', isBlue: false },
        { name: 'green', bg: '#2ecc71', isBlue: false },
        { name: 'yellow', bg: '#f1c40f', isBlue: false },
        { name: 'purple', bg: '#9b59b6', isBlue: false },
      ];

      const nonBlue = colors.filter(c => !c.isBlue);
      const selected = shuffle([colors[0], ...shuffle(nonBlue).slice(0, randomInt(3, 4))]);

      this.isBlueMap = new Map();

      selected.forEach(color => {
        const box = document.createElement('div');
        box.className = 'task-box';
        box.style.backgroundColor = color.bg;
        box.style.borderRadius = randomInt(0, 1) ? '50%' : '12px';
        this.isBlueMap.set(box, color.isBlue);
        container.appendChild(box);
      });
    },

    validate(element) {
      return !this.isBlueMap.get(element);
    },

    cleanup() {
      this.isBlueMap = null;
    }
  },

  // 8. En Hızlı Büyüyen Şekli Yakala
  fastestGrowing: {
    id: 'fastestGrowing',
    title: 'En hızlı büyüyen şekli yakala!',
    animationId: null,
    shapes: [],

    render(container) {
      const shapes = ['circle', 'square', 'triangle'];
      const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
      const count = 4;
      const fastestIndex = randomInt(0, count - 1);

      this.shapes = [];
      this.correctIndex = fastestIndex;

      for (let i = 0; i < count; i++) {
        const shape = document.createElement('div');
        shape.className = 'task-shape';
        const size = 40;
        const color = colors[i % colors.length];
        const shapeType = shapes[i % shapes.length];
        const speed = i === fastestIndex ? 1.8 : 1;

        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
        shape.style.backgroundColor = color;

        if (shapeType === 'circle') {
          shape.style.borderRadius = '50%';
        } else if (shapeType === 'triangle') {
          shape.style.width = '0';
          shape.style.height = '0';
          shape.style.backgroundColor = 'transparent';
          shape.style.borderLeft = `${size/2}px solid transparent`;
          shape.style.borderRight = `${size/2}px solid transparent`;
          shape.style.borderBottom = `${size}px solid ${color}`;
        }

        shape.dataset.index = i;
        container.appendChild(shape);

        this.shapes.push({
          element: shape,
          baseSize: size,
          currentSize: size,
          speed: speed,
          shapeType: shapeType,
          color: color,
        });
      }

      let startTime = performance.now();

      const animate = (time) => {
        const elapsed = (time - startTime) / 1000;
        this.shapes.forEach((s, idx) => {
          const newSize = s.baseSize + elapsed * 30 * s.speed;
          s.currentSize = newSize;
          if (s.shapeType === 'triangle') {
            s.element.style.borderLeftWidth = `${newSize/2}px`;
            s.element.style.borderRightWidth = `${newSize/2}px`;
            s.element.style.borderBottomWidth = `${newSize}px`;
          } else {
            s.element.style.width = newSize + 'px';
            s.element.style.height = newSize + 'px';
          }
        });
        this.animationId = requestAnimationFrame(animate);
      };

      this.animationId = requestAnimationFrame(animate);
    },

    validate(element) {
      return parseInt(element.dataset.index) === this.correctIndex;
    },

    cleanup() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.shapes = [];
    }
  },

  // 9. Şekli Eşleştir
  matchShape: {
    id: 'matchShape',
    title: '',
    shapes: [
      { name: 'Daire', type: 'circle' },
      { name: 'Kare', type: 'square' },
      { name: 'Üçgen', type: 'triangle' },
    ],

    render(container) {
      const target = pickRandom(this.shapes);
      this.targetType = target.type;
      this.title = `${target.name} şeklini seç!`;

      const shuffled = shuffle([...this.shapes]);
      const colors = ['#e74c3c', '#3498db', '#2ecc71'];

      shuffled.forEach((shape, i) => {
        const el = document.createElement('div');
        el.className = 'task-shape';
        const size = 70;
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.backgroundColor = colors[i];

        if (shape.type === 'circle') {
          el.style.borderRadius = '50%';
        } else if (shape.type === 'triangle') {
          el.style.width = '0';
          el.style.height = '0';
          el.style.backgroundColor = 'transparent';
          el.style.borderLeft = `${size/2}px solid transparent`;
          el.style.borderRight = `${size/2}px solid transparent`;
          el.style.borderBottom = `${size}px solid ${colors[i]}`;
        }

        el.dataset.type = shape.type;
        container.appendChild(el);
      });
    },

    validate(element) {
      return element.dataset.type === this.targetType;
    },

    cleanup() {
      this.targetType = null;
    }
  },

  // 10. Rengi Eşleştir
  matchColor: {
    id: 'matchColor',
    title: '',
    colors: [
      { name: 'Kırmızı', value: '#e74c3c' },
      { name: 'Mavi', value: '#3498db' },
      { name: 'Yeşil', value: '#2ecc71' },
      { name: 'Sarı', value: '#f1c40f' },
      { name: 'Mor', value: '#9b59b6' },
    ],

    render(container) {
      const target = pickRandom(this.colors);
      this.targetColor = target.value;
      this.title = `${target.name} rengi seç!`;

      const selected = shuffle([target, ...shuffle(this.colors.filter(c => c.value !== target.value)).slice(0, 3)]);
      const shapes = ['50%', '12px', '0'];

      selected.forEach((color, i) => {
        const el = document.createElement('div');
        el.className = 'task-shape';
        const size = 70;
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.backgroundColor = color.value;

        const shapeType = shapes[i % shapes.length];
        if (shapeType === '50%') {
          el.style.borderRadius = '50%';
        } else if (shapeType === '0') {
          el.style.width = '0';
          el.style.height = '0';
          el.style.backgroundColor = 'transparent';
          el.style.borderLeft = `${size/2}px solid transparent`;
          el.style.borderRight = `${size/2}px solid transparent`;
          el.style.borderBottom = `${size}px solid ${color.value}`;
        }

        el.dataset.color = color.value;
        container.appendChild(el);
      });
    },

    validate(element) {
      return element.dataset.color === this.targetColor;
    },

    cleanup() {
      this.targetColor = null;
    }
  }
};

// ============================================================
// GameManager - Ana Oyun Yöneticisi
// ============================================================
const GameManager = {
  score: 0,
  highScore: 0,
  timeLeft: 0,
  maxTime: 3000,
  timerInterval: null,
  currentTask: null,
  lastTaskId: null,
  isPlaying: false,
  taskArea: null,
  taskText: null,
  scoreEl: null,
  timerBar: null,
  feedbackEl: null,

  // DOM Elementleri
  screens: {
    start: null,
    game: null,
    end: null,
  },

  init() {
    this.taskArea = document.getElementById('task-area');
    this.taskText = document.getElementById('task-text');
    this.scoreEl = document.getElementById('score');
    this.timerBar = document.getElementById('timer-bar');
    this.feedbackEl = document.getElementById('feedback');

    this.screens.start = document.getElementById('start-screen');
    this.screens.game = document.getElementById('game-screen');
    this.screens.end = document.getElementById('end-screen');

    this.highScore = parseInt(localStorage.getItem('3saniye_highscore') || '0');

    document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    document.getElementById('retry-btn').addEventListener('click', () => this.startGame());

    SoundManager.init();
  },

  // Ekran değiştirme
  showScreen(screenName) {
    Object.values(this.screens).forEach(s => s.classList.remove('active'));
    this.screens[screenName].classList.add('active');
  },

  // Zorluk hesaplama
  getDifficultyTime() {
    const s = this.score;
    if (s >= 30) return 1500;
    if (s >= 20) return 2000;
    if (s >= 10) return 2500;
    return 3000;
  },

  // Oyunu başlat
  startGame() {
    this.score = 0;
    this.isPlaying = true;
    this.lastTaskId = null;
    this.scoreEl.textContent = '0';
    this.showScreen('game');
    this.nextTask();
  },

  // Sonraki görev
  nextTask() {
    if (!this.isPlaying) return;

    this.cleanupCurrentTask();
    this.taskArea.innerHTML = '';

    // Rastgele görev seç (aynı görev üst üste gelmesin)
    const taskKeys = Object.keys(Tasks);
    let available = taskKeys.filter(k => k !== this.lastTaskId);
    this.currentTask = Tasks[pickRandom(available)];
    this.lastTaskId = this.currentTask.id;

    // Görev metnini güncelle (bazı görevler dinamik başlık kullanır)
    if (this.currentTask.title) {
      this.taskText.textContent = this.currentTask.title;
    }

    // Görevi render et
    this.currentTask.render(this.taskArea);

    // Dinamik başlık varsa güncelle
    if (this.currentTask.title && this.currentTask.title !== this.taskText.textContent) {
      this.taskText.textContent = this.currentTask.title;
    }

    // Tıklama/dokunma olaylarını ekle
    this.addTaskListeners();

    // Süreyi başlat
    this.maxTime = this.getDifficultyTime();
    this.timeLeft = this.maxTime;
    this.startTimer();
  },

  // Görev dinleyicileri
  addTaskListeners() {
    const handler = (e) => {
      if (!this.isPlaying) return;

      let target = e.target;
      // Tıklanan element görev elementi değilse, en yakın görev elementini bul
      while (target && target !== this.taskArea && !target.dataset) {
        target = target.parentElement;
      }

      if (target === this.taskArea || !target) return;

      // Swipe görevi kendi handler'ını kullanır
      if (this.currentTask.id === 'swipeLeft') return;

      e.preventDefault();
      const isValid = this.currentTask.validate(target);
      this.checkAnswer(isValid);
    };

    this.taskArea.addEventListener('touchend', handler, { passive: false });
    this.taskArea.addEventListener('click', handler);

    this._listenerHandler = handler;
  },

  // Cevap kontrolü
  checkAnswer(isCorrect) {
    if (!this.isPlaying) return;

    this.stopTimer();

    if (isCorrect) {
      this.score++;
      this.scoreEl.textContent = this.score;
      SoundManager.play('correct');
      this.showFeedback('correct');

      setTimeout(() => {
        this.nextTask();
      }, 300);
    } else {
      SoundManager.play('wrong');
      this.showFeedback('wrong');
      this.gameAreaShake();

      setTimeout(() => {
        this.endGame();
      }, 500);
    }
  },

  // Geri bildirim göster
  showFeedback(type) {
    this.feedbackEl.className = 'feedback ' + type;
    setTimeout(() => {
      this.feedbackEl.className = 'feedback';
    }, 300);
  },

  // Oyun alanını sars
  gameAreaShake() {
    const gameMain = document.getElementById('game-main');
    gameMain.classList.add('shake');
    setTimeout(() => gameMain.classList.remove('shake'), 500);
  },

  // Zamanlayıcı başlat
  startTimer() {
    this.updateTimerBar();
    const tickInterval = 50;

    this.timerInterval = setInterval(() => {
      this.timeLeft -= tickInterval;
      this.updateTimerBar();

      if (this.timeLeft <= 0) {
        this.stopTimer();
        SoundManager.play('wrong');
        this.showFeedback('wrong');
        this.gameAreaShake();

        setTimeout(() => {
          this.endGame();
        }, 500);
      }
    }, tickInterval);
  },

  // Zamanlayıcı durdur
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  // Zaman çubuğunu güncelle
  updateTimerBar() {
    const percent = (this.timeLeft / this.maxTime) * 100;
    this.timerBar.style.width = percent + '%';

    this.timerBar.classList.remove('warning', 'danger');
    if (percent < 30) {
      this.timerBar.classList.add('danger');
    } else if (percent < 60) {
      this.timerBar.classList.add('warning');
    }
  },

  // Mevcut görevi temizle
  cleanupCurrentTask() {
    this.stopTimer();

    if (this._listenerHandler) {
      this.taskArea.removeEventListener('touchend', this._listenerHandler);
      this.taskArea.removeEventListener('click', this._listenerHandler);
      this._listenerHandler = null;
    }

    if (this.currentTask && this.currentTask.cleanup) {
      this.currentTask.cleanup();
    }
  },

  // Oyunu bitir
  endGame() {
    this.isPlaying = false;
    this.cleanupCurrentTask();

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('3saniye_highscore', this.highScore.toString());
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
