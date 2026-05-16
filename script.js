let database = null;
try {
    if (typeof window.firebase !== 'undefined') {
        const firebaseConfig = {
          apiKey: "AIzaSyD7JNqxD-xw-4sKCLCE5rYrlpi6MqU9m-M",
          authDomain: "damagame-ac454.firebaseapp.com",
          databaseURL: "https://damagame-ac454-default-rtdb.firebaseio.com",
          projectId: "damagame-ac454",
          storageBucket: "damagame-ac454.firebasestorage.app",
          messagingSenderId: "825127557607",
          appId: "1:825127557607:web:17932acede451b0f0b8542",
          measurementId: "G-SHF93T6P55"
        };
        if (!window.firebase.apps.length) {
            window.firebase.initializeApp(firebaseConfig);
        }
        database = window.firebase.database();
    } else {
        console.warn("سێرڤەر نەهاتە دیتن.");
    }
} catch (error) {
    console.error("ئاریشە:", error);
}

function toggleMenu() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        if (modal.classList.contains('hidden')) modal.classList.remove('hidden');
        else modal.classList.add('hidden');
    }
}
window.toggleMenu = toggleMenu;

let isOnline = false;
let currentRoomId = null;
let myRole = 0; 

const translations = {
    "ku-badini": {
        dir: "rtl", appTitle: "یاریا دامانێ", menuTitle: "⚙️ ڕێکخستنێن یاریێ", langLabel: "🌐 زمان (Language):",
        modeLabel: "🎮 شێوازێ یاریکرنێ:", modePvp: "دگەل هەڤالی د ئێک مۆبایل دا", modePve: "دژی کۆمپیوتەری (AI)", modeOnline: "یاریکرن ب ئۆنلاین (Online)",
        diffEasy: "AI: زەعیف", diffNormal: "AI: نۆرمال", diffHard: "AI: ب زەحمەت",
        timeLabel: "⏳ دەمێ یاریکرنێ:", timeUnlimited: "دەم: بێسنوور (ئازاد)", timeCustom: "دەم: دیارکری (خولەک)",
        themeLabel: "🎨 ثێم و دیزاینا یاریێ:", themeNeon: "١. نیۆن (Neon)", themeWood: "٢. دارین (Wood)", themeGold: "٣. زێڕین (Gold)",
        themeDark: "٤. تاریک (Dark)", themeOcean: "٥. دەریایی (Ocean)", themeCyber: "٦. سایبەرپانک (Cyber)",
        themeForest: "٧. دارستان (Forest)", themeVintage: "٨. کەڤنار (Vintage)", themeLava: "٩. ئاگرین (Lava)", themeRoyal: "١٠. شاهانە (Royal)",
        soundOn: "🔊 دەنگ", soundOff: "🔇 بێدەنگ", restartBtn: "🔄 نوی کرنەڤە", installBtn: "📥 دابەزاندن", closeBtn: "❌ گرتن",
        startBtn: "▶ دەستپێکرن", menuBtn: "⚙️ مینیو", player1: "یاریزان ١", player2: "یاریزان ٢",
        statusTurn1: "دۆرە یا یاریزانێ ئێکێ یە", statusTurn2: "دۆرە یا یاریزانێ دووێ یە", statusAi: "کۆمپیوتەر یێ هزر دکەت...",
        drawMoves: "پێنگاڤ بۆ یەکسانبوونێ", winDraw: "یاری ب یەکسانبوون ب دوماهی هات! 🤝",
        winP1: "یاریزانێ ١ ب سەرکەفت! 🏆", winP2: "یاریزانێ ٢ ب سەرکەفت! 🏆", winAi: "کۆمپیوتەر ب سەرکەفت! 🤖",
        warnStart: "بەری لڤاندنێ، هیڤییە دوگمەیا دەستپێکرنێ لێبدە!", warnForce: "پێدڤییە تو وی بەری بلڤینی یێ کو زۆرترین بەران دخۆت!", undoSuccess: "پێنگاڤ هاتە ڤەگەڕاندن!",
        noInternet: "گرێدان ب سێرڤەری نەهاتە کرن!", notYourTurn: "دۆرە نە یا تە یە!", 
        onlinePlayTitle: "🌐 یاریکرن ب ئۆنلاین", hostGame: "دروستکرنا ژوورێ (Host)", joinGame: "چوونە ژوور (Client)",
        yourRoomCode: "کۆدێ ژوورا تە ئەڤەیە:", waitPlayer: "چاڤەڕێی یاریزانێ ٢ یە...", enterRoomCode: "کۆدێ ژوورێ ل ڤێرە بنڤیسە:",
        joinRoomBtn: "چوونە ژوور", cancelBtn: "پاشگەزبوون", connected: "گرێدان سەرکەفت!", invalidCode: "کۆدێ ژوورێ خەلەتە!"
    },
    "ku-sorani": {
        dir: "rtl", appTitle: "یاری دامە", menuTitle: "⚙️ ڕێکخستنەکانی یاری", langLabel: "🌐 زمان (Language):",
        modeLabel: "🎮 شێوازی یاریکردن:", modePvp: "لەگەڵ هاوڕێ لە یەک مۆبایلدا", modePve: "دژی کۆمپیوتەر (AI)", modeOnline: "یاریکردن بە ئۆنلاین (Online)",
        diffEasy: "AI: ئاسان", diffNormal: "AI: مامناوەند", diffHard: "AI: قورس",
        timeLabel: "⏳ کاتی یاریکردن:", timeUnlimited: "کات: بێسنوور (ئازاد)", timeCustom: "کات: دیاریکراو (خولەک)",
        themeLabel: "🎨 ڕووکار و دیزاین:", themeNeon: "١. نیۆن (Neon)", themeWood: "٢. تەختە (Wood)", themeGold: "٣. ئاڵتوونی (Gold)",
        themeDark: "٤. تاریک (Dark)", themeOcean: "٥. دەریایی (Ocean)", themeCyber: "٦. سایبەرپانک (Cyber)",
        themeForest: "٧. دارستان (Forest)", themeVintage: "٨. کۆن (Vintage)", themeLava: "٩. ئاگرین (Lava)", themeRoyal: "١٠. شاهانە (Royal)",
        soundOn: "🔊 دەنگ", soundOff: "🔇 بێدەنگ", restartBtn: "🔄 نوێ کردنەوە", installBtn: "📥 دابەزاندن", closeBtn: "❌ داخستن",
        startBtn: "▶ دەستپێکردن", menuBtn: "⚙️ مینیو", player1: "یاریزانی ١", player2: "یاریزانی ٢",
        statusTurn1: "سۆرەی یاریزانی یەکەمە", statusTurn2: "سۆرەی یاریزانی دووەمە", statusAi: "کۆمپیوتەر بیر دەکاتەوە...",
        drawMoves: "هەنگاو بۆ یەکسانبوون", winDraw: "یارییەکە بە یەکسانبوون کۆتایی هات! 🤝",
        winP1: "یاریزانی ١ سەرکەوت! 🏆", winP2: "یاریزانی ٢ سەرکەوت! 🏆", winAi: "کۆمپیوتەر سەرکەوت! 🤖",
        warnStart: "پێش جوڵاندن، تکایە کرتە لە دەستپێکردن بکە!", warnForce: "پێویستە ئەو بەردە بجوڵێنیت کە زۆرترین بەرد دەخوات!", undoSuccess: "هەنگاوەکە گەڕێندرایەوە!",
        noInternet: "پەیوەندی بە سێرڤەر نەکرا!", notYourTurn: "سۆرەی تۆ نییە!",
        onlinePlayTitle: "🌐 یاریکردن بە ئۆنلاین", hostGame: "دروستکردنی ژوور (Host)", joinGame: "چوونە ژوور (Client)",
        yourRoomCode: "کۆدی ژوورەکەت ئەوەیە:", waitPlayer: "چاوەڕێی یاریزانی ٢...", enterRoomCode: "کۆدی ژوورەکە لێرە بنووسە:",
        joinRoomBtn: "چوونە ژوور", cancelBtn: "گەڕانەوە", connected: "سەرکەوتوو بوو!", invalidCode: "کۆدەکە هەڵەیە!"
    },
    "fa": {
        dir: "rtl", appTitle: "بازی چکرز", menuTitle: "⚙️ تنظیمات بازی", langLabel: "🌐 زبان:",
        modeLabel: "🎮 حالت بازی:", modePvp: "دو نفره (در یک گوشی)", modePve: "با کامپیوتر", modeOnline: "بازی آنلاین",
        diffEasy: "آسان", diffNormal: "متوسط", diffHard: "سخت", timeLabel: "⏳ زمان:", timeUnlimited: "نامحدود", timeCustom: "دلخواه (دقیقه)",
        themeLabel: "🎨 قالب:", themeNeon: "۱. نئون", themeWood: "۲. چوبی", themeGold: "۳. طلایی", themeDark: "۴. تاریک", themeOcean: "۵. اقیانوس", themeCyber: "۶. سایبرپانک", themeForest: "۷. جنگل", themeVintage: "۸. کلاسیک", themeLava: "۹. گدازه", themeRoyal: "۱۰. رویال",
        soundOn: "🔊 صدا", soundOff: "🔇 بی‌صدا", restartBtn: "🔄 شروع مجدد", installBtn: "📥 نصب", closeBtn: "❌ بستن",
        startBtn: "▶ شروع", menuBtn: "⚙️ منو", player1: "بازیکن ۱", player2: "بازیکن ۲",
        statusTurn1: "نوبت بازیکن اول", statusTurn2: "نوبت بازیکن دوم", statusAi: "کامپیوتر فکر میکند...",
        drawMoves: "حرکت تا مساوی", winDraw: "بازی مساوی شد! 🤝", winP1: "بازیکن ۱ برد! 🏆", winP2: "بازیکن ۲ برد! 🏆", winAi: "کامپیوتر برد! 🤖",
        warnStart: "اول دکمه شروع را بزنید!", warnForce: "باید مهره حریف را بزنید!", undoSuccess: "حرکت برگشت!",
        noInternet: "ارتباط با سرور برقرار نشد!", notYourTurn: "نوبت شما نیست!",
        onlinePlayTitle: "🌐 بازی آنلاین", hostGame: "ساخت اتاق (Host)", joinGame: "ورود به اتاق (Client)",
        yourRoomCode: "کد اتاق شما:", waitPlayer: "منتظر بازیکن ۲...", enterRoomCode: "کد اتاق را وارد کنید:",
        joinRoomBtn: "ورود", cancelBtn: "انصراف", connected: "متصل شد!", invalidCode: "کد اشتباه است!"
    },
    "ar": {
        dir: "rtl", appTitle: "لعبة الضامة", menuTitle: "⚙️ الإعدادات", langLabel: "🌐 اللغة:",
        modeLabel: "🎮 وضع اللعبة:", modePvp: "لاعبان (نفس الجهاز)", modePve: "ضد الكمبيوتر", modeOnline: "أونلاين",
        diffEasy: "سهل", diffNormal: "عادي", diffHard: "صعب", timeLabel: "⏳ الوقت:", timeUnlimited: "غير محدود", timeCustom: "مخصص (دقائق)",
        themeLabel: "🎨 المظهر:", themeNeon: "١. نيون", themeWood: "٢. خشبي", themeGold: "٣. ذهبي", themeDark: "٤. داكن", themeOcean: "٥. محيط", themeCyber: "٦. سايبربانك", themeForest: "٧. غابة", themeVintage: "٨. عتيق", themeLava: "٩. حمم", themeRoyal: "١٠. ملكي",
        soundOn: "🔊 الصوت", soundOff: "🔇 صامت", restartBtn: "🔄 إعادة", installBtn: "📥 تثبيت", closeBtn: "❌ إغلاق",
        startBtn: "▶ ابدأ", menuBtn: "⚙️ القائمة", player1: "اللاعب ١", player2: "اللاعب ٢",
        statusTurn1: "دور اللاعب الأول", statusTurn2: "دور اللاعب الثاني", statusAi: "الكمبيوتر يفكر...",
        drawMoves: "حركات للتعادل", winDraw: "تعادل! 🤝", winP1: "اللاعب ١ فاز! 🏆", winP2: "اللاعب ٢ فاز! 🏆", winAi: "الكمبيوتر فاز! 🤖",
        warnStart: "اضغط ابدأ أولاً!", warnForce: "يجب أن تأكل قطعة!", undoSuccess: "تم التراجع!",
        noInternet: "لا يوجد اتصال بالإنترنت!", notYourTurn: "ليس دورك!",
        onlinePlayTitle: "🌐 اللعب أونلاين", hostGame: "إنشاء غرفة (Host)", joinGame: "انضمام (Client)",
        yourRoomCode: "رمز غرفتك:", waitPlayer: "بانتظار اللاعب ٢...", enterRoomCode: "أدخل رمز الغرفة:",
        joinRoomBtn: "انضمام", cancelBtn: "إلغاء", connected: "تم الاتصال!", invalidCode: "رمز خاطئ!"
    },
    "tr": {
        dir: "ltr", appTitle: "Dama Oyunu", menuTitle: "⚙️ Ayarlar", langLabel: "🌐 Dil:",
        modeLabel: "🎮 Mod:", modePvp: "2 Oyuncu (Aynı Cihaz)", modePve: "Bilgisayara Karşı", modeOnline: "Çevrimiçi (Online)",
        diffEasy: "Kolay", diffNormal: "Normal", diffHard: "Zor", timeLabel: "⏳ Süre:", timeUnlimited: "Sınırsız", timeCustom: "Özel (Dk)",
        themeLabel: "🎨 Tema:", themeNeon: "1. Neon", themeWood: "2. Ahşap", themeGold: "3. Altın", themeDark: "4. Karanlık", themeOcean: "5. Okyanus", themeCyber: "6. Siberpunk", themeForest: "7. Orman", themeVintage: "8. Klasik", themeLava: "9. Lav", themeRoyal: "10. Kraliyet",
        soundOn: "🔊 Ses", soundOff: "🔇 Sessiz", restartBtn: "🔄 Yeniden Başlat", installBtn: "📥 Yükle", closeBtn: "❌ Kapat",
        startBtn: "▶ Başla", menuBtn: "⚙️ Menü", player1: "Oyuncu 1", player2: "Oyuncu 2",
        statusTurn1: "Sıra 1. Oyuncuda", statusTurn2: "Sıra 2. Oyuncuda", statusAi: "Bilgisayar düşünüyor...",
        drawMoves: "Beraberlik hamlesi", winDraw: "Berabere! 🤝", winP1: "Oyuncu 1 Kazandı! 🏆", winP2: "Oyuncu 2 Kazandı! 🏆", winAi: "Bilgisayar Kazandı! 🤖",
        warnStart: "Önce Başla'ya tıklayın!", warnForce: "Rakibi yemeniz şart!", undoSuccess: "Geri alındı!",
        noInternet: "İnternet bağlantısı yok!", notYourTurn: "Senin sıran değil!",
        onlinePlayTitle: "🌐 Çevrimiçi Oyun", hostGame: "Oda Kur (Host)", joinGame: "Odaya Katıl (Client)",
        yourRoomCode: "Oda Kodun:", waitPlayer: "Oyuncu 2 bekleniyor...", enterRoomCode: "Oda Kodunu Girin:",
        joinRoomBtn: "Katıl", cancelBtn: "İptal", connected: "Bağlandı!", invalidCode: "Geçersiz Kod!"
    },
    "en": {
        dir: "ltr", appTitle: "Checkers", menuTitle: "⚙️ Settings", langLabel: "🌐 Language:",
        modeLabel: "🎮 Game Mode:", modePvp: "2 Players (Local)", modePve: "vs Computer (AI)", modeOnline: "Play Online",
        diffEasy: "Easy", diffNormal: "Normal", diffHard: "Hard", timeLabel: "⏳ Time:", timeUnlimited: "Unlimited", timeCustom: "Custom (Mins)",
        themeLabel: "🎨 Theme:", themeNeon: "1. Neon", themeWood: "2. Wood", themeGold: "3. Gold", themeDark: "4. Dark", themeOcean: "5. Ocean", themeCyber: "6. Cyberpunk", themeForest: "7. Forest", themeVintage: "8. Vintage", themeLava: "9. Lava", themeRoyal: "10. Royal",
        soundOn: "🔊 Sound", soundOff: "🔇 Mute", restartBtn: "🔄 Restart", installBtn: "📥 Install", closeBtn: "❌ Close",
        startBtn: "▶ Start", menuBtn: "⚙️ Menu", player1: "Player 1", player2: "Player 2",
        statusTurn1: "Player 1's Turn", statusTurn2: "Player 2's Turn", statusAi: "AI thinking...",
        drawMoves: "Moves to draw", winDraw: "Game Drawn! 🤝", winP1: "Player 1 Wins! 🏆", winP2: "Player 2 Wins! 🏆", winAi: "AI Wins! 🤖",
        warnStart: "Click Start first!", warnForce: "You must capture!", undoSuccess: "Undone!",
        noInternet: "No Server Connection!", notYourTurn: "Not your turn!",
        onlinePlayTitle: "🌐 Play Online", hostGame: "Host Game", joinGame: "Join Game",
        yourRoomCode: "Your Room Code:", waitPlayer: "Waiting for Player 2...", enterRoomCode: "Enter Room Code:",
        joinRoomBtn: "Join", cancelBtn: "Cancel", connected: "Connected!", invalidCode: "Invalid Code!"
    }
};

