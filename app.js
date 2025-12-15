// --- 1. 變數設定與上半部字典 ---
const display = document.getElementById("display-word");
const ipaDisplay = document.getElementById("display-ipa");
const sentEnDisplay = document.getElementById("display-sentence");
const sentZnDisplay = document.getElementById("display-sent-zn");
const keyboard = document.getElementById("keyboard");
const msg = document.getElementById("message");
const livesDisplay = document.querySelector(".lives");
const scoreDisplay = document.getElementById("score-val");

let currentWord = "";
let gameActive = false;
let targetWord = "";
let currentLevel = 1;
let score = 0;
let lives = 3;
let maxLevelUnlocked = 1;

// 進入 App
window.enterApp = function() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("main-app").style.display = "block";
  speak("", 1.0);
}

// 字典上半部 (A - M)
const dictPart1 = {
  // 3字母
  "cat": { ipa: "[kæt]", sent: "Cute cat.", zn: "可愛的貓。" },
  "dog": { ipa: "[dɔg]", sent: "Good dog.", zn: "好狗。" },
  "ant": { ipa: "[ænt]", sent: "Small ant.", zn: "小螞蟻。" },
  "bus": { ipa: "[bʌs]", sent: "Big bus.", zn: "大公車。" },
  "car": { ipa: "[kɑr]", sent: "Fast car.", zn: "快車。" },
  "dad": { ipa: "[dæd]", sent: "My dad.", zn: "我爸爸。" },
  "mom": { ipa: "[mɑm]", sent: "Hi mom.", zn: "嗨媽媽。" },
  "pig": { ipa: "[pɪg]", sent: "Pink pig.", zn: "粉紅豬。" },
  "pen": { ipa: "[pɛn]", sent: "Blue pen.", zn: "藍筆。" },
  "red": { ipa: "[rɛd]", sent: "Red color.", zn: "紅色。" },
  "run": { ipa: "[rʌn]", sent: "Run fast.", zn: "跑快點。" },
  "sun": { ipa: "[sʌn]", sent: "Hot sun.", zn: "烈日。" },
  "ten": { ipa: "[tɛn]", sent: "Number ten.", zn: "數字十。" },
  "zoo": { ipa: "[zu]", sent: "Go to zoo.", zn: "去動物園。" },

  // 4字母
  "book": { ipa: "[bʊk]", sent: "Read a book.", zn: "讀書。" },
  "bird": { ipa: "[bɝd]", sent: "Flying bird.", zn: "飛鳥。" },
  "ball": { ipa: "[bɔl]", sent: "Kick ball.", zn: "踢球。" },
  "duck": { ipa: "[dʌk]", sent: "Yellow duck.", zn: "黃色小鴨。" },
  "fish": { ipa: "[fɪʃ]", sent: "Fish swim.", zn: "魚游泳。" },
  "frog": { ipa: "[frɑg]", sent: "Jump frog.", zn: "跳跳蛙。" },
  "goat": { ipa: "[got]", sent: "A goat.", zn: "一隻山羊。" },
  "good": { ipa: "[gʊd]", sent: "Good job.", zn: "做得好。" },
  "home": { ipa: "[hom]", sent: "Go home.", zn: "回家。" },
  "kite": { ipa: "[kaɪt]", sent: "Fly a kite.", zn: "放風箏。" },
  "lion": { ipa: "[ˈlaɪən]", sent: "Big lion.", zn: "大獅子。" },
  "love": { ipa: "[lʌv]", sent: "I love you.", zn: "我愛你。" },
  "milk": { ipa: "[mɪlk]", sent: "Drink milk.", zn: "喝牛奶。" },
  "moon": { ipa: "[mun]", sent: "Full moon.", zn: "滿月。" },
  "nose": { ipa: "[noz]", sent: "My nose.", zn: "我的鼻子。" },
  
  // 5+字母 (部分)
  "apple": { ipa: "[ˋæpl]", sent: "Red apple.", zn: "紅蘋果。" },
  "happy": { ipa: "[ˋhæpɪ]", sent: "I am happy.", zn: "很開心。" },
  "house": { ipa: "[haʊs]", sent: "Big house.", zn: "大房子。" },
  "mouse": { ipa: "[maʊs]", sent: "Small mouse.", zn: "小老鼠。" }
};
// --- 2. 下半部字典 (N - Z) 與 遊戲邏輯 ---
const dictPart2 = {
  "nurse": { ipa: "[nɝs]", sent: "A nurse.", zn: "護士。" },
  "orange": { ipa: "[ˋɔrɪndʒ]", sent: "Sweet orange.", zn: "甜柳橙。" },
  "panda": { ipa: "[ˋpændə]", sent: "Cute panda.", zn: "可愛貓熊。" },
  "queen": { ipa: "[kwin]", sent: "The queen.", zn: "女王。" },
  "rabbit": { ipa: "[ˋræbɪt]", sent: "Cute rabbit.", zn: "可愛兔子。" },
  "school": { ipa: "[skul]", sent: "Go to school.", zn: "去學校。" },
  "tiger": { ipa: "[ˋtaɪgɚ]", sent: "Scary tiger.", zn: "可怕老虎。" },
  "water": { ipa: "[ˈwɔtɚ]", sent: "Drink water.", zn: "喝水。" },
  "watch": { ipa: "[wɑtʃ]", sent: "My watch.", zn: "手錶。" },
  "zebra": { ipa: "[ˈzibrə]", sent: "A zebra.", zn: "斑馬。" },

  // 句子
  "i love you": { ipa: "[aɪ lʌv ju]", sent: "I love you very much.", zn: "我非常愛你。" },
  "thank you": { ipa: "[θæŋk ju]", sent: "You are welcome.", zn: "不客氣。" },
  "how are you": { ipa: "[haʊ ɑr ju]", sent: "I am fine.", zn: "你好嗎？" },
  "good morning": { ipa: "[gʊd ˈmɔrnɪŋ]", sent: "Have a nice day.", zn: "早安。" }
};

