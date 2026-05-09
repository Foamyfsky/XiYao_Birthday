const images = [
  "XiYao_1.png", "XiYao_2.png", "XiYao_3.png", "XiYao_4.png", "XiYao_5.png",
  "XiYao_6.png", "XiYao_7.png", "XiYao_8.png", "XiYao_9.png", "XiYao_10.png",
  "XiYao_11.png", "XiYao_12.png", "XiYao_13.png", "XiYao_14.png", "XiYao_15.png",
  "XiYao_16.png", "XiYao_17.png", "XiYao_18.png", "XiYao_19.png", "XiYao_20.png",
  "XiYao_21.png", "XiYao_22.png", "XiYao_23.png", "XiYao_24.png", "XiYao_25.png"
];

const stages = [
  {
    kicker: "memory 01 / since 2011",
    title: "慢悠悠暖洋洋的童年",
    caption: "2011 开始，有些人一出现，就把童年变成会发光的底片。",
    body: "我们那时候还小，世界也小，小到一段多走出来的150米都像一场正式的冒险。可就是这样一点一点的明天见，攒成了后来漫长岁月里最可靠的底气。",
    photos: [0, 1, 2, 3, 4]
  },
  {
    kicker: "memory 02 / cloudy days",
    title: "封在窗里的那些年",
    caption: "有些年份很难，可你没有被它们打败。",
    body: "后来世界突然变得安静，门外有风声，心里也有很多说不出口的疲惫。小瑶，你一直比自己想象得更勇敢，哪怕害羞、安静、低落，也还是一点点往前，把很难的日子走成了已经过去的日子。",
    photos: [5, 6, 7, 8, 9]
  },
  {
    kicker: "memory 03 / growing up",
    title: "各自赶路，也互相惦记",
    caption: "忙碌把见面变少，但没有把我们变远。",
    body: "再后来，我们被现实推着长大，被时间表、城市和很多必须完成的事分开。可我知道，有一种朋友不用每天出现，也一直在心里占着最亮的位置。",
    photos: [10, 11, 12, 13, 14]
  },
  {
    kicker: "memory 04 / across the Pacific",
    title: "太平洋也管不到的心照不宣",
    caption: "距离变成春秋，变成太平�洋，但我们总会再见。",
    body: "不同的国家，不同的时区，让一句生日快乐也像在海上漂洋过海。可是我想，只要我们还能懂对方半句话，能在嗯嗯啊啊里笑出来，就没有什么真正把我们分开。",
    photos: [15, 16, 17, 18, 19]
  },
  {
    kicker: "memory 05 / chapter 21",
    title: "21岁，新的风景要一起看",
    caption: "苦难终会终结，坚强之人永存。",
    body: "亲爱的小瑶，愿你顺利通过法律考试，拥有繁荣、清亮、自由的未来。愿你成为勇敢、可靠、强大、会爱也被爱的大人。路很长也很难，但我会一直牵着你的手，永远站在你这边。",
    photos: [20, 21, 22, 23, 24]
  }
];

const letterTexts = [
  "我说出的前一半话你总能吐出后半个，哪怕没想到两个人也能在嗯嗯啊啊我懂你的语调里相视一笑。很多东西今生只可给你，保守直到永久，别人如何明白透，对不起，又一个不在你身边的生日，Do you feel my love from miles apart？",
  "只要想起你，我就可以回到慢悠悠暖洋洋的童年里任何一个流光溢彩的晚霞日。不管是炎夏还是寒冬，我们心照不宣跳过公交站，只为一起走完多出来的一点点150米的路，然后依依不舍一步三回头说明天见，我们只能一起走150米，接下来我们要分别步行走过一个人的两站路，因为中间再没有经停目的地的公交车，但我们都知道那是值得的，尽管对于小孩子那是很长的一段路，尽管后面有一长段路只能自己走，但是明天我们还会再见的，现在那两站路变成了春秋，变成了孤单的太平洋，但是我们马上就还会再见的，我们总是会再见的，再见的时候会成长为更厉害的人，虽然我们的距离相隔很远，但是心总是很近，总是互相支持，虽然人生的艰难困苦总是无穷无尽，但是让我们一起奋斗一起面对！人生的风景我们一起去看！手拉手一起变成可靠的独当一面的很好的大人吧！生日快乐亲爱的小瑶💖",
  "苦难终会终结，坚强之人永存\n朋友是自己选择的家人，因为有你童年才变得如此美好，祝我最好的朋友生日快乐，人生的路很长，也很难走，困难重重，但是我们一起走，和你一起长大是世界上我能想到最幸运最幸福的事情，谢谢你给了我伟大的友情，爱你小瑶，生日快乐，祝你横刀立马，战胜这个世界，长大的世界也有很多风景，虽然没有小时候那么单纯，但是也很值得一看，我们手拉手一起去看吧！"
];

