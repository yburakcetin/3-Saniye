const CONFIG = {
  initialTimeLimit: 3000,
  minTimeLimit: 1200,
  maxTimeLimit: 3200,
  difficultyStep: 400,
  scorePerDifficultyIncrease: 10,
  feedbackDuration: 250,
  maxRecentTasks: 2,
  timerFrameMs: 40,
  minimumSwipeDistance: 50,
  scorePopupDuration: 640,
  motivationDuration: 900
};

const LEVEL_CONFIG = [
  { level: 1, minScore: 0, maxScore: 9, timeLimit: 3000, weights: { easy: 85, medium: 15, hard: 0 } },
  { level: 2, minScore: 10, maxScore: 24, timeLimit: 2700, weights: { easy: 60, medium: 35, hard: 5 } },
  { level: 3, minScore: 25, maxScore: 44, timeLimit: 2400, weights: { easy: 40, medium: 45, hard: 15 } },
  { level: 4, minScore: 45, maxScore: 69, timeLimit: 2100, weights: { easy: 25, medium: 45, hard: 30 } },
  { level: 5, minScore: 70, maxScore: 99, timeLimit: 1800, weights: { easy: 15, medium: 40, hard: 45 } },
  { level: 6, minScore: 100, maxScore: Infinity, timeLimit: 1500, weights: { easy: 10, medium: 30, hard: 60 } }
];

