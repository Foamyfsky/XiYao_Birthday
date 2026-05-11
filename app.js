const photos = Array.from({ length: 25 }, (_, index) => `XiYao_${index + 1}.png`);

const acceptedPasswords = new Set(["小瑶", "张曦瑶", "曦瑶", "瑶"]);

const screens = {
  welcome: document.querySelector("#welcome-screen"),
  forest: document.querySelector("#forest-screen"),
  room: document.querySelector("#room-screen")
};

const forestScreen = document.querySelector("#forest-screen");
const stage = document.querySelector("#forest-stage");
const dog = document.querySelector("#pixel-dog");
const petZone = document.querySelector(".pet-zone");
const bubble = document.querySelector("#pet-bubble");
const commandForm = document.querySelector("#command-form");
const commandInput = document.querySelector("#command-input");
const cottageDoor = document.querySelector("#cottage-door");
const lightButton = document.querySelector("#time-light");
const roomDog = document.querySelector("#room-dog");
const roomBubble = document.querySelector("#room-pet-bubble");
const lockDialog = document.querySelector("#lock-dialog");
const lockForm = document.querySelector("#lock-form");
const passwordInput = document.querySelector("#password-input");
const lockMessage = document.querySelector("#lock-message");
const albumDialog = document.querySelector("#album-dialog");
const albumGrid = document.querySelector("#album-grid");
const letterDialog = document.querySelector("#letter-dialog");
const sparkleBox = document.querySelector("#sparkles");
const waterSplash = document.querySelector("#water-splash");

let audioContext;
let birthdayTimer;
let lightsOn = true;
let roomUnlocked = false;
let wanderTimer;

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
  if (name === "forest") {
    startDogWander();
  } else {
    stopDogWander();
  }
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  audioContext.resume();
  return audioContext;
}

function beep(type = "cute") {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const pattern = {
    cute: [660, 880, 990],
    boop: [420, 560],
    wrong: [220, 170],
    open: [392, 523, 659, 784]
  }[type];

  pattern.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type === "wrong" ? "sawtooth" : "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now + index * 0.09);
    gain.gain.exponentialRampToValueAtTime(0.08, now + index * 0.09 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + index * 0.09);
    osc.stop(now + index * 0.09 + 0.14);
  });
}

function playBirthdaySong() {
  const ctx = getAudioContext();
  clearTimeout(birthdayTimer);

  const notes = [
    [392, 0, 0.24], [392, 0.28, 0.24], [440, 0.58, 0.5], [392, 1.14, 0.5], [523.25, 1.7, 0.5], [493.88, 2.28, 0.82],
    [392, 3.18, 0.24], [392, 3.46, 0.24], [440, 3.76, 0.5], [392, 4.32, 0.5], [587.33, 4.9, 0.5], [523.25, 5.46, 0.82],
    [392, 6.36, 0.24], [392, 6.64, 0.24], [783.99, 6.94, 0.5], [659.25, 7.5, 0.5], [523.25, 8.06, 0.5], [493.88, 8.64, 0.5], [440, 9.22, 0.82],
    [698.46, 10.12, 0.24], [698.46, 10.4, 0.24], [659.25, 10.7, 0.5], [523.25, 11.26, 0.5], [587.33, 11.84, 0.5], [523.25, 12.42, 1]
  ];

  const start = ctx.currentTime + 0.04;
  notes.forEach(([freq, offset, duration]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start + offset);
    gain.gain.exponentialRampToValueAtTime(0.13, start + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start + offset);
    osc.stop(start + offset + duration + 0.05);
  });

  birthdayTimer = setTimeout(playBirthdaySong, 14500);
}

function seasonName(date = new Date()) {
  const month = date.getMonth() + 1;
  if ([3, 4, 5].includes(month)) return "春天";
  if ([6, 7, 8].includes(month)) return "夏天";
  if ([9, 10, 11].includes(month)) return "秋天";
  return "冬天";
}