const acceptedNames = new Set(["张曦瑶", "曦瑶", "瑶", "小瑶"]);

let currentStage = 0;
let currentPhotoByStage = stages.map((stage) => stage.photos[0]);
let audioContext;
let musicTimer;
let musicOn = false;
let revealedLetterPages = 0;

const screens = {
  gate: document.querySelector("#gate"),
  birthday: document.querySelector("#birthday"),
  story: document.querySelector("#story"),
  gallery: document.querySelector("#gallery"),
  letter: document.querySelector("#letter")
};

const nameInput = document.querySelector("#name-input");
const gateMessage = document.querySelector("#gate-message");
const stageKicker = document.querySelector("#stage-kicker");
const storyTitle = document.querySelector("#story-title");
const stageImage = document.querySelector("#stage-image");
const stageCaption = document.querySelector("#stage-caption");
const stageBody = document.querySelector("#stage-body");
const stageThumbs = document.querySelector("#stage-thumbs");
const progressText = document.querySelector("#progress-text");
const progressBar = document.querySelector("#progress-bar");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const galleryGrid = document.querySelector("#gallery-grid");
const letterPages = document.querySelector("#letter-pages");
const revealLetterBtn = document.querySelector("#reveal-letter-btn");

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  createPetalRain(2000);
}

function normalizeName(value) {
  return value.replace(/\s+/g, "");
}

function beginBirthday() {
  const name = normalizeName(nameInput.value);
  if (!acceptedNames.has(name)) {
    gateMessage.textContent = "这封信只认得张曦瑶、瑶、或者小瑶。再试一次吧。";
    return;
  }
  gateMessage.textContent = "";
  showScreen("birthday");
  burstConfetti(90);
  startMusic();
}

function startMusic() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  audioContext.resume();
  musicOn = true;
  playBirthdayLoop();
}

function stopMusic() {
  musicOn = false;
  clearTimeout(musicTimer);
}

function playNote(freq, start, duration) {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.13, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function playBirthdayLoop() {
  if (!musicOn || !audioContext) return;
  const notes = [
    [392, 0, 0.24], [392, 0.28, 0.24], [440, 0.58, 0.52], [392, 1.15, 0.52], [523.25, 1.72, 0.52], [493.88, 2.3, 0.9],
    [392, 3.25, 0.24], [392, 3.53, 0.24], [440, 3.83, 0.52], [392, 4.4, 0.52], [587.33, 4.98, 0.52], [523.25, 5.55, 0.9],
    [392, 6.5, 0.24], [392, 6.78, 0.24], [783.99, 7.08, 0.52], [659.25, 7.65, 0.52], [523.25, 8.22, 0.52], [493.88, 8.8, 0.52], [440, 9.37, 0.9],
    [698.46, 10.32, 0.24], [698.46, 10.6, 0.24], [659.25, 10.9, 0.52], [523.25, 11.47, 0.52], [587.33, 12.05, 0.52], [523.25, 12.62, 1]
  ];
  const start = audioContext.currentTime + 0.05;
  notes.forEach(([freq, offset, duration]) => playNote(freq, start + offset, duration));
  clearTimeout(musicTimer);
  musicTimer = setTimeout(playBirthdayLoop, 14600);
}

function burstConfetti(count) {
  const box = document.querySelector("#confetti");
  const colors = ["#e88fa8", "#f5c454", "#ffd4a3", "#fff0f5", "#dab8e8"];
  for (let i = 0; i < count; i += 1) {
    const bit = document.createElement("i");
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.background = colors[i % colors.length];
    bit.style.animationDelay = `${Math.random() * 0.8}s`;
    bit.style.transform = `rotate(${Math.random() * 120}deg)`;
    box.appendChild(bit);
    setTimeout(() => bit.remove(), 4200);
  }
}

function createPetalRain(duration = 2000) {
  let container = document.querySelector(".petals-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "petals-container";
    document.body.appendChild(container);
  }

  const petalCount = 15;
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "%";
    petal.style.top = Math.random() * 50 - 50 + "px";
    petal.style.animationDuration = (2 + Math.random() * 1.5) + "s";
    petal.style.animationDelay = Math.random() * 0.5 + "s";
    petal.style.animation = `petalFall ${2 + Math.random() * 1.5}s ease-in forwards`;
    petal.style.animationDelay = Math.random() * 0.5 + "s";
    container.appendChild(petal);
    setTimeout(() => petal.remove(), duration + 1000);
  }
}

