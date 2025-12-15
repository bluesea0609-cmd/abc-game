const data = [
  { text: "Apple", icon: "🍎" }, { text: "Ball", icon: "⚽" },
  { text: "Cat", icon: "🐱" }, { text: "Dog", icon: "🐶" },
  { text: "Egg", icon: "🥚" }, { text: "Fish", icon: "🐟" },
  { text: "Goat", icon: "🐐" }, { text: "Hat", icon: "🎩" },
  { text: "Ice", icon: "🧊" }, { text: "Juice", icon: "🧃" },
  { text: "Kite", icon: "🪁" }, { text: "Lion", icon: "🦁" }
];

let isGame = false;
let target = null;
let score = 0;
const msgDiv = document.getElementById("message");
const scoreDiv = document.getElementById("score");

function speak(txt) {
  window.speechSynthesis.cancel();
  const m = new SpeechSynthesisUtterance(txt);
  m.lang = "en-US";
  window.speechSynthesis.speak(m);
}

function startReview() {
  isGame = false;
  msgDiv.innerText = "點擊卡片聽發音 🔊";
  msgDiv.style.color = "#333";
  render();
  speak("Study Mode");
}

function startGame() {
  isGame = true;
  score = 0;
  scoreDiv.innerText = score;
  msgDiv.innerText = "遊戲開始！加油！";
  render();
  setTimeout(nextQ, 1000);
}

function nextQ() {
  target = data[Math.floor(Math.random() * data.length)];
  msgDiv.innerText = "請找出: " + target.text + " ❓";
  msgDiv.style.color = "#d32f2f";
  speak("Find " + target.text);
}

function render() {
  const area = document.getElementById("game-area");
  area.innerHTML = "";
  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<span style='font-size:40px;'>${item.icon}</span><br><b>${item.text}</b>`;
    card.onclick = () => {
      if (!isGame) {
        speak(item.text);
        card.style.background = "#e8f5e9";
        setTimeout(()=>card.style.background="white", 200);
      } else {
        if (item.text === target.text) {
          score += 10;
          scoreDiv.innerText = score;
          msgDiv.innerText = "答對了！🎉";
          msgDiv.style.color = "green";
          speak("Good job!");
          setTimeout(nextQ, 1500);
        } else {
          speak("Try again");
          card.style.background = "#ffebee";
          setTimeout(()=>card.style.background="white", 200);
        }
      }
    };
    area.appendChild(card);
  });
}
// 啟動程式
startReview();