let currentLang = 'ku-badini';

function applyLanguage() {
    const t = translations[currentLang] || translations['ku-badini'];
    const settingsContent = document.querySelector('.settings-content');
    const onlineContent = document.querySelector('.online-content');
    if (settingsContent) settingsContent.style.direction = t.dir;
    if (onlineContent) onlineContent.style.direction = t.dir;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
    });
    updateStatus(); 
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) muteBtn.innerText = isMuted ? t.soundOff : t.soundOn;
}

function changeLanguage() {
    currentLang = document.getElementById('lang-selector').value;
    applyLanguage();
    saveGameState();
}

const ROWS = 8;
const COLS = 8;
let board = [];
let currentPlayer = 1;
let selectedPiece = null;
let validMoves = [];
let multiJumpPiece = null;
let isAnimating = false;
let isVsAI = false;

let timerInterval = null;
let p1Time = 0;
let p2Time = 0;
let isTimerActive = false;
let lastMoveData = { startR: null, startC: null, endR: null, endC: null };
let isGameOver = false;

let isGameStarted = false; 
let isMuted = false;

let p1CanUndo = true;
let p2CanUndo = true;
let undoState = null;
let undoTimerID = null;
let aiTimeoutID = null; 

let movesWithoutCapture = 0; 
let forcedPieces = []; 

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('install-btn');
    if (installBtn) installBtn.style.display = 'inline-block';
});

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                const installBtn = document.getElementById('install-btn');
                if (installBtn) installBtn.style.display = 'none';
            }
            deferredPrompt = null;
        });
    }
}