function timeGreeting() {
  const hour = new Date().getHours();
  const season = seasonName();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "你所在的地方";
  const place = timezone.includes("Sydney") ? "悉尼" : timezone.includes("Shanghai") ? "中国" : "你那边";

  if (hour < 5) return `Hola，夜猫子小瑶。${place}的${season}夜里也要抱抱自己，现在还好吗？`;
  if (hour < 9) return `早安小瑶，${place}的${season}早晨已经亮起来啦。今天也慢慢来。`;
  if (hour < 12) return `上午好小瑶，小狗在${season}森林里等你发号施令。`;
  if (hour < 18) return `下午好小瑶，${place}现在适合喝点热的，再摸摸小狗。`;
  if (hour < 23) return `晚上好小瑶，小屋灯已经替你打开了，今天辛苦啦。`;
  return `Hola，夜猫子小瑶。已经很晚了，森林小屋问你：现在心情还好吗？`;
}

function setBubble(text) {
  bubble.textContent = text;
}

function sparkle(count = 18) {
  const rect = stage.getBoundingClientRect();
  for (let i = 0; i < count; i += 1) {
    const bit = document.createElement("i");
    bit.style.left = `${rect.left + Math.random() * rect.width}px`;
    bit.style.top = `${rect.top + Math.random() * rect.height}px`;
    bit.style.setProperty("--x", `${Math.random() * 160 - 80}px`);
    bit.style.setProperty("--y", `${Math.random() * -150 - 40}px`);
    sparkleBox.appendChild(bit);
    bit.addEventListener("animationend", () => bit.remove());
  }
}

function animateTargetDog(targetDog, targetBubble, className, text, sound = "cute") {
  targetDog.classList.remove("dog-roll", "dog-hop", "dog-shake", "dog-spin", "dog-sleep", "dog-run", "dog-grimace");
  void targetDog.offsetWidth;
  targetDog.classList.add(className);
  targetBubble.textContent = text;
  beep(sound);

  if (className !== "dog-sleep") {
    setTimeout(() => targetDog.classList.remove(className, "dog-grimace"), 1100);
  }
}

function animateDog(className, text, sound = "cute") {
  animateTargetDog(dog, bubble, className, text, sound);
}

function animateRoomDog(className, text, sound = "cute") {
  animateTargetDog(roomDog, roomBubble, className, text, sound);
}

function moveDogRandomly() {
  if (!screens.forest.classList.contains("is-active")) return;
  const nextLeft = 15 + Math.random() * 70;
  const nextTop = 42 + Math.random() * 38;
  petZone.style.left = `${nextLeft}%`;
  petZone.style.top = `${nextTop}%`;
  petZone.style.bottom = "auto";
  petZone.style.transform = "translate(-50%, -50%)";
  petZone.classList.add("is-roaming");
  setTimeout(() => petZone.classList.remove("is-roaming"), 2100);
}

function startDogWander() {
  clearInterval(wanderTimer);
  setTimeout(moveDogRandomly, 1200);
  wanderTimer = setInterval(moveDogRandomly, 5200);
}

function stopDogWander() {
  clearInterval(wanderTimer);
  petZone.classList.remove("is-roaming");
}

function setTheme(theme, text) {
  forestScreen.classList.remove("theme-night", "theme-spring", "theme-rain", "theme-snow", "theme-sunset");
  if (theme) forestScreen.classList.add(theme);
  setBubble(text);
  sparkle(16);
  beep("boop");
}

function toggleLights(force) {
  lightsOn = typeof force === "boolean" ? force : !lightsOn;
  stage.classList.toggle("lights-off", !lightsOn);
  setBubble(lightsOn ? "灯打开啦。小屋现在像一块热乎乎的橘子糖。" : "灯关掉啦。森林变得更安静了。");
  beep("boop");
}

