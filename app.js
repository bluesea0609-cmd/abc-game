const display = document.getElementById("display-word");
const ipaDisplay = document.getElementById("display-ipa");
const sentEnDisplay = document.getElementById("display-sentence");
const sentIpaDisplay = document.getElementById("display-sent-ipa");
const sentZnDisplay = document.getElementById("display-sent-zn");
const keyboard = document.getElementById("keyboard");
const msg = document.getElementById("message");

let currentWord = "";
let challengeMode = false;
let challengeAnswer = "";

// --- 進入畫面 ---
function enterApp() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("main-app").style.display = "block";
  speak("", 1.0); 
}

// --- 📖 萬能字典 (單字 + 常用短句) ---
const dictionary = {
  // --- ❤️ 常用短句 (Phrase) ---
  "i love you": { 
    ipa: "[aɪ lʌv ju]", 
    sent: "I love you very much.", 
    sentIpa: "[aɪ lʌv ju ˈvɛrɪ mʌtʃ]", 
    zn: "我愛你。" 
  },
  "how are you": { 
    ipa: "[haʊ ɑr ju]", 
    sent: "I am fine, thank you.", 
    sentIpa: "[aɪ æm faɪn θæŋk ju]", 
    zn: "你好嗎？" 
  },
  "good morning": { 
    ipa: "[gʊd ˈmɔrnɪŋ]", 
    sent: "Have a nice day.", 
    sentIpa: "[hæv ə naɪs de]", 
    zn: "早安。" 
  },
  "thank you": { 
    ipa: "[θæŋk ju]", 
    sent: "You are welcome.", 
    sentIpa: "[ju ɑr ˈwɛlkəm]", 
    zn: "謝謝你。" 
  },
  "happy birthday": { 
    ipa: "[ˈhæpɪ ˈbɝθ͵de]", 
    sent: "Make a wish.", 
    sentIpa: "[mek ə wɪʃ]", 
    zn: "生日快樂。" 
  },

  // --- 🔤 單字庫 (A-Z) ---
  "apple": { ipa: "[ˋæpl]", sent: "I like apples.", sentIpa: "[aɪ laɪk ˈæpəlz]", zn: "我喜歡蘋果。" },
  "ant": { ipa: "[ænt]", sent: "The ant is small.", sentIpa: "[ðə ænt ɪz smɔl]", zn: "螞蟻很小。" },
  "apply": { ipa: "[əˋplaɪ]", sent: "Apply for a job.", sentIpa: "[əˈplaɪ fɔr ə dʒɑb]", zn: "申請工作。" },
  "ball": { ipa: "[bɔl]", sent: "Kick the ball.", sentIpa: "[kɪk ðə bɔl]", zn: "踢球。" },
  "bat": { ipa: "[bæt]", sent: "I saw a bat.", sentIpa: "[aɪ sɔ ə bæt]", zn: "我看見一隻蝙蝠。" },
  "bus": { ipa: "[bʌs]", sent: "The bus is coming.", sentIpa: "[ðə bʌs ɪz ˈkʌmɪŋ]", zn: "公車來了。" },
  "cat": { ipa: "[kæt]", sent: "The cat is cute.", sentIpa: "[ðə kæt ɪz kjut]", zn: "貓很可愛。" },
  "car": { ipa: "[kɑr]", sent: "My dad has a car.", sentIpa: "[maɪ dæd hæz ə kɑr]", zn: "爸爸有一輛車。" },
  "cup": { ipa: "[kʌp]", sent: "A cup of tea.", sentIpa: "[ə kʌp ʌv ti]", zn: "一杯茶。" },
  "dog": { ipa: "[dɔg]", sent: "The dog barks.", sentIpa: "[ðə dɔg bɑrks]", zn: "狗在叫。" },
  "dad": { ipa: "[dæd]", sent: "I love my dad.", sentIpa: "[aɪ lʌv maɪ dæd]", zn: "我愛爸爸。" },
  "egg": { ipa: "[ɛg]", sent: "Eat an egg.", sentIpa: "[it ən ɛg]", zn: "吃一顆蛋。" },
  "eye": { ipa: "[aɪ]", sent: "Close your eyes.", sentIpa: "[kloz jʊr aɪz]", zn: "閉上眼睛。" },
  "fish": { ipa: "[fɪʃ]", sent: "Fish swim.", sentIpa: "[fɪʃ swɪm]", zn: "魚會游泳。" },
  "fan": { ipa: "[fæn]", sent: "Turn on the fan.", sentIpa: "[tɝn ɑn ðə fæn]", zn: "開電風扇。" },
  "goat": { ipa: "[got]", sent: "Goat eats grass.", sentIpa: "[got its græs]", zn: "山羊吃草。" },
  "good": { ipa: "[gʊd]", sent: "Good job!", sentIpa: "[gʊd dʒɑb]", zn: "做得好！" },
  "hat": { ipa: "[hæt]", sent: "Wear a hat.", sentIpa: "[wɛr ə hæt]", zn: "戴帽子。" },
  "hot": { ipa: "[hɑt]", sent: "It is hot.", sentIpa: "[ɪt ɪz hɑt]", zn: "天氣很熱。" },
  "ice": { ipa: "[aɪs]", sent: "Ice is cold.", sentIpa: "[aɪs ɪz kold]", zn: "冰是冷的。" },
  "jam": { ipa: "[dʒæm]", sent: "I like jam.", sentIpa: "[aɪ laɪk dʒæm]", zn: "我喜歡果醬。" },
  "kite": { ipa: "[kaɪt]", sent: "Fly a kite.", sentIpa: "[flaɪ ə kaɪt]", zn: "放風箏。" },
  "lion": { ipa: "[ˈlaɪən]", sent: "The lion roars.", sentIpa: "[ðə ˈlaɪən rɔrz]", zn: "獅子在吼叫。" },
  "mom": { ipa: "[mɑm]", sent: "I help my mom.", sentIpa: "[aɪ hɛlp maɪ mɑm]", zn: "我幫媽媽。" },
  "map": { ipa: "[mæp]", sent: "Look at the map.", sentIpa: "[lʊk æt ðə mæp]", zn: "看地圖。" },
  "net": { ipa: "[nɛt]", sent: "A fishing net.", sentIpa: "[ə ˈfɪʃɪŋ nɛt]", zn: "一張漁網。" },
  "pig": { ipa: "[pɪg]", sent: "The pig is pink.", sentIpa: "[ðə pɪg ɪz pɪŋk]", zn: "豬是粉紅色的。" },
  "pen": { ipa: "[pɛn]", sent: "Use a pen.", sentIpa: "[juz ə pɛn]", zn: "用原子筆。" },
  "red": { ipa: "[rɛd]", sent: "Red apple.", sentIpa: "[rɛd ˈæpəl]", zn: "紅蘋果。" },
  "run": { ipa: "[rʌn]", sent: "Run fast!", sentIpa: "[rʌn fæst]", zn: "跑快一點！" },
  "sun": { ipa: "[sʌn]", sent: "The sun is hot.", sentIpa: "[ðə sʌn ɪz hɑt]", zn: "太陽很熱。" },
  "six": { ipa: "[sɪks]", sent: "I am six.", sentIpa: "[aɪ æm sɪks]", zn: "我六歲。" },
  "ten": { ipa: "[tɛn]", sent: "Count to ten.", sentIpa: "[kaʊnt tu tɛn]", zn: "數到十。" },
  "van": { ipa: "[væn]", sent: "A blue van.", sentIpa: "[ə blu væn]", zn: "一輛藍色廂型車。" },
  "zoo": { ipa: "[zu]", sent: "Go to the zoo.", sentIpa: "[go tu ðə zu]", zn: "去動物園。" },
  "zebra": { ipa: "[ˈzibrə]", sent: "A striped zebra.", sentIpa: "[ə straɪpt ˈzibrə]", zn: "一隻有條紋的斑馬。" }
};