// ====== پەنجەرەیا ئۆنلاین (Online Setup UI) ======
function updateUIForSettings() {
    const mode = document.getElementById('game-mode').value;
    isVsAI = (mode === 'pve');
    isOnline = (mode === 'online');
    
    document.getElementById('ai-difficulty').style.display = isVsAI ? 'inline-block' : 'none';
    
    if (isOnline) {
        document.getElementById('settings-modal').classList.add('hidden');
        document.getElementById('online-modal').classList.remove('hidden');
        document.getElementById('host-ui').style.display = 'none';
        document.getElementById('join-ui').style.display = 'none';
        document.querySelector('.online-options').style.display = 'flex';
    }
    
    const tSet = document.getElementById('timer-setting').value;
    document.getElementById('timer-minutes').style.display = (tSet === 'custom') ? 'inline-block' : 'none';
}

function showHostUI() {
    createRoom(); 
}

function showJoinUI() {
    document.querySelector('.online-options').style.display = 'none';
    document.getElementById('join-ui').style.display = 'block';
}

function cancelOnline() {
    document.getElementById('online-modal').classList.add('hidden');
    document.getElementById('game-mode').value = 'pvp'; 
    isOnline = false;
    currentRoomId = null;
    myRole = 0;
    toggleMenu(); 
}

