// ===== GAME STATE =====
const gameState = {
    cookies: 0,
    totalCookies: 0,
    totalClicks: 0,
    clickPower: 1,
    cookiesPerSecond: 0,
    startTime: Date.now(),
    lastTick: Date.now(),
    upgrades: {},
    multiplier: 1
};

// Initialize upgrade counts
getAllUpgrades().forEach(upgrade => {
    gameState.upgrades[upgrade.id] = 0;
});

// ===== SAVE/LOAD SYSTEM =====
const SAVE_KEY = 'cookieEmpireSave';
const AUTO_SAVE_INTERVAL = 10000; // 10 seconds

function saveGame() {
    const saveData = {
        ...gameState,
        saveTime: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    showNotification('Game Saved', 'Your progress has been saved!');
}

function loadGame() {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.assign(gameState, data);

            // Calculate offline earnings
            if (data.saveTime) {
                const offlineTime = Math.floor((Date.now() - data.saveTime) / 1000);
                const offlineEarnings = Math.floor(gameState.cookiesPerSecond * offlineTime);
                if (offlineEarnings > 0) {
                    gameState.cookies += offlineEarnings;
                    gameState.totalCookies += offlineEarnings;
                    showNotification('Welcome Back!', `You earned ${formatNumber(offlineEarnings)} cookies while away!`);
                }
            }

            gameState.startTime = Date.now() - (data.totalClicks * 1000); // Approximate
            return true;
        } catch (e) {
            console.error('Failed to load save:', e);
            return false;
        }
    }
    return false;
}

function resetGame() {
    if (confirm('Are you sure you want to reset? This will delete all progress!')) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

function exportSave() {
    const saveData = JSON.stringify(gameState, null, 2);
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cookie-empire-save-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Export Complete', 'Save file downloaded!');
}

function importSave() {
    document.getElementById('importInput').click();
}

document.getElementById('importInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                Object.assign(gameState, data);
                updateUI();
                saveGame();
                showNotification('Import Success', 'Save file loaded!');
            } catch (error) {
                alert('Invalid save file!');
            }
        };
        reader.readAsText(file);
    }
});

// ===== CORE GAME LOGIC =====

function handleClick() {
    const earnedCookies = gameState.clickPower * gameState.multiplier;
    gameState.cookies += earnedCookies;
    gameState.totalCookies += earnedCookies;
    gameState.totalClicks++;

    // Create particle effect
    createClickParticle(earnedCookies);

    updateUI();
}

function calculateClickPower() {
    let power = 1;

    // Add click upgrade effects
    UPGRADES.clickPower.forEach(upgrade => {
        const count = gameState.upgrades[upgrade.id] || 0;
        power += upgrade.effect * count;
    });

    return power;
}

function calculateCookiesPerSecond() {
    let cps = 0;

    // Auto clickers
    UPGRADES.autoClickers.forEach(upgrade => {
        const count = gameState.upgrades[upgrade.id] || 0;
        cps += upgrade.effect * count;
    });

    // Production buildings
    UPGRADES.production.forEach(upgrade => {
        const count = gameState.upgrades[upgrade.id] || 0;
        cps += upgrade.effect * count;
    });

    // Apply multipliers
    cps *= gameState.multiplier;

    return cps;
}

function calculateMultiplier() {
    let mult = 1;

    UPGRADES.multipliers.forEach(upgrade => {
        const count = gameState.upgrades[upgrade.id] || 0;
        if (count > 0) {
            mult *= Math.pow(upgrade.effect, count);
        }
    });

    return mult;
}

function getUpgradeCost(upgrade) {
    const count = gameState.upgrades[upgrade.id] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, count));
}

function canAffordUpgrade(upgrade) {
    return gameState.cookies >= getUpgradeCost(upgrade);
}

function purchaseUpgrade(upgradeId) {
    const upgrade = getUpgradeById(upgradeId);
    if (!upgrade) return;

    const cost = getUpgradeCost(upgrade);

    if (gameState.cookies >= cost) {
        gameState.cookies -= cost;
        gameState.upgrades[upgradeId]++;

        // Recalculate stats
        gameState.clickPower = calculateClickPower();
        gameState.cookiesPerSecond = calculateCookiesPerSecond();
        gameState.multiplier = calculateMultiplier();

        // Show notification for first purchase
        if (gameState.upgrades[upgradeId] === 1) {
            showNotification('New Upgrade!', `You purchased ${upgrade.name}!`);
        }

        updateUI();
    }
}

// ===== GAME LOOP =====

function gameLoop() {
    const now = Date.now();
    const deltaTime = (now - gameState.lastTick) / 1000; // Convert to seconds

    // Add passive income
    if (gameState.cookiesPerSecond > 0) {
        const earned = gameState.cookiesPerSecond * deltaTime;
        gameState.cookies += earned;
        gameState.totalCookies += earned;
    }

    gameState.lastTick = now;
    updateUI();
}

// ===== NUMBER FORMATTING =====

function formatNumber(num) {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num < 1000000000000000) return (num / 1000000000000).toFixed(1) + 'T';
    return (num / 1000000000000000).toFixed(1) + 'Q';
}

function formatTime(seconds) {
    if (seconds < 60) return Math.floor(seconds) + 's';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h';
    return Math.floor(seconds / 86400) + 'd';
}

// ===== EVENT LISTENERS =====

document.getElementById('clickButton').addEventListener('click', handleClick);
document.getElementById('saveButton').addEventListener('click', saveGame);
document.getElementById('resetButton').addEventListener('click', resetGame);
document.getElementById('exportButton').addEventListener('click', exportSave);
document.getElementById('importButton').addEventListener('click', importSave);

// ===== INITIALIZATION =====

function initGame() {
    // Try to load saved game
    const loaded = loadGame();

    if (!loaded) {
        // First time playing
        showNotification('Welcome!', 'Click the cookie to start your empire!');
    }

    // Recalculate all stats
    gameState.clickPower = calculateClickPower();
    gameState.cookiesPerSecond = calculateCookiesPerSecond();
    gameState.multiplier = calculateMultiplier();

    // Initialize UI
    initUpgradeUI();
    updateUI();

    // Start game loop
    setInterval(gameLoop, 100); // Update 10 times per second

    // Auto-save
    setInterval(saveGame, AUTO_SAVE_INTERVAL);
}

// Start the game when page loads
window.addEventListener('DOMContentLoaded', initGame);
