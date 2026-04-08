let points = 0n;
let perClick = 1n;
let upgradeCost = 10n;

let auto = 0n;
let autoCost = 50n;

let prestigePoints = 0n;
let rebirths = 0n;

// CPS LIMIT
let clickTimes = [];

// LOAD
function load() {
  let save = JSON.parse(localStorage.getItem("save"));
  if (save) {
    points = BigInt(save.points);
    perClick = BigInt(save.perClick);
    upgradeCost = BigInt(save.upgradeCost);
    auto = BigInt(save.auto);
    autoCost = BigInt(save.autoCost);
    prestigePoints = BigInt(save.prestigePoints);
    rebirths = BigInt(save.rebirths || 0);
  }
}

// SAVE
function save() {
  localStorage.setItem("save", JSON.stringify({
    points: points.toString(),
    perClick: perClick.toString(),
    upgradeCost: upgradeCost.toString(),
    auto: auto.toString(),
    autoCost: autoCost.toString(),
    prestigePoints: prestigePoints.toString(),
    rebirths: rebirths.toString()
  }));
}

// CLICK
document.getElementById("clickBtn").onclick = (e) => {
  let now = Date.now();
  clickTimes = clickTimes.filter(t => now - t < 1000);

  if (clickTimes.length < 50) {
    points += perClick + prestigePoints + rebirths;
    clickTimes.push(now);

    spawnParticles(e.clientX, e.clientY);
    shake();
  }
};

// UPGRADES
function buyUpgrade() {
  if (points >= upgradeCost) {
    points -= upgradeCost;
    perClick += 1n + prestigePoints;
    upgradeCost *= 2n;
  }
}

// AUTO
function buyAuto() {
  if (points >= autoCost) {
    points -= autoCost;
    auto += 1n;
    autoCost *= 3n;
  }
}

// PRESTIGE
function prestige() {
  if (points >= 1_000_000n) {
    let gain = points / 1_000_000n;
    prestigePoints += gain;

    points = 0n;
    perClick = 1n;
    auto = 0n;
  }
}

// REBIRTH
function rebirth() {
  if (points >= 1_000_000_000n) {
    rebirths += 1n;
    points = 0n;
    perClick = 1n;
    prestigePoints = 0n;
    auto = 0n;
  }
}

// AUTO LOOP
setInterval(() => {
  points += auto * (1n + prestigePoints + rebirths);
}, 1000);

// PARTICLES
function spawnParticles(x, y) {
  for (let i = 0; i < 10; i++) {
    let p = document.createElement("div");
    p.className = "particle";

    let angle = Math.random() * 2 * Math.PI;
    let dist = Math.random() * 60;

    p.style.left = x + "px";
    p.style.top = y + "px";

    document.body.appendChild(p);

    setTimeout(() => {
      p.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`;
      p.style.opacity = 0;
    }, 10);

    setTimeout(() => p.remove(), 600);
  }
}

// SCREEN SHAKE
function shake() {
  document.body.style.transform = "translate(2px,2px)";
  setTimeout(() => document.body.style.transform = "translate(0,0)", 50);
}

// FORMAT (INSANITY)
function format(num) {
  num = BigInt(num);
  let len = num.toString().length;

  if (len < 13) return num.toString();

  let exp = len - 1;

  if (exp >= 100 && exp < 10000) {
    let g = Math.floor(exp / 100);
    return g === 1 ? "Googol" : "Googol^" + g;
  }

  if (exp >= 10000 && exp < 1000000) {
    return "Googolplex" + "plex".repeat(Math.floor(exp/10000)-1);
  }

  if (exp >= 1000000 && exp < 1e9) {
    return "10" + "^".repeat(Math.min(9, Math.floor(Math.log10(exp)))) + exp;
  }

  if (exp >= 1e9 && exp < 1e12) {
    return "Graham's Number 😈";
  }

  if (exp >= 1e12) {
    return "TREE(3) 🌳💀";
  }

  return num.toString();
}

// UPDATE
function update() {
  document.getElementById("points").innerText = format(points);
  document.getElementById("upgradeCost").innerText = "Cost: " + format(upgradeCost);
  document.getElementById("autoInfo").innerText = "Owned: " + format(auto);
  document.getElementById("prestigeInfo").innerText = "Prestige: " + format(prestigePoints);
  document.getElementById("rebirthInfo").innerText = "Rebirths: " + format(rebirths);
}

// LOOP
setInterval(() => {
  update();
  save();
}, 100);

// ANTI ZOOM
document.addEventListener("dblclick", e => e.preventDefault());

// START
load();