const STORAGE_KEYS = {
  highScore: "threeSecondsHighScore",
  sound: "threeSecondsSoundEnabled",
  music: "threeSecondsMusicEnabled",
  vibration: "threeSecondsVibrationEnabled",
  language: "threeSecondsLanguage"
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
  musicEnabled: true,
  vibrationEnabled: true,
  audioContext: null,
  backgroundMusic: null,
  hasUserInteracted: false,
  swipeCleanup: null,
  currentCombo: 0,
  maxCombo: 0,
  currentLevel: 1,
  totalCorrectAnswers: 0,
  finalScore: 0,
  scorePopupTimer: null,
  motivationTimer: null,
  language: "tr"
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

const MISSPELLED_WORD_SETS = {
  tr: [
    { correct: "telefon", misspelled: "telofon", distractors: ["masa", "kalem", "ekran", "kitap", "okul"] },
    { correct: "kitap", misspelled: "kitpa", distractors: ["telefon", "defter", "kalem", "masa", "kapı"] },
    { correct: "bilgisayar", misspelled: "bilgisyayar", distractors: ["telefon", "ekran", "kalem", "masa", "kitap"] },
    { correct: "pencere", misspelled: "pencrae", distractors: ["kapı", "duvar", "bahçe", "masa", "okul"] },
    { correct: "güneş", misspelled: "güneşş", distractors: ["deniz", "bulut", "şehir", "çiçek", "dağ"] },
    { correct: "arkadaş", misspelled: "arkadaşş", distractors: ["oyun", "şehir", "okul", "kitap", "bahçe"] }
  ],
  en: [
    { correct: "computer", misspelled: "compter", distractors: ["phone", "screen", "mouse", "keyboard", "window"] },
    { correct: "keyboard", misspelled: "keybord", distractors: ["computer", "screen", "mouse", "phone", "table"] },
    { correct: "window", misspelled: "widnow", distractors: ["door", "garden", "school", "book", "screen"] },
    { correct: "flower", misspelled: "flwoer", distractors: ["sun", "cloud", "sea", "mountain", "garden"] },
    { correct: "friend", misspelled: "freind", distractors: ["game", "city", "school", "book", "phone"] },
    { correct: "pencil", misspelled: "pecnil", distractors: ["paper", "desk", "notebook", "screen", "window"] }
  ]
};

const DIRECTIONS = [
  { name: "sola", label: "<-", value: "left" },
  { name: "sağa", label: "->", value: "right" },
  { name: "yukarı", label: "^", value: "up" },
  { name: "aşağı", label: "v", value: "down" }
];

const OPPOSITE_DIRECTIONS = {
  left: "right",
  right: "left",
  up: "down",
  down: "up"
};

const ALPHABET_WORD_SETS = {
  tr: ["masa", "araba", "kalem", "zeytin", "defter", "limon", "bulut", "canta", "deniz", "ekran"],
  en: ["table", "apple", "pencil", "zebra", "cloud", "garden", "screen", "button", "lemon", "window"]
};

const COLOR_TONES = [
  { name: "cream", value: "#fff4c2", lightness: 95 },
  { name: "yellow", value: "#f8d84e", lightness: 78 },
  { name: "orange", value: "#e9802c", lightness: 56 },
  { name: "red", value: "#b73a3a", lightness: 42 },
  { name: "purple", value: "#6d3fa0", lightness: 34 },
  { name: "navy", value: "#1d3557", lightness: 24 }
];

const translations = {
  tr: {
    menuDescription: "Her görevi 3 saniye içinde tamamla.",
    gameTagline: "REFLEKS VE DİKKAT OYUNU",
    start: "Başla",
    howToPlay: "Nasıl Oynanır",
    settings: "Ayarlar",
    highScore: "En yüksek skor",
    score: "Skor",
    record: "Rekor",
    combo: "Combo",
    level: "Seviye",
    sound: "Ses",
    music: "Müzik",
    vibration: "Titreşim",
    language: "Dil",
    on: "Açık",
    off: "Kapalı",
    back: "Geri",
    gameOver: "Oyun Bitti",
    finalScore: "Final skor",
    maxCombo: "Maksimum combo",
    reachedLevel: "Ulaşılan seviye",
    newRecord: "Yeni Rekor!",
    retry: "Tekrar Dene",
    mainMenu: "Ana Menü",
    ruleRead: "Görevi oku.",
    ruleChoose: "Süre dolmadan doğru seçimi yap.",
    ruleScore: "Her doğru cevap combo durumuna göre puan kazandırır.",
    ruleEnd: "Yanlış cevap veya süre bitimi oyunu bitirir.",
    ruleSpeed: "Her 10 puanda oyun hızlanır.",
    colors: {
      red: "Kırmızı",
      blue: "Mavi",
      green: "Yeşil",
      yellow: "Sarı",
      purple: "Mor",
      orange: "Turuncu"
    },
    shapes: {
      circle: "Daire",
      square: "Kare",
      triangle: "Üçgen"
    },
    directions: {
      left: "sola",
      right: "sağa",
      up: "yukarı",
      down: "aşağı"
    },
    directionLabels: {
      left: "Sol",
      right: "Sağ",
      up: "Yukarı",
      down: "Aşağı"
    },
    motivation: {
      5: "Seri başladı!",
      10: "Çok iyi!",
      15: "Mükemmel!",
      20: "Durdurulamıyor!"
    },
    tasks: {
      avoidRed: "Kırmızıya dokunma",
      smallestNumber: "En küçük sayıyı seç",
      largestNumber: "En büyük sayıyı seç",
      misspelledWord: "Yanlış yazılmış kelimeyi bul",
      swipeLeft: "Ekranı sola kaydır",
      evenNumber: "Sadece çift sayılara dokun",
      notBlue: "Mavi olmayanı seç",
      fastestGrowing: "En hızlı büyüyen şekli yakala",
      matchShape: "{shape} şeklini seç",
      matchColor: "{color} rengi seç",
      oddNumber: "Tek sayıyı seç",
      missingNumber: "Eksik sayıyı bul: {sequence}",
      oddShapeOut: "Eşleşmeyen şekli seç",
      oddColorOut: "Eşleşmeyen rengi seç",
      catchBlinker: "Yanıp söneni yakala",
      wordColor: "Kelimenin rengini seç",
      dontTapNumber: "{number}'e dokunma",
      findOddNumberOut: "En farklı sayıyı bul",
      pickFirstAlphabetically: "Harf sırasına göre ilk olanı seç",
      pickLightestColor: "En açık rengi seç",
      pickDarkestColor: "En koyu rengi seç",
      swipeOppositeWay: "Ters yöne kaydır",
      directionSwipe: "{direction} kaydır"
    }
  },
  en: {
    menuDescription: "Complete every task within 3 seconds.",
    gameTagline: "REFLEX AND FOCUS GAME",
    start: "Start",
    howToPlay: "How to Play",
    settings: "Settings",
    highScore: "High score",
    score: "Score",
    record: "Record",
    combo: "Combo",
    level: "Level",
    sound: "Sound",
    music: "Music",
    vibration: "Vibration",
    language: "Language",
    on: "On",
    off: "Off",
    back: "Back",
    gameOver: "Game Over",
    finalScore: "Final score",
    maxCombo: "Max combo",
    reachedLevel: "Reached level",
    newRecord: "New Record!",
    retry: "Try Again",
    mainMenu: "Main Menu",
    ruleRead: "Read the task.",
    ruleChoose: "Choose correctly before time runs out.",
    ruleScore: "Each correct answer gives points based on your combo.",
    ruleEnd: "A wrong answer or timeout ends the game.",
    ruleSpeed: "The game speeds up every 10 points.",
    colors: {
      red: "Red",
      blue: "Blue",
      green: "Green",
      yellow: "Yellow",
      purple: "Purple",
      orange: "Orange"
    },
    shapes: {
      circle: "Circle",
      square: "Square",
      triangle: "Triangle"
    },
    directions: {
      left: "left",
      right: "right",
      up: "up",
      down: "down"
    },
    directionLabels: {
      left: "Left",
      right: "Right",
      up: "Up",
      down: "Down"
    },
    motivation: {
      5: "Combo started!",
      10: "Very good!",
      15: "Perfect!",
      20: "Unstoppable!"
    },
    tasks: {
      avoidRed: "Do not tap red",
      smallestNumber: "Choose the smallest number",
      largestNumber: "Choose the largest number",
      misspelledWord: "Find the misspelled word",
      swipeLeft: "Swipe left",
      evenNumber: "Tap only even numbers",
      notBlue: "Choose a non-blue option",
      fastestGrowing: "Catch the fastest growing shape",
      matchShape: "Choose the {shape}",
      matchColor: "Choose the {color} color",
      oddNumber: "Choose an odd number",
      missingNumber: "Find the missing number: {sequence}",
      oddShapeOut: "Choose the mismatched shape",
      oddColorOut: "Choose the mismatched color",
      catchBlinker: "Catch the blinking one",
      wordColor: "Choose the text color",
      dontTapNumber: "Don't tap {number}",
      findOddNumberOut: "Find the odd number out",
      pickFirstAlphabetically: "Pick the first alphabetically",
      pickLightestColor: "Pick the lightest color",
      pickDarkestColor: "Pick the darkest color",
      swipeOppositeWay: "Swipe the opposite way",
      directionSwipe: "Swipe {direction}"
    }
  }
};

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
  button.setAttribute("aria-label", getColorName(color.code));
  return button;
}