function createHeartBurst(x, y, count = 12) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "hearts-burst";
    heart.textContent = "💖";
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    const angle = (i / count) * Math.PI * 2;
    const velocity = 150 + Math.random() * 100;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity - 200;
    heart.style.setProperty("--tx", tx + "px");
    heart.style.setProperty("--ty", ty + "px");
    document.body.appendChild(heart);
    
    heart.addEventListener("animationend", () => heart.remove());
  }
}

function displayTaurusConstellation() {
  const taurus = document.querySelector(".constellation");
  if (taurus) {
    taurus.style.animation = "none";
    setTimeout(() => {
      taurus.style.animation = "twinkleStar 3s ease-in-out infinite";
    }, 10);
  }
}

function renderStage() {
  const stage = stages[currentStage];
  const photoIndex = currentPhotoByStage[currentStage];
  stageKicker.textContent = stage.kicker;
  storyTitle.textContent = stage.title;
  stageImage.src = images[photoIndex];
  stageCaption.textContent = stage.caption;
  stageBody.textContent = stage.body;
  progressText.textContent = `${currentStage + 1} / ${stages.length}`;
  progressBar.style.width = `${((currentStage + 1) / stages.length) * 100}%`;
  prevBtn.disabled = currentStage === 0;
  nextBtn.textContent = currentStage === stages.length - 1 ? "看看完整相册" : "继续往前走";
  renderThumbs(stage, photoIndex);
}

function renderThumbs(stage, currentPhoto) {
  stageThumbs.innerHTML = "";
  stage.photos.forEach((photoIndex) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = `thumb${photoIndex === currentPhoto ? " is-current" : ""}`;
    thumb.setAttribute("aria-label", `show ${images[photoIndex]}`);
    thumb.innerHTML = `<img src="${images[photoIndex]}" alt="">`;
    thumb.addEventListener("click", () => {
      currentPhotoByStage[currentStage] = photoIndex;
      renderStage();
      createHeartBurst(thumb.getBoundingClientRect().left + 30, thumb.getBoundingClientRect().top + 30, 6);
    });
    stageThumbs.appendChild(thumb);
  });
}

function nextStage() {
  if (currentStage === stages.length - 1) {
    showScreen("gallery");
    burstConfetti(50);
    return;
  }
  currentStage += 1;
  renderStage();
}

function prevStage() {
  currentStage = Math.max(0, currentStage - 1);
  renderStage();
}

function renderGallery() {
  galleryGrid.innerHTML = "";
  images.forEach((src, index) => {
    const item = document.createElement("figure");
    item.className = "gallery-item";
    item.innerHTML = `<img src="${src}" alt="memory ${index + 1}"><span>memory ${String(index + 1).padStart(2, "0")}</span>`;
    
    item.addEventListener("click", (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
    });
    
    galleryGrid.appendChild(item);
  });
}

function renderLetter() {
  letterPages.innerHTML = "";
  letterTexts.forEach((text, index) => {
    const page = document.createElement("p");
    page.className = `letter-page${index < revealedLetterPages ? " is-visible" : ""}`;
    page.textContent = text;
    letterPages.appendChild(page);
  });
  revealLetterBtn.textContent = revealedLetterPages >= letterTexts.length ? "读完啦，再放一次烟花" : "继续读";
}

function revealNextLetterPage() {
  if (revealedLetterPages < letterTexts.length) {
    revealedLetterPages += 1;
    renderLetter();
    burstConfetti(24);
  } else {
    burstConfetti(90);
    if (!musicOn) startMusic();
  }
}

document.querySelector("#start-btn").addEventListener("click", beginBirthday);
nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") beginBirthday();
});

document.querySelector("#memory-btn").addEventListener("click", () => {
  renderStage();
  showScreen("story");
});

document.querySelector("#music-btn").addEventListener("click", () => {
  if (musicOn) {
    stopMusic();
  } else {
    startMusic();
  }
});

nextBtn.addEventListener("click", nextStage);
prevBtn.addEventListener("click", prevStage);

document.querySelector("#letter-btn").addEventListener("click", () => {
  revealedLetterPages = 0;
  renderLetter();
  showScreen("letter");
  revealNextLetterPage();
});

revealLetterBtn.addEventListener("click", revealNextLetterPage);

document.querySelector("#restart-btn").addEventListener("click", () => {
  currentStage = 0;
  revealedLetterPages = 0;
  renderStage();
  showScreen("birthday");
});

renderGallery();
renderLetter();
