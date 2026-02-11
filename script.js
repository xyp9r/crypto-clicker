// --- 1. ПЕРЕМЕННЫЕ И НАСТРОЙКИ ---
let score = 0;
let income = 0;

// Находим элементы интерфейса
const scoreElement = document.getElementById('score');
const incomeElement = document.getElementById('income');
// Исправлено: ищем по классу, так как ID у нас нет в HTML
const coin = document.querySelector('.coin-container'); 
const shopContainer = document.getElementById('shop-items');

// --- 2. БАЗА ДАННЫХ ТОВАРОВ (МАССИВ ОБЪЕКТОВ) ---
let items = [
    {
        name: "GTX 630", 
        cost: 100,      
        income: 5,      
        count: 0        
    },
    {
        name: "GTX 730", 
        cost: 150,      
        income: 7,      
        count: 0        
    },
    {
        name: "GTX 1030", 
        cost: 250,      
        income: 15,      
        count: 0        
    },
    {
        name: "GTX 1060", 
        cost: 300,      
        income: 20,      
        count: 0        
    },
    {
        name: "GTX 1080", 
        cost: 350,      
        income: 25,      
        count: 0        
    },
];

// --- 3. ЗАГРУЗКА СОХРАНЕНИЙ ---
if (localStorage.getItem('score')) {
    score = parseInt(localStorage.getItem('score'));
    income = parseInt(localStorage.getItem('income'));
    scoreElement.innerText = score;
    incomeElement.innerText = income;
}

if (localStorage.getItem('items')) {
    items = JSON.parse(localStorage.getItem('items'));
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
            card.style.cursor = 'pointer'; // Исправлена опечатка (было cursur)
        }

        // Исправлен HTML (закрыт тег div class="info")
        card.innerHTML = `
            <div class="info">
                <h3>${item.name} <span style="font-size: 12px; color: #888">x${item.count}</span></h3>
                <p>+${formatNubmer(item.income)} / сек</p>
            </div>
            <div class="price">
                ${formatNubmer(item.cost)} $
            </div>
        `;

        card.addEventListener('click', () => buyItem(index));
        shopContainer.appendChild(card);
    });
}

// --- 5. ФУНКЦИЯ ПОКУПКИ ---
function buyItem(index) {
    const item = items[index];

    if (score >= item.cost) {
        score = score - item.cost;
        income = income + item.income;
        item.count++;
        item.cost = Math.floor(item.cost * 1.5);

        scoreElement.innerText = formatNubmer(score);
        incomeElement.innerText = formatNubmer(income);

        renderShop();
    }
}

// --- 6. КЛИК ПО МОНЕТКЕ ---
// Добавили проверку, чтобы код не падал, если монета не найдена
if (coin) {
    // В скобки добавляем (event) - это информация о клике
    coin.addEventListener('click', function (event) {

        // 1. Игровая логика
        score = score + 1;
        scoreElement.innerText = formatNubmer(score);
        renderShop();

        // 2. Визуальный эффект
        createParticle(event.clientX, event.clientY);
    });

    // Функция создания частицы
    function createParticle(x, y) {
        // Создаем элемент div в памяти
        const particle = document.createElement('div');

        // Настраиваем его
        particle.classList.add('float-text'); // Вешаем класс из CSS
        particle.innerText = '+1 $'; // Текст частицы

        // Задаем позицию
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        // Добавляем элемемнт на страницу
        document.body.appendChild(particle);

        // Удаляем элемент через 1 секунду
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
} else {
    console.error("ОШИБКА: Монетка не найдена! Проверь HTML.");
}

// --- 7. ИГРОВОЙ ЦИКЛ ---
setInterval(function () {
    score = score + income;
    scoreElement.innerText = formatNubmer(score);

    localStorage.setItem('score', score);
    localStorage.setItem('income', income);
    localStorage.setItem('items', JSON.stringify(items));

    renderShop(); 
}, 1000);

// Запуск при старте
renderShop();

// --- ФУНКЦИЯ ФОРМАТИРОВАНИЯ ЧИСЕЛ ---
function formatNubmer(num) {
    if (num < 1000) {
        return num; // Если меньше 1000, просто возвращаем число (500)
    }
    if (num < 1000000) {
        return (num / 1000).toFixed(1) + 'K'; // Делим на 1000 и добавляем 'k' (1.5k)
    }
    if (num < 1000000000) {
        return (num / 1000000).toFixed(1) + 'M'; // Делим на 1 000 000 и добавляем 'M' (2.3M)
    }
    return (num / 1000000000).toFixed(1) + 'B'; // Делим на 1 000 000 000 и добавляем 'B' (3.2B)
};