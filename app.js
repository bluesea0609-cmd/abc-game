const display = document.getElementById("display-word");
const ipaDisplay = document.getElementById("display-ipa");
// 取得顯示位置
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

// --- 📖 超級海量字典 (300+ 單字) ---
const dictionary = {
  // A
  "about": { ipa: "[əˋbaʊt]", sent: "Tell me about it.", sentIpa: "[tɛl mi əˈbaʊt ɪt]", zn: "跟我說說看。" },
  "actor": { ipa: "[ˋæktɚ]", sent: "He is an actor.", sentIpa: "[hi ɪz ən ˈæktɚ]", zn: "他是一位演員。" },
  "airplane": { ipa: "[ˋɛr͵plen]", sent: "Look at the airplane.", sentIpa: "[lʊk æt ðə ˈɛr͵plen]", zn: "看那架飛機。" },
  "all": { ipa: "[ɔl]", sent: "We are all happy.", sentIpa: "[wi ɑr ɔl ˈhæpi]", zn: "我們都很開心。" },
  "and": { ipa: "[ænd]", sent: "You and I.", sentIpa: "[ju ænd aɪ]", zn: "你和我。" },
  "angry": { ipa: "[ˋæŋgrɪ]", sent: "Do not be angry.", sentIpa: "[du nɑt bi ˈæŋgrɪ]", zn: "不要生氣。" },
  "animal": { ipa: "[ˋænəməl]", sent: "I love animals.", sentIpa: "[aɪ lʌv ˈænəməlz]", zn: "我愛動物。" },
  "ant": { ipa: "[ænt]", sent: "The ant is small.", sentIpa: "[ðə ænt ɪz smɔl]", zn: "螞蟻很小。" },
  "apple": { ipa: "[ˋæpl]", sent: "I like apples.", sentIpa: "[aɪ laɪk ˈæpəlz]", zn: "我喜歡蘋果。" },
  "apply": { ipa: "[əˋplaɪ]", sent: "Apply for a job.", sentIpa: "[əˈplaɪ fɔr ə dʒɑb]", zn: "申請工作。" },
  "arm": { ipa: "[ɑrm]", sent: "This is my arm.", sentIpa: "[ðɪs ɪz maɪ ɑrm]", zn: "這是我的手臂。" },
  "art": { ipa: "[ɑrt]", sent: "I like art class.", sentIpa: "[aɪ laɪk ɑrt klæs]", zn: "我喜歡美術課。" },
  "ask": { ipa: "[æsk]", sent: "Ask him a question.", sentIpa: "[æsk hɪm ə ˈkwɛstʃən]", zn: "問他一個問題。" },
  "at": { ipa: "[æt]", sent: "Look at me.", sentIpa: "[lʊk æt mi]", zn: "看著我。" },
  "aunt": { ipa: "[ænt]", sent: "She is my aunt.", sentIpa: "[ʃi ɪz maɪ ænt]", zn: "她是我的阿姨。" },
  
  // B
  "baby": { ipa: "[ˋbebɪ]", sent: "The baby is sleeping.", sentIpa: "[ðə ˈbebɪ ɪz ˈslipɪŋ]", zn: "寶寶正在睡覺。" },
  "back": { ipa: "[bæk]", sent: "Come back.", sentIpa: "[kʌm bæk]", zn: "回來。" },
  "bad": { ipa: "[bæd]", sent: "Not bad.", sentIpa: "[nɑt bæd]", zn: "還不錯。" },
  "bag": { ipa: "[bæg]", sent: "Open your bag.", sentIpa: "[ˈopən jʊr bæg]", zn: "打開你的包包。" },
  "ball": { ipa: "[bɔl]", sent: "Kick the ball.", sentIpa: "[kɪk ðə bɔl]", zn: "踢球。" },
  "banana": { ipa: "[bəˋnænə]", sent: "I want a banana.", sentIpa: "[aɪ wɑnt ə bəˋnænə]", zn: "我想要一根香蕉。" },
  "bank": { ipa: "[bæŋk]", sent: "Go to the bank.", sentIpa: "[go tu ðə bæŋk]", zn: "去銀行。" },
  "bat": { ipa: "[bæt]", sent: "I saw a bat.", sentIpa: "[aɪ sɔ ə bæt]", zn: "我看見一隻蝙蝠。" },
  "bath": { ipa: "[bæθ]", sent: "Take a bath.", sentIpa: "[tek ə bæθ]", zn: "洗個澡。" },
  "bear": { ipa: "[bɛr]", sent: "The bear is big.", sentIpa: "[ðə bɛr ɪz bɪg]", zn: "這隻熊很大。" },
  "bed": { ipa: "[bɛd]", sent: "Go to bed.", sentIpa: "[go tu bɛd]", zn: "上床睡覺。" },
  "bee": { ipa: "[bi]", sent: "The bee is busy.", sentIpa: "[ðə bi ɪz ˈbɪzi]", zn: "蜜蜂很忙碌。" },
  "beef": { ipa: "[bif]", sent: "I like beef.", sentIpa: "[aɪ laɪk bif]", zn: "我喜歡牛肉。" },
  "big": { ipa: "[bɪg]", sent: "The house is big.", sentIpa: "[ðə haʊs ɪz bɪg]", zn: "這房子很大。" },
  "bike": { ipa: "[baɪk]", sent: "Ride a bike.", sentIpa: "[raɪd ə baɪk]", zn: "騎腳踏車。" },
  "bird": { ipa: "[bɝd]", sent: "Look at the bird.", sentIpa: "[lʊk æt ðə bɝd]", zn: "看那隻鳥。" },
  "black": { ipa: "[blæk]", sent: "A black cat.", sentIpa: "[ə blæk kæt]", zn: "一隻黑貓。" },
  "blue": { ipa: "[blu]", sent: "The sky is blue.", sentIpa: "[ðə skaɪ ɪz blu]", zn: "天空是藍色的。" },
  "boat": { ipa: "[bot]", sent: "Row the boat.", sentIpa: "[ro ðə bot]", zn: "划船。" },
  "body": { ipa: "[ˋbɑdɪ]", sent: "Move your body.", sentIpa: "[muv jʊr ˈbɑdɪ]", zn: "動動你的身體。" },
  "book": { ipa: "[bʊk]", sent: "Read a book.", sentIpa: "[rid ə bʊk]", zn: "讀一本書。" },
  "box": { ipa: "[bɑks]", sent: "Open the box.", sentIpa: "[ˈopən ðə bɑks]", zn: "打開盒子。" },
  "boy": { ipa: "[bɔɪ]", sent: "He is a boy.", sentIpa: "[hi ɪz ə bɔɪ]", zn: "他是一個男孩。" },
  "bread": { ipa: "[brɛd]", sent: "Eat some bread.", sentIpa: "[it sʌm brɛd]", zn: "吃點麵包。" },
  "bus": { ipa: "[bʌs]", sent: "The bus is coming.", sentIpa: "[ðə bʌs ɪz ˈkʌmɪŋ]", zn: "公車來了。" },
  "buy": { ipa: "[baɪ]", sent: "Buy some food.", sentIpa: "[baɪ sʌm fud]", zn: "買點食物。" },
  
  // C
  "cake": { ipa: "[kek]", sent: "Birthday cake.", sentIpa: "[ˈbɝθ͵de kek]", zn: "生日蛋糕。" },
  "call": { ipa: "[kɔl]", sent: "Call me.", sentIpa: "[kɔl mi]", zn: "打給我。" },
  "camera": { ipa: "[ˋkæmərə]", sent: "Use a camera.", sentIpa: "[juz ə ˈkæmərə]", zn: "用相機。" },
  "can": { ipa: "[kæn]", sent: "I can swim.", sentIpa: "[aɪ kæn swɪm]", zn: "我會游泳。" },
  "candy": { ipa: "[ˋkændɪ]", sent: "Sweet candy.", sentIpa: "[swit ˈkændɪ]", zn: "甜甜的糖果。" },
  "cap": { ipa: "[kæp]", sent: "Wear a cap.", sentIpa: "[wɛr ə kæp]", zn: "戴鴨舌帽。" },
  "car": { ipa: "[kɑr]", sent: "My dad has a car.", sentIpa: "[maɪ dæd hæz ə kɑr]", zn: "爸爸有一輛車。" },
  "card": { ipa: "[kɑrd]", sent: "A birthday card.", sentIpa: "[ə ˈbɝθ͵de kɑrd]", zn: "一張生日卡片。" },
  "cat": { ipa: "[kæt]", sent: "The cat is cute.", sentIpa: "[ðə kæt ɪz kjut]", zn: "貓很可愛。" },
  "chair": { ipa: "[tʃɛr]", sent: "Sit on the chair.", sentIpa: "[sɪt ɑn ðə tʃɛr]", zn: "坐在椅子上。" },
  "class": { ipa: "[klæs]", sent: "Go to class.", sentIpa: "[go tu klæs]", zn: "去上課。" },
  "clean": { ipa: "[klin]", sent: "Clean your room.", sentIpa: "[klin jʊr rum]", zn: "打掃你的房間。" },
  "clock": { ipa: "[klɑk]", sent: "Watch the clock.", sentIpa: "[wɑtʃ ðə klɑk]", zn: "看時鐘。" },
  "close": { ipa: "[kloz]", sent: "Close the door.", sentIpa: "[kloz ðə dɔr]", zn: "關門。" },
  "coat": { ipa: "[kot]", sent: "Put on your coat.", sentIpa: "[pʊt ɑn jʊr kot]", zn: "穿上外套。" },
  "cold": { ipa: "[kold]", sent: "It is cold.", sentIpa: "[ɪt ɪz kold]", zn: "天氣很冷。" },
  "come": { ipa: "[kʌm]", sent: "Come here.", sentIpa: "[kʌm hɪr]", zn: "過來這裡。" },
  "cook": { ipa: "[kʊk]", sent: "Mom cooks dinner.", sentIpa: "[mɑm kʊks ˈdɪnɚ]", zn: "媽媽煮晚餐。" },
  "cool": { ipa: "[kul]", sent: "That is cool.", sentIpa: "[ðæt ɪz kul]", zn: "太酷了。" },
  "corn": { ipa: "[kɔrn]", sent: "I like corn.", sentIpa: "[aɪ laɪk kɔrn]", zn: "我喜歡玉米。" },
  "cow": { ipa: "[kaʊ]", sent: "The cow gives milk.", sentIpa: "[ðə kaʊ gɪvz mɪlk]", zn: "母牛產奶。" },
  "cry": { ipa: "[kraɪ]", sent: "Don't cry.", sentIpa: "[dont kraɪ]", zn: "別哭。" },
  "cup": { ipa: "[kʌp]", sent: "A cup of tea.", sentIpa: "[ə kʌp ʌv ti]", zn: "一杯茶。" },
  "cut": { ipa: "[kʌt]", sent: "Don't cut yourself.", sentIpa: "[dont kʌt jʊrˈsɛlf]", zn: "別割傷自己。" },
  "cute": { ipa: "[kjut]", sent: "You are cute.", sentIpa: "[ju ɑr kjut]", zn: "你很可愛。" },
  
  // D
  "dad": { ipa: "[dæd]", sent: "I love my dad.", sentIpa: "[aɪ lʌv maɪ dæd]", zn: "我愛爸爸。" },
  "dance": { ipa: "[dæns]", sent: "Let's dance.", sentIpa: "[lɛts dæns]", zn: "我們來跳舞吧。" },
  "day": { ipa: "[de]", sent: "Have a nice day.", sentIpa: "[hæv ə naɪs de]", zn: "祝你有美好的一天。" },
  "desk": { ipa: "[dɛsk]", sent: "Sit at the desk.", sentIpa: "[sɪt æt ðə dɛsk]", zn: "坐在書桌前。" },
  "do": { ipa: "[du]", sent: "Do your homework.", sentIpa: "[du jʊr ˈhom͵wɝk]", zn: "做功課。" },
  "doctor": { ipa: "[ˋdɑktɚ]", sent: "See a doctor.", sentIpa: "[si ə ˋdɑktɚ]", zn: "看醫生。" },
  "dog": { ipa: "[dɔg]", sent: "The dog barks.", sentIpa: "[ðə dɔg bɑrks]", zn: "狗在叫。" },
  "doll": { ipa: "[dɑl]", sent: "She has a doll.", sentIpa: "[ʃi hæz ə dɑl]", zn: "她有一個洋娃娃。" },
  "door": { ipa: "[dɔr]", sent: "Open the door.", sentIpa: "[ˈopən ðə dɔr]", zn: "開門。" },
  "down": { ipa: "[daʊn]", sent: "Sit down.", sentIpa: "[sɪt daʊn]", zn: "坐下。" },
  "draw": { ipa: "[drɔ]", sent: "Draw a picture.", sentIpa: "[drɔ ə ˈpɪktʃɚ]", zn: "畫一張圖。" },
  "drink": { ipa: "[drɪŋk]", sent: "Drink water.", sentIpa: "[drɪŋk ˈwɔtɚ]", zn: "喝水。" },
  "drive": { ipa: "[draɪv]", sent: "Drive a car.", sentIpa: "[draɪv ə kɑr]", zn: "開車。" },
  "duck": { ipa: "[dʌk]", sent: "The duck swims.", sentIpa: "[ðə dʌk swɪmz]", zn: "鴨子在游泳。" },
  
  // E
  "ear": { ipa: "[ɪr]", sent: "I have two ears.", sentIpa: "[aɪ hæv tu ɪrz]", zn: "我有兩隻耳朵。" },
  "eat": { ipa: "[it]", sent: "Eat some food.", sentIpa: "[it sʌm fud]", zn: "吃點食物。" },
  "egg": { ipa: "[ɛg]", sent: "Eat an egg.", sentIpa: "[it ən ɛg]", zn: "吃一顆蛋。" },
  "eight": { ipa: "[et]", sent: "Eight apples.", sentIpa: "[et ˈæpəlz]", zn: "八顆蘋果。" },
  "elephant": { ipa: "[ˋɛləfənt]", sent: "A big elephant.", sentIpa: "[ə bɪg ˋɛləfənt]", zn: "一隻大象。" },
  "end": { ipa: "[ɛnd]", sent: "The end.", sentIpa: "[ðə ɛnd]", zn: "結束。" },
  "eye": { ipa: "[aɪ]", sent: "Close your eyes.", sentIpa: "[kloz jʊr aɪz]", zn: "閉上眼睛。" },
  
  // F
  "face": { ipa: "[fes]", sent: "Wash your face.", sentIpa: "[wɑʃ jʊr fes]", zn: "洗臉。" },
  "fall": { ipa: "[fɔl]", sent: "Don't fall.", sentIpa: "[dont fɔl]", zn: "別跌倒。" },
  "fan": { ipa: "[fæn]", sent: "Turn on the fan.", sentIpa: "[tɝn ɑn ðə fæn]", zn: "開電風扇。" },
  "farm": { ipa: "[fɑrm]", sent: "Live on a farm.", sentIpa: "[lɪv ɑn ə fɑrm]", zn: "住在農場。" },
  "fast": { ipa: "[fæst]", sent: "Run fast.", sentIpa: "[rʌn fæst]", zn: "跑快點。" },
  "fat": { ipa: "[fæt]", sent: "The pig is fat.", sentIpa: "[ðə pɪg ɪz fæt]", zn: "這隻豬很胖。" },
  "father": { ipa: "[ˋfɑðɚ]", sent: "My father is tall.", sentIpa: "[maɪ ˋfɑðɚ ɪz tɔl]", zn: "我父親很高。" },
  "fire": { ipa: "[faɪr]", sent: "Fire is hot.", sentIpa: "[faɪr ɪz hɑt]", zn: "火很熱。" },
  "fish": { ipa: "[fɪʃ]", sent: "Fish swim.", sentIpa: "[fɪʃ swɪm]", zn: "魚會游泳。" },
  "five": { ipa: "[faɪv]", sent: "Give me five.", sentIpa: "[gɪv mi faɪv]", zn: "擊掌。" },
  "flower": { ipa: "[ˋflaʊɚ]", sent: "A red flower.", sentIpa: "[ə rɛd ˋflaʊɚ]", zn: "一朵紅花。" },
  "fly": { ipa: "[flaɪ]", sent: "Birds can fly.", sentIpa: "[bɝdz kæn flaɪ]", zn: "鳥會飛。" },
  "foot": { ipa: "[fʊt]", sent: "My foot hurts.", sentIpa: "[maɪ fʊt hɝts]", zn: "我的腳很痛。" },
  "four": { ipa: "[fɔr]", sent: "Four cats.", sentIpa: "[fɔr kæts]", zn: "四隻貓。" },
  "fox": { ipa: "[fɑks]", sent: "A clever fox.", sentIpa: "[ə ˈklɛvɚ fɑks]", zn: "一隻聰明的狐狸。" },
  "frog": { ipa: "[frɑg]", sent: "The frog jumps.", sentIpa: "[ðə frɑg dʒʌmps]", zn: "青蛙在跳。" },
  "fruit": { ipa: "[frut]", sent: "Eat fruit.", sentIpa: "[it frut]", zn: "吃水果。" },
  "fun": { ipa: "[fʌn]", sent: "Have fun.", sentIpa: "[hæv fʌn]", zn: "玩得開心。" },
  
  // G
  "game": { ipa: "[gem]", sent: "Play a game.", sentIpa: "[ple ə gem]", zn: "玩遊戲。" },
  "garden": { ipa: "[ˋgɑrdn]", sent: "In the garden.", sentIpa: "[ɪn ðə ˋgɑrdn]", zn: "在花園裡。" },
  "gift": { ipa: "[gɪft]", sent: "A birthday gift.", sentIpa: "[ə ˈbɝθ͵de gɪft]", zn: "一份生日禮物。" },
  "girl": { ipa: "[gɝl]", sent: "She is a girl.", sentIpa: "[ʃi ɪz ə gɝl]", zn: "她是一個女孩。" },
  "glass": { ipa: "[glæs]", sent: "A glass of milk.", sentIpa: "[ə glæs ʌv mɪlk]", zn: "一杯牛奶。" },
  "go": { ipa: "[go]", sent: "Let's go.", sentIpa: "[lɛts go]", zn: "我們走吧。" },
  "goat": { ipa: "[got]", sent: "Goat eats grass.", sentIpa: "[got its græs]", zn: "山羊吃草。" },
  "good": { ipa: "[gʊd]", sent: "Good job!", sentIpa: "[gʊd dʒɑb]", zn: "做得好！" },
  "grass": { ipa: "[græs]", sent: "Green grass.", sentIpa: "[grin græs]", zn: "綠色的草。" },
  "green": { ipa: "[grin]", sent: "The grass is green.", sentIpa: "[ðə græs ɪz grin]", zn: "草是綠色的。" },
  
  // H
  "hair": { ipa: "[hɛr]", sent: "Long hair.", sentIpa: "[lɔŋ hɛr]", zn: "長頭髮。" },
  "hand": { ipa: "[hænd]", sent: "Wash your hands.", sentIpa: "[wɑʃ jʊr hændz]", zn: "洗手。" },
  "happy": { ipa: "[ˋhæpɪ]", sent: "I am happy.", sentIpa: "[aɪ æm ˋhæpɪ]", zn: "我很開心。" },
  "hat": { ipa: "[hæt]", sent: "Wear a hat.", sentIpa: "[wɛr ə hæt]", zn: "戴帽子。" },
  "head": { ipa: "[hɛd]", sent: "Nod your head.", sentIpa: "[nɑd jʊr hɛd]", zn: "點點頭。" },
  "help": { ipa: "[hɛlp]", sent: "Help me.", sentIpa: "[hɛlp mi]", zn: "幫我。" },
  "hen": { ipa: "[hɛn]", sent: "The hen lays eggs.", sentIpa: "[ðə hɛn lez ɛgz]", zn: "母雞下蛋。" },
  "hi": { ipa: "[haɪ]", sent: "Say hi to him.", sentIpa: "[se haɪ tu hɪm]", zn: "跟他說嗨。" },
  "home": { ipa: "[hom]", sent: "Go home.", sentIpa: "[go hom]", zn: "回家。" },
  "horse": { ipa: "[hɔrs]", sent: "Ride a horse.", sentIpa: "[raɪd ə hɔrs]", zn: "騎馬。" },
  "hot": { ipa: "[hɑt]", sent: "It is hot today.", sentIpa: "[ɪt ɪz hɑt təˈde]", zn: "今天很熱。" },
  "house": { ipa: "[haʊs]", sent: "A big house.", sentIpa: "[ə bɪg haʊs]", zn: "一間大房子。" },
  
  // I
  "ice": { ipa: "[aɪs]", sent: "Ice is cold.", sentIpa: "[aɪs ɪz kold]", zn: "冰是冷的。" },
  "ink": { ipa: "[ɪŋk]", sent: "I need ink.", sentIpa: "[aɪ nid ɪŋk]", zn: "我需要墨水。" },
  "it": { ipa: "[ɪt]", sent: "It is a dog.", sentIpa: "[ɪt ɪz ə dɔg]", zn: "它是一隻狗。" },
  
  // J
  "jacket": { ipa: "[ˋdʒækɪt]", sent: "Wear a jacket.", sentIpa: "[wɛr ə ˋdʒækɪt]", zn: "穿外套。" },
  "jam": { ipa: "[dʒæm]", sent: "I like jam.", sentIpa: "[aɪ laɪk dʒæm]", zn: "我喜歡果醬。" },
  "jet": { ipa: "[dʒɛt]", sent: "A fast jet.", sentIpa: "[ə fæst dʒɛt]", zn: "一架快速的噴射機。" },
  "job": { ipa: "[dʒɑb]", sent: "Good job.", sentIpa: "[gʊd dʒɑb]", zn: "做得好。" },
  "joy": { ipa: "[dʒɔɪ]", sent: "Jump for joy.", sentIpa: "[dʒʌmp fɔr dʒɔɪ]", zn: "高興得跳起來。" },
  "juice": { ipa: "[dʒus]", sent: "Drink juice.", sentIpa: "[drɪŋk dʒus]", zn: "喝果汁。" },
  "jump": { ipa: "[dʒʌmp]", sent: "Jump high.", sentIpa: "[dʒʌmp haɪ]", zn: "跳高。" },
  
  // K
  "key": { ipa: "[ki]", sent: "I lost my key.", sentIpa: "[aɪ lɔst maɪ ki]", zn: "我弄丟鑰匙了。" },
  "kid": { ipa: "[kɪd]", sent: "He is a kid.", sentIpa: "[hi ɪz ə kɪd]", zn: "他是個小孩。" },
  "king": { ipa: "[kɪŋ]", sent: "The king is here.", sentIpa: "[ðə kɪŋ ɪz hɪr]", zn: "國王在這裡。" },
  "kiss": { ipa: "[kɪs]", sent: "Give me a kiss.", sentIpa: "[gɪv mi ə kɪs]", zn: "給我一個吻。" },
  "kitchen": { ipa: "[ˋkɪtʃɪn]", sent: "In the kitchen.", sentIpa: "[ɪn ðə ˋkɪtʃɪn]", zn: "在廚房裡。" },
  "kite": { ipa: "[kaɪt]", sent: "Fly a kite.", sentIpa: "[flaɪ ə kaɪt]", zn: "放風箏。" },
  
  // L
  "lamp": { ipa: "[læmp]", sent: "Turn on the lamp.", sentIpa: "[tɝn ɑn ðə læmp]", zn: "開燈。" },
  "leg": { ipa: "[lɛg]", sent: "My leg hurts.", sentIpa: "[maɪ lɛg hɝts]", zn: "我的腿很痛。" },
  "lemon": { ipa: "[ˋlɛmən]", sent: "Sour lemon.", sentIpa: "[saʊr ˋlɛmən]", zn: "酸檸檬。" },
  "like": { ipa: "[laɪk]", sent: "I like you.", sentIpa: "[aɪ laɪk ju]", zn: "我喜歡你。" },
  "lion": { ipa: "[ˈlaɪən]", sent: "The lion roars.", sentIpa: "[ðə ˈlaɪən rɔrz]", zn: "獅子在吼叫。" },
  "lip": { ipa: "[lɪp]", sent: "Red lips.", sentIpa: "[rɛd lɪps]", zn: "紅嘴唇。" },
  "look": { ipa: "[lʊk]", sent: "Look at this.", sentIpa: "[lʊk æt ðɪs]", zn: "看這個。" },
  "love": { ipa: "[lʌv]", sent: "I love you.", sentIpa: "[aɪ lʌv ju]", zn: "我愛你。" },
  "lunch": { ipa: "[lʌntʃ]", sent: "Eat lunch.", sentIpa: "[it lʌntʃ]", zn: "吃午餐。" },
  
  // M
  "make": { ipa: "[mek]", sent: "Make a cake.", sentIpa: "[mek ə kek]", zn: "做蛋糕。" },
  "man": { ipa: "[mæn]", sent: "He is a tall man.", sentIpa: "[hi ɪz ə tɔl mæn]", zn: "他是個高大的男人。" },
  "map": { ipa: "[mæp]", sent: "Look at the map.", sentIpa: "[lʊk æt ðə mæp]", zn: "看地圖。" },
  "mat": { ipa: "[mæt]", sent: "Sit on the mat.", sentIpa: "[sɪt ɑn ðə mæt]", zn: "坐在墊子上。" },
  "milk": { ipa: "[mɪlk]", sent: "Drink some milk.", sentIpa: "[drɪŋk sʌm mɪlk]", zn: "喝點牛奶。" },
  "mom": { ipa: "[mɑm]", sent: "I help my mom.", sentIpa: "[aɪ hɛlp maɪ mɑm]", zn: "我幫媽媽。" },
  "monkey": { ipa: "[ˋmʌŋkɪ]", sent: "Funny monkey.", sentIpa: "[ˈfʌnɪ ˋmʌŋkɪ]", zn: "好笑的猴子。" },
  "moon": { ipa: "[mun]", sent: "The moon is round.", sentIpa: "[ðə mun ɪz raʊnd]", zn: "月亮是圓的。" },
  "mouse": { ipa: "[maʊs]", sent: "A small mouse.", sentIpa: "[ə smɔl maʊs]", zn: "一隻小老鼠。" },
  "mouth": { ipa: "[maʊθ]", sent: "Open your mouth.", sentIpa: "[ˈopən jʊr maʊθ]", zn: "張開嘴巴。" },
  "music": { ipa: "[ˋmjuzɪk]", sent: "Listen to music.", sentIpa: "[ˋlɪsn tu ˋmjuzɪk]", zn: "聽音樂。" },
  
  // N
  "name": { ipa: "[nem]", sent: "My name is John.", sentIpa: "[maɪ nem ɪz dʒɑn]", zn: "我的名字是約翰。" },
  "neck": { ipa: "[nɛk]", sent: "My neck hurts.", sentIpa: "[maɪ nɛk hɝts]", zn: "我脖子痛。" },
  "net": { ipa: "[nɛt]", sent: "A fishing net.", sentIpa: "[ə ˈfɪʃɪŋ nɛt]", zn: "一張漁網。" },
  "new": { ipa: "[nju]", sent: "A new car.", sentIpa: "[ə nju kɑr]", zn: "一輛新車。" },
  "night": { ipa: "[naɪt]", sent: "Good night.", sentIpa: "[gʊd naɪt]", zn: "晚安。" },
  "nine": { ipa: "[naɪn]", sent: "Nine pens.", sentIpa: "[naɪn pɛnz]", zn: "九支筆。" },
  "no": { ipa: "[no]", sent: "Say no.", sentIpa: "[se no]", zn: "說不。" },
  "nose": { ipa: "[noz]", sent: "Touch your nose.", sentIpa: "[tʌtʃ jʊr noz]", zn: "摸摸你的鼻子。" },
  "nurse": { ipa: "[nɝs]", sent: "She is a nurse.", sentIpa: "[ʃi ɪz ə nɝs]", zn: "她是護理師。" },
  "nut": { ipa: "[nʌt]", sent: "A hard nut.", sentIpa: "[ə hɑrd nʌt]", zn: "一顆堅硬的堅果。" },
  
  // O
  "ocean": { ipa: "[ˋoʃən]", sent: "The ocean is deep.", sentIpa: "[ðə ˋoʃən ɪz dip]", zn: "海洋很深。" },
  "old": { ipa: "[old]", sent: "He is old.", sentIpa: "[hi ɪz old]", zn: "他老了。" },
  "one": { ipa: "[wʌn]", sent: "I have one apple.", sentIpa: "[aɪ hæv wʌn ˈæpəl]", zn: "我有一顆蘋果。" },
  "open": { ipa: "[ˋopən]", sent: "Open the book.", sentIpa: "[ˋopən ðə bʊk]", zn: "打開書。" },
  "orange": { ipa: "[ˋɔrɪndʒ]", sent: "An orange orange.", sentIpa: "[ən ˋɔrɪndʒ ˋɔrɪndʒ]", zn: "一顆橘色的柳橙。" },
  "ox": { ipa: "[ɑks]", sent: "The ox is strong.", sentIpa: "[ðə ɑks ɪz strɔŋ]", zn: "公牛很強壯。" },
  
  // P
  "pan": { ipa: "[pæn]", sent: "Cook in a pan.", sentIpa: "[kʊk ɪn ə pæn]", zn: "用平底鍋煮。" },
  "panda": { ipa: "[ˋpændə]", sent: "Cute panda.", sentIpa: "[kjut ˋpændə]", zn: "可愛的貓熊。" },
  "park": { ipa: "[pɑrk]", sent: "Play in the park.", sentIpa: "[ple ɪn ðə pɑrk]", zn: "在公園玩。" },
  "pen": { ipa: "[pɛn]", sent: "Use a pen.", sentIpa: "[juz ə pɛn]", zn: "用原子筆。" },
  "pencil": { ipa: "[ˋpɛnsl]", sent: "A sharp pencil.", sentIpa: "[ə ʃɑrp ˋpɛnsl]", zn: "一支尖鉛筆。" },
  "pet": { ipa: "[pɛt]", sent: "I have a pet.", sentIpa: "[aɪ hæv ə pɛt]", zn: "我有一隻寵物。" },
  "phone": { ipa: "[fon]", sent: "Answer the phone.", sentIpa: "[ˈænsɚ ðə fon]", zn: "接電話。" },
  "pig": { ipa: "[pɪg]", sent: "The pig is pink.", sentIpa: "[ðə pɪg ɪz pɪŋk]", zn: "豬是粉紅色的。" },
  "pink": { ipa: "[pɪŋk]", sent: "A pink flower.", sentIpa: "[ə pɪŋk ˋflaʊɚ]", zn: "一朵粉紅花。" },
  "pizza": { ipa: "[ˋpitsə]", sent: "I love pizza.", sentIpa: "[aɪ lʌv ˋpitsə]", zn: "我愛披薩。" },
  "play": { ipa: "[ple]", sent: "Let's play.", sentIpa: "[lɛts ple]", zn: "我們來玩吧。" },
  "pot": { ipa: "[pɑt]", sent: "A hot pot.", sentIpa: "[ə hɑt pɑt]", zn: "一個熱鍋子。" },
  
  // Q
  "queen": { ipa: "[kwin]", sent: "She is a queen.", sentIpa: "[ʃi ɪz ə kwin]", zn: "她是一位女王。" },
  "question": { ipa: "[ˋkwɛstʃən]", sent: "Ask a question.", sentIpa: "[æsk ə ˋkwɛstʃən]", zn: "問個問題。" },
  "quiet": { ipa: "[ˋkwaɪət]", sent: "Be quiet.", sentIpa: "[bi ˋkwaɪət]", zn: "安靜。" },
  
  // R
  "rabbit": { ipa: "[ˋræbɪt]", sent: "A white rabbit.", sentIpa: "[ə hwaɪt ˋræbɪt]", zn: "一隻白兔子。" },
  "rain": { ipa: "[ren]", sent: "It is raining.", sentIpa: "[ɪt ɪz ˈrenɪŋ]", zn: "正在下雨。" },
  "rat": { ipa: "[ræt]", sent: "I saw a rat.", sentIpa: "[aɪ sɔ ə ræt]", zn: "我看到一隻大老鼠。" },
  "read": { ipa: "[rid]", sent: "Read a book.", sentIpa: "[rid ə bʊk]", zn: "讀書。" },
  "red": { ipa: "[rɛd]", sent: "Red apple.", sentIpa: "[rɛd ˈæpəl]", zn: "紅蘋果。" },
  "rice": { ipa: "[raɪs]", sent: "Eat rice.", sentIpa: "[it raɪs]", zn: "吃飯。" },
  "robot": { ipa: "[ˋrobət]", sent: "I am a robot.", sentIpa: "[aɪ æm ə ˋrobət]", zn: "我是機器人。" },
  "room": { ipa: "[rum]", sent: "Clean your room.", sentIpa: "[klin jʊr rum]", zn: "打掃房間。" },
  "rose": { ipa: "[roz]", sent: "A red rose.", sentIpa: "[ə rɛd roz]", zn: "一朵紅玫瑰。" },
  "run": { ipa: "[rʌn]", sent: "Run fast!", sentIpa: "[rʌn fæst]", zn: "跑快一點！" },
  
  // S
  "sad": { ipa: "[sæd]", sent: "Do not be sad.", sentIpa: "[du nɑt bi sæd]", zn: "別難過。" },
  "school": { ipa: "[skul]", sent: "Go to school.", sentIpa: "[go tu skul]", zn: "去學校。" },
  "sea": { ipa: "[si]", sent: "The sea is blue.", sentIpa: "[ðə si ɪz 
