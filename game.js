const API_BASE = 'https://api-tower.electrok.ir';
const Eitaa = window.EitaaWebApp;

let score = 0;
let gameActive = false;
let userData = null;

// Initialization and Auth
async function init() {
    Eitaa.ready();
    const initData = Eitaa.initData;

    try {
        const response = await fetch(`${API_BASE}/`, { // Assuming root handles auth/welcome
            method: 'POST',
            headers: { 'Authorization': initData }
        });

        if (response.ok) {
            userData = await response.json();
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('start-screen').style.display = 'flex';
            loadLeaderboard();
        } else {
            document.getElementById('status-text').innerText = 'تأیید ورود ناموفق بود.';
        }
    } catch (e) {
        document.getElementById('status-text').innerText = 'خطا در اتصال به سرور.';
    }
}

async function loadLeaderboard() {
    const listDiv = document.getElementById('leaderboard-content');
    try {
        const res = await fetch(`${API_BASE}/api/leaderboard`);
        const data = await res.json();
        if (data.success) {
            listDiv.innerHTML = data.leaderboard.map((item, i) => 
                `<div class="rank-item"><span>${i+1}. ${item.name}</span><span>${item.score}</span></div>`
            ).join('');
        }
    } catch (e) {
        listDiv.innerText = 'خطا در دریافت لیست.';
    }
}

async function submitScore(finalScore) {
    if (!Eitaa.initData) return;
    try {
        await fetch(`${API_BASE}/api/score`, {
            method: 'POST',
            headers: { 'Authorization': Eitaa.initData, 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: finalScore })
        });
    } catch (e) { console.error("Score submission failed", e); }
}

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
    score = 0;
    updateScoreUI();
    gameActive = true;
    // Game logic here (simplified for this structure)
}

function updateScoreUI() {
    document.getElementById('score').innerText = score.toLocaleString('fa-IR');
}

// Start the app
init();