function handleCommand(rawValue) {
  const command = rawValue.trim().replace(/\s+/g, "");
  if (!command) {
    setBubble("你可以直接对我说中文，比如：打滚、换星空、开灯、睡觉。");
    return;
  }

  if (/打滚|滚|翻/.test(command)) {
    animateDog("dog-roll", "收到，小狗打滚给小瑶看。");
  } else if (/跳|蹦/.test(command)) {
    animateDog("dog-hop", "跳一下！把今天的小烦恼踩扁。");
  } else if (/转圈|旋转|转/.test(command)) {
    animateDog("dog-spin", "转圈圈，生日好运也转过来。");
  } else if (/跑|过来|来/.test(command)) {
    animateDog("dog-run", "我来啦我来啦，坐到小瑶旁边。");
  } else if (/睡|晚安|困/.test(command)) {
    animateDog("dog-sleep", "小狗趴下陪你。要是累了，我们就一起安静一会儿。", "boop");
  } else if (/喂|吃|狗粮|饭|零食/.test(command)) {
    feedRoomPet();
  } else if (/摸|抱|贴贴|陪|宠/.test(command)) {
    petRoomPet();
  } else if (/洗澡|洗|冲澡|水/.test(command)) {
    showerRoomPet();
  } else if (/鬼脸|丑脸|怪脸|摇|晃|凶/.test(command)) {
    animateDog("dog-shake", "嘿！小狗做了一个很努力的鬼脸。", "wrong");
    dog.classList.add("dog-grimace");
  } else if (/你好|嗨|hi|hello|hola|在吗|问候/.test(command)) {
    animateDog("dog-hop", timeGreeting());
  } else if (/雨|下雨/.test(command)) {
    setTheme("theme-rain", "下雨模式好了。听，森林在很轻地呼吸。");
  } else if (/雪|下雪|冬/.test(command)) {
    setTheme("theme-snow", "小雪落下来啦，记得把自己裹暖。");
  } else if (/星|夜|月|晚上|夜晚/.test(command)) {
    setTheme("theme-night", "星空模式打开。小屋灯会陪你到很晚。");
  } else if (/春|花|绿色|森林/.test(command)) {
    setTheme("theme-spring", "森林变得更绿一点，送你一小片春天。");
  } else if (/夕阳|黄昏|橘|暖/.test(command)) {
    setTheme("theme-sunset", "暖橘色黄昏来了，像老朋友的拥抱。");
  } else if (/默认|复原|原来/.test(command)) {
    setTheme("", "已经回到默认森林。小狗继续守在小屋旁边。");
  } else if (/开灯|亮/.test(command)) {
    toggleLights(true);
  } else if (/关灯|暗/.test(command)) {
    toggleLights(false);
  } else if (/回家|进屋|小屋|开门/.test(command)) {
    openLock();
  } else if (/照片|相册|信|letter/.test(command)) {
    openAlbum();
  } else {
    animateDog("dog-shake", "这句我还在学习，但我先摇一摇尾巴回应你。试试“打滚”“换星空”“开灯”。", "boop");
  }
}

function randomPetReaction() {
  const actions = [
    () => animateDog("dog-roll", "小瑶点到隐藏按钮：小狗快乐打滚。"),
    () => animateDog("dog-hop", timeGreeting()),
    () => {
      animateDog("dog-shake", "哇，被摸到了！小狗做鬼脸并抖了一下。", "wrong");
      dog.classList.add("dog-grimace");
    },
    () => animateDog("dog-spin", "小狗转圈，把生日祝福甩成星星。"),
    () => animateDog("dog-run", "小狗冲过来贴贴。")
  ];
  actions[Math.floor(Math.random() * actions.length)]();
}

function openLock() {
  lockMessage.textContent = "";
  passwordInput.value = "";
  lockDialog.showModal();
  setTimeout(() => passwordInput.focus(), 60);
  beep("boop");
}

function unlockRoom() {
  const password = passwordInput.value.trim().replace(/\s+/g, "");
  if (!acceptedPasswords.has(password)) {
    lockMessage.textContent = "暗号不对哦。提示：她的名字是“小瑶”。";
    beep("wrong");
    return;
  }

  lockDialog.close();
  roomUnlocked = true;
  showScreen("room");
  sparkle(36);
  beep("open");
  playBirthdaySong();
  animateRoomDog("dog-hop", "我也进屋啦。小瑶，生日快乐，欢迎回家。");
}

