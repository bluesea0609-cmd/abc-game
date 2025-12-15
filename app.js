const display = document.getElementById("display-word");
const ipaDisplay = document.getElementById("display-ipa");
const sentDisplay = document.getElementById("display-sentence");
const keyboard = document.getElementById("keyboard");
const msg = document.getElementById("message");

let currentWord = "";
let challengeMode = false;
let challengeAnswer = "";

// --- 0. 進入畫面功能 ---
function enterApp() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("main-app").style.display = "block";
  speak("", 1.0); 
}

// --- 📖 超級字典 (含音標與例句) ---
// 你可以在這裡自由增加字和句子！
const dictionary = {
  "apple": { ipa: "[ˋæpl]", sent: "I like to eat apples." },
  "apply": { ipa: "[əˋplaɪ]", sent: "Please apply for the job." },
  "ant":   { ipa: "[ænt]", sent: "The ant is small." },
  "ball":  { ipa: "[bɔl]", sent: "He kicks the ball." },
  "bat":   { ipa: "[bæt]", sent: "I saw a bat flying." },
  "bus":   { ipa: "[bʌs]", sent: "The bus is coming." },
  "box":   { ipa: "[bɑks]", sent: "Open the box." },
  "cat":   { ipa: "[kæt]", sent: "The cat is cute." },
  "cut":   { ipa: "[kʌt]", sent: "Do not cut your finger." },
  "car":   { ipa: "[kɑr]", sent: "My dad has a red car." },
  "cup":   { ipa: "[kʌp]", sent: "A cup of tea." },
  "dog":   { ipa: "[dɔg]", sent: "The dog barks loudly." },
  "dad":   { ipa: "[dæd]", sent: "I love my dad." },
  "egg":   { ipa: "[ɛg]", sent: "I eat an egg for breakfast." },
  "eye":   { ipa: "[aɪ]", sent: "Close your eyes." },
  "fish":  { ipa: "[fɪʃ]", sent: "Fish swim in the water." },
  "fan":   { ipa: "[fæn]", sent: "Turn on the fan." },
  "goat":  { ipa: "[got]", sent: "The goat eats grass." },
  "hat":   { ipa: "[hæt]", sent: "He wears a hat." },
  "hot":   { ipa: "[hɑt]", sent: "The soup is hot." },
  "ice":   { ipa: "[aɪs]", sent: "Ice is cold." },
  "jam":   { ipa: "[dʒæm]", sent: "I like strawberry jam." },
  "kite":  { ipa: "[kaɪt]", sent: "Fly a kite in the sky." },
  "lion":  { ipa: "[ˋlaɪən]", sent: "The lion is the king." },
  "mom":   { ipa: "[mɑm]", sent: "Mom helps me." },
  "map":   { ipa: "[mæp]", sent: "Look at the map." },
  "net":   { ipa: "[nɛt]", sent: "Catch fish with a net." },
  "pig":   { ipa: "[pɪg]", sent: "The pig is pink." },
  "pen":   { ipa: "[pɛn]", sent: "I write with a pen." },
  "red":   { ipa: "[rɛd]", sent: "The apple is red." },
  "run":   { ipa: "[rʌn]", sent: "Run fast!" },
  "sun":   { ipa: "[sʌn]", sent: "The sun is hot." },
  "six":   { ipa: "[sɪks]", sent: "I am six years old." },
  "top":   { ipa: "[tɑp]", sent: "The spinning top." },
  "ten":   { ipa: "[tɛn]", sent: "Count to ten." },
  "van":   { ipa: "[væn]", sent: "A big blue van." },
  "zoo":   { ipa: "[zu]", sent: "We go to the zoo." }
};

const challengeWords = Object.keys(dictionary); // 自動從字典裡抓字當題目
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

// 2. 更新畫面 (核心邏輯)
function updateScreen() {
  display.innerText = currentWord === "" ? "_" : currentWord;
  const lowerWord = currentWord.toLowerCase();
  
  // 查字典
  const entry = dictionary[lowerWord];
  
  if (entry) {
    // 找到了！顯示音標和例句
    ipaDisplay.innerText = entry.ipa;
    sentDisplay.innerText = entry.sent;
  } else {
    // 沒找到，清空
    ipaDisplay.innerText = "";
    sentDisplay.innerText = "";
  }
  
  if (challengeMode) checkSpelling();
}

function clearWord() {
  currentWord = "";
  challengeMode = false;
  msg.innerText = "自由拼字模式";
  updateScreen();
}

// 3. 唸出單字 + 例句
function speakWord() {
  if (currentWord === "") return;
  
  const lowerWord = currentWord.toLowerCase();
  const entry = dictionary[lowerWord];
  
  if (entry) {
    // 如果字典有，先唸單字，再唸例句
    speak(currentWord + ". " + entry.sent, 0.9);
  } else {
    // 字典沒有，只唸單字
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
    
    // 答對時，強制顯示詳細資訊
    const entry = dictionary[challengeAnswer];
    if(entry) {
        ipaDisplay.innerText = entry.ipa;
        sentDisplay.innerText = entry.sent;
        speak("Correct! " + challengeAnswer + ". " + entry.sent); // 答對也唸例句加深印象
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
