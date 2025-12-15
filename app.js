const display = document.getElementById("display-word");
const ipaDisplay = document.getElementById("display-ipa");
// 取得三個新的顯示位置
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

// --- 📖 終極字典 (單字 + 音標 + 例句 + 例句音標 + 中文) ---
const dictionary = {
  "apple": { 
    ipa: "[ˋæpl]", 
    sent: "I like apples.", 
    sentIpa: "[aɪ laɪk ˈæpəlz]", 
    zn: "我喜歡蘋果。" 
  },
  "apply": { 
    ipa: "[əˋplaɪ]", 
    sent: "Please apply here.", 
    sentIpa: "[pliz əˈplaɪ hɪr]", 
    zn: "請在這裡申請。" 
  },
  "ant": { 
    ipa: "[ænt]", 
    sent: "The ant is small.", 
    sentIpa: "[ðə ænt ɪz smɔl]", 
    zn: "螞蟻很小。" 
  },
  "ball": { 
    ipa: "[bɔl]", 
    sent: "Kick the ball.", 
    sentIpa: "[kɪk ðə bɔl]", 
    zn: "踢這顆球。" 
  },
  "bat": { 
    ipa: "[bæt]", 
    sent: "I saw a bat.", 
    sentIpa: "[aɪ sɔ ə bæt]", 
    zn: "我看到一隻蝙蝠。" 
  },
  "bus": { 
    ipa: "[bʌs]", 
    sent: "The bus is coming.", 
    sentIpa: "[ðə bʌs ɪz ˈkʌmɪŋ]", 
    zn: "公車來了。" 
  },
  "box": { 
    ipa: "[bɑks]", 
    sent: "Open the box.", 
    sentIpa: "[ˈopən ðə bɑks]", 
    zn: "打開這個盒子。" 
  },
  "cat": { 
    ipa: "[kæt]", 
    sent: "The cat is cute.", 
    sentIpa: "[ðə kæt ɪz kjut]", 
    zn: "這隻貓很可愛。" 
  },
  "cut": { 
    ipa: "[kʌt]", 
    sent: "Don't cut yourself.", 
    sentIpa: "[dont kʌt jʊrˈsɛlf]", 
    zn: "別割傷你自己。" 
  },
  "car": { 
    ipa: "[kɑr]", 
    sent: "My dad has a car.", 
    sentIpa: "[maɪ dæd hæz ə kɑr]", 
    zn: "我爸爸有一輛車。" 
  },
  "cup": { 
    ipa: "[kʌp]", 
    sent: "A cup of tea.", 
    sentIpa: "[ə kʌp ʌv ti]", 
    zn: "一杯茶。" 
  },
  "dog": { 
    ipa: "[dɔg]", 
    sent: "The dog barks.", 
    sentIpa: "[ðə dɔg bɑrks]", 
    zn: "這隻狗在叫。" 
  },
  "dad": { 
    ipa: "[dæd]", 
    sent: "I love my dad.", 
    sentIpa: "[aɪ lʌv maɪ dæd]", 
    zn: "我愛我爸爸。" 
  },
  "egg": { 
    ipa: "[ɛg]", 
    sent: "I eat an egg.", 
    sentIpa: "[aɪ it ən ɛg]", 
    zn: "我吃了一顆蛋。" 
  },
  "eye": { 
    ipa: "[aɪ]", 
    sent: "Close your eyes.", 
    sentIpa: "[kloz jʊr aɪz]", 
    zn: "閉上你的眼睛。" 
  },
  "fish": { 
    ipa: "[fɪʃ]", 
    sent: "Fish swim fast.", 
    sentIpa: "[fɪʃ swɪm fæst]", 
    zn: "魚游得很快。" 
  },
  "fan": { 
    ipa: "[fæn]", 
    sent: "Turn on the fan.", 
    sentIpa: "[tɝn ɑn ðə fæn]", 
    zn: "打開電風扇。" 
  },
  "goat": { 
    ipa: "[got]", 
    sent: "The goat eats grass.", 
    sentIpa: "[ðə got its græs]", 
    zn: "山羊吃草。" 
  },
  "hat": { 
    ipa: "[hæt]", 
    sent: "He wears a hat.", 
    sentIpa: "[hi wɛrz ə hæt]", 
    zn: "他戴著帽子。" 
  },
  "hot": { 
    ipa: "[hɑt]", 
    sent: "The soup is hot.", 
    sentIpa: "[ðə sup ɪz hɑt]", 
    zn: "這湯很熱。" 
  },
  "ice": { 
    ipa: "[aɪs]", 
    sent: "Ice is cold.", 
    sentIpa: "[aɪs ɪz kold]", 
    zn: "冰是冷的。" 
  },
  "jam": { 
    ipa: "[dʒæm]", 
    sent: "I like jam.", 
    sentIpa: "[aɪ laɪk dʒæm]", 
    zn: "我喜歡果醬。" 
  },
  "kite": { 
    ipa: "[kaɪt]", 
    sent: "Fly a kite.", 
    sentIpa: "[flaɪ ə kaɪt]", 
    zn: "放風箏。" 
  },
  "lion": { 
    ipa: "[ˋlaɪən]", 
    sent: "The lion is big.", 
    sentIpa: "[ðə ˈlaɪən ɪz bɪg]", 
    zn: "這隻獅子很大。" 
  },
  "mom": { 
    ipa: "[mɑm]", 
    sent: "Mom helps me.", 
    sentIpa: "[mɑm hɛlps mi]", 
    zn: "媽媽幫我。" 
  },
  "map": { 
    ipa: "[mæp]", 
    sent: "Look at the map.", 
    sentIpa: "[lʊk æt ðə mæp]", 
    zn: "看這張地圖。" 
  },
  "net": { 
    ipa: "[nɛt]", 
    sent: "A fishing net.", 
    sentIpa: "[ə ˈfɪʃɪŋ nɛt]", 
    zn: "一張漁網。" 
  },
  "pig": { 
    ipa: "[pɪg]", 
    sent: "The pig is pink.", 
    sentIpa: "[ðə pɪg ɪz pɪŋk]", 
    zn: "這隻豬是粉紅色的。" 
  },
  "pen": { 
    ipa: "[pɛn]", 
    sent: "I use a pen.", 
    sentIpa: "[aɪ juz ə pɛn]", 
    zn: "我用原子筆。" 
  },
  "red": { 
    ipa: "[rɛd]", 
    sent: "The apple is red.", 
    sentIpa: "[ðə ˈæpəl ɪz rɛd]", 
    zn: "這顆蘋果是紅色的。" 
  },
  "run": { 
    ipa: "[rʌn]", 
    sent: "Run fast!", 
    sentIpa: "[rʌn fæst]", 
    zn: "跑快點！" 
  },
  "sun": { 
    ipa: "[sʌn]", 
    sent: "The sun is hot.", 
    sentIpa: "[ðə sʌn ɪz hɑt]", 
    zn: "太陽很熱。" 
  },
  "six": { 
    ipa: "[sɪks]", 
    sent: "I am six.", 
    sentIpa: "[aɪ æm sɪks]", 
    zn: "我六歲。" 
  },
  "top": { 
    ipa: "[tɑp]", 
    sent: "Spin the top.", 
    sentIpa: "[spɪn ðə tɑp]", 
    zn: "旋轉陀螺。" 
  },
  "ten": { 
    ipa: "[tɛn]", 
    sent: "Count to ten.", 
    sentIpa: "[kaʊnt tu tɛn]", 
    zn: "數到十。" 
  },
  "van": { 
    ipa: "[væn]", 
    sent: "A blue van.", 
    sentIpa: "[ə blu væn]", 
    zn: "一輛藍色廂型車。" 
  },
  "zoo": { 
    ipa: "[zu]", 
    sent: "We go to the zoo.", 
    sentIpa: "[wi go tu ðə zu]", 
    zn: "我們去動物園。" 
  }
};