function makeToneBox(tone, isCorrect) {
  const button = makeOption("", isCorrect, "color-box tone-box");
  button.style.background = tone.value;
  button.dataset.tone = tone.name;
  button.setAttribute("aria-label", tone.name);
  return button;
}

function makeShape(type, color, isCorrect, extraClass = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `shape ${type} ${extraClass}`.trim();
  button.dataset.correct = String(isCorrect);
  button.dataset.shape = type;
  button.setAttribute("aria-label", getShapeName(type));

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

function translate(key, params = {}) {
  const value = translations[state.language]?.[key] ?? translations.tr[key] ?? key;
  return String(value).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
}

function translateTask(key, params = {}) {
  const value = translations[state.language]?.tasks?.[key] ?? translations.tr.tasks[key] ?? key;
  return String(value).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
}

function getColorName(code) {
  return translations[state.language]?.colors?.[code] ?? translations.tr.colors[code] ?? code;
}

function getShapeName(type) {
  return translations[state.language]?.shapes?.[type] ?? translations.tr.shapes[type] ?? type;
}

function getDirectionName(value) {
  return translations[state.language]?.directions?.[value] ?? translations.tr.directions[value] ?? value;
}

function getDirectionLabel(value) {
  return translations[state.language]?.directionLabels?.[value] ?? translations.tr.directionLabels[value] ?? value;
}

function getSwipeDirection(diffX, diffY) {
  const absX = Math.abs(diffX);
  const absY = Math.abs(diffY);
  if (absX < CONFIG.minimumSwipeDistance && absY < CONFIG.minimumSwipeDistance) return null;
  if (absX > absY * 1.3) return diffX < 0 ? "left" : "right";
  if (absY > absX * 1.3) return diffY < 0 ? "up" : "down";
  return null;
}

function renderSwipePad(area, label, expectedDirection) {
  const pad = document.createElement("div");
  pad.className = "swipe-pad";
  pad.innerHTML = `<span>${label}</span>`;
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

    const point = getPoint(event);
    const direction = getSwipeDirection(point.x - startX, point.y - startY);
    if (!direction) return;

    processed = true;
    checkAnswer(direction === expectedDirection);
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
}

const tasks = [
  {
    id: "avoid-red",
    difficulty: "easy",
    titleKey: "avoidRed",
    title: "Kırmızıya dokunma",
    render(area) {
      const safeColors = COLORS.filter((color) => color.code !== "red");
      const selected = shuffle([COLORS[0], ...shuffle(safeColors).slice(0, 4)]);
      selected.forEach((color) => area.appendChild(makeColorBox(color, color.code !== "red")));
    }
  },
  {
    id: "smallest-number",
    difficulty: "easy",
    titleKey: "smallestNumber",
    title: "En küçük sayıyı seç",
    render(area) {
      const numbers = uniqueNumbers(randomInt(3, 4), 1, 99);
      const answer = Math.min(...numbers);
      shuffle(numbers).forEach((number) => area.appendChild(makeOption(number, number === answer)));
    }
  },
  {
    id: "largest-number",
    difficulty: "easy",
    titleKey: "largestNumber",
    title: "En büyük sayıyı seç",
    render(area) {
      const numbers = uniqueNumbers(randomInt(3, 4), 1, 99);
      const answer = Math.max(...numbers);
      shuffle(numbers).forEach((number) => area.appendChild(makeOption(number, number === answer)));
    }
  },
  {
    id: "misspelled-word",
    difficulty: "medium",
    titleKey: "misspelledWord",
    title: "Yanlış yazılmış kelimeyi bul",
    render(area) {
      const wordSets = MISSPELLED_WORD_SETS[state.language] || MISSPELLED_WORD_SETS.tr;
      const set = pick(wordSets);
      const words = shuffle([
        { text: set.misspelled, correct: true },
        ...shuffle(set.distractors).slice(0, 3).map((word) => ({ text: word, correct: false }))
      ]);
      words.forEach((word) => area.appendChild(makeOption(word.text, word.correct, "word-option")));
    }
  },
  {
    id: "swipe-left",
    difficulty: "medium",
    titleKey: "swipeLeft",
    title: "Ekranı sola kaydır",
    render(area) {
      const pad = document.createElement("div");
      pad.className = "swipe-pad";
      pad.innerHTML = `<span><- ${translateTask("swipeLeft")}</span>`;
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
    difficulty: "easy",
    titleKey: "evenNumber",
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
    difficulty: "easy",
    titleKey: "notBlue",
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
    difficulty: "hard",
    titleKey: "fastestGrowing",
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
    difficulty: "easy",
    titleKey: "matchShape",
    title: "",
    render(area) {
      const target = pick(SHAPES);
      shuffle(SHAPES).forEach((shape, index) => {
        area.appendChild(makeShape(shape.type, COLORS[index].value, shape.type === target.type));
      });
      return translateTask("matchShape", { shape: getShapeName(target.type) });
    }
  },
  {
    id: "match-color",
    difficulty: "medium",
    titleKey: "matchColor",
    title: "",
    render(area) {
      const target = pick(COLORS);
      const selected = shuffle([target, ...shuffle(COLORS.filter((color) => color.code !== target.code)).slice(0, 3)]);
      selected.forEach((color, index) => {
        area.appendChild(makeShape(SHAPES[index % SHAPES.length].type, color.value, color.code === target.code));
      });
      return translateTask("matchColor", { color: getColorName(target.code) });
    }
  },
  {
    id: "odd-number",
    difficulty: "easy",
    titleKey: "oddNumber",
    title: "Tek sayıyı seç",
    render(area) {
      const odds = uniqueNumbers(2, 0, 24).map((number) => number * 2 + 1);
      const evens = uniqueNumbers(2, 1, 25).map((number) => number * 2);
      shuffle([...odds, ...evens]).forEach((number) => {
        area.appendChild(makeOption(number, number % 2 === 1));
      });
    }
  },
  {
    id: "dont-tap-number",
    difficulty: "easy",
    titleKey: "dontTapNumber",
    title: "",
    render(area) {
      const numbers = uniqueNumbers(4, 1, 9);
      const forbidden = pick(numbers);
      shuffle(numbers).forEach((number) => {
        area.appendChild(makeOption(number, number !== forbidden));
      });
      return translateTask("dontTapNumber", { number: forbidden });
    }
  },
  {
    id: "missing-number",
    difficulty: "medium",
    titleKey: "missingNumber",
    title: "",
    render(area) {
      const start = randomInt(1, 5);
      const step = randomInt(2, 4);
      const missingIndex = randomInt(1, 2);
      const sequence = [0, 1, 2, 3].map((index) => start + index * step);
      const answer = sequence[missingIndex];
      const label = sequence.map((number, index) => (index === missingIndex ? "?" : number)).join(", ");
      const options = shuffle([answer, answer - step, answer + step, answer + step * 2]);

      options.forEach((number) => {
        area.appendChild(makeOption(number, number === answer));
      });

      return translateTask("missingNumber", { sequence: label });
    }
  },
  {
    id: "odd-number-out",
    difficulty: "medium",
    titleKey: "findOddNumberOut",
    title: "En farklı sayıyı bul",
    render(area) {
      const useParity = Math.random() < 0.5;
      let numbers;
      let answer;

      if (useParity) {
        const evens = uniqueNumbers(3, 3, 16).map((number) => number * 2);
        answer = randomInt(3, 19) * 2 + 1;
        numbers = [...evens, answer];
      } else {
        const multiples = uniqueNumbers(3, 1, 9).map((number) => number * 5);
        do {
          answer = randomInt(6, 49);
        } while (answer % 5 === 0);
        numbers = [...multiples, answer];
      }

      shuffle(numbers).forEach((number) => {
        area.appendChild(makeOption(number, number === answer));
      });
    }
  },
  {
    id: "first-alphabetically",
    difficulty: "medium",
    titleKey: "pickFirstAlphabetically",
    title: "Harf sırasına göre ilk olanı seç",
    timeModifier: 1.08,
    render(area) {
      const locale = state.language === "tr" ? "tr" : "en";
      const words = shuffle(ALPHABET_WORD_SETS[state.language] || ALPHABET_WORD_SETS.en).slice(0, 4);
      const answer = [...words].sort((a, b) => a.localeCompare(b, locale))[0];
      shuffle(words).forEach((word) => {
        area.appendChild(makeOption(word, word === answer, "word-option"));
      });
    }
  },
  {
    id: "odd-shape-out",
    difficulty: "medium",
    titleKey: "oddShapeOut",
    title: "Eşleşmeyen şekli seç",
    render(area) {
      const common = pick(SHAPES);
      const different = pick(SHAPES.filter((shape) => shape.type !== common.type));
      const items = shuffle([
        { shape: common, correct: false },
        { shape: common, correct: false },
        { shape: common, correct: false },
        { shape: different, correct: true }
      ]);

      items.forEach((item, index) => {
        area.appendChild(makeShape(item.shape.type, COLORS[index].value, item.correct));
      });
    }
  },
  {
    id: "odd-color-out",
    difficulty: "easy",
    titleKey: "oddColorOut",
    title: "Eşleşmeyen rengi seç",
    render(area) {
      const common = pick(COLORS);
      const different = pick(COLORS.filter((color) => color.code !== common.code));
      const items = shuffle([common, common, common, different]);

      items.forEach((color) => {
        area.appendChild(makeColorBox(color, color.code === different.code));
      });
    }
  },
  {
    id: "lightest-color",
    difficulty: "medium",
    titleKey: "pickLightestColor",
    title: "En açık rengi seç",
    render(area) {
      const tones = shuffle(COLOR_TONES).slice(0, 4);
      const answer = tones.reduce((lightest, tone) => (tone.lightness > lightest.lightness ? tone : lightest), tones[0]);
      shuffle(tones).forEach((tone) => {
        area.appendChild(makeToneBox(tone, tone === answer));
      });
    }
  },
  {
    id: "darkest-color",
    difficulty: "medium",
    titleKey: "pickDarkestColor",
    title: "En koyu rengi seç",
    render(area) {
      const tones = shuffle(COLOR_TONES).slice(0, 4);
      const answer = tones.reduce((darkest, tone) => (tone.lightness < darkest.lightness ? tone : darkest), tones[0]);
      shuffle(tones).forEach((tone) => {
        area.appendChild(makeToneBox(tone, tone === answer));
      });
    }
  },
  {
    id: "catch-blinker",
    difficulty: "hard",
    titleKey: "catchBlinker",
    title: "Yanıp söneni yakala",
    render(area) {
      const answerIndex = randomInt(0, 3);
      for (let index = 0; index < 4; index += 1) {
        const box = makeColorBox(COLORS[index + 1], index === answerIndex);
        if (index === answerIndex) box.classList.add("blink-target");
        area.appendChild(box);
      }
    }
  },
  {
    id: "word-color",
    difficulty: "hard",
    titleKey: "wordColor",
    title: "Kelimenin rengini seç",
    render(area) {
      const wordColor = pick(COLORS);
      const textColor = pick(COLORS.filter((color) => color.code !== wordColor.code));
      const word = document.createElement("div");
      word.className = "color-word";
      word.textContent = getColorName(wordColor.code).toUpperCase();
      word.style.color = textColor.value;
      area.appendChild(word);

      const options = shuffle([textColor, ...shuffle(COLORS.filter((color) => color.code !== textColor.code)).slice(0, 3)]);
      options.forEach((color) => {
        area.appendChild(makeColorBox(color, color.code === textColor.code));
      });
    }
  },
  {
    id: "opposite-swipe",
    difficulty: "hard",
    titleKey: "swipeOppositeWay",
    title: "Ters yöne kaydır",
    timeModifier: 1.05,
    render(area) {
      const direction = pick(DIRECTIONS);
      const expectedDirection = OPPOSITE_DIRECTIONS[direction.value];
      renderSwipePad(area, `${direction.label} ${getDirectionLabel(direction.value)}`, expectedDirection);
      return translateTask("swipeOppositeWay");
    },
    cleanup() {
      if (state.swipeCleanup) {
        state.swipeCleanup();
        state.swipeCleanup = null;
      }
    }
  },
  {
    id: "direction-swipe",
    difficulty: "hard",
    titleKey: "directionSwipe",
    title: "",
    render(area) {
      const direction = pick(DIRECTIONS);
      renderSwipePad(area, `${direction.label} ${translateTask("directionSwipe", { direction: getDirectionName(direction.value) })}`, direction.value);
      return translateTask("directionSwipe", { direction: getDirectionName(direction.value) });
    },
    cleanup() {
      if (state.swipeCleanup) {
        state.swipeCleanup();
        state.swipeCleanup = null;
      }
    }
  }
];

function showScreen(screenName) {
  Object.values(dom.screens).forEach((screen) => screen.classList.remove("active"));
  dom.screens[screenName].classList.add("active");
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });

  dom.soundStatus.textContent = translate(state.soundEnabled ? "on" : "off");
  dom.musicStatus.textContent = translate(state.musicEnabled ? "on" : "off");
  dom.vibrationStatus.textContent = translate(state.vibrationEnabled ? "on" : "off");
  dom.languageSelect.value = state.language;

  if (state.currentTask && state.isPlaying) {
    dom.taskTitle.textContent = state.currentTask.dynamicTitle || translateTask(state.currentTask.titleKey);
  }
}