function createRoom() {
    if (!database) { showWarning(translations[currentLang].noInternet); return; }

    // بکارئینانا initBoard ل شوینا resetGame داکو پەنجەرە نەهێتە گرتن
    initBoard(true); 

    // پیشاندانا بەشێ Host پشتی کارپێکرنا initBoard داکو نەشارتیتەڤە
    document.querySelector('.online-options').style.display = 'none';
    document.getElementById('join-ui').style.display = 'none';
    document.getElementById('host-ui').style.display = 'block';

    currentRoomId = Math.floor(1000 + Math.random() * 9000).toString();
    myRole = 1; 
    
    document.getElementById('display-room-code').innerText = currentRoomId;
    
    database.ref('rooms/' + currentRoomId).set({
        board: board, currentPlayer: 1,
        p1Time: p1Time, p2Time: p2Time,
        status: 'waiting',
        p1CanUndo: p1CanUndo, p2CanUndo: p2CanUndo,
        movesWithoutCapture: 0,
        lastActionBy: 0
    });
    
    listenToRoom();
}

function joinRoom() {
    if (!database) { showWarning(translations[currentLang].noInternet); return; }
    const code = document.getElementById('join-code-input').value.trim();
    if(!code) return;
    const t = translations[currentLang];
    
    database.ref('rooms/' + code).once('value', snapshot => {
        if(snapshot.exists()) {
            currentRoomId = code;
            myRole = 2; 
            database.ref('rooms/' + currentRoomId).update({ status: 'playing' });
            
            showWarning(t.connected);
            listenToRoom();
            
            setTimeout(() => {
                document.getElementById('online-modal').classList.add('hidden');
                isGameStarted = true;
                startTimer();
            }, 1000);
            
        } else {
            showWarning(t.invalidCode);
        }
    });
}

function listenToRoom() {
    if (!database) return;
    database.ref('rooms/' + currentRoomId).on('value', snapshot => {
        const data = snapshot.val();
        if(!data) return;

        if (myRole === 1 && data.status === 'playing' && !isGameStarted) {
             const t = translations[currentLang];
             showWarning(t.connected);
             setTimeout(() => {
                 document.getElementById('online-modal').classList.add('hidden');
                 isGameStarted = true;
                 startTimer();
             }, 1000);
        }

        if (data.lastActionBy !== myRole && data.lastActionBy !== 0) {
            board = data.board || board;
            currentPlayer = data.currentPlayer || currentPlayer;
            p1Time = data.p1Time !== undefined ? data.p1Time : p1Time;
            p2Time = data.p2Time !== undefined ? data.p2Time : p2Time;
            multiJumpPiece = data.multiJumpPiece || null;
            lastMoveData = data.lastMoveData || { startR: null, startC: null, endR: null, endC: null };
            p1CanUndo = data.p1CanUndo !== undefined ? data.p1CanUndo : p1CanUndo;
            p2CanUndo = data.p2CanUndo !== undefined ? data.p2CanUndo : p2CanUndo;
            movesWithoutCapture = data.movesWithoutCapture || 0;
            
            renderBoard();
            updateScores();
            updateStatus();
            updateTimerDisplay();
        }
    });
}

function syncGameState() {
    if (isOnline && currentRoomId && database) {
        database.ref('rooms/' + currentRoomId).update({
            board: board,
            currentPlayer: currentPlayer,
            p1Time: p1Time,
            p2Time: p2Time,
            multiJumpPiece: multiJumpPiece || null,
            lastMoveData: lastMoveData,
            p1CanUndo: p1CanUndo,
            p2CanUndo: p2CanUndo,
            movesWithoutCapture: movesWithoutCapture,
            lastActionBy: myRole
        });
    }
}
// ====== دوماهیا لۆژیکا ئۆنلاین ======

function startGame() {
    if (isOnline && !currentRoomId) {
        updateUIForSettings(); 
        return;
    }
    isGameStarted = true;
    document.getElementById('start-btn').style.display = 'none';
    startTimer();
    playSound('move');
    saveGameState();
}
window.startGame = startGame;

function handleSettingChange() {
    updateUIForSettings();
    if(!isOnline) resetGame(true);
}

function saveUndoState() {
    undoState = {
        board: JSON.parse(JSON.stringify(board)),
        currentPlayer: currentPlayer,
        p1Time: p1Time,
        p2Time: p2Time,
        lastMoveData: { ...lastMoveData },
        movesWithoutCapture: movesWithoutCapture
    };
}

function undoMove() {
    if (!undoState || isGameOver) return;
    
    let lastPieceOwner = undoState.currentPlayer;
    
    if (isOnline && lastPieceOwner !== myRole) return;
    if (lastPieceOwner === 1 && !p1CanUndo) return;
    if (lastPieceOwner === 2 && !p2CanUndo) return;

    if (aiTimeoutID) { clearTimeout(aiTimeoutID); aiTimeoutID = null; }

    board = JSON.parse(JSON.stringify(undoState.board));
    currentPlayer = undoState.currentPlayer;
    p1Time = undoState.p1Time;
    p2Time = undoState.p2Time;
    lastMoveData = { ...undoState.lastMoveData };
    movesWithoutCapture = undoState.movesWithoutCapture;
    
    if (lastPieceOwner === 1) p1CanUndo = false;
    if (lastPieceOwner === 2) p2CanUndo = false;
    
    undoState = null; multiJumpPiece = null; selectedPiece = null; validMoves = [];
    
    playSound('move');
    showWarning(translations[currentLang].undoSuccess);
    renderBoard(); updateScores(); updateStatus(); updateTimerDisplay();
    saveGameState();
    syncGameState(); 
}

function changeTheme() {
    const theme = document.getElementById('theme-selector').value;
    document.body.setAttribute('data-theme', theme);
    saveGameState();
}

function saveGameState() {
    if (isGameOver || isOnline) return; 
    const gameState = {
        board: board, currentPlayer: currentPlayer, multiJumpPiece: multiJumpPiece,
        lastMoveData: lastMoveData, p1Time: p1Time, p2Time: p2Time,
        movesWithoutCapture: movesWithoutCapture, isGameStarted: isGameStarted,
        isMuted: isMuted, p1CanUndo: p1CanUndo, p2CanUndo: p2CanUndo,
        lang: currentLang, mode: document.getElementById('game-mode').value,
        difficulty: document.getElementById('ai-difficulty').value,
        theme: document.getElementById('theme-selector').value,
        timerSetting: document.getElementById('timer-setting').value,
        timerMinutes: document.getElementById('timer-minutes').value
    };
    try { localStorage.setItem('damaSave', JSON.stringify(gameState)); } catch(e) {}
}