const challengeWords = Object.keys(dictionary);
const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// 1. 產生鍵盤
letters.forEach(char => {
  const btn = document.createElement("div");
  btn.className = "key";
  btn.innerText = char.toUpperCase();
  btn.onclick = () => { addLetter(char); speak(char, 1.5); };
  keyboard.appendChild(btn);
});

function addLetter(char) {
  if (currentWord.length < 12) {
    currentWord += char;
    updateScreen();
  }
}

// 2. 更新畫面 (包含所有詳細資訊)
function updateScreen() {
  display.innerText = currentWord === "" ? "_" : currentWord;
  const lowerWord = currentWord.toLowerCase();
  
  const entry = dictionary[lowerWord];
  
  if (entry) {
    // 找到了！顯示完整資訊
    ipaDisplay.innerText = entry.ipa;
    sentEnDisplay.innerText = entry.sent;
    sentIpaDisplay.innerText = entry.sentIpa; // 例句音標
    sentZnDisplay.innerText = entry.zn;       // 中文翻譯
  } else {
    // 沒找到，全部清空
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

// 3. 唸出單字 + 英文句子
function speakWord() {
  if (currentWord === "") return;
  
  const lowerWord = currentWord.toLowerCase();
  const entry = dictionary[lowerWord];
  
  if (entry) {
    speak(currentWord + ". " + entry.sent, 0.9);
  } else {
    speak(currentWord, 1.0);
  }
}

function speak(text, rate) {
  window.speechSynthesis.cancel();
  const m = new SpeechSynthesisUtterance(text);
  m.lang = "en-US";
  m.rate = rate || 1.0;
  window.speechSynthesis.speak(m);
}

function startChallenge() {
  challengeMode = true;
  currentWord = "";
  updateScreen();
  challengeAnswer = challengeWords[Math.floor(Math.random() * challengeWords.length)];
  msg.innerText = "聽到了什麼字？";
  speak("Spell the word... " + challengeAnswer);
}

function checkSpelling() {
  if (currentWord.toLowerCase() === challengeAnswer) {
    msg.innerText = "答對了！🎉";
    msg.style.color = "green";
    
    // 答對時強制顯示資訊
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
  } else if (currentWord.length >= challengeAnswer.length) {
    msg.innerText = "不對喔，再聽一次！";
    msg.style.color = "red";
    speak("Try again. " + challengeAnswer);
    currentWord = ""; 
    setTimeout(updateScreen, 1000);
  }
}

