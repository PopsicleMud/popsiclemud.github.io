// ===== UPGRADE DEFINITIONS =====

const UPGRADES = {
  // Click Power Upgrades
  clickPower: [
    {
      id: 'click1',
      name: 'Better Oven',
      description: 'Doubles cookies per click',
      baseCost: 15,
      costMultiplier: 1.15,
      effect: 2,
      type: 'click'
    },
    {
      id: 'click2',
      name: 'Steel Spatula',
      description: '+5 cookies per click',
      baseCost: 100,
      costMultiplier: 1.15,
      effect: 5,
      type: 'click'
    },
    {
      id: 'click3',
      name: 'Magic Whisk',
      description: '+25 cookies per click',
      baseCost: 1000,
      costMultiplier: 1.15,
      effect: 25,
      type: 'click'
    },
    {
      id: 'click4',
      name: 'Cookie Laser',
      description: '+100 cookies per click',
      baseCost: 10000,
      costMultiplier: 1.15,
      effect: 100,
      type: 'click'
    },
    {
      id: 'click5',
      name: 'Quantum Mixer',
      description: '+500 cookies per click',
      baseCost: 100000,
      costMultiplier: 1.15,
      effect: 500,
      type: 'click'
    }
  ],

  // Auto Clicker Upgrades
  autoClickers: [
    {
      id: 'auto1',
      name: 'Grandma',
      description: 'Bakes 1 cookie per second',
      baseCost: 50,
      costMultiplier: 1.15,
      effect: 1,
      type: 'auto'
    },
    {
      id: 'auto2',
      name: 'Cookie Robot',
      description: 'Produces 5 cookies per second',
      baseCost: 500,
      costMultiplier: 1.15,
      effect: 5,
      type: 'auto'
    },
    {
      id: 'auto3',
      name: 'Cookie Drone',
      description: 'Generates 25 cookies per second',
      baseCost: 5000,
      costMultiplier: 1.15,
      effect: 25,
      type: 'auto'
    },
    {
      id: 'auto4',
      name: 'Cookie AI',
      description: 'Creates 100 cookies per second',
      baseCost: 50000,
      costMultiplier: 1.15,
      effect: 100,
      type: 'auto'
    }
  ],

  // Production Buildings
  production: [
    {
      id: 'prod1',
      name: 'Cookie Farm',
      description: 'Grows 10 cookies per second',
      baseCost: 200,
      costMultiplier: 1.15,
      effect: 10,
      type: 'production'
    },
    {
      id: 'prod2',
      name: 'Cookie Factory',
      description: 'Manufactures 50 cookies per second',
      baseCost: 2000,
      costMultiplier: 1.15,
      effect: 50,
      type: 'production'
    },
    {
      id: 'prod3',
      name: 'Cookie Mine',
      description: 'Extracts 200 cookies per second',
      baseCost: 20000,
      costMultiplier: 1.15,
      effect: 200,
      type: 'production'
    },
    {
      id: 'prod4',
      name: 'Cookie Lab',
      description: 'Synthesizes 1000 cookies per second',
      baseCost: 200000,
      costMultiplier: 1.15,
      effect: 1000,
      type: 'production'
    },
    {
      id: 'prod5',
      name: 'Cookie Portal',
      description: 'Summons 5000 cookies per second',
      baseCost: 2000000,
      costMultiplier: 1.15,
      effect: 5000,
      type: 'production'
    }
  ],

  // Multiplier Upgrades
  multipliers: [
    {
      id: 'mult1',
      name: 'Cookie Blessing',
      description: '2x all production',
      baseCost: 10000,
      costMultiplier: 2,
      effect: 2,
      type: 'multiplier'
    },
    {
      id: 'mult2',
      name: 'Golden Cookie',
      description: '3x all production',
      baseCost: 100000,
      costMultiplier: 3,
      effect: 3,
      type: 'multiplier'
    },
    {
      id: 'mult3',
      name: 'Cookie God',
      description: '5x all production',
      baseCost: 1000000,
      costMultiplier: 5,
      effect: 5,
      type: 'multiplier'
    }
  ]
};

// Helper function to get all upgrades as a flat array
function getAllUpgrades() {
  return [
    ...UPGRADES.clickPower,
    ...UPGRADES.autoClickers,
    ...UPGRADES.production,
    ...UPGRADES.multipliers
  ];
}

// Helper function to get upgrade by ID
function getUpgradeById(id) {
  return getAllUpgrades().find(upgrade => upgrade.id === id);
}
