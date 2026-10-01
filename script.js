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
        soundIcon: document.getElementById('soundIcon')
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

    const train = { x: 443, y: 480, width: 74, height: 76, speed: 335 };
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
    const keys = new Set();
    const touchKeys = new Set();
    let soundUnlocked = false;
    const routeColors = [
        ['#b6e4dc', '#77c2a4', '#4b9a81'],
        ['#b4d5ef', '#83b2d1', '#5c88ac'],
        ['#d9d4f5', '#aaa1d6', '#7770ae'],
        ['#f4dbad', '#d4ad72', '#a88350']
    ];

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
        train.x = (WIDTH - train.width) / 2;
        train.y = HEIGHT - 132;
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

    function update(delta) {
        game.elapsed += delta;
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
        train.x += dx * train.speed * delta;
        train.y += dy * train.speed * delta;
        train.x = Math.max(230, Math.min(656, train.x));
        train.y = Math.max(52, Math.min(HEIGHT - train.height - 12, train.y));

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
        const palette = routeColors[Math.floor(game.score / 1500) % routeColors.length];
        const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        sky.addColorStop(0, '#bce7ed');
        sky.addColorStop(.42, '#d9eee1');
        sky.addColorStop(1, palette[0]);
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = 'rgba(255,248,207,.82)';
        ctx.beginPath();
        ctx.arc(804, 88, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.52)';
        for (const cloud of clouds) {
            const x = (cloud.x - time * 4 + WIDTH + 120) % (WIDTH + 120) - 60;
            drawCloud(x, cloud.y, cloud.size);
        }

        ctx.fillStyle = palette[1];
        ctx.fillRect(0, 205, WIDTH, HEIGHT - 205);
        ctx.fillStyle = palette[2];
        ctx.beginPath();
        ctx.moveTo(0, 220);
        for (let x = 0; x <= WIDTH; x += 40) {
            ctx.lineTo(x, 186 + Math.sin(x * .012) * 29 + Math.sin(x * .029) * 10);
        }
        ctx.lineTo(WIDTH, HEIGHT);
        ctx.lineTo(0, HEIGHT);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = palette[1];
        ctx.globalAlpha = .62;
        ctx.beginPath();
        ctx.moveTo(0, 310);
        for (let x = 0; x <= WIDTH; x += 45) ctx.lineTo(x, 264 + Math.sin(x * .009 + 2) * 31);
        ctx.lineTo(WIDTH, HEIGHT);
        ctx.lineTo(0, HEIGHT);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.fillStyle = 'rgba(255,255,255,.11)';
        for (let x = 18; x < WIDTH; x += 37) {
            const y = 330 + ((x * 7 + game.trackScroll * 2) % 255);
            drawFlower(x, y, x % 3 === 0 ? '#fff1b7' : '#e2ffcb');
        }

        // The gravel bed and wooden sleepers make the route feel like a real railway.
        ctx.fillStyle = '#b9a88b';
        ctx.fillRect(280, 0, 400, HEIGHT);
        ctx.fillStyle = 'rgba(77,76,64,.13)';
        for (let y = -64 + game.trackScroll; y < HEIGHT; y += 64) {
            ctx.fillRect(286, y, 388, 8);
        }
        ctx.fillStyle = '#685d50';
        ctx.fillRect(327, 0, 15, HEIGHT);
        ctx.fillRect(618, 0, 15, HEIGHT);
        ctx.fillStyle = '#ddd0b1';
        ctx.fillRect(330, 0, 5, HEIGHT);
        ctx.fillRect(621, 0, 5, HEIGHT);
        ctx.fillStyle = 'rgba(255,255,255,.16)';
        ctx.fillRect(342, 0, 3, HEIGHT);
        ctx.fillRect(630, 0, 3, HEIGHT);

        // Scenery scrolls more slowly than the track for a gentle parallax effect.
        for (const tree of scenery) {
            const y = (tree.y + game.trackScroll * .55) % (HEIGHT + 50) - 25;
            drawPine(tree.x, y, tree.size, tree.shade);
        }
        const shade = ctx.createLinearGradient(0, 0, WIDTH, 0);
        shade.addColorStop(0, 'rgba(30,87,69,.13)');
        shade.addColorStop(.25, 'transparent');
        shade.addColorStop(.75, 'transparent');
        shade.addColorStop(1, 'rgba(30,87,69,.13)');
        ctx.fillStyle = shade;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
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
        ctx.fillStyle = 'rgba(70,103,70,.32)';
        ctx.fillRect(x - .5, y + 2, 1, 5);
    }

    function drawPine(x, y, size, shade) {
        ctx.fillStyle = 'rgba(35,82,66,.15)';
        ctx.beginPath();
        ctx.ellipse(x + 3, y + size * .77, size * .5, size * .13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = shade > .5 ? '#408d70' : '#367f68';
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
        ctx.fillStyle = '#916e4d';
        ctx.fillRect(x - size * .055, y + size * .4, size * .11, size * .22);
    }

    function drawTrain(time) {
        const x = train.x;
        const y = train.y + (game.running && !game.paused ? Math.sin(time * 13) * 1.2 : 0);
        const cx = x + train.width / 2;
        if (game.shield > 0) {
            const pulse = 1 + Math.sin(time * 8) * .045;
            ctx.strokeStyle = 'rgba(131,255,219,.83)';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#9af3d1';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.ellipse(cx, y + train.height / 2, 48 * pulse, 53 * pulse, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        if (game.invulnerable > 0 && Math.floor(time * 18) % 2 === 0) return;

        ctx.fillStyle = 'rgba(34,69,70,.23)';
        ctx.beginPath();
        ctx.ellipse(cx, y + 71, 36, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wheel bogies and little brass details.
        ctx.fillStyle = '#3e4850';
        roundedRect(x + 7, y + 29, 60, 36, 9);
        ctx.fill();
        ctx.fillStyle = '#222f39';
        for (const wheelX of [x + 14, x + 60]) {
            for (const wheelY of [y + 39, y + 58]) {
                ctx.beginPath();
                ctx.arc(wheelX, wheelY, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#b9c1b8';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fillStyle = '#e5c875';
                ctx.beginPath();
                ctx.arc(wheelX, wheelY, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#222f39';
            }
        }

        ctx.fillStyle = '#d6534c';
        roundedRect(x + 9, y + 28, 56, 38, 9);
        ctx.fill();
        ctx.fillStyle = '#f27661';
        roundedRect(x + 13, y + 31, 48, 26, 7);
        ctx.fill();
        ctx.fillStyle = '#b84143';
        roundedRect(x + 18, y + 4, 38, 36, 14);
        ctx.fill();
        ctx.fillStyle = '#ef765f';
        ctx.beginPath();
        ctx.ellipse(cx, y + 14, 19, 15, 0, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#233e50';
        roundedRect(x + 25, y + 7, 22, 15, 5);
        ctx.fill();
        ctx.fillStyle = '#bfe9e7';
        roundedRect(x + 28, y + 9, 16, 10, 3);
        ctx.fill();
        ctx.fillStyle = '#ffd982';
        ctx.beginPath();
        ctx.arc(cx, y + 32, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f4c965';
        roundedRect(x + 15, y + 63, 44, 7, 3);
        ctx.fill();
        ctx.fillStyle = '#8f383a';
        roundedRect(x + 24, y + 25, 28, 5, 2);
        ctx.fill();
    }

    function drawRock(item) {
        const x = item.x;
        const y = item.y;
        const size = item.size;
        ctx.fillStyle = 'rgba(41,57,63,.2)';
        ctx.beginPath();
        ctx.ellipse(x + size / 2, y + size * .91, size * .5, size * .13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#727f83';
        ctx.strokeStyle = '#59696d';
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
        ctx.strokeStyle = 'rgba(237,244,225,.38)';
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
        const cx = item.x + item.size / 2;
        const cy = item.y + item.size / 2;
        const radius = item.size * (.39 + Math.sin(time * 7 + item.x) * .025);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * .65);
        ctx.shadowColor = '#ffdc75';
        ctx.shadowBlur = 17;
        ctx.fillStyle = '#ffd15e';
        ctx.strokeStyle = '#fff0ae';
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
        ctx.restore();
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
    setSound(game.soundOn);
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