function getInitialLanguage() {
  const savedLanguage = localStorage.getItem(STORAGE_KEYS.language);
  if (savedLanguage === "tr" || savedLanguage === "en") {
    return savedLanguage;
  }

  const browserLanguages = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || "en"];
  const isTurkish = browserLanguages.some((language) =>
    String(language).toLowerCase().startsWith("tr")
  );

  return isTurkish ? "tr" : "en";
}

function loadSettings() {
  state.highScore = Number(localStorage.getItem(STORAGE_KEYS.highScore) || 0);
  state.soundEnabled = localStorage.getItem(STORAGE_KEYS.sound) !== "false";
  state.musicEnabled = localStorage.getItem(STORAGE_KEYS.music) !== "false";
  state.vibrationEnabled = localStorage.getItem(STORAGE_KEYS.vibration) !== "false";
  state.language = getInitialLanguage();
  dom.soundToggle.checked = state.soundEnabled;
  dom.musicToggle.checked = state.musicEnabled;
  dom.vibrationToggle.checked = state.vibrationEnabled;
  dom.languageSelect.value = state.language;
  applyTranslations();
  updateHighScoreViews();
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEYS.sound, String(state.soundEnabled));
  localStorage.setItem(STORAGE_KEYS.music, String(state.musicEnabled));
  localStorage.setItem(STORAGE_KEYS.vibration, String(state.vibrationEnabled));
  localStorage.setItem(STORAGE_KEYS.language, state.language);
}

