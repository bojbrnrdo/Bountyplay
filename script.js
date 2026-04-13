// =======================================================
// BOUNTOPLAY CYBERSECURITY GAME - FULL SYSTEM
// =======================================================

// ================= SCREEN CONTROL =================
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ================= LOGIN =================
function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (user && pass) {
    showScreen("loadingScreen");

    setTimeout(() => {
      showScreen("gameScreen");
    }, 2000);
  } else {
    alert("Please enter credentials");
  }
}

// ================= GAME CONFIG =================
const config = {
  timePerQuestion: 10,
  baseScore: 10,
  streakBonus: 2
};

// ================= QUESTIONS =================
const questions = [

/* ================= EMAIL ================= */
{
type:"email",
s:"Urgent Request – CEO",
f:"ceo.office@company-support.com",
m:`Hi,

I need your assistance urgently. I'm currently in a meeting.

Please purchase gift cards worth ₱25,000 and send codes.

Confidential.

CEO`,
p:true,
difficulty:"medium"
},

{
type:"email",
s:"Payroll Adjustment",
f:"payroll@company.com",
m:`Your salary has been updated.

Please check HR system.

Payroll Team`,
p:false,
difficulty:"easy"
},

{
type:"email",
s:"Account Verification Needed",
f:"support@paypaI.com",
m:`We detected suspicious activity.

Verify immediately.`,
p:true,
difficulty:"hard"
},

{
type:"email",
s:"Meeting Schedule",
f:"admin@company.com",
m:`Meeting at 3PM today.`,
p:false,
difficulty:"easy"
},

{
type:"email",
s:"Security Alert",
f:"security@company-support.com",
m:`Your account will be locked.

Verify now.`,
p:true,
difficulty:"medium"
},

/* ================= MCQ ================= */
{
type:"mcq",
q:"You receive urgent payment request from your boss. What will you do?",
choices:[
"Send immediately",
"Verify via official channel",
"Ignore",
"Forward"
],
correct:1,
difficulty:"medium"
},

{
type:"mcq",
q:"You leave your workstation. What will you do?",
choices:[
"Leave it unlocked",
"Lock your PC",
"Turn off monitor",
"Ignore"
],
correct:1,
difficulty:"easy"
},

{
type:"mcq",
q:"You find USB in office. What will you do?",
choices:[
"Plug it in",
"Give to IT",
"Take home",
"Ignore"
],
correct:1,
difficulty:"medium"
},

{
type:"mcq",
q:"You clicked suspicious link. What now?",
choices:[
"Ignore",
"Restart PC",
"Report to IT",
"Continue"
],
correct:2,
difficulty:"hard"
},

{
type:"mcq",
q:"Unknown software install request. What will you do?",
choices:[
"Install",
"Check with IT",
"Scan first",
"Ignore"
],
correct:1,
difficulty:"medium"
}

// 🔥 you can expand more easily
];

// ================= SHUFFLE =================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ================= STATE =================
let current = 0;
let score = 0;
let streak = 0;
let correctAnswers = 0;
let timer;
let timeLeft = config.timePerQuestion;
let playing = false;
let locked = false;

// ================= START GAME =================
function startGame() {
  // RESET STATE
  current = 0;
  score = 0;
  streak = 0;
  correctAnswers = 0;
  playing = true;
  locked = false;

  shuffle(questions);

  // RESET UI
  document.getElementById("score").innerText = 0;
  document.getElementById("streak").innerText = 0;
  document.getElementById("time").innerText = config.timePerQuestion;
  document.getElementById("feedback").innerText = "";

  document.getElementById("startBtn").style.display = "none";

  nextQuestion();
}

// ================= LOAD QUESTION =================
function nextQuestion() {
  clearInterval(timer);
  locked = false;

  if (current >= questions.length) {
    endGame();
    return;
  }

  let q = questions[current];

  if (q.type === "email") {
    renderEmail(q);
  } else {
    renderMCQ(q);
  }

  startTimer();
}

// ================= RENDER =================
function renderEmail(q) {
  document.getElementById("question").innerHTML =
    `<h3>${q.s}</h3><p><b>From:</b> ${q.f}</p><p>${q.m}</p>`;

  document.getElementById("choices").innerHTML =
    `<button onclick="answer(true)">🚨 Phishing</button>
     <button onclick="answer(false)">✅ Legit</button>`;
}

function renderMCQ(q) {
  let html = "";
  q.choices.forEach((c,i)=>{
    html += `<button onclick="answer(${i})">${c}</button>`;
  });

  document.getElementById("question").innerHTML = `<h3>${q.q}</h3>`;
  document.getElementById("choices").innerHTML = html;
}

// ================= ANSWER =================
function answer(choice) {
  if (!playing || locked) return;

  locked = true;
  clearInterval(timer);

  let q = questions[current];
  let buttons = document.querySelectorAll(".choices button");

  buttons.forEach(btn => btn.classList.add("disabled"));

  let correct = false;

  if (q.type === "email") {
    buttons.forEach((btn, index) => {
      let val = index === 0;

      if (val === q.p) btn.classList.add("correct");
      if (val === choice && val !== q.p) btn.classList.add("wrong");
    });

    correct = (choice === q.p);

  } else {
    buttons.forEach((btn, index) => {
      if (index === q.correct) btn.classList.add("correct");
      if (index === choice && index !== q.correct) btn.classList.add("wrong");
    });

    correct = (choice === q.correct);
  }

  // SCORE LOGIC
  if (correct) {
    correctAnswers++;
    streak++;
    let points = config.baseScore + (streak * config.streakBonus);
    score += points;
  } else {
    streak = 0;
  }

  updateHUD();

  current++;

  setTimeout(nextQuestion, 1000);
}

// ================= TIMER =================
function startTimer() {
  clearInterval(timer);

  timeLeft = config.timePerQuestion;
  document.getElementById("time").innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);

      if (!locked) {
        locked = true;
        streak = 0;
        current++;
        setTimeout(nextQuestion, 800);
      }
    }
  }, 1000);
}

// ================= HUD =================
function updateHUD() {
  document.getElementById("score").innerText = score;
  document.getElementById("streak").innerText = streak;
}

// ================= PERFORMANCE =================
function calculateAccuracy() {
  return Math.round((correctAnswers / questions.length) * 100);
}

function getRiskLevel(acc) {
  if (acc >= 80) return "LOW RISK ✅";
  if (acc >= 50) return "MEDIUM RISK ⚠️";
  return "HIGH RISK 🚨";
}

// ================= END GAME =================
function endGame() {
  playing = false;
  clearInterval(timer);

  let accuracy = calculateAccuracy();
  let risk = getRiskLevel(accuracy);

  document.getElementById("finalScore").innerText = score;
  document.getElementById("finalStreak").innerText = streak;

  // 🔥 ADD THESE IN HTML if you want
  if (document.getElementById("accuracy")) {
    document.getElementById("accuracy").innerText = accuracy + "%";
    document.getElementById("risk").innerText = risk;
  }

  showScreen("dashboardScreen");
}

// ================= RESTART =================
function restartGame() {
  showScreen("gameScreen");
  startGame();
}