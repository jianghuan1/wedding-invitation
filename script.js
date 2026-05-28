const weddingConfig = {
  date: "2026-06-24T17:18:00+08:00",
  rsvpUrl: "",
};

const toast = document.querySelector("[data-toast]");
const musicButton = document.querySelector("[data-music]");

let audioContext;
let masterGain;
let musicTimer;
let isMusicPlaying = false;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function updateCountdown() {
  const target = new Date(weddingConfig.date).getTime();
  const now = Date.now();
  const distance = Math.max(0, target - now);
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;

  const days = Math.floor(distance / day);
  const hours = Math.floor((distance % day) / hour);
  const minutes = Math.floor((distance % hour) / minute);

  document.querySelector("[data-days]").textContent = String(days).padStart(3, "0");
  document.querySelector("[data-hours]").textContent = String(hours).padStart(2, "0");
  document.querySelector("[data-minutes]").textContent = String(minutes).padStart(2, "0");
}

document.querySelector("[data-share]").addEventListener("click", async () => {
  const link = window.location.href.split("#")[0];
  try {
    await navigator.clipboard.writeText(link);
    showToast("请柬链接已复制");
  } catch {
    showToast("可从浏览器地址栏复制链接");
  }
});

document.querySelector("[data-rsvp]").addEventListener("click", () => {
  if (weddingConfig.rsvpUrl) {
    window.open(weddingConfig.rsvpUrl, "_blank", "noopener,noreferrer");
    return;
  }
  showToast("回执链接待替换");
});

function playTone(frequency, startTime, duration, type = "sine", level = 0.16) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(level, startTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(masterGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
}

function scheduleMusicLoop() {
  const base = audioContext.currentTime + 0.04;
  const melody = [
    [659.25, 0, 0.68],
    [587.33, 0.78, 0.52],
    [523.25, 1.42, 0.8],
    [392.0, 2.34, 0.88],
    [440.0, 3.28, 0.56],
    [523.25, 3.96, 0.92],
    [587.33, 5.12, 0.62],
    [659.25, 5.86, 1.1],
  ];

  melody.forEach(([frequency, offset, duration]) => {
    playTone(frequency, base + offset, duration, "sine", 0.13);
  });

  [261.63, 329.63, 392.0].forEach((frequency) => {
    playTone(frequency, base, 3.2, "triangle", 0.035);
  });
  [293.66, 369.99, 440.0].forEach((frequency) => {
    playTone(frequency, base + 3.8, 3.4, "triangle", 0.03);
  });
}

async function startMusic() {
  audioContext = audioContext || new AudioContext();
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(0.42, audioContext.currentTime + 0.8);
  masterGain.connect(audioContext.destination);

  scheduleMusicLoop();
  musicTimer = window.setInterval(scheduleMusicLoop, 7600);
  isMusicPlaying = true;
  musicButton.textContent = "暂停音乐";
  musicButton.setAttribute("aria-pressed", "true");
  showToast("音乐已开启");
}

function stopMusic() {
  window.clearInterval(musicTimer);
  if (masterGain && audioContext) {
    masterGain.gain.cancelScheduledValues(audioContext.currentTime);
    masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), audioContext.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.28);
  }
  isMusicPlaying = false;
  musicButton.textContent = "音乐";
  musicButton.setAttribute("aria-pressed", "false");
  showToast("音乐已暂停");
}

musicButton.addEventListener("click", async () => {
  if (isMusicPlaying) {
    stopMusic();
    return;
  }

  try {
    await startMusic();
  } catch {
    showToast("当前浏览器暂不支持播放");
  }
});

updateCountdown();
window.setInterval(updateCountdown, 60 * 1000);
