// --- 1. ПЕРЕМЕННЫЕ И НАСТРОЙКИ ---
let score = 0;
let income = 0;
let incomeMultiplier = 1;
let clickPower = 1; // сколько даем за один клик
let upgradeCost = 500; // Начальная цена апгрейда
let autoClicks = 0; // сколько автокликов в секунду сначало
let autoClickCost = 1000; // начальная цена бота (я поставил 1000 для теста)

// Находим элементы интерфейса
const scoreElement = document.getElementById('score');
const incomeElement = document.getElementById('income');
const upgradeBtn = document.getElementById('btn-double');
const autoClickBtn = document.getElementById('btn-autoclick');
const coin = document.querySelector('.coin-container'); 
const shopContainer = document.getElementById('shop-items');

// --- 2. БАЗА ДАННЫХ ТОВАРОВ (МАССИВ ОБЪЕКТОВ) ---
let items = [
    { name: "GTX 630",  cost: 100, income: 5,  count: 0 },
    { name: "GTX 730",  cost: 150, income: 7,  count: 0 },
    { name: "GTX 1030", cost: 250, income: 15, count: 0 },
    { name: "GTX 1060", cost: 300, income: 20, count: 0 },
    { name: "GTX 1080", cost: 350, income: 25, count: 0 },
    { name: "GTX 2070", cost: 500, income: 40, count: 0 },
    { name: "GTX 2080", cost: 700, income: 50, count: 0 },
    { name: "GTX 3070", cost: 850, income: 65, count: 0 },
    { name: "GTX 3080", cost: 950, income: 80, count: 0 },
    { name: "GTX 3090", cost: 1100, income: 95, count: 0 },
    { name: "GTX 4070", cost: 1300, income: 115, count: 0 },
    { name: "GTX 4080", cost: 1500, income: 145, count: 0 },
    { name: "GTX 4090", cost: 1700, income: 170, count: 0 },
    { name: "GTX 5070", cost: 2000, income: 200, count: 0 },
    { name: "GTX 5080", cost: 2200, income: 230, count: 0 },
    { name: "GTX 5090", cost: 2500, income: 260, count: 0 },
];

// --- 3. ЗАГРУЗКА СОХРАНЕНИЙ ---
if (localStorage.getItem('score')) {
    score = parseInt(localStorage.getItem('score'));
    income = parseInt(localStorage.getItem('income'));

    if (localStorage.getItem('clickPower')) {
        clickPower = parseInt(localStorage.getItem('clickPower'));
    }
    if (localStorage.getItem('upgradeCost')) {
        upgradeCost = parseInt(localStorage.getItem('upgradeCost'));
    }
    if (localStorage.getItem('autoClicks')) {
        autoClicks = parseInt(localStorage.getItem('autoClicks'));
        autoClickCost = parseInt(localStorage.getItem('autoClickCost'));
    }
}

if (localStorage.getItem('items')) {
    items = JSON.parse(localStorage.getItem('items'));
}

// Вызываем обновление кнопок при старте
upgradeUpgradeButton();

if (localStorage.getItem('hasDoubleClick') === 'true') {
    let hasDoubleClick = true;
    disableUpgradeBtn(); 
}

// --- 4. ОТРИСОВКА МАГАЗИНА (РЕНДЕР) ---
function renderShop() {
    shopContainer.innerHTML = ''; 

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('shop-item');

        if (score < item.cost) {
            card.classList.add('disabled');
            card.style.borderColor = '#444';
        } else {
            card.classList.remove('disabled');
            card.style.borderColor = '#4caf50';
            card.style.cursor = 'pointer';
        }

        card.innerHTML = `
            <div class="info">
                <h3>${item.name} <span style="font-size: 12px; color: #888">x${item.count}</span></h3>
                <p>+${formatNumber(item.income)} / сек</p>
            </div>
            <div class="price">
                ${formatNumber(item.cost)} $
            </div>
        `;

        card.addEventListener('click', () => buyItem(index));
        shopContainer.appendChild(card);
    });
}

// --- 5. ФУНКЦИЯ ПОКУПКИ ТОВАРА ---
function buyItem(index) {
    const item = items[index];

    if (score >= item.cost) {
        playSound('sfx-buy');
        score = score - item.cost;
        income = income + item.income;
        item.count++;
        item.cost = Math.floor(item.cost * 1.5);

        scoreElement.innerText = formatNumber(score);
        incomeElement.innerText = formatNumber(income);

        renderShop();
    }
}

// --- 6. КЛИК ПО МОНЕТКЕ ---
if (coin) {
    coin.addEventListener('click', function (event) {
        playSound('sfx-click');
        score = score + clickPower;

        scoreElement.innerText = formatNumber(score);
        renderShop(); 
        createParticle(event.clientX, event.clientY);
    });
}

// --- 7. ПОКУПКА АПГРЕЙДА (КНОПКА УСИЛЕНИЯ КЛИКА) ---
if (upgradeBtn) {
    upgradeBtn.addEventListener('click', function() {
        if (score >= upgradeCost) {
            score = score - upgradeCost; 
            clickPower = clickPower * 2; 
            upgradeCost = Math.floor(upgradeCost * 3);

            scoreElement.innerText = formatNumber(score);

            localStorage.setItem('clickPower', clickPower);
            localStorage.setItem('upgradeCost', upgradeCost);
            
            upgradeUpgradeButton();
            renderShop();
        }
    }); // <-- ВОТ ЭТИ СКОБКИ БЫЛИ ПОТЕРЯНЫ!
}