function loadGameState() {
    const saved = localStorage.getItem('damaSave');
    if (saved && !isOnline) {
        try {
            const state = JSON.parse(saved);
            if (!state || !state.board) return false;
            
            board = state.board; currentPlayer = state.currentPlayer;
            multiJumpPiece = state.multiJumpPiece; lastMoveData = state.lastMoveData;
            p1Time = state.p1Time; p2Time = state.p2Time;
            movesWithoutCapture = state.movesWithoutCapture || 0;
            isGameStarted = state.isGameStarted !== undefined ? state.isGameStarted : false;
            isMuted = state.isMuted || false;
            p1CanUndo = state.p1CanUndo !== undefined ? state.p1CanUndo : true;
            p2CanUndo = state.p2CanUndo !== undefined ? state.p2CanUndo : true;
            currentLang = state.lang || 'ku-badini';
            
            document.getElementById('lang-selector').value = currentLang;
            document.getElementById('game-mode').value = state.mode || 'pvp';
            document.getElementById('ai-difficulty').value = state.difficulty || 'normal';
            document.getElementById('theme-selector').value = state.theme || 'neon';
            document.getElementById('timer-setting').value = state.timerSetting || 'unlimited';
            document.getElementById('timer-minutes').value = state.timerMinutes || 5;
            
            applyLanguage(); updateUIForSettings(); changeTheme();
            return true;
        } catch (e) {
            localStorage.removeItem('damaSave');
            return false;
        }
    }
    return false;
}

function startTimer() {
    clearInterval(timerInterval);
    if (!isGameStarted) return; 
    
    const setting = document.getElementById('timer-setting').value;
    if (setting === 'unlimited' || isGameOver) {
        document.getElementById('timer1').innerText = "";
        document.getElementById('timer2').innerText = "";
        isTimerActive = false;
        return;
    }
    
    isTimerActive = true;
    timerInterval = setInterval(() => {
        if (currentPlayer === 1) {
            p1Time--;
            if (p1Time <= 0) { p1Time = 0; gameOver(2); clearInterval(timerInterval); }
        } else {
            p2Time--;
            if (p2Time <= 0) { p2Time = 0; gameOver(1); clearInterval(timerInterval); }
        }
        updateTimerDisplay();
        if(p1Time % 5 === 0 && !isOnline) saveGameState(); 
    }, 1000);
}

function updateTimerDisplay() {
    const setting = document.getElementById('timer-setting').value;
    const t1 = document.getElementById('timer1'); const t2 = document.getElementById('timer2');
    
    if (setting === 'unlimited') { t1.innerText = ""; t2.innerText = ""; return; }

    const formatTime = (secs) => {
        let h = Math.floor(secs / 3600); let m = Math.floor((secs % 3600) / 60); let s = secs % 60;
        if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };
    
    t1.innerText = `⏱ ${formatTime(p1Time)}`; t2.innerText = `⏱ ${formatTime(p2Time)}`;
    t1.className = p1Time <= 30 && p1Time > 0 ? "timer danger" : "timer";
    t2.className = p2Time <= 30 && p2Time > 0 ? "timer danger" : "timer";
}

function initBoard(forceNew = false) {
    const gameOverModal = document.getElementById('game-over-modal');
    if (gameOverModal) gameOverModal.classList.add('hidden');
    isGameOver = false;
    
    if (forceNew || !loadGameState()) {
        board = []; currentPlayer = 1; selectedPiece = null; validMoves = []; multiJumpPiece = null; isAnimating = false;
        lastMoveData = { startR: null, startC: null, endR: null, endC: null };
        movesWithoutCapture = 0;
        isGameStarted = false; 
        
        p1CanUndo = true; p2CanUndo = true; undoState = null;
        if (aiTimeoutID) { clearTimeout(aiTimeoutID); aiTimeoutID = null; }

        updateUIForSettings();
        
        let tSet = document.getElementById('timer-setting').value;
        if (tSet === 'unlimited') { p1Time = p2Time = 0; } 
        else {
            let mins = parseInt(document.getElementById('timer-minutes').value) || 5;
            if (mins < 1) mins = 1; if (mins > 60) mins = 60;
            document.getElementById('timer-minutes').value = mins; 
            p1Time = p2Time = mins * 60;
        }
        
        for (let r = 0; r < ROWS; r++) {
            board[r] = [];
            for (let c = 0; c < COLS; c++) {
                if (r === 1 || r === 2) board[r][c] = 2;
                else if (r === 5 || r === 6) board[r][c] = 1;
                else board[r][c] = 0;
            }
        }
        changeTheme();
    } else { updateUIForSettings(); }
    
    applyLanguage(); 
    
    if (isGameStarted) {
        document.getElementById('start-btn').style.display = 'none';
        startTimer();
    } else {
        document.getElementById('start-btn').style.display = 'inline-block';
    }
    
    updateScores(); renderBoard(); updateStatus(); updateTimerDisplay();
}

function resetGame(force = false) {
    if (force) localStorage.removeItem('damaSave');
    if (isOnline) { currentRoomId = null; myRole = 0; }
    const modal1 = document.getElementById('settings-modal');
    const modal2 = document.getElementById('online-modal');
    if (modal1) modal1.classList.add('hidden'); 
    if (modal2) modal2.classList.add('hidden'); 
    initBoard(force);
}

function getOwner(val) { return (val === 1 || val === 3) ? 1 : ((val === 2 || val === 4) ? 2 : 0); }

function updateScores() {
    let p1Count = 0, p2Count = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (getOwner(board[r][c]) === 1) p1Count++;
            if (getOwner(board[r][c]) === 2) p2Count++;
        }
    }
    document.getElementById('score1').innerText = (16 - p2Count);
    document.getElementById('score2').innerText = (16 - p1Count);
}

function checkWinCondition() {
    let p1Count = 0, p2Count = 0, p1HasMoves = false, p2HasMoves = false;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            let owner = getOwner(board[r][c]);
            if (owner === 1) { p1Count++; if (!p1HasMoves && getValidMoves(r, c, board).length > 0) p1HasMoves = true; } 
            else if (owner === 2) { p2Count++; if (!p2HasMoves && getValidMoves(r, c, board).length > 0) p2HasMoves = true; }
        }
    }
    if (p1Count === 0 || (!p1HasMoves && currentPlayer === 1)) { gameOver(2); return true; } 
    else if (p2Count === 0 || (!p2HasMoves && currentPlayer === 2)) { gameOver(1); return true; }
    return false;
}

function gameOver(winner) {
    isGameOver = true;
    clearInterval(timerInterval);
    if (aiTimeoutID) clearTimeout(aiTimeoutID);
    localStorage.removeItem('damaSave'); 
    playSound('win');
    
    const modal = document.getElementById('game-over-modal');
    const text = document.getElementById('winner-text');
    const t = translations[currentLang];
    
    if (winner === 0) {
        text.innerText = t.winDraw; text.style.color = "#ffffff";
    } else if (winner === 1) { 
        text.innerText = t.winP1; text.style.color = "var(--p1-glow)"; 
    } else { 
        text.innerText = isVsAI ? t.winAi : t.winP2; text.style.color = "var(--p2-glow)"; 
    }
    if (modal) modal.classList.remove('hidden');
}

