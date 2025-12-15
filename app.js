const display = document.getElementById("display-word");
const ipaDisplay = document.getElementById("display-ipa");
const sentEnDisplay = document.getElementById("display-sentence");
const sentZnDisplay = document.getElementById("display-sent-zn");
const keyboard = document.getElementById("keyboard");
const msg = document.getElementById("message");

let currentWord = "";
let challengeMode = false;
let challengeAnswer = "";

// 進入畫面
window.enterApp = function() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("main-app").style.display = "block";
  speak("", 1.0);
}

// --- 第一部分字典 (短句 + A-M) ---
const dictPart1 = {
  // ❤️ 常用短句
  "i love you": { ipa: "[aɪ lʌv ju]", sent: "I love you very much.", zn: "我非常愛你。" },
  "thank you": { ipa: "[θæŋk ju]", sent: "You are welcome.", zn: "不客氣。" },
  "how are you": { ipa: "[haʊ ɑr ju]", sent: "I am fine.", zn: "你好嗎？" },

  // A - M 單字
  "apple": { ipa: "[ˋæpl]", sent: "Red apple.", zn: "紅蘋果。" },
  "ant": { ipa: "[ænt]", sent: "Small ant.", zn: "小螞蟻。" },
  "ball": { ipa: "[bɔl]", sent: "Kick the ball.", zn: "踢球。" },
  "bus": { ipa: "[bʌs]", sent: "Big bus.", zn: "大公車。" },
  "cat": { ipa: "[kæt]", sent: "Cute cat.", zn: "可愛的貓。" },
  "car": { ipa: "[kɑr]", sent: "Fast car.", zn: "快車。" },
  "dog": { ipa: "[dɔg]", sent: "Good dog.", zn: "好狗。" },
  "duck": { ipa: "[dʌk]", sent: "Yellow duck.", zn: "黃色小鴨。" },
  "egg": { ipa: "[ɛg]", sent: "Eat an egg.", zn: "吃蛋。" },
  "eye": { ipa: "[aɪ]", sent: "My eyes.", zn: "我的眼睛。" },
  "fish": { ipa: "[fɪʃ]", sent: "Fish swim.", zn: "魚游泳。" },
  "fan": { ipa: "[fæn]", sent: "Cool fan.", zn: "涼風扇。" },
  "goat": { ipa: "[got]", sent: "A goat.", zn: "一隻山羊。" },
  "good": { ipa: "[gʊd]", sent: "Good job.", zn: "做得好。" },
  "hat": { ipa: "[hæt]", sent: "Red hat.", zn: "紅帽子。" },
  "hot": { ipa: "[hɑt]", sent: "Very hot.", zn: "很熱。" },
  "ice": { ipa: "[aɪs]", sent: "Cold ice.", zn: "冷冰塊。" },
  "ink": { ipa: "[ɪŋk]", sent: "Black ink.", zn: "黑墨水。" },
  "jam": { ipa: "[dʒæm]", sent: "Sweet jam.", zn: "甜果醬。" },
  "jet": { ipa: "[dʒɛt]", sent: "Fast jet.", zn: "噴射機。" },
  "kite": { ipa: "[kaɪt]", sent: "Fly a kite.", zn: "放風箏。" },
  "king": { ipa: "[kɪŋ]", sent: "The king.", zn: "國王。" },
  "lion": { ipa: "[ˈlaɪən]", sent: "Big lion.", zn: "大獅子。" },
  "love": { ipa: "[lʌv]", sent: "I love you.", zn: "我愛你。" },
  "mom": { ipa: "[mɑm]", sent: "Hi mom.", zn: "嗨媽媽。" },
  "milk": { ipa: "[mɪlk]", sent: "Drink milk.", zn: "喝牛奶。" },
  "moon": { ipa: "[mun]", sent: "Full moon.", zn: "滿月。" },
  "mouse": { ipa: "[maʊs]", sent: "Small mouse.", zn: "小老鼠。" }
};
// --- 第二部分字典 (N-Z) ---
const dictPart2 = {
  "net": { ipa: "[nɛt]", sent: "Fishing net.", zn: "漁網。" },
  "nose": { ipa: "[noz]", sent: "My nose.", zn: "我的鼻子。" },
  "nine": { ipa: "[naɪn]", sent: "Number nine.", zn: "數字九。" },
  "nurse": { ipa: "[nɝs]", sent: "A nurse.", zn: "護士。" },
  "one": { ipa: "[wʌn]", sent: "Number one.", zn: "第一名。" },
  "ox": { ipa: "[ɑks]", sent: "Big ox.", zn: "大公牛。" },
  "orange": { ipa: "[ˋɔrɪndʒ]", sent: "Sweet orange.", zn: "甜柳橙。" },
  "open": { ipa: "[ˋopən]", sent: "Open door.", zn: "開門。" },
  "pig": { ipa: "[pɪg]", sent: "Pink pig.", zn: "粉紅豬。" },
  "pen": { ipa: "[pɛn]", sent: "Blue pen.", zn: "藍筆。" },
  "park": { ipa: "[pɑrk]", sent: "Go to park.", zn: "去公園。" },
  "play": { ipa: "[ple]", sent: "Let's play.", zn: "我們來玩。" },
  "queen": { ipa: "[kwin]", sent: "The queen.", zn: "女王。" },
  "quiet": { ipa: "[ˋkwaɪət]", sent: "Be quiet.", zn: "安靜。" },
  "red": { ipa: "[rɛd]", sent: "Red color.", zn: "紅色。" },
  "run": { ipa: "[rʌn]", sent: "Run fast.", zn: "跑快點。" },
  "rain": { ipa: "[ren]", sent: "Heavy rain.", zn: "大雨。" },
  "rabbit": { ipa: "[ˋræbɪt]", sent: "Cute rabbit.", zn: "可愛兔子。" },
  "sun": { ipa: "[sʌn]", sent: "Hot sun.", zn: "烈日。" },
  "six": { ipa: "[sɪks]", sent: "Number six.", zn: "數字六。" },
  "star": { ipa: "[stɑr]", sent: "Shining star.", zn: "閃亮的星。" },
  "school": { ipa: "[skul]", sent: "Go to school.", zn: "去學校。" },
  "ten": { ipa: "[tɛn]", sent: "Number ten.", zn: "數字十。" },
  "top": { ipa: "[tɑp]", sent: "Spinning top.", zn: "陀螺。" },
  "tiger": { ipa: "[ˋtaɪgɚ]", sent: "Scary tiger.", zn: "可怕老虎。" },
  "tree": { ipa: "[tri]", sent: "Big tree.", zn: "大樹。" },
  "up": { ipa: "[ʌp]", sent: "Stand up.", zn: "起立。" },
  "use": { ipa: "[juz]", sent: "Use it.", zn: "使用它。" },
  "umbrella": { ipa: "[ʌmˋbrɛlə]", sent: "Open umbrella.", zn: "開傘。" },
  "van": { ipa: "[væn]", sent: "Blue van.", zn: "廂型車。" },
  "vet": { ipa: "[vɛt]", sent: "Animal doctor.", zn: "獸醫。" },
  "water": { ipa: "[ˈwɔtɚ]", sent: "Drink water.", zn: "喝水。" },
  "win": { ipa: "[wɪn]", sent: "You win.", zn: "你贏了。" },
  "watch": { ipa: "[wɑtʃ]", sent: "My watch.", zn: "手錶。" },
  "wolf": { ipa: "[wʊlf]", sent: "Bad wolf.", zn: "壞野狼。" },
  "x-ray": { ipa: "[ˋɛksˋre]", sent: "X-ray photo.", zn: "X光片。" },
  "box": { ipa: "[bɑks]", sent: "A box.", zn: "箱子。" },
  "fox": { ipa: "[fɑks]", sent: "Smart fox.", zn: "狐狸。" },
  "yes": { ipa: "[jɛs]", sent: "Say yes.", zn: "說好。" },
  "you": { ipa: "[ju]", sent: "You and me.", zn: "你和我。" },
  "yellow": { ipa: "[ˋjɛlo]", sent: "Yellow banana.", zn: "黃香蕉。" },
  "yoyo": { ipa: "[ˋjoˋjo]", sent: "Play yoyo.", zn: "玩溜溜球。" },
  "zoo": { ipa: "[zu]", sent: "Go to zoo.", zn: "去動物園。" },
  "zebra": { ipa: "[ˈzibrə]", sent: "A zebra.", zn: "斑馬。" },
  "zero": { ipa: "[ˋzɪro]", sent: "Number zero.", zn: "數字零。" }
};

