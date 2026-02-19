// --- 1. ПЕРЕМЕННЫЕ И НАСТРОЙКИ ---
let score = 0;
let income = 0;
let incomeMultiplier = 1;
let clickPower = 1; // сколько даем за один клик
let upgradeCost = 500; // Начальная цена апгрейда

// Находим элементы интерфейса
const scoreElement = document.getElementById('score');
const incomeElement = document.getElementById('income');
const upgradeBtn = document.getElementById('btn-double');
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

    // Загружаем силу клика и цену апгрейда
    if (localStorage.getItem('clickPower')) {
        clickPower = parseInt(localStorage.getItem('clickPower'));
    }
    if (localStorage.getItem('upgradeCost')) {
        upgradeCost = parseInt(localStorage.getItem('upgradeCost'));
    }
}

if (localStorage.getItem('items')) {
    items = JSON.parse(localStorage.getItem('items'));
}

upgradeUpgradeButton();

// Проверка покупки апгрейда при загрузке
if (localStorage.getItem('hasDoubleClick') === 'true') {
    hasDoubleClick = true;
    disableUpgradeBtn(); // Вызываем функцию отключения кнопки
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
        
       // просто добавляем текущую силу клика
        score = score + clickPower;

        scoreElement.innerText = formatNumber(score);
        renderShop(); // Обновляем магазин (вдруг денег стало хватать?)

        // Визуальный эффект
        createParticle(event.clientX, event.clientY);
    });
} else {
    console.error("ОШИБКА: Монетка не найдена! Проверь HTML.");
}

// --- 7. ПОКУПКА АПГРЕЙДА (КНОПКА) ---
if (upgradeBtn) {
    upgradeBtn.addEventListener('click', function() {

        // Если хватает денег на текущую цену апгрейда
        if (score >= upgradeCost) {
            score = score - upgradeCost; // Забираем денюшку за апгрейд
            clickPower = clickPower * 2; // Удваиваем

            // Увеличиваем цену следующего апгрейда в 3 раза и тд
            upgradeCost = Math.floor(upgradeCost * 3);

            scoreElement.innerText = formatNumber(score);

            localStorage.setItem('clickPower', clickPower);
            localStorage.setItem('upgradeCost', upgradeCost);

            upgradeUpgradeButton();
            renderShop();
        }
    });
}

//Функция обновления текста на кнопке
function upgradeUpgradeButton() {
    if (upgradeBtn) {
        // Усиливаем клик
        upgradeBtn.innerText = `Усилить клик (+${formatNumber(clickPower)}) | Цена: ${formatNumber(upgradeCost)}$`;

        // Если не хватает денег - красим в серый
        if (score < upgradeCost) {
            upgradeBtn.style.opacity = "0.6";
        } else {
            upgradeBtn.style.opacity = "1";
        }
    }
}
// Помощник для отключения кнопки (чтобы не дублировать код)
// Помощник для отключения кнопки
function disableUpgradeBtn() {
    if (upgradeBtn) {
        upgradeBtn.innerText = "УЖЕ КУПЛЕНО!";
        // Мы УБРАЛИ строчки с .style.background и .style.color
        // CSS сам сделает кнопку серой, когда увидит disabled = true
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

    score = score + currentIncome;
    scoreElement.innerText = formatNumber(score);
    incomeElement.innerText = formatNumber(currentIncome);
    
    // score = score + income;
    // scoreElement.innerText = formatNumber(score);

    localStorage.setItem('score', score);
    localStorage.setItem('income', income);
    localStorage.setItem('items', JSON.stringify(items));

    renderShop(); 
    upgradeUpgradeButton();
}, 1000);

// --- 10. ФОРМАТИРОВАНИЕ ЧИСЕЛ (1.5k) ---
// Исправили опечатку Nubmer -> Number
function formatNumber(num) {
    if (num < 1000) return num;
    if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
}


// --- 11. СИСТЕМА СЛУЧАЙНЫХ СОБЫТИЙ --- 

const newsBanner = document.getElementById('news-banner');

// Список возможных событий
const events = [
    {
        text: "🚀 Илон Маск твитнул про крипту! Доход x2!",
        multiplier: 2, // Умножаем доход на 2
        duration: 10000, // Длиться 10 секунд
        type: "good" // Хорошая новость
    },
        {
            text: "📉 Китай запретил майнинг... Доход упал в 2 раза",
        multiplier: 0.5, // Делим доход на 2
        duration: 10000, // Длиться 10 секунд
        type: "bad" // Хорошая новость
    },
    {
        text: "⚡️ Видеокарты подешевели! Временный буст x3!",
        multiplier: 3,
        duration: 5000,  // 5 секунд
        type: "good"
    }
];

// Функция запуска события
function triggerRandomEvent() {
    // 1. Выбираем случайное событие из списка
    const randomIndex = Math.floor(Math.random() * events.length);
    const event = events[randomIndex];

    // 2. Применяем эффект
    incomeMultiplier = event.multiplier;

    // 3. Показываем плашку
    newsBanner.innerText = event.text;
    newsBanner.classList.remove('news-hidden'); // показываем
    newsBanner.classList.add(event.type === 'good' ? 'news-good' : 'news-bad'); // красим

    // 4. Таймер отключения события
    setTimeout(() => {
        incomeMultiplier = 1; // Возвращаем множитель в норму

        // прячем плашку
        newsBanner.classList.add('news-hidden');
        newsBanner.classList.remove('news-good', 'news-bad');

        // возвращем текст дохода в норму визуально сразу
        incomeElement.innerText = formatNumber(income);
    }, event.duration);
}

// Запускаем проверку событий каждые 30 секунд
setInterval(triggerRandomEvent, 30000);

// Запуск при старте
renderShop();
