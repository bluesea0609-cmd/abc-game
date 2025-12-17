// --- 1. 變數設定 ---
const display = document.getElementById("display-word");
const ipaDisplay = document.getElementById("display-ipa");
const sentEnDisplay = document.getElementById("display-sentence");
const sentIpaDisplay = document.getElementById("display-sent-ipa") || { innerText: "" }; 
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

// --- 2. 字典資料庫 Part 1 (A-M) ---
const dictPart1 = {
  "ant": { ipa: "[ænt]", sent: "Small ant.", sent_ipa: "[smɔl ænt]", zn: "小螞蟻。" },
  "apple": { ipa: "[ˈæpl]", sent: "Red apple.", sent_ipa: "[rɛd ˈæpl]", zn: "紅蘋果。" },
  "at": { ipa: "[æt]", sent: "At home.", sent_ipa: "[æt hoʊm]", zn: "在...地點。" },
  "ball": { ipa: "[bɔl]", sent: "Kick ball.", sent_ipa: "[kɪk bɔl]", zn: "踢球。" },
  "bird": { ipa: "[bɝd]", sent: "Flying bird.", sent_ipa: "[ˈflaɪɪŋ bɝd]", zn: "飛鳥。" },
  "book": { ipa: "[bʊk]", sent: "Read a book.", sent_ipa: "[rid ə bʊk]", zn: "讀書。" },
  "bus": { ipa: "[bʌs]", sent: "Big bus.", sent_ipa: "[bɪg bʌs]", zn: "大公車。" },
  "car": { ipa: "[kɑr]", sent: "Fast car.", sent_ipa: "[fæst kɑr]", zn: "快車。" },
  "cat": { ipa: "[kæt]", sent: "Cute cat.", sent_ipa: "[kjut kæt]", zn: "可愛的貓。" },
  "dad": { ipa: "[dæd]", sent: "My dad.", sent_ipa: "[maɪ dæd]", zn: "我爸爸。" },
  "dog": { ipa: "[dɔg]", sent: "Good dog.", sent_ipa: "[gʊd dɔg]", zn: "好狗。" },
  "duck": { ipa: "[dʌk]", sent: "Yellow duck.", sent_ipa: "[ˈjɛloʊ dʌk]", zn: "黃色小鴨。" },
  "fish": { ipa: "[fɪʃ]", sent: "Fish swim.", sent_ipa: "[fɪʃ swɪm]", zn: "魚游泳。" },
  "frog": { ipa: "[frɑg]", sent: "Jump frog.", sent_ipa: "[dʒʌmp frɑg]", zn: "跳跳蛙。" },
  "goat": { ipa: "[got]", sent: "A goat.", sent_ipa: "[ə goʊt]", zn: "一隻山羊。" },
  "good": { ipa: "[gʊd]", sent: "Good job.", sent_ipa: "[gʊd dʒɑb]", zn: "做得好。" },
  "good morning": { ipa: "[gʊd ˈmɔrnɪŋ]", sent: "Have a nice day.", sent_ipa: "[hæv ə naɪs deɪ]", zn: "早安。" },
  "happy": { ipa: "[ˈhæpi]", sent: "I am happy.", sent_ipa: "[aɪ æm ˈhæpi]", zn: "很開心。" },
  "high": { ipa: "[haɪ]", sent: "The kite is high.", sent_ipa: "[ðə kaɪt ɪz haɪ]", zn: "風箏飛得很高。" },
  "home": { ipa: "[hom]", sent: "Go home.", sent_ipa: "[goʊ hoʊm]", zn: "回家。" },
  "house": { ipa: "[haʊs]", sent: "Big house.", sent_ipa: "[bɪg haʊs]", zn: "大房子。" },
  "how are you": { ipa: "[haʊ ɑr ju]", sent: "I am fine.", sent_ipa: "[aɪ æm faɪn]", zn: "你好嗎？" },
  "i love you": { ipa: "[aɪ lʌv ju]", sent: "I love you very much.", sent_ipa: "[aɪ lʌv ju ˈvɛri mʌtʃ]", zn: "我非常愛你。" },
  "in": { ipa: "[ɪn]", sent: "In the box.", sent_ipa: "[ɪn ðə bɑks]", zn: "在...裡面。" },
  "kite": { ipa: "[kaɪt]", sent: "Fly a kite.", sent_ipa: "[flaɪ ə kaɪt]", zn: "放風箏。" },
  "lion": { ipa: "[ˈlaɪən]", sent: "Big lion.", sent_ipa: "[bɪg ˈlaɪən]", zn: "大獅子。" },
  "love": { ipa: "[lʌv]", sent: "I love you.", sent_ipa: "[aɪ lʌv ju]", zn: "我愛你。" },
  "milk": { ipa: "[mɪlk]", sent: "Drink milk.", sent_ipa: "[drɪŋk mɪlk]", zn: "喝牛奶。" },
  "mom": { ipa: "[mɑm]", sent: "Hi mom.", sent_ipa: "[haɪ mɑm]", zn: "嗨媽媽。" },
  "moon": { ipa: "[mun]", sent: "Full moon.", sent_ipa: "[fʊl mun]", zn: "滿月。" },
  "morning": { ipa: "[ˈmɔrnɪŋ]", sent: "Good morning.", sent_ipa: "[gʊd ˈmɔrnɪŋ]", zn: "早安。" },
  "mouse": { ipa: "[maʊs]", sent: "Small mouse.", sent_ipa: "[smɔl maʊs]", zn: "小老鼠。" }
};
// --- 3. 字典資料庫 Part 2 (N-Z) ---
const dictPart2 = {
  "nose": { ipa: "[noz]", sent: "My nose.", sent_ipa: "[maɪ noʊz]", zn: "我的鼻子。" },
  "nurse": { ipa: "[nɝs]", sent: "A nurse.", sent_ipa: "[ə nɝs]", zn: "護士。" },
  "october": { ipa: "[ɑkˈtoʊbɚ]", sent: "It is October.", sent_ipa: "[ɪt ɪz ɑkˈtoʊbɚ]", zn: "十月。" },
  "on": { ipa: "[ɑn]", sent: "On the table.", sent_ipa: "[ɑn ðə ˈteɪbl]", zn: "在...上面。" },
  "open": { ipa: "[ˈoʊpən]", sent: "Open the door.", sent_ipa: "[ˈoʊpən ðə dɔr]", zn: "打開。" },
  "orange": { ipa: "[ˈɔrɪndʒ]", sent: "Sweet orange.", sent_ipa: "[swit ˈɔrɪndʒ]", zn: "甜柳橙。" },
  "panda": { ipa: "[ˈpændə]", sent: "Cute panda.", sent_ipa: "[kjut ˈpændə]", zn: "可愛貓熊。" },
  "pen": { ipa: "[pɛn]", sent: "Blue pen.", sent_ipa: "[blu pɛn]", zn: "藍筆。" },
  "pig": { ipa: "[pɪg]", sent: "Pink pig.", sent_ipa: "[pɪŋk pɪg]", zn: "粉紅豬。" },
  "please": { ipa: "[pliz]", sent: "Please help.", sent_ipa: "[pliz hɛlp]", zn: "請。" },
  "queen": { ipa: "[kwin]", sent: "The queen.", sent_ipa: "[ðə kwin]", zn: "女王。" },
  "quick": { ipa: "[kwɪk]", sent: "Be quick.", sent_ipa: "[bi kwɪk]", zn: "快一點。" },
  "rabbit": { ipa: "[ˈræbɪt]", sent: "Cute rabbit.", sent_ipa: "[kjut ˈræbɪt]", zn: "可愛兔子。" },
  "red": { ipa: "[rɛd]", sent: "Red color.", sent_ipa: "[rɛd ˈkʌlɚ]", zn: "紅色。" },
  "right": { ipa: "[raɪt]", sent: "Turn right.", sent_ipa: "[tɝn raɪt]", zn: "右邊/正確。" },
  "run": { ipa: "[rʌn]", sent: "Run fast.", sent_ipa: "[rʌn fæst]", zn: "跑快點。" },
  "school": { ipa: "[skul]", sent: "Go to school.", sent_ipa: "[goʊ tu skul]", zn: "去學校。" },
  "sun": { ipa: "[sʌn]", sent: "Hot sun.", sent_ipa: "[hɑt sʌn]", zn: "烈日。" },
  "ten": { ipa: "[tɛn]", sent: "Number ten.", sent_ipa: "[ˈnʌmbɚ tɛn]", zn: "數字十。" },
  "thank you": { ipa: "[θæŋk ju]", sent: "You are welcome.", sent_ipa: "[ju ɑr ˈwɛlkəm]", zn: "不客氣。" },
  "tiger": { ipa: "[ˈtaɪgɚ]", sent: "Scary tiger.", sent_ipa: "[ˈskɛri ˈtaɪgɚ]", zn: "可怕老虎。" },
  "very": { ipa: "[ˈvɛri]", sent: "Very good.", sent_ipa: "[ˈvɛri gʊd]", zn: "非常。" },
  "watch": { ipa: "[wɑtʃ]", sent: "My watch.", sent_ipa: "[maɪ wɑtʃ]", zn: "手錶。" },
  "water": { ipa: "[ˈwɔtɚ]", sent: "Drink water.", sent_ipa: "[drɪŋk ˈwɔtɚ]", zn: "喝水。" },
  "will": { ipa: "[wɪl]", sent: "I will go.", sent_ipa: "[aɪ wɪl goʊ]", zn: "將要。" },
  "zebra": { ipa: "[ˈzibrə]", sent: "A zebra.", sent_ipa: "[ə ˈzibrə]", zn: "斑馬。" },
  "zoo": { ipa: "[zu]", sent: "Go to zoo.", sent_ipa: "[goʊ tu zu]", zn: "去動物園。" }
};

