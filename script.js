(() => {
    'use strict';

    const WIDTH = 960;
    const HEIGHT = 600;
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const elements = {
        score: document.getElementById('score'),
        best: document.getElementById('bestScore'),
        lives: document.getElementById('lives'),
        level: document.getElementById('level'),
        status: document.getElementById('statusMessage'),
        weatherBadge: document.getElementById('weatherBadge'),
        weatherIcon: document.getElementById('weatherIcon'),
        weatherName: document.getElementById('weatherName'),
        weatherEffect: document.getElementById('weatherEffect'),
        toast: document.getElementById('toast'),
        start: document.getElementById('startScreen'),
        pause: document.getElementById('pauseScreen'),
        over: document.getElementById('gameOverScreen'),
        finalScore: document.getElementById('finalScore'),
        stars: document.getElementById('starsCollected'),
        streak: document.getElementById('maxStreak'),
        startButton: document.getElementById('startButton'),
        restartButton: document.getElementById('restartButton'),
        pauseButton: document.getElementById('pauseButton'),
        pauseIcon: document.getElementById('pauseIcon'),
        resumeButton: document.getElementById('resumeButton'),
        soundButton: document.getElementById('soundButton'),
        soundIcon: document.getElementById('soundIcon'),
        themeButton: document.getElementById('themeButton'),
        themeButtonLabel: document.getElementById('themeButtonLabel'),
        themeIcon: document.getElementById('themeIcon'),
        themeName: document.getElementById('selectedThemeName'),
        themeDescription: document.getElementById('selectedThemeDescription'),
        themeScreen: document.getElementById('themeScreen'),
        closeThemeButton: document.getElementById('closeThemeButton'),
        chooseThemeButton: document.getElementById('chooseThemeButton')
    };

    const themes = {
        meadow: {
            name: 'Sunny Meadow', shortName: 'Meadow', icon: '🌿', description: 'Wildflowers, rolling hills, and fresh green tracks.',
            sky: ['#bce7ed', '#d9eee1', '#b6e4dc'], ground: '#77c2a4', farHill: '#4b9a81', nearHill: '#6aae8a',
            bed: '#b9a88b', sleeper: '#86745d', rail: '#685d50', railLight: '#ddd0b1',
            trees: ['#408d70', '#367f68'], trunk: '#916e4d', flowers: ['#fff1b7', '#e2ffcb'],
            sun: '#fff3c5', skyGlow: 'rgba(255,248,207,.82)', edgeShade: 'rgba(30,87,69,.13)',
            train: ['#d6534c', '#f27661', '#b84143', '#233e50', '#bfe9e7', '#ffd982', '#f4c965', '#3e4850', '#222f39'],
            rock: ['#727f83', '#59696d', 'rgba(237,244,225,.38)'], star: '#ffd15e', starLight: '#fff0ae', shield: '#9af3d1'
        },
        winter: {
            name: 'Frosty Peaks', shortName: 'Frosty Peaks', icon: '❄️', description: 'Snow-capped pines and crisp, icy-blue rails.',
            sky: ['#77a9d1', '#c6e2f1', '#e7f1f5'], ground: '#dcebf1', farHill: '#789eb8', nearHill: '#a6c7d5',
            bed: '#a7bac4', sleeper: '#728996', rail: '#536e81', railLight: '#e9f8ff',
            trees: ['#397b83', '#51969a'], trunk: '#78695f', flowers: ['#ffffff', '#d8f3ff'],
            sun: '#f2fbff', skyGlow: 'rgba(235,249,255,.78)', edgeShade: 'rgba(60,112,147,.13)',
            train: ['#2871a3', '#4e9dcc', '#20567f', '#1b3b55', '#c8f0ff', '#fff2c9', '#e9f5ff', '#405766', '#283d4a'],
            rock: ['#8299a6', '#5a7382', 'rgba(243,251,255,.78)'], star: '#9ceaff', starLight: '#effcff', shield: '#a9e8ff'
        },
        sunset: {
            name: 'Golden Sunset', shortName: 'Sunset', icon: '🌅', description: 'Warm desert skies, copper cliffs, and golden rails.',
            sky: ['#e88769', '#f5bc83', '#f9d9a2'], ground: '#cc9366', farHill: '#a85f55', nearHill: '#bc7959',
            bed: '#9b735d', sleeper: '#684d43', rail: '#57443f', railLight: '#f0c58c',
            trees: ['#54765a', '#72915f'], trunk: '#75503d', flowers: ['#ffe49b', '#ffc88e'],
            sun: '#fff0ad', skyGlow: 'rgba(255,221,157,.8)', edgeShade: 'rgba(107,62,54,.16)',
            train: ['#c25a3e', '#ef8858', '#994435', '#563e3d', '#ffe0b1', '#fff0bd', '#ffd077', '#594740', '#3e3634'],
            rock: ['#9c6854', '#70483f', 'rgba(255,225,180,.45)'], star: '#fff0a0', starLight: '#fffbe1', shield: '#ffd09a'
        },
        neon: {
            name: 'Neon Night', shortName: 'Neon Night', icon: '🌙', description: 'A starlit night ride with electric violet and aqua.',
            sky: ['#151c46', '#282b5d', '#54447a'], ground: '#443864', farHill: '#302959', nearHill: '#554178',
            bed: '#39334e', sleeper: '#25263d', rail: '#252c4e', railLight: '#74eaf5',
            trees: ['#443b78', '#584389'], trunk: '#34314c', flowers: ['#ff8edb', '#8cf9ff'],
            sun: '#f3a8e8', skyGlow: 'rgba(245,167,239,.66)', edgeShade: 'rgba(14,17,55,.3)',
            train: ['#15aebd', '#45e3db', '#16758c', '#182942', '#a8fff4', '#ffe6ff', '#ff88db', '#30304a', '#191e35'],
            rock: ['#66628a', '#454164', 'rgba(210,190,255,.62)'], star: '#ff88db', starLight: '#fff0ff', shield: '#8cf9ff'
        }
    };

    const weatherTypes = {
        clear: { name: 'Clear skies', icon: '☀', effect: 'Clear skies: the rails are dry and easy to handle.' },
        rain: { name: 'Rain', icon: '🌧', effect: 'Rain: slick rails soften steering and lengthen braking.' },
        snow: { name: 'Snow', icon: '❄', effect: 'Snow: low grip slows steering and makes braking take longer.' },
        fog: { name: 'Fog', icon: '🌫', effect: 'Fog: poor visibility makes distant hazards harder to spot.' },
        storm: { name: 'Thunderstorm', icon: '⛈', effect: 'Storm: gusts push the train; wet rails make braking slower.' }
    };

    const game = {
        running: false,
        paused: false,
        score: 0,
        lives: 3,
        stars: 0,
        streak: 0,
        bestStreak: 0,
        best: readNumber('little-locomotive-best'),
        theme: readTheme(),
        weather: 'clear',
        weatherClock: 8,
        weatherDuration: 8,
        lightningTimer: 3,
        lightningFlash: 0,
        lightningX: WIDTH / 2,
        elapsed: 0,
        spawnClock: 0,
        spawnEvery: 1.05,
        shield: 0,
        invulnerable: 0,
        trackScroll: 0,
        shake: 0,
        soundOn: readSetting('little-locomotive-sound', true),
        audio: null,
        lastFrame: 0,
        toastTimer: 0
    };

    const train = { x: 443, y: 480, width: 74, height: 76, speed: 335, vx: 0, vy: 0 };
    const obstacles = [];
    const particles = [];
    const scenery = Array.from({ length: 18 }, (_, i) => ({
        x: i % 2 ? 65 + Math.random() * 125 : 770 + Math.random() * 125,
        y: Math.random() * HEIGHT,
        size: 14 + Math.random() * 16,
        shade: Math.random()
    }));
    const clouds = Array.from({ length: 6 }, (_, i) => ({
        x: 90 + i * 170,
        y: 35 + Math.random() * 135,
        size: 20 + Math.random() * 16
    }));
    const weatherParticles = Array.from({ length: 180 }, () => ({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
        speed: 260 + Math.random() * 360,
        length: 9 + Math.random() * 16,
        drift: -25 + Math.random() * 50,
        size: 1 + Math.random() * 2
    }));
    const keys = new Set();
    const touchKeys = new Set();
    let soundUnlocked = false;
    function readTheme() {
        try {
            const saved = localStorage.getItem('little-locomotive-theme');
            return saved && Object.hasOwn(themes, saved) ? saved : 'meadow';
        } catch {
            return 'meadow';
        }
    }

    function activeTheme() {
        return themes[game.theme];
    }

    function applyTheme(themeId) {
        if (!Object.hasOwn(themes, themeId)) return;
        game.theme = themeId;
        const theme = activeTheme();
        document.documentElement.dataset.theme = themeId;
        elements.themeIcon.textContent = theme.icon;
        elements.themeButtonLabel.textContent = theme.shortName;
        elements.themeName.textContent = theme.name;
        elements.themeDescription.textContent = theme.description;
        document.querySelectorAll('[data-theme-choice]').forEach((button) => {
            button.setAttribute('aria-pressed', String(button.dataset.themeChoice === themeId));
        });
        store('little-locomotive-theme', themeId);
        render(performance.now() / 1000);
    }

    function openThemePicker() {
        if (game.running && !game.paused) togglePause(true);
        elements.themeScreen.classList.remove('is-hidden');
        const selected = elements.themeScreen.querySelector('[aria-pressed="true"]');
        if (selected) selected.focus();
    }

    function closeThemePicker() {
        elements.themeScreen.classList.add('is-hidden');
        elements.themeButton.focus();
    }

    function readNumber(key) {
        try {
            const value = Number(localStorage.getItem(key));
            return Number.isFinite(value) && value > 0 ? value : 0;
        } catch {
            return 0;
        }
    }

    function readSetting(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : value === 'true';
        } catch {
            return fallback;
        }
    }

    function store(key, value) {
        try {
            localStorage.setItem(key, String(value));
        } catch {
            // The game still works when browser storage is unavailable.
        }
    }

    function formatScore(value) {
        return String(Math.max(0, Math.floor(value))).padStart(5, '0');
    }

    function updateHud() {
        elements.score.textContent = formatScore(game.score);
        elements.best.textContent = formatScore(game.best);
        elements.lives.innerHTML = Array.from({ length: 3 }, (_, index) =>
            `<span class="${index >= game.lives ? 'heart-lost' : ''}" aria-hidden="true">♥</span>`
        ).join(' ');
        elements.lives.setAttribute('aria-label', `${game.lives} ${game.lives === 1 ? 'life' : 'lives'} remaining`);
        elements.level.textContent = `ROUTE ${String(Math.floor(game.score / 500) + 1).padStart(2, '0')}`;
        const weather = weatherTypes[game.weather];
        elements.weatherBadge.dataset.weather = game.weather;
        if (elements.weatherName.textContent !== weather.name) {
            elements.weatherIcon.textContent = weather.icon;
            elements.weatherName.textContent = weather.name;
            elements.weatherEffect.textContent = weather.effect;
        }
    }

    function setStatus(message) {
        elements.status.textContent = message;
    }

    function showToast(message, color = '#fff0a8') {
        elements.toast.textContent = message;
        elements.toast.style.color = color;
        elements.toast.classList.add('show');
        clearTimeout(game.toastTimer);
        game.toastTimer = setTimeout(() => elements.toast.classList.remove('show'), 1000);
    }

    function unlockAudio() {
        if (!game.soundOn) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!game.audio) game.audio = new AudioContext();
        if (game.audio.state === 'suspended') game.audio.resume();
        soundUnlocked = true;
    }

    function tone(frequency, duration = .12, wave = 'sine', volume = .035) {
        if (!game.soundOn || !soundUnlocked || !game.audio) return;
        const oscillator = game.audio.createOscillator();
        const gain = game.audio.createGain();
        oscillator.type = wave;
        oscillator.frequency.setValueAtTime(frequency, game.audio.currentTime);
        gain.gain.setValueAtTime(volume, game.audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(.001, game.audio.currentTime + duration);
        oscillator.connect(gain);
        gain.connect(game.audio.destination);
        oscillator.start();
        oscillator.stop(game.audio.currentTime + duration);
    }

    function setSound(on) {
        game.soundOn = on;
        store('little-locomotive-sound', on);
        elements.soundIcon.textContent = on ? '♫' : '♪';
        elements.soundButton.querySelector('.button-label').textContent = on ? 'Sound on' : 'Sound off';
        elements.soundButton.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
        if (on) unlockAudio();
    }

    function startGame() {
        unlockAudio();
        game.running = true;
        game.paused = false;
        game.score = 0;
        game.lives = 3;
        game.stars = 0;
        game.streak = 0;
        game.bestStreak = 0;
        game.elapsed = 0;
        game.spawnClock = 0;
        game.spawnEvery = 1.05;
        game.shield = 0;
        game.invulnerable = 0;
        game.trackScroll = 0;
        game.shake = 0;
        game.weather = 'clear';
        game.weatherClock = 0;
        game.weatherDuration = 7;
        game.lightningTimer = 4;
        game.lightningFlash = 0;
        train.x = (WIDTH - train.width) / 2;
        train.y = HEIGHT - 132;
        train.vx = 0;
        train.vy = 0;
        obstacles.length = 0;
        particles.length = 0;
        keys.clear();
        touchKeys.clear();
        elements.start.classList.add('is-hidden');
        elements.pause.classList.add('is-hidden');
        elements.over.classList.add('is-hidden');
        elements.pauseButton.disabled = false;
        elements.pauseIcon.textContent = 'Ⅱ';
        elements.pauseButton.setAttribute('aria-label', 'Pause game');
        setStatus('Find your rhythm!');
        updateHud();
        tone(523, .12);
        setTimeout(() => tone(659, .16), 100);
    }

    function changeWeather() {
        if (game.weather === 'clear') {
            const choices = ['rain', 'snow', 'fog', 'storm'];
            game.weather = choices[Math.floor(Math.random() * choices.length)];
            game.weatherDuration = 13 + Math.random() * 8;
            setStatus(`${weatherTypes[game.weather].name} rolling in!`);
            showToast(`${weatherTypes[game.weather].icon} ${weatherTypes[game.weather].name.toUpperCase()} AHEAD`);
            if (game.weather === 'storm') game.lightningTimer = 2 + Math.random() * 3;
        } else {
            game.weather = 'clear';
            game.weatherDuration = 6 + Math.random() * 4;
            setStatus('The weather is clearing.');
            showToast('☀ THE SKY IS CLEARING');
        }
        updateHud();
    }

    function updateWeather(delta) {
        game.weatherClock += delta;
        if (game.weatherClock >= game.weatherDuration) {
            game.weatherClock = 0;
            changeWeather();
        }
        game.lightningFlash = Math.max(0, game.lightningFlash - delta);

        if (game.weather === 'storm') {
            game.lightningTimer -= delta;
            if (game.lightningTimer <= 0) {
                game.lightningTimer = 4 + Math.random() * 6;
                game.lightningFlash = .18 + Math.random() * .1;
                game.lightningX = 100 + Math.random() * (WIDTH - 200);
                tone(65, .28, 'triangle', .06);
            }
        }

        if (game.weather === 'rain' || game.weather === 'storm') {
            const wind = game.weather === 'storm' ? -100 : -27;
            for (const drop of weatherParticles) {
                drop.x += (drop.drift + wind) * delta;
                drop.y += drop.speed * delta * (game.weather === 'storm' ? 1.25 : 1);
                if (drop.y > HEIGHT + 22) {
                    drop.y = -drop.length;
                    drop.x = Math.random() * WIDTH;
                }
                if (drop.x < -15) drop.x = WIDTH + 8;
            }
        } else if (game.weather === 'snow') {
            for (const flake of weatherParticles) {
                flake.x += Math.sin(game.elapsed * .8 + flake.y * .02) * 22 * delta;
                flake.y += flake.speed * delta * .3;
                if (flake.y > HEIGHT + 5) {
                    flake.y = -5;
                    flake.x = Math.random() * WIDTH;
                }
            }
        }
    }

    function endGame() {
        game.running = false;
        game.paused = false;
        keys.clear();
        touchKeys.clear();
        if (game.score > game.best) {
            game.best = Math.floor(game.score);
            store('little-locomotive-best', game.best);
            showToast('NEW PERSONAL BEST!', '#ffe08a');
        }
        elements.finalScore.textContent = Math.floor(game.score).toLocaleString();
        elements.stars.textContent = game.stars;
        elements.streak.textContent = game.bestStreak;
        elements.over.classList.remove('is-hidden');
        elements.pauseButton.disabled = true;
        setStatus('What a lovely ride.');
        updateHud();
        tone(220, .28, 'triangle');
    }

    function togglePause(forcePause = null) {
        if (!game.running) return;
        game.paused = forcePause === null ? !game.paused : forcePause;
        elements.pause.classList.toggle('is-hidden', !game.paused);
        elements.pauseIcon.textContent = game.paused ? '▶' : 'Ⅱ';
        elements.pauseButton.setAttribute('aria-label', game.paused ? 'Resume game' : 'Pause game');
        setStatus(game.paused ? 'Taking a little breather.' : 'Back on track!');
        keys.clear();
        touchKeys.clear();
        game.lastFrame = performance.now();
    }

    function spawnThing() {
        const chance = Math.random();
        if (chance < .18) {
            obstacles.push({
                type: 'star',
                x: 278 + Math.random() * 404,
                y: -50,
                size: 27,
                speed: 205 + Math.min(game.score * .06, 100)
            });
            return;
        }
        const tree = chance > .82;
        obstacles.push({
            type: tree ? 'tree' : 'rock',
            x: 266 + Math.random() * 420,
            y: -50,
            size: tree ? 42 : 38,
            speed: 205 + Math.min(game.score * .06, 125) + Math.random() * 45
        });
    }

    function overlaps(item) {
        const margin = item.type === 'star' ? 2 : 6;
        return train.x + 13 < item.x + item.size - margin
            && train.x + train.width - 13 > item.x + margin
            && train.y + 12 < item.y + item.size - margin
            && train.y + train.height - 8 > item.y + margin;
    }

    function burst(x, y, color, count = 14) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 35 + Math.random() * 150;
            particles.push({
                x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                life: .45 + Math.random() * .55, maxLife: .9, size: 2 + Math.random() * 4, color
            });
        }
    }

    function collectStar(item) {
        game.stars++;
        game.streak++;
        game.bestStreak = Math.max(game.bestStreak, game.streak);
        game.score += 100;
        game.shield = 5;
        burst(item.x + item.size / 2, item.y + item.size / 2, '#ffe18a', 22);
        showToast('STAR +100  ·  SHIELD UP!', '#ffe18a');
        setStatus('Shiny! You have a shield.');
        tone(740, .1);
        setTimeout(() => tone(988, .16), 80);
        updateHud();
    }

    function collideWithHazard(item) {
        if (game.invulnerable > 0) return;
        burst(train.x + train.width / 2, train.y + train.height / 2, game.shield > 0 ? '#9af3d1' : '#ffd27b', 17);
        if (game.shield > 0) {
            game.shield = 0;
            game.invulnerable = .75;
            showToast('SHIELD SAVED YOU!', '#9af3d1');
            setStatus('Close call! Keep rolling.');
            tone(390, .16, 'triangle');
        } else {
            game.lives--;
            game.streak = 0;
            game.invulnerable = 1.25;
            game.shake = .24;
            showToast('BONK! Watch the track!', '#ffd27b');
            setStatus('Careful, conductor!');
            tone(175, .2, 'square', .025);
            updateHud();
            if (game.lives <= 0) endGame();
        }
    }

    function getDrivingConditions() {
        switch (game.weather) {
            case 'rain':
                return { acceleration: 770, braking: 485, coast: 170, speed: .94, wind: 0 };
            case 'snow':
                return { acceleration: 590, braking: 340, coast: 95, speed: .78, wind: 0 };
            case 'storm':
                return { acceleration: 670, braking: 385, coast: 115, speed: .86, wind: -1 };
            default:
                return { acceleration: 1500, braking: 1280, coast: 510, speed: 1, wind: 0 };
        }
    }

    function approachVelocity(current, target, delta, conditions) {
        if (target === 0) {
            const amount = conditions.coast * delta;
            return Math.abs(current) <= amount ? 0 : current - Math.sign(current) * amount;
        }
        const reversingOrSlowing = current !== 0 && (Math.sign(current) !== Math.sign(target) || Math.abs(target) < Math.abs(current));
        const amount = (reversingOrSlowing ? conditions.braking : conditions.acceleration) * delta;
        if (Math.abs(target - current) <= amount) return target;
        return current + Math.sign(target - current) * amount;
    }

    function update(delta) {
        game.elapsed += delta;
        updateWeather(delta);
        game.score += delta * 7;
        game.trackScroll = (game.trackScroll + delta * (125 + Math.min(game.score * .6, 180))) % 64;
        game.invulnerable = Math.max(0, game.invulnerable - delta);
        game.shield = Math.max(0, game.shield - delta);
        game.shake = Math.max(0, game.shake - delta);
        game.spawnEvery = Math.max(.53, 1.05 - game.score / 6500);
        game.spawnClock += delta;
        if (game.spawnClock >= game.spawnEvery) {
            game.spawnClock -= game.spawnEvery;
            spawnThing();
        }

        const directions = new Set([...keys, ...touchKeys]);
        let dx = Number(directions.has('right')) - Number(directions.has('left'));
        let dy = Number(directions.has('down')) - Number(directions.has('up'));
        if (dx && dy) {
            dx *= Math.SQRT1_2;
            dy *= Math.SQRT1_2;
        }
        const conditions = getDrivingConditions();
        train.vx = approachVelocity(train.vx, dx * train.speed * conditions.speed, delta, conditions);
        train.vy = approachVelocity(train.vy, dy * train.speed * conditions.speed, delta, conditions);
        if (game.weather === 'storm') {
            train.vx += Math.sin(game.elapsed * 2.1) * 105 * delta;
        }
        train.x += train.vx * delta;
        train.y += train.vy * delta;
        if (train.x < 230 || train.x > 656) {
            train.x = Math.max(230, Math.min(656, train.x));
            train.vx = 0;
        }
        if (train.y < 52 || train.y > HEIGHT - train.height - 12) {
            train.y = Math.max(52, Math.min(HEIGHT - train.height - 12, train.y));
            train.vy = 0;
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            const item = obstacles[i];
            item.y += item.speed * delta;
            if (overlaps(item)) {
                obstacles.splice(i, 1);
                if (item.type === 'star') collectStar(item);
                else collideWithHazard(item);
                if (!game.running) return;
            } else if (item.y > HEIGHT + 30) {
                obstacles.splice(i, 1);
                if (item.type !== 'star') {
                    game.score += 15;
                    game.streak++;
                    game.bestStreak = Math.max(game.bestStreak, game.streak);
                    setStatus(game.streak >= 5 ? `${game.streak} in a row! Lovely driving.` : 'Clear track. Nice work!');
                }
            }
        }
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.life -= delta;
            particle.x += particle.vx * delta;
            particle.y += particle.vy * delta;
            particle.vx *= Math.max(0, 1 - delta * 2);
            particle.vy *= Math.max(0, 1 - delta * 2);
            if (particle.life <= 0) particles.splice(i, 1);
        }
        updateHud();
    }

    function roundedRect(x, y, width, height, radius) {
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, radius);
    }

    function drawBackground(time) {
        const theme = activeTheme();
        const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        sky.addColorStop(0, theme.sky[0]);
        sky.addColorStop(.42, theme.sky[1]);
        sky.addColorStop(1, theme.sky[2]);
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = theme.skyGlow;
        ctx.beginPath();
        ctx.arc(804, 88, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.52)';
        if (game.theme !== 'neon') {
            for (const cloud of clouds) {
                const x = (cloud.x - time * 4 + WIDTH + 120) % (WIDTH + 120) - 60;
                drawCloud(x, cloud.y, cloud.size);
            }
        }
        ctx.fillStyle = theme.ground;
        ctx.fillRect(0, 205, WIDTH, HEIGHT - 205);
        ctx.fillStyle = theme.farHill;
        ctx.beginPath();
        ctx.moveTo(0, 220);
        for (let x = 0; x <= WIDTH; x += 40) {
            ctx.lineTo(x, 186 + Math.sin(x * .012) * 29 + Math.sin(x * .029) * 10);
        }
        ctx.lineTo(WIDTH, HEIGHT);
        ctx.lineTo(0, HEIGHT);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = theme.nearHill;
        ctx.globalAlpha = .72;
        ctx.beginPath();
        ctx.moveTo(0, 310);
        for (let x = 0; x <= WIDTH; x += 45) ctx.lineTo(x, 264 + Math.sin(x * .009 + 2) * 31);
        ctx.lineTo(WIDTH, HEIGHT);
        ctx.lineTo(0, HEIGHT);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        drawLandmarks(time);

        if (game.theme === 'meadow' || game.theme === 'sunset') {
            for (let x = 18; x < WIDTH; x += 37) {
                const y = 330 + ((x * 7 + game.trackScroll * 2) % 255);
                drawFlower(x, y, theme.flowers[x % 2]);
            }
        } else if (game.theme === 'winter') {
            ctx.fillStyle = 'rgba(255,255,255,.68)';
            for (let x = 16; x < WIDTH; x += 49) {
                const y = (x * 11 + game.trackScroll * 1.2) % HEIGHT;
                ctx.beginPath();
                ctx.arc(x, y, 1.5 + (x % 3), 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            ctx.fillStyle = 'rgba(140,249,255,.7)';
            for (let x = 18; x < WIDTH; x += 51) {
                const y = (x * 9 + game.trackScroll * 1.4) % HEIGHT;
                ctx.fillRect(x, y, 2, 2);
            }
        }

        // The gravel bed and wooden sleepers make the route feel like a real railway.
        ctx.fillStyle = theme.bed;
        ctx.fillRect(280, 0, 400, HEIGHT);
        ctx.fillStyle = game.theme === 'winter' ? 'rgba(245,252,255,.19)' : 'rgba(30,32,41,.16)';
        for (let y = -64 + game.trackScroll; y < HEIGHT; y += 64) {
            ctx.fillRect(286, y, 388, 8);
        }
        ctx.fillStyle = theme.rail;
        ctx.fillRect(327, 0, 15, HEIGHT);
        ctx.fillRect(618, 0, 15, HEIGHT);
        ctx.fillStyle = theme.railLight;
        ctx.fillRect(330, 0, 5, HEIGHT);
        ctx.fillRect(621, 0, 5, HEIGHT);
        ctx.fillStyle = 'rgba(255,255,255,.16)';
        ctx.fillRect(342, 0, 3, HEIGHT);
        ctx.fillRect(630, 0, 3, HEIGHT);

        // Scenery scrolls more slowly than the track for a gentle parallax effect.
        for (const tree of scenery) {
            const y = (tree.y + game.trackScroll * .55) % (HEIGHT + 50) - 25;
            if (game.theme === 'sunset') drawCactus(tree.x, y, tree.size);
            else drawPine(tree.x, y, tree.size, tree.shade);
        }
        const shade = ctx.createLinearGradient(0, 0, WIDTH, 0);
        shade.addColorStop(0, theme.edgeShade);
        shade.addColorStop(.25, 'transparent');
        shade.addColorStop(.75, 'transparent');
        shade.addColorStop(1, theme.edgeShade);
        ctx.fillStyle = shade;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    function drawLandmarks(time) {
        if (game.theme === 'winter') {
            // Layered snowy peaks sit behind the lower foothills.
            const peaks = [
                { x: -35, y: 228, w: 230, h: 187 },
                { x: 92, y: 250, w: 250, h: 142 },
                { x: 205, y: 220, w: 250, h: 190 },
                { x: 405, y: 254, w: 230, h: 142 },
                { x: 585, y: 224, w: 260, h: 190 },
                { x: 790, y: 250, w: 230, h: 155 }
            ];
            peaks.forEach((peak, index) => {
                ctx.fillStyle = index % 2 ? '#91b4ca' : '#7fabc5';
                ctx.beginPath();
                ctx.moveTo(peak.x, peak.y);
                ctx.lineTo(peak.x + peak.w * .5, peak.y - peak.h);
                ctx.lineTo(peak.x + peak.w, peak.y);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#f5fbff';
                ctx.beginPath();
                ctx.moveTo(peak.x + peak.w * .34, peak.y - peak.h * .33);
                ctx.lineTo(peak.x + peak.w * .5, peak.y - peak.h);
                ctx.lineTo(peak.x + peak.w * .68, peak.y - peak.h * .35);
                ctx.lineTo(peak.x + peak.w * .55, peak.y - peak.h * .43);
                ctx.lineTo(peak.x + peak.w * .48, peak.y - peak.h * .32);
                ctx.lineTo(peak.x + peak.w * .42, peak.y - peak.h * .43);
                ctx.closePath();
                ctx.fill();
            });
        } else if (game.theme === 'sunset') {
            // Flat-topped mesas frame the desert route.
            const mesas = [
                { x: -25, y: 233, w: 190, h: 73 },
                { x: 90, y: 216, w: 235, h: 96 },
                { x: 652, y: 226, w: 190, h: 77 },
                { x: 788, y: 208, w: 222, h: 103 }
            ];
            mesas.forEach((mesa, index) => {
                ctx.fillStyle = index % 2 ? '#a95f50' : '#c07857';
                ctx.beginPath();
                ctx.moveTo(mesa.x, mesa.y);
                ctx.lineTo(mesa.x + 18, mesa.y);
                ctx.lineTo(mesa.x + 31, mesa.y - mesa.h * .66);
                ctx.lineTo(mesa.x + 48, mesa.y - mesa.h);
                ctx.lineTo(mesa.x + mesa.w * .69, mesa.y - mesa.h);
                ctx.lineTo(mesa.x + mesa.w * .77, mesa.y - mesa.h * .7);
                ctx.lineTo(mesa.x + mesa.w - 7, mesa.y - mesa.h * .68);
                ctx.lineTo(mesa.x + mesa.w, mesa.y);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,218,155,.42)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(mesa.x + 50, mesa.y - mesa.h + 5);
                ctx.lineTo(mesa.x + mesa.w * .68, mesa.y - mesa.h + 5);
                ctx.stroke();
            });
        } else if (game.theme === 'neon') {
            // A layered city silhouette with glowing windows makes this a night ride.
            const buildings = [
                [12, 78, 116], [79, 115, 152], [174, 74, 102], [226, 104, 137],
                [704, 82, 110], [764, 122, 159], [855, 75, 105], [906, 99, 132]
            ];
            ctx.fillStyle = '#28264e';
            buildings.forEach(([x, width, height], index) => {
                ctx.fillRect(x, 294 - height, width, height);
                ctx.fillStyle = index % 2 ? '#514071' : '#39335f';
                ctx.fillRect(x + width * .28, 294 - height - 13, width * .42, 13);
                ctx.fillStyle = '#28264e';
                for (let wy = 310 - height; wy < 285; wy += 22) {
                    for (let wx = x + 12; wx < x + width - 7; wx += 22) {
                        ctx.fillStyle = (wx + wy) % 3 ? 'rgba(140,249,255,.72)' : 'rgba(255,136,219,.8)';
                        ctx.fillRect(wx, wy, 6, 9);
                    }
                }
                ctx.fillStyle = '#28264e';
            });
            ctx.strokeStyle = 'rgba(140,249,255,.45)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 295);
            ctx.lineTo(WIDTH, 295);
            ctx.stroke();
            ctx.fillStyle = '#fff0a9';
            for (let i = 0; i < 34; i++) {
                const x = (i * 173 + 41) % WIDTH;
                const y = 18 + ((i * 79) % 143);
                const pulse = .45 + (Math.sin(time * 2 + i) + 1) * .25;
                ctx.globalAlpha = pulse;
                ctx.fillRect(x, y, i % 4 === 0 ? 3 : 2, i % 4 === 0 ? 3 : 2);
            }
            ctx.globalAlpha = 1;
        } else {
            // A tiny windmill and a winding stream make the meadow its own destination.
            ctx.fillStyle = 'rgba(71,137,160,.46)';
            ctx.beginPath();
            ctx.moveTo(0, 324);
            ctx.bezierCurveTo(115, 286, 174, 354, 282, 318);
            ctx.lineTo(282, 342);
            ctx.bezierCurveTo(174, 378, 115, 310, 0, 348);
            ctx.closePath();
            ctx.fill();
            drawWindmill(130, 206, time);
        }
    }

    function drawWindmill(x, y, time) {
        ctx.fillStyle = '#f3edda';
        ctx.beginPath();
        ctx.moveTo(x - 13, y + 61);
        ctx.lineTo(x - 8, y + 8);
        ctx.lineTo(x + 8, y + 8);
        ctx.lineTo(x + 13, y + 61);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#a67c56';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.save();
        ctx.translate(x, y + 8);
        ctx.rotate(time * .22);
        ctx.strokeStyle = '#f8f3df';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        for (let blade = 0; blade < 4; blade++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(0, -2);
            ctx.lineTo(0, -34);
            ctx.stroke();
        }
        ctx.restore();
        ctx.fillStyle = '#c7955f';
        ctx.beginPath();
        ctx.arc(x, y + 8, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawCloud(x, y, size) {
        ctx.fillStyle = 'rgba(255,255,255,.46)';
        ctx.beginPath();
        ctx.arc(x, y, size * .5, Math.PI, 0);
        ctx.arc(x + size * .45, y - size * .18, size * .58, Math.PI, 0);
        ctx.arc(x + size, y, size * .43, Math.PI, 0);
        ctx.lineTo(x + size * 1.43, y + size * .34);
        ctx.lineTo(x, y + size * .34);
        ctx.closePath();
        ctx.fill();
    }

    function drawFlower(x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 2.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = activeTheme().trunk;
        ctx.fillRect(x - .5, y + 2, 1, 5);
    }

    function drawPine(x, y, size, shade) {
        const theme = activeTheme();
        ctx.fillStyle = 'rgba(35,52,66,.16)';
        ctx.beginPath();
        ctx.ellipse(x + 3, y + size * .77, size * .5, size * .13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = shade > .5 ? theme.trees[0] : theme.trees[1];
        ctx.beginPath();
        ctx.moveTo(x, y - size * .5);
        ctx.lineTo(x - size * .42, y + size * .12);
        ctx.lineTo(x - size * .19, y + size * .1);
        ctx.lineTo(x - size * .52, y + size * .48);
        ctx.lineTo(x + size * .52, y + size * .48);
        ctx.lineTo(x + size * .19, y + size * .1);
        ctx.lineTo(x + size * .42, y + size * .12);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = theme.trunk;
        ctx.fillRect(x - size * .055, y + size * .4, size * .11, size * .22);
        if (game.theme === 'winter') {
            ctx.fillStyle = 'rgba(247,253,255,.88)';
            ctx.beginPath();
            ctx.moveTo(x, y - size * .5);
            ctx.lineTo(x - size * .2, y - size * .08);
            ctx.lineTo(x + size * .02, y - size * .02);
            ctx.closePath();
            ctx.fill();
        }
    }

    function drawCactus(x, y, size) {
        const theme = activeTheme();
        ctx.fillStyle = 'rgba(70,42,45,.16)';
        ctx.beginPath();
        ctx.ellipse(x + 3, y + size * .75, size * .36, size * .1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = theme.trees[0];
        ctx.lineWidth = Math.max(4, size * .17);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y + size * .52);
        ctx.lineTo(x, y - size * .35);
        ctx.moveTo(x, y + size * .05);
        ctx.lineTo(x - size * .3, y + size * .05);
        ctx.lineTo(x - size * .3, y - size * .18);
        ctx.moveTo(x, y + size * .23);
        ctx.lineTo(x + size * .28, y + size * .23);
        ctx.lineTo(x + size * .28, y - size * .02);
        ctx.stroke();
        ctx.lineCap = 'butt';
    }

    function drawTrain(time) {
        const palette = activeTheme().train;
        const x = train.x;
        const y = train.y + (game.running && !game.paused ? Math.sin(time * 13) * 1.2 : 0);
        const cx = x + train.width / 2;
        if (game.shield > 0) {
            const pulse = 1 + Math.sin(time * 8) * .045;
            ctx.strokeStyle = activeTheme().shield;
            ctx.lineWidth = 3;
            ctx.shadowColor = activeTheme().shield;
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.ellipse(cx, y + train.height / 2, 48 * pulse, 53 * pulse, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        if (game.invulnerable > 0 && Math.floor(time * 18) % 2 === 0) return;

        ctx.fillStyle = 'rgba(34,49,59,.24)';
        ctx.beginPath();
        ctx.ellipse(cx, y + 71, 36, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wheel bogies and little brass details.
        ctx.fillStyle = palette[7];
        roundedRect(x + 7, y + 29, 60, 36, 9);
        ctx.fill();
        ctx.fillStyle = palette[8];
        for (const wheelX of [x + 14, x + 60]) {
            for (const wheelY of [y + 39, y + 58]) {
                ctx.beginPath();
                ctx.arc(wheelX, wheelY, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = palette[6];
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fillStyle = palette[6];
                ctx.beginPath();
                ctx.arc(wheelX, wheelY, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#222f39';
            }
        }

        ctx.fillStyle = palette[0];
        roundedRect(x + 9, y + 28, 56, 38, 9);
        ctx.fill();
        ctx.fillStyle = palette[1];
        roundedRect(x + 13, y + 31, 48, 26, 7);
        ctx.fill();
        ctx.fillStyle = palette[2];
        roundedRect(x + 18, y + 4, 38, 36, 14);
        ctx.fill();
        ctx.fillStyle = palette[1];
        ctx.beginPath();
        ctx.ellipse(cx, y + 14, 19, 15, 0, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = palette[3];
        roundedRect(x + 25, y + 7, 22, 15, 5);
        ctx.fill();
        ctx.fillStyle = palette[4];
        roundedRect(x + 28, y + 9, 16, 10, 3);
        ctx.fill();
        ctx.fillStyle = palette[5];
        ctx.beginPath();
        ctx.arc(cx, y + 32, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = palette[6];
        roundedRect(x + 15, y + 63, 44, 7, 3);
        ctx.fill();
        ctx.fillStyle = palette[2];
        roundedRect(x + 24, y + 25, 28, 5, 2);
        ctx.fill();
    }

    function drawRock(item) {
        const palette = activeTheme().rock;
        const x = item.x;
        const y = item.y;
        const size = item.size;
        ctx.fillStyle = 'rgba(41,57,63,.2)';
        ctx.beginPath();
        ctx.ellipse(x + size / 2, y + size * .91, size * .5, size * .13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = palette[0];
        ctx.strokeStyle = palette[1];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + size * .07, y + size * .79);
        ctx.lineTo(x + size * .18, y + size * .38);
        ctx.lineTo(x + size * .46, y + size * .12);
        ctx.lineTo(x + size * .78, y + size * .27);
        ctx.lineTo(x + size * .97, y + size * .68);
        ctx.lineTo(x + size * .86, y + size * .91);
        ctx.lineTo(x + size * .27, y + size * .95);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = palette[2];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + size * .23, y + size * .43);
        ctx.lineTo(x + size * .47, y + size * .22);
        ctx.stroke();
    }

    function drawHazardTree(item) {
        const size = item.size;
        drawPine(item.x + size / 2, item.y + size * .43, size, .8);
    }

    function drawStar(item, time) {
        const palette = activeTheme();
        const cx = item.x + item.size / 2;
        const cy = item.y + item.size / 2;
        const radius = item.size * (.39 + Math.sin(time * 7 + item.x) * .025);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * .65);
        ctx.shadowColor = palette.star;
        ctx.shadowBlur = 17;
        ctx.fillStyle = palette.star;
        ctx.strokeStyle = palette.starLight;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const angle = -Math.PI / 2 + i * Math.PI / 5;
            const r = i % 2 === 0 ? radius : radius * .46;
            if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    function render(time) {
        ctx.save();
        if (game.shake > 0) {
            const intensity = game.shake * 16;
            ctx.translate((Math.random() - .5) * intensity, (Math.random() - .5) * intensity);
        }
        drawBackground(time);
        for (const item of obstacles) {
            if (item.type === 'star') drawStar(item, time);
            else if (item.type === 'tree') drawHazardTree(item);
            else drawRock(item);
        }
        for (const particle of particles) {
            ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        drawTrain(time);
        if (game.shield > 0 && game.running) {
            ctx.fillStyle = '#d8fff1';
            ctx.font = '700 11px "DM Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`SHIELD ${game.shield.toFixed(1)}s`, train.x + train.width / 2, train.y - 8);
        }
        drawWeather(time);
        ctx.restore();
    }

    function drawWeather(time) {
        if (game.weather === 'rain' || game.weather === 'storm') {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.strokeStyle = game.theme === 'neon' ? 'rgba(157,238,255,.53)' : 'rgba(224,244,255,.62)';
            ctx.lineWidth = game.weather === 'storm' ? 1.8 : 1.25;
            ctx.globalAlpha = game.weather === 'storm' ? .67 : .48;
            ctx.beginPath();
            for (const drop of weatherParticles) {
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x - drop.length * .24, drop.y + drop.length);
            }
            ctx.stroke();
            ctx.restore();
        } else if (game.weather === 'snow') {
            ctx.save();
            for (const flake of weatherParticles) {
                const radius = flake.size * 1.1;
                ctx.globalAlpha = .4 + (flake.size / 3) * .35;
                ctx.fillStyle = game.theme === 'sunset' ? '#fff4dc' : '#ffffff';
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        } else if (game.weather === 'fog') {
            // Translucent drifting fog washes out the scene and shortens the view of the rails.
            ctx.save();
            const haze = ctx.createLinearGradient(0, 0, 0, HEIGHT);
            haze.addColorStop(0, 'rgba(226,237,237,.16)');
            haze.addColorStop(.28, 'rgba(226,237,237,.42)');
            haze.addColorStop(.56, 'rgba(226,237,237,.2)');
            haze.addColorStop(.83, 'rgba(226,237,237,.48)');
            haze.addColorStop(1, 'rgba(226,237,237,.22)');
            ctx.fillStyle = haze;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            for (let i = 0; i < 5; i++) {
                const x = (i * 248 + time * (i % 2 ? 8 : -5) + WIDTH) % (WIDTH + 140) - 70;
                const y = 115 + i * 96 + Math.sin(time + i) * 17;
                const cloud = ctx.createRadialGradient(x, y, 8, x, y, 175);
                cloud.addColorStop(0, 'rgba(235,244,243,.28)');
                cloud.addColorStop(1, 'rgba(235,244,243,0)');
                ctx.fillStyle = cloud;
                ctx.fillRect(x - 175, y - 75, 350, 150);
            }
            ctx.restore();
        }

        if (game.weather === 'storm' && game.lightningFlash > 0) {
            ctx.save();
            ctx.fillStyle = `rgba(229,240,255,${Math.min(.45, game.lightningFlash * 1.8)})`;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            const x = game.lightningX;
            ctx.shadowColor = '#e7f4ff';
            ctx.shadowBlur = 24;
            ctx.fillStyle = '#f5fbff';
            ctx.beginPath();
            ctx.moveTo(x, 15);
            ctx.lineTo(x - 24, 93);
            ctx.lineTo(x + 5, 84);
            ctx.lineTo(x - 13, 157);
            ctx.lineTo(x + 32, 72);
            ctx.lineTo(x + 7, 83);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    function frame(timestamp) {
        const delta = game.lastFrame ? Math.min((timestamp - game.lastFrame) / 1000, .04) : 0;
        game.lastFrame = timestamp;
        if (game.running && !game.paused) update(delta);
        render(timestamp / 1000);
        requestAnimationFrame(frame);
    }

    function keyDirection(key) {
        switch (key.toLowerCase()) {
            case 'arrowleft': case 'a': return 'left';
            case 'arrowright': case 'd': return 'right';
            case 'arrowup': case 'w': return 'up';
            case 'arrowdown': case 's': return 'down';
            default: return null;
        }
    }

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !elements.themeScreen.classList.contains('is-hidden')) {
            closeThemePicker();
            return;
        }
        const direction = keyDirection(event.key);
        if (direction) {
            keys.add(direction);
            if (game.running) event.preventDefault();
        }
        if ((event.code === 'Space' || event.key.toLowerCase() === 'p') && !event.repeat) {
            event.preventDefault();
            togglePause();
        }
        if (event.key === 'Enter' && !game.running) {
            if (!elements.start.classList.contains('is-hidden')) startGame();
            else if (!elements.over.classList.contains('is-hidden')) startGame();
        }
    });

    window.addEventListener('keyup', (event) => {
        const direction = keyDirection(event.key);
        if (direction) keys.delete(direction);
    });

    window.addEventListener('blur', () => {
        keys.clear();
        touchKeys.clear();
        if (game.running && !game.paused) togglePause(true);
    });

    document.querySelectorAll('[data-direction]').forEach((button) => {
        const direction = button.dataset.direction;
        const release = (event) => {
            if (event) event.preventDefault();
            touchKeys.delete(direction);
            button.classList.remove('pressed');
        };
        button.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            button.setPointerCapture(event.pointerId);
            touchKeys.add(direction);
            button.classList.add('pressed');
        });
        button.addEventListener('pointerup', release);
        button.addEventListener('pointercancel', release);
        button.addEventListener('lostpointercapture', release);
    });

    elements.startButton.addEventListener('click', startGame);
    elements.restartButton.addEventListener('click', startGame);
    elements.resumeButton.addEventListener('click', () => togglePause(false));
    elements.pauseButton.addEventListener('click', () => togglePause());
    elements.soundButton.addEventListener('click', () => setSound(!game.soundOn));
    elements.themeButton.addEventListener('click', openThemePicker);
    elements.chooseThemeButton.addEventListener('click', openThemePicker);
    elements.closeThemeButton.addEventListener('click', closeThemePicker);
    elements.themeScreen.addEventListener('click', (event) => {
        if (event.target === elements.themeScreen) closeThemePicker();
    });
    document.querySelectorAll('[data-theme-choice]').forEach((button) => {
        button.addEventListener('click', () => {
            applyTheme(button.dataset.themeChoice);
            showToast(`${activeTheme().name} selected`, activeTheme().star);
            closeThemePicker();
        });
    });
    setSound(game.soundOn);
    applyTheme(game.theme);
    updateHud();

    const resizeCanvas = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = WIDTH * ratio;
        canvas.height = HEIGHT * ratio;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    requestAnimationFrame(frame);
})();
