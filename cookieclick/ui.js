// ===== UI UPDATE FUNCTIONS =====

function updateUI() {
    // Update resource display
    document.getElementById('cookieCount').textContent = formatNumber(gameState.cookies);
    document.getElementById('clickValue').textContent = formatNumber(gameState.clickPower * gameState.multiplier);

    // Update statistics
    document.getElementById('totalClicks').textContent = formatNumber(gameState.totalClicks);
    document.getElementById('totalCookies').textContent = formatNumber(gameState.totalCookies);
    document.getElementById('cookiesPerSecond').textContent = formatNumber(gameState.cookiesPerSecond);

    const timePlayed = Math.floor((Date.now() - gameState.startTime) / 1000);
    document.getElementById('timePlayed').textContent = formatTime(timePlayed);

    // Update upgrade cards
    updateUpgradeCards();
}

function initUpgradeUI() {
    // Create upgrade cards for each category
    createUpgradeCards('clickUpgrades', UPGRADES.clickPower);
    createUpgradeCards('autoUpgrades', UPGRADES.autoClickers);
    createUpgradeCards('productionUpgrades', UPGRADES.production);
    createUpgradeCards('multiplierUpgrades', UPGRADES.multipliers);
}

function createUpgradeCards(containerId, upgrades) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    upgrades.forEach(upgrade => {
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.id = `upgrade-${upgrade.id}`;
        card.onclick = () => purchaseUpgrade(upgrade.id);

        const productionText = upgrade.type === 'auto' || upgrade.type === 'production'
            ? `<div class="upgrade-production">+${formatNumber(upgrade.effect)}/sec</div>`
            : upgrade.type === 'multiplier'
                ? `<div class="upgrade-production">${upgrade.effect}x multiplier</div>`
                : '';

        card.innerHTML = `
      <div class="upgrade-header">
        <div class="upgrade-name">${upgrade.name}</div>
        <div class="upgrade-count" id="count-${upgrade.id}">0</div>
      </div>
      <div class="upgrade-description">${upgrade.description}</div>
      <div class="upgrade-footer">
        <div class="upgrade-cost" id="cost-${upgrade.id}">0</div>
        ${productionText}
      </div>
    `;

        container.appendChild(card);
    });
}

function updateUpgradeCards() {
    getAllUpgrades().forEach(upgrade => {
        const card = document.getElementById(`upgrade-${upgrade.id}`);
        const costElement = document.getElementById(`cost-${upgrade.id}`);
        const countElement = document.getElementById(`count-${upgrade.id}`);

        if (!card || !costElement || !countElement) return;

        const cost = getUpgradeCost(upgrade);
        const count = gameState.upgrades[upgrade.id] || 0;
        const affordable = canAffordUpgrade(upgrade);

        // Update cost and count
        costElement.textContent = formatNumber(cost);
        countElement.textContent = count;

        // Update card state
        card.classList.remove('affordable', 'disabled');
        if (affordable) {
            card.classList.add('affordable');
        } else if (gameState.cookies < cost * 0.5) {
            card.classList.add('disabled');
        }
    });
}

// ===== VISUAL EFFECTS =====

function createClickParticle(value) {
    const button = document.getElementById('clickButton');
    const rect = button.getBoundingClientRect();

    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = '+' + formatNumber(value);

    // Random position around the button
    const offsetX = (Math.random() - 0.5) * 100;
    const offsetY = (Math.random() - 0.5) * 100;

    particle.style.left = (rect.left + rect.width / 2 + offsetX) + 'px';
    particle.style.top = (rect.top + rect.height / 2 + offsetY) + 'px';

    document.body.appendChild(particle);

    // Remove after animation
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

function showNotification(title, message) {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
    <div class="notification-title">${title}</div>
    <div class="notification-message">${message}</div>
  `;

    document.body.appendChild(notification);

    // Remove after animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== KEYBOARD SHORTCUTS =====

document.addEventListener('keydown', (e) => {
    // Space bar to click
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        handleClick();
    }

    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveGame();
    }
});

// ===== VISIBILITY CHANGE HANDLING =====

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Save when tab becomes hidden
        saveGame();
    } else {
        // Update last tick when tab becomes visible again
        gameState.lastTick = Date.now();
    }
});
