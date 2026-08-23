/**
 * =========================================================
 * Sion (シオン) ✦ eden* 纪念站交互脚本
 * Canvas 星空粒子 · WebAudio 空灵八音盒 · 名台词轮播 · 星空信箱
 * =========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initCanvasStarfield();
    initQuotesCarousel();
    initLettersToSion();
    initWebAudioMusicBox();
});

/* =========================================================
   1. Canvas 星空与蒲公英光尘系统
   ========================================================= */
let launchSpecialStar = null;

function initCanvasStarfield() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initStars();
    });

    // 鼠标微重力视差
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

    // 1. 恒星背景
    let stars = [];
    const STAR_COUNT = Math.floor(Math.min(width, 1600) * 0.15);

    function initStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.3,
                color: Math.random() > 0.3 ? '#70d6ff' : (Math.random() > 0.5 ? '#ffffff' : '#c084fc'),
                alpha: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    initStars();

    // 2. 蒲公英光尘粒子 (向上漂浮)
    let floatingDust = [];
    const DUST_COUNT = 45;
    for (let i = 0; i < DUST_COUNT; i++) {
        floatingDust.push(createDustParticle(width, height));
    }

    function createDustParticle(w, h, startBottom = false) {
        return {
            x: Math.random() * w,
            y: startBottom ? h + 10 : Math.random() * h,
            size: Math.random() * 2.5 + 1.2,
            speedY: Math.random() * 0.6 + 0.2,
            speedX: (Math.random() - 0.5) * 0.4,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.03 + 0.01,
            alpha: Math.random() * 0.6 + 0.2,
            color: Math.random() > 0.4 ? 'rgba(112, 214, 255,' : 'rgba(230, 240, 255,'
        };
    }

    // 3. 流星 (Shooting Stars)
    let shootingStars = [];
    function spawnShootingStar() {
        if (shootingStars.length < 2 && Math.random() < 0.015) {
            shootingStars.push({
                x: Math.random() * width * 0.8 + width * 0.1,
                y: Math.random() * height * 0.3,
                length: Math.random() * 80 + 40,
                speed: Math.random() * 8 + 6,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
                opacity: 1,
                decay: Math.random() * 0.015 + 0.01
            });
        }
    }

    // 暴露信件发射特效
    launchSpecialStar = function() {
        for (let i = 0; i < 3; i++) {
            shootingStars.push({
                x: width * 0.5 + (Math.random() - 0.5) * 200,
                y: height * 0.7,
                length: 120,
                speed: 12 + i * 2,
                angle: -Math.PI / 3 + (Math.random() - 0.5) * 0.3,
                opacity: 1,
                decay: 0.008,
                special: true
            });
        }
    };

    // 渲染循环
    function animate() {
        // 缓动鼠标坐标
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        const offsetX = (mouse.x - width / 2) * 0.015;
        const offsetY = (mouse.y - height / 2) * 0.015;

        ctx.clearRect(0, 0, width, height);

        // 绘制星空
        stars.forEach(star => {
            star.phase += star.twinkleSpeed;
            const currentAlpha = Math.max(0.1, star.alpha + Math.sin(star.phase) * 0.3);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // 绘制蒲公英光尘
        floatingDust.forEach(p => {
            p.y -= p.speedY;
            p.wobble += p.wobbleSpeed;
            p.x += Math.sin(p.wobble) * 0.6 + p.speedX;

            if (p.y < -10) {
                Object.assign(p, createDustParticle(width, height, true));
            }

            ctx.beginPath();
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
            gradient.addColorStop(0, `${p.color} ${p.alpha})`);
            gradient.addColorStop(1, `${p.color} 0)`);
            ctx.fillStyle = gradient;
            ctx.globalAlpha = p.alpha;
            ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // 生成与绘制流星
        spawnShootingStar();
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];
            const tailX = s.x - Math.cos(s.angle) * s.length;
            const tailY = s.y - Math.sin(s.angle) * s.length;

            const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
            if (s.special) {
                grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
                grad.addColorStop(0.3, `rgba(192, 132, 252, ${s.opacity * 0.8})`);
                grad.addColorStop(1, 'rgba(112, 214, 255, 0)');
            } else {
                grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
                grad.addColorStop(0.5, `rgba(112, 214, 255, ${s.opacity * 0.6})`);
                grad.addColorStop(1, 'rgba(112, 214, 255, 0)');
            }

            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = s.special ? 2.5 : 1.5;
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            // 移动
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            s.opacity -= s.decay;

            if (s.opacity <= 0 || s.x < 0 || s.x > width || s.y > height) {
                shootingStars.splice(i, 1);
            }
        }

        ctx.globalAlpha = 1.0;
        requestAnimationFrame(animate);
    }

    animate();
}

/* =========================================================
   2. 名台词轮播控制
   ========================================================= */
function initQuotesCarousel() {
    const slides = document.querySelectorAll('.quote-slide');
    const dotsContainer = document.getElementById('quote-dots');
    const prevBtn = document.getElementById('quote-prev');
    const nextBtn = document.getElementById('quote-next');

    if (!slides.length || !dotsContainer) return;

    let currentIndex = 0;
    let autoInterval = null;

    // 创建指示圆点
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('quote-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(idx);
            resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.quote-dot');

    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

    function resetAutoPlay() {
        clearInterval(autoInterval);
        autoInterval = setInterval(nextSlide, 7500);
    }

    resetAutoPlay();
}

/* =========================================================
   3. 星空信箱 (Letters to Sion)
   ========================================================= */
function initLettersToSion() {
    const form = document.getElementById('message-form');
    const nameInput = document.getElementById('sender-name');
    const contentInput = document.getElementById('sender-content');
    const charCounter = document.getElementById('char-count');
    const letterList = document.getElementById('letter-list');
    const letterCountSpan = document.getElementById('letter-count');
    const clearBtn = document.getElementById('clear-letters-btn');

    // 默认内置寄语
    const defaultLetters = [
        {
            name: "榛名亮",
            content: "外面的世界很大，也很安静。蒲公英都盛开了，我会一直陪着你。",
            time: "2009-09-18"
        },
        {
            name: "观星者",
            content: "致敬 minori 留给这个世界的绝美物语。Sion，愿你在繁星之海永远自由。",
            time: "2024-05-20"
        },
        {
            name: "旅人",
            content: "《eden*》是我心中的白月光。愿每个渴望自由的灵魂都能找到属于自己的山丘与花海。",
            time: "2025-01-01"
        }
    ];

    // 读取本地存储
    let letters = JSON.parse(localStorage.getItem('sion_letters') || 'null');
    if (!letters || letters.length === 0) {
        letters = defaultLetters;
        localStorage.setItem('sion_letters', JSON.stringify(letters));
    }

    // 字数监听
    if (contentInput && charCounter) {
        contentInput.addEventListener('input', () => {
            charCounter.textContent = contentInput.value.length;
        });
    }

    // 渲染信件列表
    function renderLetters() {
        if (!letterList) return;
        letterList.innerHTML = '';
        if (letterCountSpan) letterCountSpan.textContent = letters.length;

        letters.slice().reverse().forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'feed-item';
            itemEl.innerHTML = `
                <div class="feed-item-header">
                    <span class="feed-item-name">✦ ${escapeHtml(item.name)}</span>
                    <span class="feed-item-time">${escapeHtml(item.time)}</span>
                </div>
                <div class="feed-item-body">${escapeHtml(item.content)}</div>
            `;
            letterList.appendChild(itemEl);
        });
    }

    function escapeHtml(str) {
        return (str || '').replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[m]);
    }

    // 表单提交
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = (nameInput.value || '').trim();
            const content = (contentInput.value || '').trim();

            if (!name || !content) return;

            const now = new Date();
            const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

            const newLetter = { name, content, time: timeStr };
            letters.push(newLetter);
            localStorage.setItem('sion_letters', JSON.stringify(letters));

            renderLetters();
            form.reset();
            if (charCounter) charCounter.textContent = '0';

            // 触发星空光子发射动画
            if (typeof launchSpecialStar === 'function') {
                launchSpecialStar();
            }

            // 提交按钮微动效反馈
            const submitBtn = document.getElementById('send-letter-btn');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = `<span>已化作星光升空 ✨</span>`;
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                }, 2500);
            }
        });
    }

    // 清空按钮
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm("确定要重置星空信箱吗？")) {
                letters = defaultLetters;
                localStorage.setItem('sion_letters', JSON.stringify(letters));
                renderLetters();
            }
        });
    }

    renderLetters();
}