function calculateForcedPieces() {
    forcedPieces = [];
    if (multiJumpPiece) {
        let maxCaps = getMaxCaptures(multiJumpPiece.r, multiJumpPiece.c, board);
        forcedPieces.push({ r: multiJumpPiece.r, c: multiJumpPiece.c, maxCaps: maxCaps });
        return;
    }
    let globalMaxCaptures = 0;
    let piecesMaxCaptures = [];
    for (let ir = 0; ir < ROWS; ir++) {
        for (let ic = 0; ic < COLS; ic++) {
            if (getOwner(board[ir][ic]) === currentPlayer) {
                let maxCaps = getMaxCaptures(ir, ic, board);
                if (maxCaps > 0) {
                    piecesMaxCaptures.push({ r: ir, c: ic, maxCaps: maxCaps });
                    if (maxCaps > globalMaxCaptures) globalMaxCaptures = maxCaps;
                }
            }
        }
    }
    if (globalMaxCaptures > 0) { forcedPieces = piecesMaxCaptures.filter(p => p.maxCaps === globalMaxCaptures); }
}

function startUndoTimer(e) {
    e.preventDefault(); 
    const el = e.target;
    el.classList.add('undoing-piece');
    
    if (aiTimeoutID) { clearTimeout(aiTimeoutID); }

    undoTimerID = setTimeout(() => {
        el.classList.remove('undoing-piece');
        undoMove();
    }, 3000); 
}

function cancelUndoTimer(e) {
    if (undoTimerID) {
        clearTimeout(undoTimerID); undoTimerID = null;
        if (isVsAI && currentPlayer === 2 && !isGameOver) {
            aiTimeoutID = setTimeout(makeAIMove, 800);
        }
    }
    if(e && e.target) { e.target.classList.remove('undoing-piece'); }
    document.querySelectorAll('.undoing-piece').forEach(p => p.classList.remove('undoing-piece'));
}

function renderBoard() {
    calculateForcedPieces(); 
    const boardElement = document.getElementById('board');
    if(!boardElement) return;
    boardElement.innerHTML = '';
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell'; cell.dataset.row = r; cell.dataset.col = c;
            
            if ((r === lastMoveData.startR && c === lastMoveData.startC) || (r === lastMoveData.endR && c === lastMoveData.endC)) {
                cell.classList.add('last-move');
            }
            
            if (validMoves.some(m => m.r === r && m.c === c)) {
                cell.classList.add('valid-move'); cell.onclick = () => onCellClick(r, c);
            } else { cell.onclick = () => onCellClick(r, c); }

            if (board[r][c] !== 0) {
                const piece = document.createElement('div');
                piece.className = `piece p${getOwner(board[r][c])}`; piece.id = `piece-${r}-${c}`;
                if (board[r][c] === 3 || board[r][c] === 4) piece.classList.add('king');
                if (selectedPiece && selectedPiece.r === r && selectedPiece.c === c) piece.classList.add('selected');
                
                let pieceOwner = getOwner(board[r][c]);
                if (forcedPieces.some(p => p.r === r && p.c === c) && (!isVsAI || currentPlayer === 1)) {
                    if (!isOnline || pieceOwner === myRole) piece.classList.add('forced-piece');
                }
                
                let isLastMovePiece = (r === lastMoveData.endR && c === lastMoveData.endC);
                let canOwnerUndo = false;
                
                if (pieceOwner === 1 && p1CanUndo) {
                    if (currentPlayer === 2 || multiJumpPiece) canOwnerUndo = true;
                } else if (pieceOwner === 2 && p2CanUndo && !isVsAI) {
                    if (currentPlayer === 1 || multiJumpPiece) canOwnerUndo = true;
                }
                
                if (isOnline && pieceOwner !== myRole) canOwnerUndo = false;

                if (isLastMovePiece && canOwnerUndo) {
                    piece.addEventListener('touchstart', startUndoTimer, {passive: false});
                    piece.addEventListener('mousedown', startUndoTimer);
                    piece.addEventListener('touchend', cancelUndoTimer);
                    piece.addEventListener('mouseup', cancelUndoTimer);
                    piece.addEventListener('mouseleave', cancelUndoTimer);
                    piece.addEventListener('touchcancel', cancelUndoTimer);
                }

                cell.appendChild(piece);
            }
            boardElement.appendChild(cell);
        }
    }
}

function getValidMoves(r, c, b) {
    let moves = [], pieceVal = b[r][c], owner = getOwner(pieceVal), isKing = (pieceVal === 3 || pieceVal === 4);
    let directions = isKing ? [{dr: 1, dc: 0}, {dr: -1, dc: 0}, {dr: 0, dc: 1}, {dr: 0, dc: -1}] : [{dr: owner === 1 ? -1 : 1, dc: 0}, {dr: 0, dc: -1}, {dr: 0, dc: 1}];

    directions.forEach(d => {
        let nr = r + d.dr, nc = c + d.dc, foundEnemy = false, enemyPos = null;
        while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            if (b[nr][nc] === 0) {
                if (!foundEnemy) moves.push({ r: nr, c: nc, jump: null });
                else moves.push({ r: nr, c: nc, jump: { r: enemyPos.r, c: enemyPos.c } });
            } else if (getOwner(b[nr][nc]) === owner) break; 
            else { if (!foundEnemy) { foundEnemy = true; enemyPos = { r: nr, c: nc }; } else break; }
            if (!isKing) break; 
            nr += d.dr; nc += d.dc;
        }
    });

    if (!isKing) {
        directions.forEach(d => {
            let nr = r + d.dr, nc = c + d.dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                if (getOwner(b[nr][nc]) !== owner && getOwner(b[nr][nc]) !== 0) {
                    let jumpR = nr + d.dr, jumpC = nc + d.dc;
                    if (jumpR >= 0 && jumpR < ROWS && jumpC >= 0 && jumpC < COLS && b[jumpR][jumpC] === 0) {
                        moves.push({ r: jumpR, c: jumpC, jump: { r: nr, c: nc } });
                    }
                }
            }
        });
    }
    return moves;
}