function updateHighScoreViews() {
  dom.highScoreEls.forEach((element) => {
    element.textContent = state.highScore;
  });
}

function getLevelConfig(score = state.score) {
  return LEVEL_CONFIG.find((level) => score >= level.minScore && score <= level.maxScore) || LEVEL_CONFIG[0];
}

function getTimeLimit(task = state.currentTask) {
  const level = getLevelConfig(state.score);
  const modifier = task?.timeModifier || 1;
  const time = level.timeLimit * modifier;
  return Math.max(CONFIG.minTimeLimit, Math.min(CONFIG.maxTimeLimit, time));
}

function calculateScoreGain(combo) {
  if (combo >= 15) return 4;
  if (combo >= 10) return 3;
  if (combo >= 5) return 2;
  return 1;
}

function getLevel(score) {
  return getLevelConfig(score).level;
}

function resetSessionStats() {
  state.score = 0;
  state.currentCombo = 0;
  state.maxCombo = 0;
  state.currentLevel = 1;
  state.totalCorrectAnswers = 0;
  state.finalScore = 0;
}

function updateGameStats() {
  state.currentLevel = getLevel(state.score);
  dom.score.textContent = state.score;
  dom.combo.textContent = `x${state.currentCombo}`;
  dom.level.textContent = state.currentLevel;
}

