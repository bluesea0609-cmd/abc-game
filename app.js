// 取得所有螢幕元件 (加強防呆)
const display = document.getElementById("display-word");
const ipaDisplay = document.getElementById("display-ipa");
const sentEnDisplay = document.getElementById("display-sentence");
const sentIpaDisplay = document.getElementById("display-sent-ipa");
const sentZnDisplay = document.getElementById("display-sent-zn");
const keyboard = document.getElementById("keyboard");

let currentWord = "";
let challengeMode = false;
let challengeAnswer = "";

// --- 進入畫面 (修復按鈕沒反應的問題) ---
window.enterApp = function() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("main-app").style.display = "block";
  // 喚醒聲音引擎
  speak("", 1.0);
}

// --- 📖 萬能字典 (包含 I love you) ---
const dictionary = {
  // ❤️ 常用短句
  "i love you": { ipa: "[aɪ lʌv ju]", sent: "I love you so much.", sentIpa: "[aɪ lʌv ju so mʌtʃ]", zn: "我非常愛你。" },
  "thank you": { ipa: "[θæŋk ju]", sent: "You are welcome.", sentIpa: "[ju ɑr ˈwɛlkəm]", zn: "不客氣。" },
  "hello": { ipa: "[həˋlo]", sent: "Nice to meet you.", sentIpa: "[naɪs tu mit ju]", zn: "很高興認識你。" },
  
  // 🔤 基礎單字 (這裡放部分示範，你可以自己加更多)
  "apple": { ipa: "[ˋæpl]", sent: "It is a red apple.", sentIpa: "[ɪt ɪz ə rɛd ˈæpəl]", zn: "這是一顆紅蘋果。" },
  "book": { ipa: "[bʊk]", sent: "Read a book.", sentIpa: "[rid ə bʊk]", zn: "讀一本書。" },
  "cat": { ipa: "[kæt]", sent: "The cat is cute.", sentIpa: "[ðə kæt ɪz kjut]", zn: "這隻貓很可愛。" },
  "dog": { ipa: "[dɔg]", sent: "The dog barks.", sentIpa: "[ðə dɔg bɑrks]", zn: "這隻狗在叫。" },
  "egg": { ipa: "[ɛg]", sent: "I eat an egg.", sentIpa: "[aɪ it ən ɛg]", zn: "我吃一顆蛋。" },
  "fish": { ipa: "[fɪʃ]", sent: "Fish swim.", sentIpa: "[fɪʃ swɪm]", zn: "魚在游泳。" },
  "good": { ipa: "[gʊd]", sent: "Good job.", sentIpa: "[gʊd dʒɑb]", zn: "做得好。" },
  "happy": { ipa: "[ˋhæpɪ]", sent: "I am happy.", sentIpa: "[aɪ æm ˋhæpɪ]", zn: "我很開心。" },
  "love": { ipa: "[lʌv]", sent: "Love creates peace.", sentIpa: "[lʌv kriˈets pis]", zn: "愛創造和平。" },
  "mom": { ipa: "[mɑm]", sent: "I help mom.", sentIpa: "[aɪ hɛlp mɑm]", zn: "我幫媽媽。" },
  "pig": { ipa: "[pɪg]", sent: "The pig is pink.", sentIpa: "[ðə pɪg ɪz pɪŋk]", zn: "豬是粉紅色的。" },
  "red": { ipa: "[rɛd]", sent: "Red apple.", sentIpa: "[rɛd ˈæpəl]", zn: "紅蘋果。" },
  "sun": { ipa: "[sʌn]", sent: "The sun is hot.", sentIpa: "[ðə sʌn ɪz hɑt]", zn: "太陽很熱。" },
  "zoo": { ipa: "[zu]", sent: "Go to the zoo.", sentIpa: "[go tu ðə zu]", zn: "去動物園。" }
};

const challengeWords = Object.keys(dictionary).filter(w => !w.includes(" ")); // 挑戰只出單字，不出句子
const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// 1. 產生鍵盤 (含空白鍵)
keyboard.innerHTML = ""; // 清空舊的
letters.forEach(char => {
  const btn = document.createElement("div");
  btn.className = "key";
  btn.innerText = char.toUpperCase();
  btn.onclick = () => { addLetter(char); speak(char, 1.5); };
  keyboard.appendChild(btn);
});

// 加入空白鍵 (Space)
const spaceBtn = document.createElement("div");
spaceBtn.className = "key key-space"; 
spaceBtn.innerText = "␣";
spaceBtn.onclick = () => { addLetter(" "); speak("Space", 1.5); };
keyboard.appendChild(spaceBtn);

// 加入退格鍵 (Del)
const delBtn = document.createElement("div");
delBtn.className = "key key-del"; 
delBtn.innerText = "⌫";
delBtn.style.background = "#ffcdd2";
delBtn.onclick = () => { 
  currentWord = currentWord.slice(0, -1); 
  updateScreen(); 
};
keyboard.appendChild(delBtn);

function addLetter(char) {
  if (currentWord.length < 25) { 
    currentWord += char;
    updateScreen();
  }
}

// 2. 更新畫面
function updateScreen() {
  const displayWord = document.getElementById("display-word");
  displayWord.innerText = currentWord === "" ? "_" : currentWord;
  
  const lowerWord = currentWord.toLowerCase().trim();
  const entry = dictionary[lowerWord];
  
  if (entry) {
    if(ipaDisplay) ipaDisplay.innerText = entry.ipa;
    if(sentEnDisplay) sentEnDisplay.innerText = entry.sent;
    if(sentIpaDisplay) sentIpaDisplay.innerText = entry.sentIpa;
    if(sentZnDisplay) sentZnDisplay.innerText = entry.zn;
  } else {
    if(ipaDisplay) ipaDisplay.innerText = "";
    if(sentEnDisplay) sentEnDisplay.innerText = "";
    if(sentIpaDisplay) sentIpaDisplay.innerText = "";
    if(sentZnDisplay) sentZnDisplay.innerText = "";
  }
  
  if (challengeMode) checkSpelling();
}

window.clearWord = function() {
  currentWord = "";
  challengeMode = false;
  document.getElementById("message").innerText = "";
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

// 挑戰功能
window.startChallenge = function() {
  challengeMode = true;
  currentWord = "";
  updateScreen();
  challengeAnswer = challengeWords[Math.floor(Math.random() * challengeWords.length)];
  speak("Spell... " + challengeAnswer);
}

function checkSpelling() {
  if (currentWord.toLowerCase().trim() === challengeAnswer) {
    document.getElementById("message").innerText = "Correct! 🎉";
    const entry = dictionary[challengeAnswer];
    if(entry) {
       sentEnDisplay.innerText = entry.sent;
       sentZnDisplay.innerText = entry.zn;
       speak("Correct! " + challengeAnswer + ". " + entry.sent);
    }
    challengeMode = false;
  }
}
