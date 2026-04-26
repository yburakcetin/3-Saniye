const CONFIG = {
  initialTimeLimit: 3000,
  minTimeLimit: 1000,
  difficultyStep: 400,
  scorePerDifficultyIncrease: 10,
  feedbackDuration: 250,
  maxRecentTasks: 2,
  timerFrameMs: 40,
  minimumSwipeDistance: 50
};

const STORAGE_KEYS = {
  highScore: "threeSecondsHighScore",
  sound: "threeSecondsSoundEnabled",
  vibration: "threeSecondsVibrationEnabled"
};

const state = {
  score: 0,
  highScore: 0,
  currentTask: null,
  recentTasks: [],
  isPlaying: false,
  inputLocked: true,
  timerId: null,
  roundStartedAt: 0,
  roundLimit: CONFIG.initialTimeLimit,
  soundEnabled: true,
  vibrationEnabled: true,
  audioContext: null,
  swipeCleanup: null
};

const dom = {};

const COLORS = [
  { name: "kırmızı", value: "#e33b3b", code: "red" },
  { name: "mavi", value: "#2f80ed", code: "blue" },
  { name: "yeşil", value: "#31c46b", code: "green" },
  { name: "sarı", value: "#f2c94c", code: "yellow" },
  { name: "mor", value: "#9b51e0", code: "purple" },
  { name: "turuncu", value: "#f2994a", code: "orange" }
];

const SHAPES = [
  { name: "daire", type: "circle" },
  { name: "kare", type: "square" },
  { name: "üçgen", type: "triangle" }
];