function showScoreGain(gain) {
  if (state.scorePopupTimer) {
    window.clearTimeout(state.scorePopupTimer);
  }

  dom.scorePopup.textContent = `+${gain}`;
  dom.scorePopup.classList.remove("hidden", "show");
  void dom.scorePopup.offsetWidth;
  dom.scorePopup.classList.add("show");

  state.scorePopupTimer = window.setTimeout(() => {
    dom.scorePopup.classList.add("hidden");
    dom.scorePopup.classList.remove("show");
  }, CONFIG.scorePopupDuration);
}

function showMotivation(combo) {
  const message = translations[state.language]?.motivation?.[combo];
  if (!message) return;

  if (state.motivationTimer) {
    window.clearTimeout(state.motivationTimer);
  }

  dom.motivationMessage.textContent = message;
  dom.motivationMessage.classList.remove("hidden");
  void dom.motivationMessage.offsetWidth;
  dom.motivationMessage.classList.add("show");

  state.motivationTimer = window.setTimeout(() => {
    dom.motivationMessage.classList.remove("show");
    dom.motivationMessage.classList.add("hidden");
  }, CONFIG.motivationDuration);
}

function getDifficultyWeights() {
  return getLevelConfig(state.score).weights;
}

function pickWeightedDifficulty() {
  const weights = getDifficultyWeights();
  const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  let roll = randomInt(1, total);

  for (const [difficulty, weight] of Object.entries(weights)) {
    roll -= weight;
    if (roll <= 0) {
      return difficulty;
    }
  }

  return "easy";
}

