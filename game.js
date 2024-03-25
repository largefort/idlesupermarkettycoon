const shelf = document.getElementById('shelf');
const cashDisplay = document.getElementById('cash');
const reputationDisplay = document.getElementById('reputation');
const levelDisplay = document.getElementById('level');
const shelvesFilledDisplay = document.getElementById('shelvesFilled');

let gameData = {
    cash: 0,
    reputation: 0,
    level: 1,
    shelvesFilled: 0,
    workers: {
        cashier: 0,
        shelfStocker: 0,
        customer: 0,
        skilledCashier: 0,
        skilledStocker: 0
    }
};

const REPUTATION_PER_CLICK = 1;
const CASH_PER_CLICK = 10;
const REPUTATION_PER_LEVEL = 100;
const SHELVES_FILLED_PER_CLICK = 1;

// Worker Efficiency
const WORKER_EFFICIENCY = {
    cashier: 1,
    shelfStocker: 1,
    skilledCashier: 2, // skilled workers are twice as efficient
    skilledStocker: 2
};

// Worker Costs (for example)
const WORKER_COSTS = {
    cashier: 100,
    shelfStocker: 150,
    customer: 200, // Adjusted cost for hiring a customer
    skilledCashier: 300,
    skilledStocker: 350
};

shelf.addEventListener('click', () => {
    clickShelf();
});

function clickShelf() {
    gameData.cash += CASH_PER_CLICK;
    gameData.reputation += REPUTATION_PER_CLICK;
    gameData.shelvesFilled += SHELVES_FILLED_PER_CLICK;
    checkLevelUp();
    updateDisplay();
    saveGame();
}

function checkLevelUp() {
    if (gameData.reputation >= REPUTATION_PER_LEVEL * gameData.level) {
        gameData.level++;
        gameData.reputation = 0;
    }
}

setInterval(() => {
    // Workers generate cash/shelves filled automatically
    gameData.cash += (gameData.workers.cashier + gameData.workers.skilledCashier * WORKER_EFFICIENCY.skilledCashier);
    gameData.shelvesFilled += (gameData.workers.shelfStocker + gameData.workers.skilledStocker * WORKER_EFFICIENCY.skilledStocker);
    
    // Automatically generate reputation points if there are hired customers
    if (gameData.workers.customer > 0) {
        gameData.reputation += REPUTATION_PER_CLICK;
        checkLevelUpCustomer();
    }
    
    updateDisplay();
}, 1000); // Update every second

function checkLevelUpCustomer() {
    if (gameData.reputation >= REPUTATION_PER_LEVEL * gameData.level) {
        gameData.level++;
        gameData.reputation = 0;
    }
}

function updateDisplay() {
    cashDisplay.textContent = gameData.cash;
    reputationDisplay.textContent = gameData.reputation;
    levelDisplay.textContent = gameData.level;
    shelvesFilledDisplay.textContent = gameData.shelvesFilled;
}

function saveGame() {
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem('gameData'));
    if (savedGame) {
        gameData = savedGame;
    }
    updateDisplay();
}

window.onload = loadGame;

// Example of how to hire a worker
function hireWorker(workerType) {
    if (workerType === 'customer') { // Check if hiring a customer
        gameData.cash -= WORKER_COSTS[workerType];
        gameData.workers[workerType]++;
        saveGame();
        updateDisplay();
    } else {
        if (gameData.cash >= WORKER_COSTS[workerType]) {
            gameData.cash -= WORKER_COSTS[workerType];
            gameData.workers[workerType]++;
            saveGame();
            updateDisplay();
        } else {
            console.log("Not enough cash to hire:", workerType);
        }
    }
}