// 合併字典
const dictionary = Object.assign({}, dictPart1, dictPart2);

// 初始化
loadProgress();
updateLevelButtons();

// --- 功能函數 ---

window.startGame = function(level) {
  currentLevel = level;
  score = 0;
  lives = 3;
  gameActive = true;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("main-app").style.display = "block";
  document.getElementById("win-screen").style.display = "none";
  document.querySelector(".btn-submit").style.display = "block";
  updateStats();
  nextQuestion();
  speak("Level " + level + ", Start!", 1.0);
}

window.enterFreeMode = function() {
  gameActive = false;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("main-app").style.display = "block";
  document.querySelector(".btn-submit").style.display = "none";
  msg.innerText = "自由拼字模式";
  currentWord = "";
  updateScreen();
}

window.goHome = function() {
  document.getElementById("start-screen").style.display = "flex";
  document.getElementById("main-app").style.display = "none";
  document.getElementById("win-screen").style.display = "none";
  updateLevelButtons();
}

function nextQuestion() {
  currentWord = "";
  updateScreen();
  let pool = [];
  const keys = Object.keys(dictionary);
  
  if (currentLevel === 1) pool = keys.filter(k => k.length <= 3 && !k.includes(" "));
  else if (currentLevel === 2) pool = keys.filter(k => k.length === 4);
  else if (currentLevel === 3) pool = keys.filter(k => k.length >= 5 && !k.includes(" "));
  else if (currentLevel === 4) pool = keys.filter(k => k.includes(" "));
  else pool = keys;
  
  targetWord = pool[Math.floor(Math.random() * pool.length)];
  msg.innerText = "請聽音拼字...";
  msg.style.color = "#333";
  setTimeout(() => speak("Spell... " + targetWord), 500);
}

window.checkAnswer = function() {
  if (!gameActive) return;
  const input = currentWord.toLowerCase().trim();
  if (input === targetWord) {
    score += 100;
    msg.innerText = "答對了！🎉";
    msg.style.color = "green";
    const entry = dictionary[targetWord];
    if (entry) {
      if(sentEnDisplay) sentEnDisplay.innerText = entry.sent;
      if(sentZnDisplay) sentZnDisplay.innerText = entry.zn;
      speak("Correct! " + targetWord + ". " + entry.sent);
    }
    updateStats();
    if (score >= 500) setTimeout(levelCleared, 2000);
    else setTimeout(nextQuestion, 2000);
  } else {
    lives--;
    updateStats();
    msg.innerText = "錯了，再試一次！";
    msg.style.color = "red";
    speak("Try again.");
    if (lives <= 0) {
      msg.innerText = "Game Over 💀";
      speak("Game Over");
      setTimeout(goHome, 2000);
    }
  }
}

