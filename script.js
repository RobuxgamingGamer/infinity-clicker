let points = 0n;
let perClick = 1n;
let upgradeCost = 10n;

let auto = 0n;
let autoCost = 50n;

let prestigePoints = 0n;

// Load save
function load() {
  let save = JSON.parse(localStorage.getItem("save"));

  if (save) {
    points = BigInt(save.points);
    perClick = BigInt(save.perClick);
    upgradeCost = BigInt(save.upgradeCost);
    auto = BigInt(save.auto);
    autoCost = BigInt(save.autoCost);
    prestigePoints = BigInt(save.prestigePoints);
  }
}

// Save
function save() {
  localStorage.setItem("save", JSON.stringify({
    points: points.toString(),
    perClick: perClick.toString(),
    upgradeCost: upgradeCost.toString(),
    auto: auto.toString(),
    autoCost: autoCost.toString(),
    prestigePoints: prestigePoints.toString()
  }));
}

// Click
let clickTimes = [];

document.getElementById("clickBtn").onclick = () => {
  let now = Date.now();

  // Keep only clicks in last 1 second
  clickTimes = clickTimes.filter(t => now - t < 1000);

  if (clickTimes.length < 50) {
    points += perClick + prestigePoints;
    clickTimes.push(now);
  }
};

// Upgrade
function buyUpgrade() {
  if (points >= upgradeCost) {
    points -= upgradeCost;
    perClick += 1n + prestigePoints;
    upgradeCost *= 2n;
  }
}

// Automation
function buyAuto() {
  if (points >= autoCost) {
    points -= autoCost;
    auto += 1n;
    autoCost *= 3n;
  }
}

// Prestige
function prestige() {
  if (points >= 1000000n) {
    let gain = points / 1000000n;

    prestigePoints += gain;

    // Reset
    points = 0n;
    perClick = 1n;
    upgradeCost = 10n;
    auto = 0n;
    autoCost = 50n;
  }
}

// Auto tick
setInterval(() => {
  points += auto * (1n + prestigePoints);
}, 1000);

// UI update
function format(num) {
  return num.toString();
}

function update() {
  document.getElementById("points").innerText = format(points);

  document.getElementById("upgradeCost").innerText =
    "Cost: " + format(upgradeCost);

  document.getElementById("autoInfo").innerText =
    "Owned: " + format(auto) + " | Cost: " + format(autoCost);

  document.getElementById("prestigeInfo").innerText =
    "Prestige Points: " + format(prestigePoints) +
    " (Need 1,000,000)";
}

// Game loop
setInterval(() => {
  update();
  save();
}, 100);

// Load at start
load();