// --- 1. ПЕРЕМЕННЫЕ И НАСТРОЙКИ ---
let score = 0;
let income = 0;
let hasDoubleClick = false; // По умолчанию улучшения нет

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
];

// --- 3. ЗАГРУЗКА СОХРАНЕНИЙ ---
if (localStorage.getItem('score')) {
    score = parseInt(localStorage.getItem('score'));
    income = parseInt(localStorage.getItem('income'));
    scoreElement.innerText = formatNumber(score);
    incomeElement.innerText = formatNumber(income);
}

if (localStorage.getItem('items')) {
    items = JSON.parse(localStorage.getItem('items'));
}

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
        
        // Логика двойного клика
        if (hasDoubleClick === true) {
            score = score + 2; 
        } else {
            score = score + 1; 
        }

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
        // Цена 500 (как в HTML), а не 5000
        if (score >= 500 && hasDoubleClick === false) {
            score = score - 500; 
            hasDoubleClick = true; 

            scoreElement.innerText = formatNumber(score);
            disableUpgradeBtn(); // Отключаем кнопку

            localStorage.setItem('hasDoubleClick', 'true');
        }
    });
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
    
    // ВАЖНО: Тут должна быть проверка!
    if (hasDoubleClick === true) {
        particle.innerText = '+2 $'; // Если куплено
    } else {
        particle.innerText = '+1 $'; // Если нет
    }

    particle.style.left = x + 'px';
    particle.style.top = y + 'px';

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1000);
}   

// --- 9. ИГРОВОЙ ЦИКЛ ---
setInterval(function () {
    score = score + income;
    scoreElement.innerText = formatNumber(score);

    localStorage.setItem('score', score);
    localStorage.setItem('income', income);
    localStorage.setItem('items', JSON.stringify(items));

    renderShop(); 
}, 1000);

// --- 10. ФОРМАТИРОВАНИЕ ЧИСЕЛ (1.5k) ---
// Исправили опечатку Nubmer -> Number
function formatNumber(num) {
    if (num < 1000) return num;
    if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
}

// Запуск при старте
renderShop();