function levelCleared() {
  if (currentLevel >= maxLevelUnlocked && currentLevel < 5) {
    maxLevelUnlocked = currentLevel + 1;
    saveProgress();
  }
  document.getElementById("win-screen").style.display = "flex";
  speak("Level Cleared!");
}

// 產生鍵盤
const letters = "abcdefghijklmnopqrstuvwxyz".split("");
keyboard.innerHTML = "";
letters.forEach(char => {
  const btn = document.createElement("div");
  btn.className = "key";
  btn.innerText = char.toUpperCase();
  btn.onclick = () => { addLetter(char); speak(char, 1.5); };
  keyboard.appendChild(btn);
});
const spaceBtn = document.createElement("div");
spaceBtn.className = "key key-space";
spaceBtn.innerText = "␣ Space";
spaceBtn.onclick = () => { addLetter(" "); speak("Space", 1.5); };
keyboard.appendChild(spaceBtn);
const backBtn = document.createElement("div");
backBtn.className = "key key-del";
backBtn.innerText = "⌫";
backBtn.onclick = () => { if(currentWord.length>0) { currentWord=currentWord.slice(0,-1); updateScreen(); }};
keyboard.appendChild(backBtn);

function addLetter(char) {
  if (currentWord.length < 25) { currentWord += char; updateScreen(); }
}

function updateScreen() {
  if (display) display.innerText = currentWord === "" ? "_" : currentWord;
  if (!gameActive) {
    const lower = currentWord.toLowerCase().trim();
    const entry = dictionary[lower];
    if (entry) {
       ipaDisplay.innerText = entry.ipa;
       sentEnDisplay.innerText = entry.sent;
       sentZnDisplay.innerText = entry.zn;
    } else {
       ipaDisplay.innerText = "";
       sentEnDisplay.innerText = "";
       sentZnDisplay.innerText = "";
    }
  } else {
     ipaDisplay.innerText = ""; sentEnDisplay.innerText = ""; sentZnDisplay.innerText = "";
  }
}

function updateStats() {
  document.getElementById("score-val").innerText = score;
  let hearts = ""; for(let i=0; i<lives; i++) hearts += "❤️";
  livesDisplay.innerText = hearts;
}

window.clearWord = function() { currentWord = ""; updateScreen(); }
window.speakWord = function() {
  if (gameActive) speak("Spell... " + targetWord);
  else {
    const lower = currentWord.toLowerCase().trim();
    const entry = dictionary[lower];
    if (entry) speak(currentWord + ". " + entry.sent);
    else speak(currentWord);
  }
}

function speak(text, rate) {
  window.speechSynthesis.cancel();
  const m = new SpeechSynthesisUtterance(text);
  m.lang = "en-US";
  m.rate = rate || 1.0;
  window.speechSynthesis.speak(m);
}

function saveProgress() { localStorage.setItem("englishGameLevel", maxLevelUnlocked); }
function loadProgress() { const saved = localStorage.getItem("englishGameLevel"); if (saved) maxLevelUnlocked = parseInt(saved); }
function updateLevelButtons() {
  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById("lvl-" + i);
    if (i <= maxLevelUnlocked) {
      btn.classList.remove("locked"); btn.classList.add("unlocked");
      btn.innerHTML = "第 " + i + " 關<br>" + (i===5 ? "💀" : "⭐⭐⭐");
    } else {
      btn.classList.add("locked"); btn.classList.remove("unlocked");
      btn.innerHTML = "第 " + i + " 關<br>🔒";
    }
  }
}
window.resetProgress = function() { if(confirm("確定重置？")) { maxLevelUnlocked=1; saveProgress(); updateLevelButtons(); }}
