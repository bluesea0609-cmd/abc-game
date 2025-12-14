const container = document.getElementById("letters");
// A-Z 完整單字庫
const letters = [
  ["A", "Apple"], ["B", "Ball"], ["C", "Cat"], ["D", "Dog"], ["E", "Egg"],
  ["F", "Fish"], ["G", "Goat"], ["H", "Hat"], ["I", "Igloo"], ["J", "Jam"],
  ["K", "Kite"], ["L", "Lion"], ["M", "Moon"], ["N", "Nut"], ["O", "Orange"],
  ["P", "Pig"], ["Q", "Queen"], ["R", "Rat"], ["S", "Sun"], ["T", "Tree"],
  ["U", "Umbrella"], ["V", "Van"], ["W", "Watch"], ["X", "X-ray"], ["Y", "Yoyo"], ["Z", "Zebra"]
];

letters.forEach(item => {
  const btn = document.createElement("button");
  btn.innerText = item[0];
  btn.onclick = () => {
    speak(item[0]);
    setTimeout(() => speak(item[1]), 800);
  };
  container.appendChild(btn);
});

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US"; 
  window.speechSynthesis.speak(msg);
}

function startQuiz() {
  speak("Great job! Keep going!");
}