/* =========================================================
   4. Web Audio 氛围八音盒合成器 (Pure Vanilla Web Audio)
   ========================================================= */
function initWebAudioMusicBox() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioText = audioBtn ? audioBtn.querySelector('.audio-text') : null;
    if (!audioBtn) return;

    let isPlaying = false;
    let audioCtx = null;
    let timerId = null;

    // eden* 风格空灵旋律音符频率序列 (A 小调 / C 大调琶音与八音盒和弦)
    // 音名: A3, C4, E4, A4, B4, C5, D5, E5, G4
    const melodyNotes = [
        440.00, 523.25, 659.25, 880.00, // A4, C5, E5, A5
        587.33, 659.25, 523.25, 440.00, // D5, E5, C5, A4
        392.00, 493.88, 587.33, 783.99, // G4, B4, D5, G5
        659.25, 587.33, 493.88, 392.00, // E5, D5, B4, G4
        349.23, 440.00, 523.25, 698.46, // F4, A4, C5, F5
        659.25, 523.25, 440.00, 329.63, // E5, C5, A4, E4
        329.63, 440.00, 493.88, 659.25, // E4, A4, B4, E5
        493.88, 440.00, 392.00, 440.00  // B4, A4, G4, A4
    ];

    let noteStep = 0;

    function playMusicBoxNote(freq, time) {
        if (!audioCtx) return;

        // 主振荡器 (正弦波，柔和八音盒质感)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // 泛音振荡器 (营造水晶/钟琴感)
        const oscOvertone = audioCtx.createOscillator();
        const gainOvertone = audioCtx.createGain();

        // 低通滤波器模拟木质共鸣
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, time);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        oscOvertone.type = 'triangle';
        oscOvertone.frequency.setValueAtTime(freq * 2, time);

        // 音量包络 (快速打击，长尾衰减)
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.25, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.8);

        gainOvertone.gain.setValueAtTime(0, time);
        gainOvertone.gain.linearRampToValueAtTime(0.06, time + 0.015);
        gainOvertone.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

        osc.connect(gain);
        oscOvertone.connect(gainOvertone);

        gain.connect(filter);
        gainOvertone.connect(filter);
        filter.connect(audioCtx.destination);

        osc.start(time);
        oscOvertone.start(time);
        osc.stop(time + 3.0);
        oscOvertone.stop(time + 1.5);
    }

    function scheduleMusic() {
        if (!isPlaying || !audioCtx) return;

        const now = audioCtx.currentTime;
        const noteFreq = melodyNotes[noteStep % melodyNotes.length];

        // 基础音符
        playMusicBoxNote(noteFreq, now);

        // 偶数步叠加低八度和弦底音
        if (noteStep % 4 === 0) {
            playMusicBoxNote(noteFreq * 0.5, now);
        }

        noteStep++;
        timerId = setTimeout(scheduleMusic, 600); // 每 600ms 一个音符
    }

    audioBtn.addEventListener('click', async () => {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }

        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }

        isPlaying = !isPlaying;

        if (isPlaying) {
            audioBtn.classList.add('playing');
            if (audioText) audioText.textContent = "八音盒: 播放中";
            scheduleMusic();
        } else {
            audioBtn.classList.remove('playing');
            if (audioText) audioText.textContent = "八音盒: 关";
            clearTimeout(timerId);
        }
    });
}