function pickTask() {
  const available = tasks.filter((task) => !state.recentTasks.includes(task.id));
  const pool = available.length ? available : tasks;
  const difficulty = pickWeightedDifficulty();
  const difficultyPool = pool.filter((task) => task.difficulty === difficulty);
  const task = pick(difficultyPool.length ? difficultyPool : pool);
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
  state.hasUserInteracted = true;
  unlockAudio();
  updateBackgroundMusicState();
  playSound("start");
  vibrate(20);
  cleanupCurrentTask();
  resetSessionStats();
  if (state.scorePopupTimer) window.clearTimeout(state.scorePopupTimer);
  if (state.motivationTimer) window.clearTimeout(state.motivationTimer);
  state.scorePopupTimer = null;
  state.motivationTimer = null;
  state.recentTasks = [];
  state.isPlaying = true;
  state.inputLocked = false;
  dom.recordLabel.classList.add("hidden");
  dom.scorePopup.classList.add("hidden");
  dom.scorePopup.classList.remove("show");
  dom.motivationMessage.classList.add("hidden");
  dom.motivationMessage.classList.remove("show");
  updateGameStats();
  showScreen("game");
  nextTask();
}

function nextTask() {
  if (!state.isPlaying) return;
  cleanupCurrentTask();
  state.inputLocked = false;
  const task = pickTask();
  state.currentTask = task;
  task.dynamicTitle = "";
  dom.taskTitle.textContent = translateTask(task.titleKey);
  const dynamicTitle = task.render(dom.taskArea);
  if (dynamicTitle) {
    task.dynamicTitle = dynamicTitle;
    dom.taskTitle.textContent = dynamicTitle;
  }
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
    state.currentCombo += 1;
    state.maxCombo = Math.max(state.maxCombo, state.currentCombo);
    state.totalCorrectAnswers += 1;
    const gain = calculateScoreGain(state.currentCombo);
    state.score += gain;
    updateGameStats();
    showScoreGain(gain);
    showMotivation(state.currentCombo);
    showFeedback("correct");
    playSound("correct");
    vibrate(30);
    window.setTimeout(nextTask, CONFIG.feedbackDuration);
    return;
  }

  state.currentCombo = 0;
  updateGameStats();
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
      state.currentCombo = 0;
      updateGameStats();
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
  state.finalScore = state.score;
  state.currentLevel = getLevel(state.finalScore);

  const isRecord = state.score > state.highScore;
  if (isRecord) {
    state.highScore = state.score;
    localStorage.setItem(STORAGE_KEYS.highScore, String(state.highScore));
  }

  dom.finalScore.textContent = state.finalScore;
  dom.finalMaxCombo.textContent = `x${state.maxCombo}`;
  dom.finalLevel.textContent = state.currentLevel;
  dom.recordLabel.classList.toggle("hidden", !isRecord);
  updateHighScoreViews();
  showScreen("gameOver");
}

