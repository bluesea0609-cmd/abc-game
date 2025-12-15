const display = document.getElementById("display-word");
const keyboard = document.getElementById("keyboard");
const msg = document.getElementById("message");

let currentWord = "";
let challengeMode = false;
let challengeAnswer = "";

// 字母列表
const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// 1. 產生鍵盤
letters.forEach(char => {
  const btn = document.createElement("div");
  btn.className = "key";
  btn.innerText = char.toUpperCase(); // 顯示大寫
  
  btn.onclick = () => {
    // 點擊字母時
    addLetter(char);
    // 輕輕唸出字母音 (Phonics嘗試)
    speak(char, 1.5); 
  };
  keyboard.appendChild(btn);
});

// 2. 把字母加到螢幕上
function addLetter(char) {
  if (currentWord.length < 12) { // 限制長度
    currentWord += char;
    updateScreen();
  }
}

// 3. 更新畫面
function updateScreen() {
  // 如果是空的顯示底線，否則顯示單字
  display.innerText = currentWord === "" ? "_" : currentWord;
  
  // 如果在挑戰模式，檢查拼對了沒
  if (challengeMode) {
    checkSpelling();
  }
}

// 4. 清除按鈕
function clearWord() {
  currentWord = "";
  challengeMode = false; // 清除時退出挑戰模式
  msg.innerText = "自由拼字模式";
  updateScreen();
}

// 5. 唸出整個單字 (核心功能)
function speakWord() {
  if (currentWord === "") return;
  
  // 唸出螢幕上的字
  speak(currentWord, 1.0);
}

// 發音工具
function speak(text, rate) {
  window.speechSynthesis.cancel();
  const m = new SpeechSynthesisUtterance(text);
  m.lang = "en-US";
  m.rate = rate || 1.0; // 語速
  window.speechSynthesis.speak(m);
}

// --- 互動功能：聽音拼字挑戰 ---

const words = ["cat", "dog", "pig", "bat", "red", "bus", "sun", "hat", "egg", "box"];

function startChallenge() {
  challengeMode = true;
  currentWord = "";
  updateScreen();
  
  // 隨機選一個字
  challengeAnswer = words[Math.floor(Math.random() * words.length)];
  
  msg.innerText = "聽到了什麼字？請拼出來！";
  speak("Spell the word... " + challengeAnswer);
}

function checkSpelling() {
  if (currentWord.toLowerCase() === challengeAnswer) {
    msg.innerText = "答對了！太棒了！🎉";
    msg.style.color = "green";
    speak("Correct! " + challengeAnswer);
    challengeMode = false; // 結束這回合
  } else if (currentWord.length >= challengeAnswer.length) {
    // 如果拼錯但長度到了，提示一下
    msg.innerText = "不對喔，再聽一次！";
    msg.style.color = "red";
    speak("Try again. " + challengeAnswer);
    currentWord = ""; // 清空讓他重拼
    setTimeout(updateScreen, 1000);
  }
}