const WORD_SETS = [
  { wrong: "telofon", correct: ["telefon", "masa", "kalem"] },
  { wrong: "kitpa", correct: ["kitap", "okul", "defter"] },
  { wrong: "bilgisyayar", correct: ["bilgisayar", "ekran", "fare"] },
  { wrong: "pencrae", correct: ["pencere", "kapı", "duvar"] },
  { wrong: "güneşş", correct: ["güneş", "deniz", "bulut"] },
  { wrong: "arkadaşş", correct: ["arkadaş", "oyun", "şehir"] }
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(list) {
  return list[randomInt(0, list.length - 1)];
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function makeOption(text, isCorrect, className = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `option ${className}`.trim();
  button.textContent = text;
  button.dataset.correct = String(isCorrect);
  return button;
}

function makeColorBox(color, isCorrect) {
  const button = makeOption("", isCorrect, "color-box");
  button.style.background = color.value;
  button.dataset.color = color.code;
  button.setAttribute("aria-label", color.name);
  return button;
}

function makeShape(type, color, isCorrect, extraClass = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `shape ${type} ${extraClass}`.trim();
  button.dataset.correct = String(isCorrect);
  button.dataset.shape = type;
  button.setAttribute("aria-label", type);

  if (type === "triangle") {
    button.style.background = color;
  } else {
    button.style.background = color;
  }

  return button;
}

function uniqueNumbers(count, min, max) {
  const values = new Set();
  while (values.size < count) {
    values.add(randomInt(min, max));
  }
  return [...values];
}

const tasks = [
  {
    id: "avoid-red",
    title: "Kırmızıya dokunma",
    render(area) {
      const safeColors = COLORS.filter((color) => color.code !== "red");
      const selected = shuffle([COLORS[0], ...shuffle(safeColors).slice(0, 4)]);
      selected.forEach((color) => area.appendChild(makeColorBox(color, color.code !== "red")));
    }
  },
  {
    id: "smallest-number",
    title: "En küçük sayıyı seç",
    render(area) {
      const numbers = uniqueNumbers(randomInt(3, 4), 1, 99);
      const answer = Math.min(...numbers);
      shuffle(numbers).forEach((number) => area.appendChild(makeOption(number, number === answer)));
    }
  },
  {
    id: "largest-number",
    title: "En büyük sayıyı seç",
    render(area) {
      const numbers = uniqueNumbers(randomInt(3, 4), 1, 99);
      const answer = Math.max(...numbers);
      shuffle(numbers).forEach((number) => area.appendChild(makeOption(number, number === answer)));
    }
  },
  {
    id: "misspelled-word",
    title: "Yanlış yazılmış kelimeyi bul",
    render(area) {
      const set = pick(WORD_SETS);
      const words = shuffle([
        { text: set.wrong, correct: true },
        ...set.correct.map((word) => ({ text: word, correct: false }))
      ]);
      words.forEach((word) => area.appendChild(makeOption(word.text, word.correct, "word-option")));
    }
  },
  {
    id: "swipe-left",
    title: "Ekranı sola kaydır",
    render(area) {
      const pad = document.createElement("div");
      pad.className = "swipe-pad";
      pad.innerHTML = "<span>← Sola kaydır</span>";
      area.appendChild(pad);

      let startX = 0;
      let startY = 0;
      let tracking = false;
      let processed = false;

      const getPoint = (event) => {
        const source = event.changedTouches ? event.changedTouches[0] : event;
        return { x: source.clientX, y: source.clientY };
      };

      const startSwipe = (event) => {
        if (state.inputLocked || !state.isPlaying) return;
        const point = getPoint(event);
        tracking = true;
        processed = false;
        startX = point.x;
        startY = point.y;
      };

      const moveSwipe = (event) => {
        if (!tracking || state.inputLocked || !state.isPlaying) return;
        if (event.cancelable) event.preventDefault();
      };

      const finishSwipe = (event) => {
        if (!tracking || processed || state.inputLocked || !state.isPlaying) return;
        tracking = false;
        processed = true;

        const point = getPoint(event);
        const diffX = point.x - startX;
        const diffY = point.y - startY;
        const absX = Math.abs(diffX);
        const absY = Math.abs(diffY);
        const movedEnough = absX >= CONFIG.minimumSwipeDistance || absY >= CONFIG.minimumSwipeDistance;
        const isLeftSwipe = diffX < -CONFIG.minimumSwipeDistance && absX > absY * 1.3;

        if (!movedEnough) return;
        checkAnswer(isLeftSwipe);
      };

      const cancelSwipe = () => {
        tracking = false;
      };

      pad.addEventListener("touchstart", startSwipe, { passive: true });
      pad.addEventListener("touchmove", moveSwipe, { passive: false });
      pad.addEventListener("touchend", finishSwipe, { passive: false });
      pad.addEventListener("touchcancel", cancelSwipe);
      pad.addEventListener("mousedown", startSwipe);
      pad.addEventListener("mousemove", moveSwipe);
      pad.addEventListener("mouseup", finishSwipe);
      pad.addEventListener("mouseleave", cancelSwipe);

      state.swipeCleanup = () => {
        pad.removeEventListener("touchstart", startSwipe);
        pad.removeEventListener("touchmove", moveSwipe);
        pad.removeEventListener("touchend", finishSwipe);
        pad.removeEventListener("touchcancel", cancelSwipe);
        pad.removeEventListener("mousedown", startSwipe);
        pad.removeEventListener("mousemove", moveSwipe);
        pad.removeEventListener("mouseup", finishSwipe);
        pad.removeEventListener("mouseleave", cancelSwipe);
      };
    },
    cleanup() {
      if (state.swipeCleanup) {
        state.swipeCleanup();
        state.swipeCleanup = null;
      }
    }
  },
  {
    id: "even-number",
    title: "Sadece çift sayılara dokun",
    render(area) {
      const evens = uniqueNumbers(2, 1, 25).map((number) => number * 2);
      const odds = uniqueNumbers(2, 0, 24).map((number) => number * 2 + 1);
      shuffle([...evens, ...odds]).forEach((number) => {
        area.appendChild(makeOption(number, number % 2 === 0));
      });
    }
  },
  {
    id: "not-blue",
    title: "Mavi olmayanı seç",
    render(area) {
      const blue = COLORS.find((color) => color.code === "blue");
      const others = COLORS.filter((color) => color.code !== "blue");
      const selected = shuffle([blue, ...shuffle(others).slice(0, 4)]);
      selected.forEach((color) => {
        const box = makeColorBox(color, color.code !== "blue");
        box.dataset.correct = String(color.code !== "blue");
        box.dataset.color = color.code;
        area.appendChild(box);
      });
    }
  },
  {
    id: "fastest-growing",
    title: "En hızlı büyüyen şekli yakala",
    render(area) {
      const answerIndex = randomInt(0, 3);
      for (let index = 0; index < 4; index += 1) {
        const shape = makeShape(pick(SHAPES).type, COLORS[index].value, index === answerIndex, "grower");
        shape.style.setProperty("--grow-speed", index === answerIndex ? "360ms" : `${randomInt(680, 900)}ms`);
        area.appendChild(shape);
      }
    }
  },
  {
    id: "match-shape",
    title: "",
    render(area) {
      const target = pick(SHAPES);
      shuffle(SHAPES).forEach((shape, index) => {
        area.appendChild(makeShape(shape.type, COLORS[index].value, shape.type === target.type));
      });
      return `${target.name} şeklini seç`;
    }
  },
  {
    id: "match-color",
    title: "",
    render(area) {
      const target = pick(COLORS);
      const selected = shuffle([target, ...shuffle(COLORS.filter((color) => color.code !== target.code)).slice(0, 3)]);
      selected.forEach((color, index) => {
        area.appendChild(makeShape(SHAPES[index % SHAPES.length].type, color.value, color.code === target.code));
      });
      return `${target.name} rengi seç`;
    }
  }
];

function showScreen(screenName) {
  Object.values(dom.screens).forEach((screen) => screen.classList.remove("active"));
  dom.screens[screenName].classList.add("active");
}

function loadSettings() {
  state.highScore = Number(localStorage.getItem(STORAGE_KEYS.highScore) || 0);
  state.soundEnabled = localStorage.getItem(STORAGE_KEYS.sound) !== "false";
  state.vibrationEnabled = localStorage.getItem(STORAGE_KEYS.vibration) !== "false";
  dom.soundToggle.checked = state.soundEnabled;
  dom.vibrationToggle.checked = state.vibrationEnabled;
  updateHighScoreViews();
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEYS.sound, String(state.soundEnabled));
  localStorage.setItem(STORAGE_KEYS.vibration, String(state.vibrationEnabled));
}

function updateHighScoreViews() {
  dom.highScoreEls.forEach((element) => {
    element.textContent = state.highScore;
  });
}

function getTimeLimit() {
  const steps = Math.floor(state.score / CONFIG.scorePerDifficultyIncrease);
  const time = CONFIG.initialTimeLimit - steps * CONFIG.difficultyStep;
  return Math.max(CONFIG.minTimeLimit, time);
}

function pickTask() {
  const available = tasks.filter((task) => !state.recentTasks.includes(task.id));
  const pool = available.length ? available : tasks;
  const task = pick(pool);
  state.recentTasks.push(task.id);
  while (state.recentTasks.length > CONFIG.maxRecentTasks) {
    state.recentTasks.shift();
  }
  return task;
}

function cleanupCurrentTask() {
  stopTimer();
  if (state.currentTask && typeof state.currentTask.cleanup === "function") {
    state.currentTask.cleanup();
  }
  state.currentTask = null;
  clearElement(dom.taskArea);
}

function startGame() {
  unlockAudio();
  playSound("start");
  vibrate(20);
  cleanupCurrentTask();
  state.score = 0;
  state.recentTasks = [];
  state.isPlaying = true;
  state.inputLocked = false;
  dom.score.textContent = "0";
  dom.recordLabel.classList.add("hidden");
  showScreen("game");
  nextTask();
}

function nextTask() {
  if (!state.isPlaying) return;
  cleanupCurrentTask();
  state.inputLocked = false;
  const task = pickTask();
  state.currentTask = task;
  dom.taskTitle.textContent = task.title;
  const dynamicTitle = task.render(dom.taskArea);
  if (dynamicTitle) dom.taskTitle.textContent = dynamicTitle;
  startTimer();
}

function handleOptionClick(event) {
  const option = event.target.closest("[data-correct]");
  if (!option || !dom.taskArea.contains(option)) return;
  checkAnswer(option.dataset.correct === "true");
}

function checkAnswer(isCorrect) {
  if (!state.isPlaying || state.inputLocked) return;
  state.inputLocked = true;
  stopTimer();

  if (isCorrect) {
    state.score += 1;
    dom.score.textContent = state.score;
    showFeedback("correct");
    playSound("correct");
    vibrate(30);
    window.setTimeout(nextTask, CONFIG.feedbackDuration);
    return;
  }

  showFeedback("wrong");
  playSound("wrong");
  vibrate([80, 40, 80]);
  dom.taskArea.classList.add("shake");
  window.setTimeout(() => endGame("wrong"), CONFIG.feedbackDuration);
}

function showFeedback(type) {
  dom.feedback.className = `feedback ${type}`;
  window.setTimeout(() => {
    dom.feedback.className = "feedback";
    dom.taskArea.classList.remove("shake");
  }, CONFIG.feedbackDuration);
}

function startTimer() {
  state.roundLimit = getTimeLimit();
  state.roundStartedAt = performance.now();
  updateTimerBar(1);

  const tick = () => {
    if (!state.isPlaying || state.inputLocked) return;
    const elapsed = performance.now() - state.roundStartedAt;
    const remainingRatio = Math.max(0, 1 - elapsed / state.roundLimit);
    updateTimerBar(remainingRatio);

    if (remainingRatio <= 0) {
      state.inputLocked = true;
      showFeedback("wrong");
      playSound("wrong");
      vibrate([80, 40, 80]);
      window.setTimeout(() => endGame("timeout"), CONFIG.feedbackDuration);
      return;
    }

    state.timerId = window.setTimeout(tick, CONFIG.timerFrameMs);
  };

  state.timerId = window.setTimeout(tick, CONFIG.timerFrameMs);
}

function stopTimer() {
  if (state.timerId) {
    window.clearTimeout(state.timerId);
    state.timerId = null;
  }
}

function updateTimerBar(ratio) {
  const percent = Math.max(0, Math.min(100, ratio * 100));
  dom.timerBar.style.width = `${percent}%`;
  dom.timerBar.classList.toggle("warning", percent <= 55 && percent > 28);
  dom.timerBar.classList.toggle("danger", percent <= 28);
}

function endGame() {
  if (!state.isPlaying) return;
  state.isPlaying = false;
  state.inputLocked = true;
  cleanupCurrentTask();

  const isRecord = state.score > state.highScore;
  if (isRecord) {
    state.highScore = state.score;
    localStorage.setItem(STORAGE_KEYS.highScore, String(state.highScore));
  }

  dom.finalScore.textContent = state.score;
  dom.recordLabel.classList.toggle("hidden", !isRecord);
  updateHighScoreViews();
  showScreen("gameOver");
}

function goMenu() {
  state.isPlaying = false;
  state.inputLocked = true;
  cleanupCurrentTask();
  updateHighScoreViews();
  showScreen("menu");
}

function unlockAudio() {
  if (!state.soundEnabled || state.audioContext) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) state.audioContext = new AudioContext();
  } catch (error) {
    state.audioContext = null;
  }
}