function goMenu() {
  state.isPlaying = false;
  state.inputLocked = true;
  cleanupCurrentTask();
  state.currentCombo = 0;
  updateGameStats();
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

function initBackgroundMusic() {
  if (state.backgroundMusic) return;
  try {
    state.backgroundMusic = new Audio("assets/audio/Coin_Slot_Dreams.mp3");
    state.backgroundMusic.loop = true;
    state.backgroundMusic.volume = 0.25;
    state.backgroundMusic.preload = "auto";
  } catch (error) {
    state.backgroundMusic = null;
  }
}

function playBackgroundMusic() {
  if (!state.musicEnabled || !state.hasUserInteracted) return;
  initBackgroundMusic();
  if (!state.backgroundMusic) return;

  const playPromise = state.backgroundMusic.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {});
  }
}

function pauseBackgroundMusic() {
  if (!state.backgroundMusic) return;
  try {
    state.backgroundMusic.pause();
  } catch (error) {
    // Audio pause failures should not affect the game.
  }
}

function updateBackgroundMusicState() {
  if (state.musicEnabled) {
    playBackgroundMusic();
    return;
  }

  pauseBackgroundMusic();
}

function toggleMusicSetting(isEnabled) {
  state.musicEnabled = isEnabled;
  state.hasUserInteracted = true;
  saveSettings();
  applyTranslations();
  updateBackgroundMusicState();
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
  dom.combo = document.getElementById("combo");
  dom.level = document.getElementById("level");
  dom.finalScore = document.getElementById("final-score");
  dom.finalMaxCombo = document.getElementById("final-max-combo");
  dom.finalLevel = document.getElementById("final-level");
  dom.taskTitle = document.getElementById("task-title");
  dom.taskArea = document.getElementById("task-area");
  dom.timerBar = document.getElementById("timer-bar");
  dom.feedback = document.getElementById("feedback");
  dom.scorePopup = document.getElementById("score-popup");
  dom.motivationMessage = document.getElementById("motivation-message");
  dom.recordLabel = document.getElementById("record-label");
  dom.soundToggle = document.getElementById("sound-toggle");
  dom.musicToggle = document.getElementById("music-toggle");
  dom.vibrationToggle = document.getElementById("vibration-toggle");
  dom.soundStatus = document.getElementById("sound-status");
  dom.musicStatus = document.getElementById("music-status");
  dom.vibrationStatus = document.getElementById("vibration-status");
  dom.languageSelect = document.getElementById("language-select");
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
    applyTranslations();
  });

  dom.musicToggle.addEventListener("change", () => {
    toggleMusicSetting(dom.musicToggle.checked);
  });

  dom.vibrationToggle.addEventListener("change", () => {
    state.vibrationEnabled = dom.vibrationToggle.checked;
    saveSettings();
    applyTranslations();
  });

  dom.languageSelect.addEventListener("change", () => {
    state.language = translations[dom.languageSelect.value] ? dom.languageSelect.value : "tr";
    saveSettings();
    applyTranslations();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDom();
  initBackgroundMusic();
  bindEvents();
  loadSettings();
  updateGameStats();
  showScreen("menu");
});
