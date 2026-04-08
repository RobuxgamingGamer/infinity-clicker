// CORE
let points = 0n;
let perClick = 1n;
let upgradeCost = 10n;

let auto = 0n;
let autoCost = 50n;

// PRESTIGE SYSTEM
let prestigeLevel = 0;
let prestigeRequirement = 1_000_000n;
let prestigeMultiplier = 1;

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

    prestigeLevel = save.prestigeLevel || 0;
    prestigeRequirement = BigInt(save.prestigeRequirement || 1000000);
    prestigeMultiplier = save.prestigeMultiplier || 1;
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
    prestigeLevel,
    prestigeRequirement: prestigeRequirement.toString(),
    prestigeMultiplier
  }));
}

// CLICK
document.getElementById("clickBtn").onclick = (e) => {
  let now = Date.now();
  clickTimes = clickTimes.filter(t => now - t < 1000);

  if (clickTimes.length < 50) {
    let gain = Number(perClick) * prestigeMultiplier;
    points += BigInt(Math.floor(gain));

    clickTimes.push(now);
    spawnParticles(e.clientX, e.clientY);
  }
};

// UPGRADES (BOOSTED BY PRESTIGE)
function buyUpgrade() {
  if (points >= upgradeCost) {
    points -= upgradeCost;

    let boost = 2 * prestigeMultiplier;
    perClick += BigInt(Math.floor(boost));

    upgradeCost *= 2n;
  }
}

// AUTO (STACKABLE + SCALED)
function buyAuto() {
  if (points >= autoCost) {
    points -= autoCost;
    auto += 1n;
    autoCost *= 2n;
  }
}

// PRESTIGE
function prestige() {
  if (points >= prestigeRequirement) {
    prestigeLevel++;

    // MULTIPLIER ×1.5
    prestigeMultiplier *= 1.5;

    // REQUIREMENT DOUBLES
    prestigeRequirement *= 2n;

    // RESET
    points = 0n;
    perClick = 1n;
    auto = 0n;
    upgradeCost = 10n;
    autoCost = 50n;
  }
}

// AUTO LOOP
setInterval(() => {
  let gain = Number(auto) * prestigeMultiplier;
  points += BigInt(Math.floor(gain));
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

// FORMAT (SHORTENED BUT CLEAN)
function format(num) {
  num = BigInt(num);
  let len = num.toString().length;

  if (len < 13) return num.toString();

  let exp = len - 1;

  if (exp >= 100 && exp < 10000) return "Googol";
  if (exp >= 10000 && exp < 1e6) return "Googolplex";
  if (exp >= 1e6 && exp < 1e9) return "10^" + exp;
  if (exp >= 1e9 && exp < 1e12) return "Graham's Number 😈";
  if (exp >= 1e12) return "TREE(3) 🌳💀";

  return num.toString();
}

// UPDATE
function update() {
  document.getElementById("points").innerText = format(points);

  document.getElementById("upgradeCost").innerText =
    "Cost: " + format(upgradeCost);

  document.getElementById("autoInfo").innerText =
    "Owned: " + format(auto) + " | Cost: " + format(autoCost);

  document.getElementById("prestigeInfo").innerText =
    "Prestige Lv: " + prestigeLevel +
    " | Multiplier: x" + prestigeMultiplier.toFixed(2) +
    " | Need: " + format(prestigeRequirement);
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