// 合併字典
const dictionary = Object.assign({}, dictPart1, dictPart2);
// --- 4. 功能函數 ---
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
  
  if (pool.length === 0) pool = keys;

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
      if(sentEnDisplay) sentEnDisplay.innerText = entry.sent || "";
      if(sentIpaDisplay) sentIpaDisplay.innerText = entry.sent_ipa || ""; 
      if(sentZnDisplay) sentZnDisplay.innerText = entry.zn || "";
      speak("Correct! " + targetWord + ". " + (entry.sent || ""));
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
       ipaDisplay.innerText = entry.ipa || "";
       sentEnDisplay.innerText = entry.sent || "";
       if(sentIpaDisplay) sentIpaDisplay.innerText = entry.sent_ipa || ""; 
       sentZnDisplay.innerText = entry.zn || "";
    } else {
       ipaDisplay.innerText = "";
       sentEnDisplay.innerText = "";
       if(sentIpaDisplay) sentIpaDisplay.innerText = "";
       sentZnDisplay.innerText = "";
    }
  } else {
     ipaDisplay.innerText = ""; 
     sentEnDisplay.innerText = ""; 
     if(sentIpaDisplay) sentIpaDisplay.innerText = "";
     sentZnDisplay.innerText = "";
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
    if (entry && entry.sent) speak(currentWord + ". " + entry.sent);
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

// 啟動遊戲設定 (放在最後以確保安全)
loadProgress();
updateLevelButtons();