function getMaxCaptures(r, c, b) {
    let jumpMoves = getValidMoves(r, c, b).filter(m => m.jump !== null);
    if (jumpMoves.length === 0) return 0;
    let maxCount = 0, pieceVal = b[r][c];

    for (let move of jumpMoves) {
        let nextBoard = b.map(row => [...row]);
        nextBoard[move.r][move.c] = pieceVal; nextBoard[r][c] = 0; nextBoard[move.jump.r][move.jump.c] = 0; 
        let nextPieceVal = pieceVal, owner = getOwner(pieceVal);
        
        let crowned = false;
        if (owner === 1 && move.r === 0 && pieceVal === 1) { nextPieceVal = 3; crowned = true; }
        if (owner === 2 && move.r === ROWS - 1 && pieceVal === 2) { nextPieceVal = 4; crowned = true; }
        
        nextBoard[move.r][move.c] = nextPieceVal;
        
        let count = 1;
        if (!crowned) {
            count += getMaxCaptures(move.r, move.c, nextBoard);
        }
        
        if (count > maxCount) maxCount = count;
    }
    return maxCount;
}

function onCellClick(r, c) {
    if (!isGameStarted) {
        showWarning(translations[currentLang].warnStart);
        return;
    }

    if (isAnimating || isGameOver) return; 
    if (isVsAI && currentPlayer === 2) return; 
    
    if (isOnline) {
        if (currentPlayer !== myRole) { showWarning(translations[currentLang].notYourTurn); return; }
        if (!multiJumpPiece && getOwner(board[r][c]) !== myRole && getOwner(board[r][c]) !== 0) return;
    }

    if (multiJumpPiece) {
        if (r !== multiJumpPiece.r || c !== multiJumpPiece.c) {
            if (validMoves.some(m => m.r === r && m.c === c)) executeMove(r, c);
            return; 
        }
    }

    if (getOwner(board[r][c]) === currentPlayer) {
        if (forcedPieces.length > 0 && !forcedPieces.some(p => p.r === r && p.c === c)) {
            showWarning(translations[currentLang].warnForce); return;
        }

        let pieceMoves = getValidMoves(r, c, board);
        if (forcedPieces.length > 0) {
            let maxCaps = forcedPieces[0].maxCaps;
            validMoves = pieceMoves.filter(m => {
                if (m.jump === null) return false;
                let nextBoard = board.map(row => [...row]);
                
                let nextPieceVal = board[r][c];
                let owner = getOwner(nextPieceVal);
                let crowned = false;
                if (owner === 1 && m.r === 0 && nextPieceVal === 1) { nextPieceVal = 3; crowned = true; }
                if (owner === 2 && m.r === ROWS - 1 && nextPieceVal === 2) { nextPieceVal = 4; crowned = true; }

                nextBoard[m.r][m.c] = nextPieceVal;
                nextBoard[r][c] = 0; nextBoard[m.jump.r][m.jump.c] = 0;
                
                let caps = 1;
                if (!crowned) {
                    caps += getMaxCaptures(m.r, m.c, nextBoard);
                }
                return caps === maxCaps;
            });
        } else { validMoves = pieceMoves; }

        selectedPiece = { r, c }; renderBoard();
        if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    } else {
        if (!multiJumpPiece && validMoves.some(m => m.r === r && m.c === c)) { executeMove(r, c); } 
        else if (!multiJumpPiece) { selectedPiece = null; validMoves = []; renderBoard(); }
    }
}

function evaluateBoardForMove(chosen) {
    let tempBoard = board.map(row => [...row]);
    let pieceVal = tempBoard[chosen.startR][chosen.startC];
    let m = chosen.move;
    tempBoard[m.r][m.c] = pieceVal; tempBoard[chosen.startR][chosen.startC] = 0;
    if (m.jump) tempBoard[m.jump.r][m.jump.c] = 0;
    if (m.r === ROWS - 1 && pieceVal === 2) tempBoard[m.r][m.c] = 4;

    let score = 0, p1MaxCaps = 0;
    let p1Count = 0, p2Count = 0;
    let p1Pos = [], p2Pos = [];

    for (let ir = 0; ir < ROWS; ir++) {
        for (let ic = 0; ic < COLS; ic++) {
            let p = tempBoard[ir][ic];
            if (p === 2) { score += 10; if (ic === 0 || ic === COLS - 1) score += 2; if (ir === 0) score += 3; p2Count++; p2Pos.push({r:ir, c:ic}); }
            if (p === 4) { score += 25; p2Count++; p2Pos.push({r:ir, c:ic}); }
            if (p === 1) { score -= 10; p1Count++; p1Pos.push({r:ir, c:ic}); }
            if (p === 3) { score -= 25; p1Count++; p1Pos.push({r:ir, c:ic}); }
            if (getOwner(p) === 1) {
                let caps = getMaxCaptures(ir, ic, tempBoard);
                if (caps > p1MaxCaps) p1MaxCaps = caps;
            }
        }
    }
    score -= (p1MaxCaps * 20); 

    if (p2Count > p1Count && p1Count <= 3) {
        let distanceScore = 0;
        for (let aiPiece of p2Pos) {
            let minD = 100;
            for (let huPiece of p1Pos) {
                let d = Math.abs(aiPiece.r - huPiece.r) + Math.abs(aiPiece.c - huPiece.c);
                if (d < minD) minD = d;
            }
            distanceScore += minD;
        }
        score -= distanceScore * 1.5; 
    }

    return score;
}

function makeAIMove() {
    if (currentPlayer !== 2 || isGameOver) return;

    calculateForcedPieces(); 

    let possibleMoves = [];
    if (forcedPieces.length > 0) {
        let maxCaps = forcedPieces[0].maxCaps;
        forcedPieces.forEach(p => {
            let moves = getValidMoves(p.r, p.c, board).filter(m => m.jump !== null);
            moves.forEach(m => {
                let nextBoard = board.map(row => [...row]);
                
                let nextPieceVal = board[p.r][p.c];
                let owner = getOwner(nextPieceVal);
                let crowned = false;
                if (owner === 1 && m.r === 0 && nextPieceVal === 1) { nextPieceVal = 3; crowned = true; }
                if (owner === 2 && m.r === ROWS - 1 && nextPieceVal === 2) { nextPieceVal = 4; crowned = true; }

                nextBoard[m.r][m.c] = nextPieceVal;
                nextBoard[p.r][p.c] = 0; nextBoard[m.jump.r][m.jump.c] = 0;
                
                let caps = 1;
                if (!crowned) {
                    caps += getMaxCaptures(m.r, m.c, nextBoard);
                }
                
                if (caps === maxCaps) {
                    possibleMoves.push({ startR: p.r, startC: p.c, move: m });
                }
            });
        });
    } else {
        for(let ir = 0; ir < ROWS; ir++){
            for(let ic = 0; ic < COLS; ic++){
                if(getOwner(board[ir][ic]) === 2) {
                    getValidMoves(ir, ic, board).forEach(m => possibleMoves.push({ startR: ir, startC: ic, move: m }));
                }
            }
        }
    }

    if (possibleMoves.length > 0) {
        let chosen;
        let difficulty = document.getElementById('ai-difficulty').value;
        if (difficulty === 'normal') { chosen = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]; } 
        else {
            let scoredMoves = possibleMoves.map(m => { return { moveObj: m, score: evaluateBoardForMove(m) }; });
            if (difficulty === 'hard') scoredMoves.sort((a, b) => b.score - a.score); 
            else if (difficulty === 'easy') scoredMoves.sort((a, b) => a.score - b.score); 
            let bestScore = scoredMoves[0].score;
            let bestCandidates = scoredMoves.filter(m => m.score === bestScore);
            chosen = bestCandidates[Math.floor(Math.random() * bestCandidates.length)].moveObj;
        }

        selectedPiece = { r: chosen.startR, c: chosen.startC };
        validMoves = [chosen.move];
        renderBoard();
        setTimeout(() => { executeMove(chosen.move.r, chosen.move.c); }, 500);
    }
}

