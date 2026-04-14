// =======================================================
// BOUNTOPLAY - FINAL SYSTEM (FAIL FIX + NO FREEZE)
// =======================================================

// ================= SCREEN CONTROL =================
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ================= NAVIGATION =================
function goToGame() {
  showScreen("loadingScreen");

  setTimeout(() => {
    showScreen("gameScreen");
    resetGameUI();
  }, 800);
}

// ================= EMAIL VALIDATION =================
function validateEmail() {
  let email = document.getElementById("emailInput").value.trim();
  let error = document.getElementById("emailError");

  let valid = /^[a-zA-Z0-9._%+-]+@bounty\.com\.ph$/.test(email);

  if (!valid) {
    error.style.display = "block";
    return;
  }

  error.style.display = "none";

  document.getElementById("emailEntry").style.display = "none";
  document.getElementById("gameContent").style.display = "block";

  startPrimaryGame();
}

// =======================================================
// ================= PRIMARY GAME =================
// =======================================================

let emailIndex = 0;
let primaryCompleted = false;
let currentMode = "primary";
let gameOver = false;

const emails = [

{
  subject: "Security Alert: Suspicious Sign-in Attempt Detected",
  sender: `Google Security <span class="clickable">security@google-support-alert.co</span>`,
  body: `
    <p>Dear User,</p>

    <p>We detected a suspicious sign-in attempt on your Google Account from a new device.</p>

    <p>If this was not you, please review your account activity to prevent unauthorized access.</p>

    <p>To secure your account, please click the link below and verify your information:</p>

    <p>👉 <span class="clickable">http://google-account-security-check.co</span></p>

    <p>If you do not take action, your account may be temporarily restricted.</p>

    <p>Thank you for your <span class="clickable">cooperatoin</span>.</p>

    <br>

    <p>Sincerely,<br>Google Security Team</p>
  `,
  malicious: 3
},

{
  subject: "Important: Please Review Your Latest Account Statement",
  sender: `Security Bank <span>no-reply@securitybank.com.ph</span>`,
  body: `
    <p>Dear Customer,</p>

    <p>Your latest account statement from Security Bank Corporation is now available.</p>

    <p>For your convenience, we have attached your statement for this month.</p>

    <div class="attachment clickable">
      <div class="file-icon">📄</div>
      <div class="file-info">
        <b>SecurityBank_Verification_Form.pdf</b>
        <span>PDF • 245 KB</span>
      </div>
    </div>

    <p>
      To avoid account suspension, please download the attachment and submit your account
      <span class="clickable">detials</span> immediately.
    </p>

    <p class="clickable">
      If no action is taken, your account may be temporarily restricted.
    </p>

    <p>Thank you for your trust and service.</p>

    <br>

    <p>Sincerely,<br>Security Bank Customer Support</p>
  `,
  malicious: 3
}

];

// ================= STATE =================
let score = 0;
let mistakes = 0;
let maxMistakes = 4;
let found = 0;
let totalMalicious = 3;

// ================= RESET =================
function resetGameUI() {
  emailIndex = 0;
  score = 0;
  mistakes = 0;
  found = 0;
  primaryCompleted = false;
  currentMode = "primary";
  gameOver = false;

  updateHUD();

  document.getElementById("emailEntry").style.display = "block";
  document.getElementById("gameContent").style.display = "none";
}

// ================= START PRIMARY =================
function startPrimaryGame() {
  currentMode = "primary";
  loadEmail();
}

// ================= LOAD EMAIL =================
function loadEmail() {

  if (emailIndex >= emails.length) {
    primaryCompleted = true;

    document.querySelectorAll(".sidebar li")[1].classList.remove("locked");

    setTimeout(() => {
      switchTab("updates");
    }, 500);

    return;
  }

  let email = emails[emailIndex];

  found = 0;
  totalMalicious = email.malicious;

  updateHUD();

  document.getElementById("emailSubject").innerText = email.subject;
  document.getElementById("emailSender").innerHTML = email.sender;
  document.getElementById("emailBody").innerHTML = email.body;

  activatePhishingClick();
}