const challengeWords = Object.keys(dictionary);
// 字母列表
const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// --- 1. 產生鍵盤 (含空白鍵) ---
letters.forEach(char => {
  createKey(char.toUpperCase(), char);
});

// 加入「空白鍵」
const spaceBtn = document.createElement("div");
spaceBtn.className = "key key-space"; // 特殊樣式
spaceBtn.innerText = "␣ Space";
spaceBtn.onclick = () => { addLetter(" "); speak("Space", 1.5); };
keyboard.appendChild(spaceBtn);

function createKey(text, val) {
  const btn = document.createElement("div");
  btn.className = "key";
  btn.innerText = text;
  btn.onclick = () => { addLetter(val); speak(val, 1.5); };
  keyboard.appendChild(btn);
}

function addLetter(char) {
  if (currentWord.length < 20) { // 句子可以長一點
    currentWord += char;
    updateScreen();
  }
}

// --- 2. 更新畫面 (核心) ---
function updateScreen() {
  display.innerText = currentWord === "" ? "_" : currentWord;
  const lowerWord = currentWord.toLowerCase().trim(); // 去掉前後空白來查
  
  const entry = dictionary[lowerWord];
  
  if (entry) {
    // 找到了 (不論是單字還是句子)
    ipaDisplay.innerText = entry.ipa;
    sentEnDisplay.innerText = entry.sent;
    sentIpaDisplay.innerText = entry.sentIpa;
    sentZnDisplay.innerText = entry.zn;
  } else {
    // 沒找到
    ipaDisplay.innerText = "";
    sentEnDisplay.innerText = "";
    sentIpaDisplay.innerText = "";
    sentZnDisplay.innerText = "";
  }
  
  if (challengeMode) checkSpelling();
}

function clearWord() {
  currentWord = "";
  challengeMode = false;
  msg.innerText = "自由拼字模式";
  updateScreen();
}

// --- 3. 朗讀功能 ---
function speakWord() {
  if (currentWord === "") return;
  
  const lowerWord = currentWord.toLowerCase().trim();
  const entry = dictionary[lowerWord];
  
  if (entry) {
    // 如果字典有，唸：內容 -> 例句
    speak(currentWord + ". " + entry.sent, 0.9);
  } else {
    // 如果字典沒有，還是要唸出使用者打的字 (語音引擎會自動發音)
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

// --- 4. 挑戰模式 ---
function startChallenge() {
  challengeMode = true;
  currentWord = "";
  updateScreen();
  challengeAnswer = challengeWords[Math.floor(Math.random() * challengeWords.length)];
  msg.innerText = "聽到了什麼？";
  speak("Spell... " + challengeAnswer);
}

function checkSpelling() {
  const input = currentWord.toLowerCase().trim();
  if (input === challengeAnswer) {
    msg.innerText = "答對了！🎉";
    msg.style.color = "green";
    
    const entry = dictionary[challengeAnswer];
    if(entry) {
        ipaDisplay.innerText = entry.ipa;
        sentEnDisplay.innerText = entry.sent;
        sentIpaDisplay.innerText = entry.sentIpa;
        sentZnDisplay.innerText = entry.zn;
        speak("Correct! " + challengeAnswer + ". " + entry.sent);
    } else {
        speak("Correct! " + challengeAnswer);
    }
    
    challengeMode = false;
  } else if (input.length >= challengeAnswer.length) {
    msg.innerText = "不對喔，再聽一次！";
    msg.style.color = "red";
    speak("Try again. " + challengeAnswer);
    currentWord = ""; 
    setTimeout(updateScreen, 1000);
  }
}

