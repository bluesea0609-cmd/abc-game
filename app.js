const display = document.getElementById("display-word");
const ipaDisplay = document.getElementById("display-ipa");
const sentEnDisplay = document.getElementById("display-sentence");
const sentZnDisplay = document.getElementById("display-sent-zn");
const keyboard = document.getElementById("keyboard");
const msg = document.getElementById("message");

let currentWord = "";
let challengeMode = false;
let challengeAnswer = "";

// --- 進入畫面 ---
window.enterApp = function() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("main-app").style.display = "block";
  speak("", 1.0); // 喚醒聲音
}

// --- 📖 完整 A-Z 字典 (人工核對版) ---
const dictionary = {
  // ❤️ 常用句子
  "i love you": { ipa: "[aɪ lʌv ju]", sent: "I love you very much.", zn: "我非常愛你。" },
  "thank you": { ipa: "[θæŋk ju]", sent: "You are welcome.", zn: "不客氣。" },
  "how are you": { ipa: "[haʊ ɑr ju]", sent: "I am fine.", zn: "你好嗎？" },

  // A - L (前半段)
  "apple": { ipa: "[ˋæpl]", sent: "Red apple.", zn: "紅蘋果。" },
  "ant": { ipa: "[ænt]", sent: "Small ant.", zn: "小螞蟻。" },
  "ball": { ipa: "[bɔl]", sent: "Kick the ball.", zn: "踢球。" },
  "bird": { ipa: "[bɝd]", sent: "A flying bird.", zn: "飛翔的鳥。" },
  "cat": { ipa: "[kæt]", sent: "Cute cat.", zn: "可愛的貓。" },
  "car": { ipa: "[kɑr]", sent: "Fast car.", zn: "快車。" },
  "dog": { ipa: "[dɔg]", sent: "Good dog.", zn: "好狗。" },
  "duck": { ipa: "[dʌk]", sent: "Yellow duck.", zn: "黃色小鴨。" },
  "egg": { ipa: "[ɛg]", sent: "Eat an egg.", zn: "吃蛋。" },
  "eye": { ipa: "[aɪ]", sent: "My eyes.", zn: "我的眼睛。" },
  "fish": { ipa: "[fɪʃ]", sent: "Fish swim.", zn: "魚游泳。" },
  "fan": { ipa: "[fæn]", sent: "Cool fan.", zn: "涼爽的風扇。" },
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

  // M - Z (後半段 - 這次保證有！)
  "mom": { ipa: "[mɑm]", sent: "Hi mom.", zn: "嗨媽媽。" },
  "map": { ipa: "[mæp]", sent: "Look at the map.", zn: "看地圖。" },
  "milk": { ipa: "[mɪlk]", sent: "Drink milk.", zn: "喝牛奶。" },
  "moon": { ipa: "[mun]", sent: "Full moon.", zn: "滿月。" },
  "mouse": { ipa: "[maʊs]", sent: "Small mouse.", zn: "小老鼠。" },
  
  "net": { ipa: "[nɛt]", sent: "Fishing net.", zn: "漁網。" },
  "nose": { ipa: "[noz]", sent: "My nose.", zn: "我的鼻子。" },
  "nine": { ipa: "[naɪn]", sent: "Number nine.", zn: "數字九。" },
  "nurse": { ipa: "[nɝs]", sent: "She is a nurse.", zn: "她是護士。" },

  "one": { ipa: "[wʌn]", sent: "Number one.", zn: "第一名。" },
  "ox": { ipa: "[ɑks]", sent: "Big ox.", zn: "大公牛。" },
  "orange": { ipa: "[ˋɔrɪndʒ]", sent: "Sweet orange.", zn: "甜柳橙。" },
  "open": { ipa: "[ˋopən]", sent: "Open the door.", zn: "開門。" },

  "pig": { ipa: "[pɪg]", sent: "Pink pig.", zn: "粉紅豬。" },
  "pen": { ipa: "[pɛn]", sent: "Blue pen.", zn: "藍筆。" },
  "park": { ipa: "[pɑrk]", sent: "Go to the park.", zn: "去公園。" },
  "play": { ipa: "[ple]", sent: "Let's play.", zn: "我們來玩。" },

  "queen": { ipa: "[kwin]", sent: "The queen.", zn: "女王。" },
  "quiet": { ipa: "[ˋkwaɪət]", sent: "Be quiet.", zn: "安靜。" },
  "quiz": { ipa: "[kwɪz]", sent: "Take a quiz.", zn: "小考。" },

  "red": { ipa: "[rɛd]", sent: "Red color.", zn: "紅色。" },
  "run": { ipa: "[rʌn]", sent: "Run fast.", zn: "跑快點。" },
  "rain": { ipa: "[ren]", sent: "Heavy rain.", zn: "大雨。" },
  "rabbit": { ipa: "[ˋræbɪt]", sent: "Cute rabbit.", zn: "可愛的兔子。" },

  "sun": { ipa: "[sʌn]", sent: "Hot sun.", zn: "烈日。" },
  "six": { ipa: "[sɪks]", sent: "Number six.", zn: "數字六。" },
  "star": { ipa: "[stɑr]", sent: "Shining star.", zn: "閃亮的星。" },
  "school": { ipa: "[skul]", sent: "Go to school.", zn: "去學校。" },

  "ten": { ipa: "[tɛn]", sent: "Number ten.", zn: "數字十。" },
  "top": { ipa: "[tɑp]", sent: "Spinning top.", zn: "陀螺。" },
  "tiger": { ipa: "[ˋtaɪgɚ]", sent: "Scary tiger.", zn: "可怕的老虎。" },
  "tree": { ipa: "[tri]", sent: "Big tree.", zn: "大樹。" },

  "up": { ipa: "[ʌp]", sent: "Stand up.", zn: "起立。" },
  "use": { ipa: "[juz]", sent: "Use it.", zn: "使用它。" },
  "umbrella": { ipa: "[ʌmˋbrɛlə]", sent: "Open umbrella.", zn: "打開雨傘。" },

  "van": { ipa: "[væn]", sent: "Blue van.", zn: "藍色廂型車。" },
  "vet": { ipa: "[vɛt]", sent: "Animal doctor.", zn: "獸醫。" },
  "vest": { ipa: "[vɛst]", sent: "Wear a vest.", zn: "穿背心。" },

  "water": { ipa: "[ˈwɔtɚ]", sent: "Drink water.", zn: "喝水。" },
  "win": { ipa: "[wɪn]", sent: "You win.", zn: "你贏了。" },
  "watch": { ipa: "[wɑtʃ]", sent: "My watch.", zn: "我的手錶。" },
  "wolf": { ipa: "[wʊlf]", sent: "Bad wolf.", zn: "壞野狼。" },

  "x-ray": { ipa: "[ˋɛksˋre]", sent: "X-ray photo.", zn: "X光片。" },
  "box": { ipa: "[bɑks]", sent: "A box.", zn: "一個箱子。" },
  "fox": { ipa: "[fɑks]", sent: "Smart fox.", zn: "聰明的狐狸。" },

  "yes": { ipa: "[jɛs]", sent: "Say yes.", zn: "說好。" },
  "you": { ipa: "[ju]", sent: "You and me.", zn: "你和我。" },
  "yellow": { ipa: "[ˋjɛlo]", sent: "Yellow banana.", zn: "黃色香蕉。" },
  "yoyo": { ipa: "[ˋjoˋjo]", sent: "Play yoyo.", zn: "玩溜溜球。" },

  "zoo": { ipa: "[zu]", sent: "Go to zoo.", zn: "去動物園。" },
  "zebra": { ipa: "[ˈzibrə]", sent: "Black and white.", zn: "黑白條紋。" },
  "zero": { ipa: "[ˋzɪro]", sent: "Number zero.", zn: "數字零。" }
};

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// 1. 產生鍵盤
keyboard.innerHTML =