// ================= CLICK SYSTEM =================
function activatePhishingClick() {

  let body = document.getElementById("emailBody");
  let sender = document.getElementById("emailSender");

  body.onclick = null;
  sender.onclick = null;

  function handleClick(e) {

    if (gameOver) return;

    let target = e.target;

    if (target.classList.contains("clickable")) {

      if (target.classList.contains("clicked")) return;

      target.classList.add("clicked");

      found++;
      score += 10;

      updateHUD();

      if (found === totalMalicious) {
        setTimeout(() => {
          emailIndex++;
          loadEmail();
        }, 800);
      }

    } else {

      mistakes++;

      target.classList.add("wrong");

      setTimeout(() => target.classList.remove("wrong"), 400);

      updateHUD();

      if (mistakes === maxMistakes) {
        gameOver = true;

        highlightMissed();

        setTimeout(() => {
          endGame();
        }, 800);
      }
    }
  }

  body.onclick = handleClick;
  sender.onclick = handleClick;
}

// ================= HIGHLIGHT =================
function highlightMissed() {
  document.querySelectorAll(".clickable").forEach(el => {
    if (!el.classList.contains("clicked")) {
      el.style.outline = "2px solid yellow";
    }
  });
}

// =======================================================
// ================= UPDATES GAME =================
// =======================================================

let scenarioIndex = 0;

const scenarios = [
{
  question: "You found a USB in the office hallway. What will you do?",
  choices: ["Plug it in", "Give it to IT", "Take it home", "Ignore"],
  correct: 1
},
{
  question: "Your coworker asks for your password. What will you do?",
  choices: ["Share it", "Decline and report", "Write it down", "Ignore"],
  correct: 1
},
{
  question: "You leave your workstation. What should you do?",
  choices: ["Leave it open", "Lock your PC", "Turn off monitor", "Ignore"],
  correct: 1
}
];

// ================= TAB SWITCH =================
function switchTab(tab) {

  if (tab === "updates" && !primaryCompleted) return;

  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));

  if (tab === "updates") {
    currentMode = "updates";
    document.querySelectorAll(".sidebar li")[1].classList.add("active");

    startUpdatesGame();
  }
}

// ================= START =================
function startUpdatesGame() {
  scenarioIndex = 0;
  loadScenario();
}

// ================= LOAD =================
function loadScenario() {

  if (scenarioIndex >= scenarios.length) {
    endGame();
    return;
  }

  let s = scenarios[scenarioIndex];

  document.getElementById("scenarioText").innerText = s.question;

  let html = "";

  s.choices.forEach((c, i) => {
    html += `<button onclick="answerScenario(${i})">${c}</button>`;
  });

  document.getElementById("choices").innerHTML = html;

  updateHUD();
}

// ================= ANSWER =================
function answerScenario(choice) {

  if (gameOver) return;

  let s = scenarios[scenarioIndex];
  let buttons = document.querySelectorAll("#choices button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;

    if (i === s.correct) btn.classList.add("clicked");
    if (i === choice && i !== s.correct) btn.classList.add("wrong");
  });

  if (choice === s.correct) {
    score += 10;
  } else {
    mistakes++;
  }

  updateHUD();

  if (mistakes === maxMistakes) {
    gameOver = true;

    setTimeout(() => {
      endGame();
    }, 800);

    return;
  }

  setTimeout(() => {
    scenarioIndex++;
    loadScenario();
  }, 900);
}

// =======================================================
// ================= HUD =================
// =======================================================

function updateHUD() {
  document.getElementById("score").innerText = score;
  document.getElementById("mistakes").innerText = `${mistakes}/${maxMistakes}`;

  if (currentMode === "primary") {
    document.getElementById("streak").innerText = `${found}/${totalMalicious}`;
  } else {
    document.getElementById("streak").innerText = "-";
  }
}

// =======================================================
// ================= END =================
// =======================================================

function endGame() {

  let totalPossible = emails.length * 3 + scenarios.length;
  let totalFound = score / 10;

  let accuracy = Math.round((totalFound / totalPossible) * 100);

  let risk =
    accuracy >= 80 ? "LOW RISK ✅" :
    accuracy >= 50 ? "MEDIUM RISK ⚠️" :
    "CRITICAL RISK 🚨";

  document.getElementById("finalScore").innerText = score;
  document.getElementById("accuracy").innerText = accuracy + "%";
  document.getElementById("risk").innerText = risk;
  document.getElementById("finalStreak").innerText = "-";

  showScreen("dashboardScreen");
}
