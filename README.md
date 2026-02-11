# 💰 Crypto Clicker

A lightweight, browser-based economic simulation game built with pure JavaScript. Experience the thrill of scaling a crypto-mining empire from scratch.

## 🎮 Gameplay Mechanics
1. **Click & Earn:** Start by manually clicking the coin to build your initial capital.
2. **Upgrade Your Setup:** Visit the shop to purchase GPUs once you have enough funds.
3. **Passive Income:** Each GPU generates automatic income every second.
4. **Dynamic Economy:** Strategic planning is required as hardware prices increase by **1.5x** after every purchase (inflation model).

## ⚙️ Tech Stack
* **HTML5** — Semantic structure.
* **CSS3** — Custom styling, flexbox layouts, and UI state management (Active/Disabled visuals).
* **JavaScript (ES6+)** — Core game logic:
    * **Event Listeners:** Handling user interactions.
    * **Game Loop:** `setInterval` implementation for passive income ticks.
    * **DOM Manipulation:** Real-time UI updates for score, prices, and income.
    * **Logic:** Conditionals to prevent insufficient fund glitches and handle price inflation.

## 🚀 How to Run
This project is built with Vanilla JS and requires no build tools or dependencies.
1. Clone the repository.
2. Open `index.html` in any modern web browser.
3. Start clicking!

## 🛣 Roadmap
* [ ] **Persistence:** Save progress using browser `localStorage`.
* [ ] **New Tiers:** Add advanced hardware (ASIC Miners, Data Centers).
* [ ] **Visuals:** Add particle effects and animations for clicks.

---
*Created by [xyp9r]*