function openAlbum() {
  if (!roomUnlocked) {
    setBubble("相册信放在小屋里面。先敲门，用“小瑶”当暗号吧。");
    openLock();
    return;
  }
  albumDialog.showModal();
  beep("open");
}

function callRoomPet() {
  animateRoomDog("dog-run", "小狗从森林跑进来了：小瑶，我在，今天我负责把你捂暖。");
}

function feedRoomPet() {
  if (!roomUnlocked) {
    setBubble("先进小屋再喂小狗吧，里面有一只更乖的。");
    return;
  }
  animateRoomDog("dog-hop", "嗷呜！谢谢小瑶投喂。它把好运也叼给你。");
  sparkle(14);
}

function petRoomPet() {
  if (!roomUnlocked) {
    setBubble("摸摸森林里的小狗也可以，但屋里还有更软的一只。");
    return;
  }
  animateRoomDog("dog-spin", "被摸摸头啦。希望你也感觉像被毛茸茸的小可爱抱住一样暖。");
  sparkle(18);
}

function showerRoomPet() {
  if (!roomUnlocked) {
    setBubble("洗澡工具在屋里，先回家吧。");
    return;
  }
  animateRoomDog("dog-shake", "哗啦啦洗澡！水花飞到屏幕上啦，小狗香喷喷地回来了。", "boop");
  splashWater();
}

function splashWater() {
  for (let i = 0; i < 42; i += 1) {
    const drop = document.createElement("i");
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.top = `${Math.random() * 60}%`;
    drop.style.setProperty("--drop-x", `${Math.random() * 220 - 110}px`);
    drop.style.setProperty("--drop-y", `${140 + Math.random() * 260}px`);
    drop.style.animationDelay = `${Math.random() * 0.22}s`;
    waterSplash.appendChild(drop);
    drop.addEventListener("animationend", () => drop.remove());
  }
  beep("cute");
}

function openLetter() {
  letterDialog.showModal();
  beep("open");
}

function renderAlbum() {
  albumGrid.innerHTML = "";
  photos.forEach((src, index) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const caption = document.createElement("figcaption");
    img.src = src;
    img.alt = `小瑶的回忆照片 ${index + 1}`;
    caption.textContent = `memory ${String(index + 1).padStart(2, "0")}`;
    figure.append(img, caption);
    albumGrid.appendChild(figure);
  });
}

function applyInitialTimeMood() {
  const hour = new Date().getHours();
  if (hour >= 18 || hour < 6) {
    forestScreen.classList.add("theme-night");
    lightsOn = true;
    stage.classList.remove("lights-off");
    setBubble("晚上好，小瑶。小屋的暖灯已经亮着啦。");
  }
}

document.querySelector("#open-envelope").addEventListener("click", () => {
  showScreen("forest");
  applyInitialTimeMood();
  sparkle(28);
  beep("open");
});

dog.addEventListener("click", randomPetReaction);

commandForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleCommand(commandInput.value);
  commandInput.value = "";
});

cottageDoor.addEventListener("click", openLock);
lightButton.addEventListener("click", () => toggleLights());

lockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  unlockRoom();
});

document.querySelector("#cancel-lock").addEventListener("click", () => lockDialog.close());
document.querySelector("#back-to-forest").addEventListener("click", () => showScreen("forest"));
document.querySelector("#letter-open").addEventListener("click", openAlbum);
document.querySelector("#close-album").addEventListener("click", () => albumDialog.close());
document.querySelectorAll(".book-icon").forEach((button) => {
  button.addEventListener("click", openLetter);
});
document.querySelector("#close-letter").addEventListener("click", () => letterDialog.close());
document.querySelector("#call-pet").addEventListener("click", callRoomPet);
document.querySelector("#feed-pet").addEventListener("click", feedRoomPet);
document.querySelector("#pet-pet").addEventListener("click", petRoomPet);
document.querySelector("#shower-pet").addEventListener("click", showerRoomPet);
roomDog.addEventListener("click", petRoomPet);

renderAlbum();