// --- 7.1. ПОКУПКА АВТОКЛИКЕРА ---
if (autoClickBtn) {
    autoClickBtn.addEventListener('click', function() {
        if (score >= autoClickCost) {
            score = score - autoClickCost;
            autoClicks = autoClicks + 1;
            autoClickCost = Math.floor(autoClickCost * 2.5);

            scoreElement.innerText = formatNumber(score);

            localStorage.setItem('autoClicks', autoClicks);
            localStorage.setItem('autoClickCost', autoClickCost);

            upgradeUpgradeButton();
            renderShop();
        }
    });
}

// --- ПОМОЩНИКИ ДЛЯ КНОПОК ---
function upgradeUpgradeButton() {
    if (upgradeBtn) {
        upgradeBtn.innerText = `Усилить клик (+${formatNumber(clickPower)}) | Цена: ${formatNumber(upgradeCost)}$`;
        if (score < upgradeCost) {
            upgradeBtn.style.opacity = "0.6";
        } else {
            upgradeBtn.style.opacity = "1";
        }
    }
    
    if (autoClickBtn) {
        autoClickBtn.innerText = `Автоклик: ${autoClicks}/сек | Цена: ${formatNumber(autoClickCost)}$`;
        if (score < autoClickCost) {
            autoClickBtn.style.opacity = "0.6";
        } else {
            autoClickBtn.style.opacity = "1";
        }
    }
}

function disableUpgradeBtn() {
    if (upgradeBtn) {
        upgradeBtn.innerText = "УЖЕ КУПЛЕНО!";
        upgradeBtn.disabled = true;
    }
}

// --- 8. ЭФФЕКТЫ (Particles) ---
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('float-text');
    particle.innerText = '+' + formatNumber(clickPower) + ' $';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1000);
}   

// --- 9. ИГРОВОЙ ЦИКЛ ---
setInterval(function () {
    let currentIncome = income * incomeMultiplier;
    let autoIncome = autoClicks * clickPower * incomeMultiplier;

    score = score + currentIncome + autoIncome;
    scoreElement.innerText = formatNumber(score);
    incomeElement.innerText = formatNumber(currentIncome + autoIncome);

    localStorage.setItem('score', score);
    localStorage.setItem('income', income);
    localStorage.setItem('items', JSON.stringify(items));

    renderShop(); 
    upgradeUpgradeButton();

    // --- ЭФФЕКТЫ АВТОКЛИКЕРА ---
    if (autoClicks > 0 && coin) {
        // 1. узнаем где сейчас на экране находится монета
        const rect = coin.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height /2;

        // 2. Ограничиваем количество циферок
        let particlesToSpawn = Math.min(autoClicks, 10);

        for (let i = 0; i < particlesToSpawn; i++) {
            setTimeout(() => {
                // делаем случайный разблок вокруг круга монеты
                const randomX = centerX + (Math.random() - 0.5) * 150;
                const randomY = centerY + (Math.random() - 0.5) * 150;

                createParticle(randomX, randomY);
            }, i *(1000 / particlesToSpawn));
        }
    }
}, 1000);

// --- 10. ФОРМАТИРОВАНИЕ ЧИСЕЛ ---
function formatNumber(num) {
    if (num < 1000) return num;
    if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
}

// --- 11. СИСТЕМА СЛУЧАЙНЫХ СОБЫТИЙ --- 
const newsBanner = document.getElementById('news-banner');

const events = [
    { text: "🚀 Илон Маск твитнул про крипту! Доход x2!", multiplier: 2, duration: 10000, type: "good" },
    { text: "📉 Китай запретил майнинг... Доход упал в 2 раза", multiplier: 0.5, duration: 20000, type: "bad" },
    { text: "⚡️ Видеокарты подешевели! Временный буст x3!", multiplier: 3, duration: 5000, type: "good" },
    { text: "🥴 Илон Маск сделал плохой твит! Курс рухнул...", multiplier: 0.5, duration: 15000, type: "bad" },
    { text: "😭 Трамп всё таки был на острове Эпштейна! Курс рухнул...", multiplier: 0.25, duration: 20000, type: "bad" },
    { text: " 🥰 Трамп не был на острове Эпштейна! Курс вырос!", multiplier: 3, duration: 10000, type: "good" },
    { text: " 🤑 ТЫ ВЫИГРАЛ МИЛЛИАРД ДОЛЛАРОВ!!!", multiplier: 100, type: "bad" }
];

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playDigitalSiren() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sawtooth'; 
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); 
    oscillator.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.5); 
    oscillator.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 1.0); 
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0); 
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.0); 
}

function triggerRandomEvent() {
    playDigitalSiren();
    const randomIndex = Math.floor(Math.random() * events.length);
    const event = events[randomIndex];
    incomeMultiplier = event.multiplier;

    newsBanner.innerText = event.text;
    newsBanner.classList.remove('news-hidden'); 
    newsBanner.classList.add(event.type === 'good' ? 'news-good' : 'news-bad'); 

    setTimeout(() => {
        incomeMultiplier = 1; 
        newsBanner.classList.add('news-hidden');
        newsBanner.classList.remove('news-good', 'news-bad');
        incomeElement.innerText = formatNumber(income);
    }, event.duration);
}

setInterval(triggerRandomEvent, 30000);

// --- 12. ЗВУКИ (С диагностикой) ---
function playSound(id) {
    const audio = document.getElementById(id);
    if (!audio) {
        console.error(`❌ ОШИБКА: Я не нашел аудио-тег с id="${id}" в HTML!`);
        return;
    }
    audio.currentTime = 0; 
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.warn(`⚠️ БРАУЗЕР ЗАПРЕТИЛ ЗВУК: ${error}`);
        });
    }
}

// Запуск при старте
renderShop();