function animateMove(startR, startC, endR, endC, callback) {
    isAnimating = true;
    const pieceElement = document.getElementById(`piece-${startR}-${startC}`);
    const endCell = document.querySelector(`[data-row="${endR}"][data-col="${endC}"]`);
    
    if (pieceElement && endCell) {
        const startRect = pieceElement.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();
        pieceElement.style.transition = 'transform 0.3s ease-in-out';
        pieceElement.style.transform = `translate(${endRect.left - startRect.left + (endRect.width - startRect.width) / 2}px, ${endRect.top - startRect.top + (endRect.height - startRect.height) / 2}px) scale(1.1)`;
        pieceElement.style.zIndex = 50;
        setTimeout(() => { callback(); isAnimating = false; }, 300);
    } else { callback(); isAnimating = false; }
}

function executeMove(r, c) {
    if (undoTimerID) cancelUndoTimer(); 
    
    const move = validMoves.find(m => m.r === r && m.c === c);
    if (!move) return;

    if (!multiJumpPiece && (!isVsAI || currentPlayer === 1)) {
        saveUndoState();
    }

    lastMoveData = { startR: selectedPiece.r, startC: selectedPiece.c, endR: r, endC: c };

    animateMove(selectedPiece.r, selectedPiece.c, r, c, () => {
        let pieceVal = board[selectedPiece.r][selectedPiece.c];
        board[r][c] = pieceVal; board[selectedPiece.r][selectedPiece.c] = 0;
        let captured = false;

        if (move.jump) { 
            board[move.jump.r][move.jump.c] = 0; 
            captured = true; 
            if(typeof playSound === 'function') playSound('capture'); 
        } else { 
            if(typeof playSound === 'function') playSound('move'); 
        }

        let crownedThisTurn = false;
        if (currentPlayer === 1 && r === 0 && pieceVal === 1) { board[r][c] = 3; crownedThisTurn = true; } 
        else if (currentPlayer === 2 && r === ROWS - 1 && pieceVal === 2) { board[r][c] = 4; crownedThisTurn = true; }

        checkLastPieceKing(); updateScores();

        let p1CurrentCount = 0, p2CurrentCount = 0;
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                let owner = getOwner(board[i][j]);
                if (owner === 1) p1CurrentCount++;
                if (owner === 2) p2CurrentCount++;
            }
        }

        if (p1CurrentCount === 1 && p2CurrentCount === 1) {
            if (captured) movesWithoutCapture = 0;
            else movesWithoutCapture++;
        } else {
            movesWithoutCapture = 0; 
        }

        if (captured && !crownedThisTurn) {
            let maxCaps = getMaxCaptures(r, c, board);
            if (maxCaps > 0) {
                multiJumpPiece = { r, c }; selectedPiece = { r, c };
                validMoves = getValidMoves(r, c, board).filter(m => {
                    if (m.jump === null) return false;
                    let nextBoard = board.map(row => [...row]);
                    
                    let nextPieceVal = board[r][c];
                    let owner = getOwner(nextPieceVal);
                    let crowned = false;
                    if (owner === 1 && m.r === 0 && nextPieceVal === 1) { nextPieceVal = 3; crowned = true; }
                    if (owner === 2 && m.r === ROWS - 1 && nextPieceVal === 2) { nextPieceVal = 4; crowned = true; }

                    nextBoard[m.r][m.c] = nextPieceVal;
                    nextBoard[r][c] = 0; nextBoard[m.jump.r][m.jump.c] = 0;
                    
                    let caps = 1;
                    if (!crowned) {
                        caps += getMaxCaptures(m.r, m.c, nextBoard);
                    }
                    return caps === maxCaps;
                });
                renderBoard(); saveGameState(); syncGameState();
                if (isVsAI && currentPlayer === 2) aiTimeoutID = setTimeout(makeAIMove, 600); 
                return; 
            }
        }

        multiJumpPiece = null; currentPlayer = currentPlayer === 1 ? 2 : 1;
        selectedPiece = null; validMoves = [];
        
        renderBoard(); updateStatus(); saveGameState(); syncGameState();
        
        if (movesWithoutCapture >= 30) {
            gameOver(0); 
            syncGameState();
            return;
        }

        if(!checkWinCondition() && isVsAI && currentPlayer === 2) { 
            aiTimeoutID = setTimeout(makeAIMove, 800); 
        }
    });
}

function checkLastPieceKing() {
    let p1Count = 0, p2Count = 0, p1Pos = null, p2Pos = null;
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (board[i][j] === 1 || board[i][j] === 3) { p1Count++; p1Pos = { r: i, c: j }; } 
            else if (board[i][j] === 2 || board[i][j] === 4) { p2Count++; p2Pos = { r: i, c: j }; }
        }
    }
    let madeKing = false;
    if (p1Count === 1 && board[p1Pos.r][p1Pos.c] === 1) { board[p1Pos.r][p1Pos.c] = 3; madeKing = true; }
    if (p2Count === 1 && board[p2Pos.r][p2Pos.c] === 2) { board[p2Pos.r][p2Pos.c] = 4; madeKing = true; }
    if (madeKing && typeof playSound === 'function') playSound('king');
}

function showWarning(msg) {
    const statusEl = document.getElementById('status');
    if (!statusEl) return;
    statusEl.innerText = msg; statusEl.className = "status warning";
    setTimeout(() => { updateStatus(); }, 2500);
}

function updateStatus() {
    const statusEl = document.getElementById('status');
    if (!statusEl) return;
    const t = translations[currentLang];
    
    let drawText = movesWithoutCapture > 0 ? ` (${t.drawMoves}: ${Math.floor(movesWithoutCapture/2)}/15)` : "";

    if (currentPlayer === 1) {
        statusEl.innerText = `${t.statusTurn1}${drawText}`;
        statusEl.className = "status p1-turn";
    } else {
        statusEl.innerText = isVsAI ? `${t.statusAi}${drawText}` : `${t.statusTurn2}${drawText}`;
        statusEl.className = "status p2-turn";
    }
}

window.onload = () => {
    initBoard();
};