function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    unlockAudio();
    if (!state.audioContext) return;
    const now = state.audioContext.currentTime;
    const oscillator = state.audioContext.createOscillator();
    const gain = state.audioContext.createGain();
    const presets = {
      start: [330, 0.08, 0.08],
      correct: [620, 0.09, 0.09],
      wrong: [150, 0.12, 0.16]
    };
    const [frequency, volume, duration] = presets[type] || presets.correct;
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain);
    gain.connect(state.audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch (error) {
    state.audioContext = null;
  }
}

function vibrate(pattern) {
  if (!state.vibrationEnabled || !navigator.vibrate) return;
  try {
    navigator.vibrate(pattern);
  } catch (error) {
    // Unsupported browsers can ignore vibration.
  }
}

function initDom() {
  dom.screens = {
    menu: document.getElementById("menu-screen"),
    game: document.getElementById("game-screen"),
    howTo: document.getElementById("how-to-screen"),
    settings: document.getElementById("settings-screen"),
    gameOver: document.getElementById("game-over-screen")
  };
  dom.score = document.getElementById("score");
  dom.finalScore = document.getElementById("final-score");
  dom.taskTitle = document.getElementById("task-title");
  dom.taskArea = document.getElementById("task-area");
  dom.timerBar = document.getElementById("timer-bar");
  dom.feedback = document.getElementById("feedback");
  dom.recordLabel = document.getElementById("record-label");
  dom.soundToggle = document.getElementById("sound-toggle");
  dom.vibrationToggle = document.getElementById("vibration-toggle");
  dom.highScoreEls = document.querySelectorAll("[data-high-score]");
}

function bindEvents() {
  document.getElementById("start-btn").addEventListener("click", startGame);
  document.getElementById("retry-btn").addEventListener("click", startGame);
  document.getElementById("how-to-btn").addEventListener("click", () => showScreen("howTo"));
  document.getElementById("settings-btn").addEventListener("click", () => showScreen("settings"));
  document.getElementById("game-menu-btn").addEventListener("click", goMenu);
  document.querySelectorAll("[data-back-menu]").forEach((button) => {
    button.addEventListener("click", goMenu);
  });
  dom.taskArea.addEventListener("pointerup", handleOptionClick);

  dom.soundToggle.addEventListener("change", () => {
    state.soundEnabled = dom.soundToggle.checked;
    saveSettings();
  });

  dom.vibrationToggle.addEventListener("change", () => {
    state.vibrationEnabled = dom.vibrationToggle.checked;
    saveSettings();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDom();
  bindEvents();
  loadSettings();
  showScreen("menu");
});