// 合併字典
const dictionary = Object.assign({}, dictPart1, dictPart2);
const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// 產生鍵盤
if (keyboard) {
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
  backBtn.onclick = () => { 
    if(currentWord.length > 0) {
      currentWord = currentWord.slice(0, -1);
      updateScreen();
    }
  };
  keyboard.appendChild(backBtn);
}

function addLetter(char) {
  if (currentWord.length < 25) {
    currentWord += char;
    updateScreen();
  }
}

function updateScreen() {
  if (display) display.innerText = currentWord === "" ? "_" : currentWord;
  const lowerWord = currentWord.toLowerCase().trim();
  const entry = dictionary[lowerWord];
  
  if (entry) {
    if(ipaDisplay) ipaDisplay.innerText = entry.ipa;
    if(sentEnDisplay) sentEnDisplay.innerText = entry.sent;
    if(sentZnDisplay) sentZnDisplay.innerText = entry.zn;
  } else {
    if(ipaDisplay) ipaDisplay.innerText = "";
    if(sentEnDisplay) sentEnDisplay.innerText = "";
    if(sentZnDisplay) sentZnDisplay.innerText = "";
  }
  
  if (challengeMode) checkSpelling();
}

window.clearWord = function() {
  currentWord = "";
  challengeMode = false;
  if(msg) msg.innerText = "";
  updateScreen();
}

window.speakWord = function() {
  if (currentWord === "") return;
  const lowerWord = currentWord.toLowerCase().trim();
  const entry = dictionary[lowerWord];
  
  if (entry) {
    speak(currentWord + ". " + entry.sent, 0.9);
  } else {
    speak(currentWord, 0.9);
  }
}

function speak(text, rate) {
  window.speechSynthesis.cancel();
  const m = new SpeechSynthesisUtterance(text);
  m.lang = "en-US";
  m.rate = rate || 1.0;
  window.speechSynthesis.speak(m);
}

window.startChallenge = function() {
  challengeMode = true;
  currentWord = "";
  updateScreen();
  const keys = Object.keys(dictionary).filter(k => !k.includes(" "));
  challengeAnswer = keys[Math.floor(Math.random() * keys.length)];
  if(msg) msg.innerText = "聽音拼字中...";
  speak("Spell... " + challengeAnswer);
}

function checkSpelling() {
  if (currentWord.toLowerCase().trim() === challengeAnswer) {
    if(msg) msg.innerText = "Correct! 🎉";
    const entry = dictionary[challengeAnswer];
    if(entry) {
       if(sentEnDisplay) sentEnDisplay.innerText = entry.sent;
       if(sentZnDisplay) sentZnDisplay.innerText = entry.zn;
       speak("Correct! " + challengeAnswer + ". " + entry.sent);
    }
    challengeMode = false;
  }
}
