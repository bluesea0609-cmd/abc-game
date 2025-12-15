const display = document.getElementById("display-word");
const ipaDisplay = document.getElementById("display-ipa");
const keyboard = document.getElementById("keyboard");
const msg = document.getElementById("message");

let currentWord = "";
let challengeMode = false;
let challengeAnswer = "";

// --- 0. 進入畫面功能 ---
function enterApp() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("main-app").style.display = "block";
  speak("", 1.0); // 喚醒聲音
}

// --- 📖 字典 ---
const dictionary = {
  "apple": "[ˋæpl]", "apply": "[əˋplaɪ]", "ant": "[ænt]",
  "ball": "[bɔl]", "bat": "[bæt]", "bus": "[bʌs]", "box": "[bɑks]",
  "cat": "[kæt]", "cut": "[kʌt]", "car": "[kɑr]", "cup": "[kʌp]",
  "dog": "[dɔg]", "dad": "[dæd]", "egg": "[ɛg]", "eye": "[aɪ]",
  "fish": "[fɪʃ]", "fan": "[fæn]", "goat": "[got]",
  "hat": "[hæt]", "hot": "[hɑt]", "ice": "[aɪs]", "jam": "[dʒæm]",
  "kite": "[kaɪt]", "lion": "[ˋlaɪən]", "mom": "[mɑm]", "map": "[mæp]",
  "net": "[nɛt]", "pig": "[pɪg]", "pen": "[pɛn]",
  "red": "[rɛd]", "run": "[rʌn]", "sun": "[sʌn]", "six": "[sɪks]",
  "top": "[tɑp]", "ten": "[tɛn]", "van": "[væn]", "zoo": "[zu]"
};

const challengeWords = ["cat", "dog", "pig", "bat", "red", "bus", "sun", "hat", "egg", "box", "apple", "fish"];
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

function updateScreen() {
  display.innerText = currentWord === "" ? "_" : currentWord;
  const lowerWord = currentWord.toLowerCase();
  ipaDisplay.innerText = dictionary[lowerWord] ? dictionary[lowerWord] : "";
  if (challengeMode) checkSpelling();
}

function clearWord() {
  currentWord = "";
  challengeMode = false;
  msg.innerText = "自由拼字模式";
  updateScreen();
}

function speakWord() {
  if (currentWord === "") return;
  speak(currentWord, 1.0);
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
    if(dictionary[challengeAnswer]) ipaDisplay.innerText = dictionary[challengeAnswer];
    speak("Correct! " + challengeAnswer);
    challengeMode = false;
  } else if (currentWord.length >= challengeAnswer.length) {
    msg.innerText = "不對喔，再聽一次！";
    msg.style.color = "red";
    speak("Try again. " + challengeAnswer);
    currentWord = ""; 
    setTimeout(updateScreen, 1000);
  }
}
