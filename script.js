/**
 * =========================================================
 * Sion (シオン / 诗音) ✦ eden* 纪念站交互系统
 * Canvas 星空 · 19张 CG 全屏灯箱 · 37首 OST 留声机 · 星空信箱
 * =========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initCanvasStarfield();
    initQuotesCarousel();
    initLettersToSion();
    initOSTPlayer();
    initCGLightbox();
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

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

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

    function animate() {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        const offsetX = (mouse.x - width / 2) * 0.015;
        const offsetY = (mouse.y - height / 2) * 0.015;

        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            star.phase += star.twinkleSpeed;
            const currentAlpha = Math.max(0.1, star.alpha + Math.sin(star.phase) * 0.3);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });

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
   2. 全屏 CG 灯箱浏览系统 (Lightbox)
   ========================================================= */
function initCGLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const backdrop = document.getElementById('lightbox-backdrop');

    if (!galleryItems.length || !modal) return;

    let currentIndex = 0;
    const cgList = Array.from(galleryItems).map(item => ({
        src: item.dataset.src || item.querySelector('img').src,
        caption: item.dataset.caption || item.querySelector('.gallery-caption').textContent
    }));

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const item = cgList[currentIndex];
        if (modalImg) modalImg.src = item.src;
        if (modalCaption) modalCaption.textContent = item.caption;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + cgList.length) % cgList.length;
        updateLightboxContent();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % cgList.length;
        updateLightboxContent();
    }

    galleryItems.forEach((item, idx) => {
        item.addEventListener('click', () => openLightbox(idx));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

/* =========================================================
   3. 《eden*》全 37 首 OST 原声留声机系统
   ========================================================= */
const EDEN_TRACKS = [
    {
        id: 1,
        title: "Sion",
        artist: "天門 · Asterisk OST",
        tag: "✦ Sion 诗音主题曲 · 纯音乐",
        file: "audio/Sion.mp3",
        duration: "02:43",
        isInstrumental: true,
        motto: "「亮……外面的世界，原来是这么宽广、这么美丽的啊。」"
    },
    {
        id: 2,
        title: "Felix",
        artist: "天門 · Asterisk OST",
        tag: "菲利克斯 · 纯音乐",
        file: "audio/Felix.mp3",
        duration: "02:37",
        isInstrumental: true,
        motto: "背负救世宿命的新人类少女，在冰冷的数据之海中独守孤光。"
    },
    {
        id: 3,
        title: "Sleeping Beauty",
        artist: "天門 · Asterisk OST",
        tag: "睡美人 · 纯音乐",
        file: "audio/Sleeping_Beauty.mp3",
        duration: "01:49",
        isInstrumental: true,
        motto: "702研究所白色牢笼中，静静沉睡的少女 诗音。"
    },
    {
        id: 4,
        title: "Bird cage",
        artist: "天門 · Asterisk OST",
        tag: "鸟笼 · 纯音乐",
        file: "audio/Bird_cage.mp3",
        duration: "02:20",
        isInstrumental: true,
        motto: "被世人奉若神明，却被严密囚禁于温室的金丝雀。"
    },
    {
        id: 5,
        title: "To the new world",
        artist: "天門 · Asterisk OST",
        tag: "迈向新世界 · 纯音乐",
        file: "audio/To_the_new_world.mp3",
        duration: "02:34",
        isInstrumental: true,
        motto: "「走吧，我带你去看真正的世界。」"
    },
    {
        id: 6,
        title: "Silent night",
        artist: "天門 · Asterisk OST",
        tag: "静谧之夜 · 纯音乐",
        file: "audio/Silent_night.mp3",
        duration: "02:14",
        isInstrumental: true,
        motto: "山丘木屋里微弱的炉火，夜空中无尽的星河。"
    },
    {
        id: 7,
        title: "Last wish",
        artist: "天門 · Asterisk OST",
        tag: "最后的愿望 · 纯音乐",
        file: "audio/Last_wish.mp3",
        duration: "04:24",
        isInstrumental: true,
        motto: "不需要拯救全宇宙，我只想要与你相守的日常。"
    },
    {
        id: 8,
        title: "Separation",
        artist: "天門 · Asterisk OST",
        tag: "诀别 · 纯音乐",
        file: "audio/Separation.mp3",
        duration: "05:01",
        isInstrumental: true,
        motto: "「谢谢你……在这个星球上找到了我。」"
    },
    {
        id: 9,
        title: "Time left",
        artist: "天門 · Asterisk OST",
        tag: "余下的时光 · 纯音乐",
        file: "audio/Time_left.mp3",
        duration: "03:05",
        isInstrumental: true,
        motto: "末日倒计时里，不可替代的每一寸光阴。"
    },
    {
        id: 10,
        title: "Yearning to the sky",
        artist: "天門 · Asterisk OST",
        tag: "向往苍穹 · 纯音乐",
        file: "audio/Yearning_to_the_sky.mp3",
        duration: "02:15",
        isInstrumental: true,
        motto: "仰望浩瀚苍穹，母星最后的浪漫物语。"
    },
    {
        id: 11,
        title: "Elica",
        artist: "天門 · Asterisk OST",
        tag: "艾丽卡 · 纯音乐",
        file: "audio/Elica.mp3",
        duration: "02:32",
        isInstrumental: true,
        motto: "温柔守护着 诗音 的姊妹与战友。"
    },
    {
        id: 12,
        title: "Lavinia",
        artist: "天門 · Asterisk OST",
        tag: "拉薇妮亚 · 纯音乐",
        file: "audio/Lavinia.mp3",
        duration: "01:35",
        isInstrumental: true,
        motto: "军方守卫与职责的交织。"
    },
    {
        id: 13,
        title: "Maya",
        artist: "天門 · Asterisk OST",
        tag: "玛雅 · 纯音乐",
        file: "audio/Maya.mp3",
        duration: "03:19",
        isInstrumental: true,
        motto: "冷峻外表下深藏的动摇与悲悯。"
    },
    {
        id: 14,
        title: "Lively girl",
        artist: "天門 · Asterisk OST",
        tag: "活泼的少女 · 纯音乐",
        file: "audio/Lively_girl.mp3",
        duration: "02:45",
        isInstrumental: true,
        motto: "荒芜岁月中闪烁的欢笑与生机。"
    },
    {
        id: 15,
        title: "Miracle",
        artist: "天門 · Asterisk OST",
        tag: "奇迹 · 纯音乐",
        file: "audio/Miracle.mp3",
        duration: "03:39",
        isInstrumental: true,
        motto: "「在这颗即将毁灭的星球上，能与你相遇就是奇迹。」"
    },
    {
        id: 16,
        title: "Eternal sleep",
        artist: "天門 · Asterisk OST",
        tag: "永眠 · 纯音乐",
        file: "audio/Eternal_sleep.mp3",
        duration: "02:30",
        isInstrumental: true,
        motto: "化作永恒的繁星，静默守望着这颗无人的星球。"
    },
    {
        id: 17,
        title: "Solitude",
        artist: "天門 · Asterisk OST",
        tag: "孤独 · 纯音乐",
        file: "audio/Solitude.mp3",
        duration: "02:26",
        isInstrumental: true,
        motto: "在冰冷世界里的沉思与回响。"
    },
    {
        id: 18,
        title: "lear earth",
        artist: "天門 · Asterisk OST",
        tag: "澄澈大地 · 纯音乐",
        file: "audio/lear_earth.mp3",
        duration: "05:04",
        isInstrumental: true,
        motto: "洗尽铅华的地球，唯美辽阔的自然原野。"
    },
    {
        id: 19,
        title: "Bonds of knife and gun",
        artist: "天門 · Asterisk OST",
        tag: "刀枪的羁绊 · 纯音乐",
        file: "audio/Bonds_of_knife_and_gun.mp3",
        duration: "03:39",
        isInstrumental: true,
        motto: "军人意志与守护挚爱的誓言。"
    },
    {
        id: 20,
        title: "Burial man",
        artist: "天門 · Asterisk OST",
        tag: "送葬之人 · 纯音乐",
        file: "audio/Burial_man.mp3",
        duration: "02:37",
        isInstrumental: true,
        motto: "为旧时代文明送葬的孤独守墓者。"
    },
    {
        id: 21,
        title: "Calm talking",
        artist: "天門 · Asterisk OST",
        tag: "平静的交谈 · 纯音乐",
        file: "audio/Calm_talking.mp3",
        duration: "02:15",
        isInstrumental: true,
        motto: "午后阳光下，简单而温暖的日常。"
    },
    {
        id: 22,
        title: "Can't leave you alone",
        artist: "天門 · Asterisk OST",
        tag: "无法丢下你一人 · 纯音乐",
        file: "audio/Cant_leave_you_alone.mp3",
        duration: "03:50",
        isInstrumental: true,
        motto: "「我绝不会把你一个人留在这座牢笼里。」"
    },
    {
        id: 23,
        title: "Desire",
        artist: "天門 · Asterisk OST",
        tag: "渴望 · 纯音乐",
        file: "audio/Desire.mp3",
        duration: "02:32",
        isInstrumental: true,
        motto: "对真实与自由的炽热向往。"
    },
    {
        id: 24,
        title: "Estranged",
        artist: "天門 · Asterisk OST",
        tag: "隔阂 · 纯音乐",
        file: "audio/Estranged.mp3",
        duration: "01:52",
        isInstrumental: true,
        motto: "人与人之间的距离与误解。"
    },
    {
        id: 25,
        title: "For you now",
        artist: "天門 · Asterisk OST",
        tag: "献给此刻的你 · 纯音乐",
        file: "audio/For_you_now.mp3",
        duration: "01:59",
        isInstrumental: true,
        motto: "愿将一切温柔献给此时此刻的你。"
    },
    {
        id: 26,
        title: "Geniality",
        artist: "天門 · Asterisk OST",
        tag: "温情 · 纯音乐",
        file: "audio/Geniality.mp3",
        duration: "02:37",
        isInstrumental: true,
        motto: "如清风般抚慰心灵的温情。"
    },
    {
        id: 27,
        title: "Instruction",
        artist: "天門 · Asterisk OST",
        tag: "指示 · 纯音乐",
        file: "audio/Instruction.mp3",
        duration: "01:40",
        isInstrumental: true,
        motto: "军令如山与内心良知的博弈。"
    },
    {
        id: 28,
        title: "Liberating",
        artist: "天門 · Asterisk OST",
        tag: "解放 · 纯音乐",
        file: "audio/Liberating.mp3",
        duration: "02:41",
        isInstrumental: true,
        motto: "打破桎梏，迈出追求自由的第一步。"
    },
    {
        id: 29,
        title: "Nostalgia feeling",
        artist: "天門 · Asterisk OST",
        tag: "乡愁与怀念 · 纯音乐",
        file: "audio/Nostalgia_feeling.mp3",
        duration: "02:42",
        isInstrumental: true,
        motto: "记忆深处泛起的淡淡怀念。"
    },
    {
        id: 30,
        title: "Other side of sadness",
        artist: "天門 · Asterisk OST",
        tag: "悲伤的彼岸 · 纯音乐",
        file: "audio/Other_side_of_sadness.mp3",
        duration: "02:07",
        isInstrumental: true,
        motto: "穿越悲伤之后所见到的希望微光。"
    },
    {
        id: 31,
        title: "Past desire",
        artist: "天門 · Asterisk OST",
        tag: "往昔之愿 · 纯音乐",
        file: "audio/Past_desire.mp3",
        duration: "01:26",
        isInstrumental: true,
        motto: "过往记忆里的微小心愿。"
    },
    {
        id: 32,
        title: "Presentiment",
        artist: "天門 · Asterisk OST",
        tag: "预感 · 纯音乐",
        file: "audio/Presentiment.mp3",
        duration: "02:25",
        isInstrumental: true,
        motto: "命运齿轮悄然转动的预感。"
    },
    {
        id: 33,
        title: "Rule",
        artist: "天門 · Asterisk OST",
        tag: "规则 · 纯音乐",
        file: "audio/Rule.mp3",
        duration: "02:08",
        isInstrumental: true,
        motto: "军规与秩序的压迫感。"
    },
    {
        id: 34,
        title: "Simply",
        artist: "天門 · Asterisk OST",
        tag: "纯粹 · 纯音乐",
        file: "audio/Simply.mp3",
        duration: "02:42",
        isInstrumental: true,
        motto: "最纯粹的心愿，往往最难能可贵。"
    },
    {
        id: 35,
        title: "Unstable",
        artist: "天門 · Asterisk OST",
        tag: "动摇 · 纯音乐",
        file: "audio/Unstable.mp3",
        duration: "01:55",
        isInstrumental: true,
        motto: "末日崩塌前夕的动荡与抉择。"
    },
    {
        id: 36,
        title: "You laugh under emptiness",
        artist: "天門 · Asterisk OST",
        tag: "空虚下的笑颜 · 纯音乐",
        file: "audio/You_laugh_under_emptiness.mp3",
        duration: "03:52",
        isInstrumental: true,
        motto: "荒芜苍穹下，你那令人心碎的纯真笑容。"
    },
    {
        id: 37,
        title: "Android",
        artist: "天門 · Asterisk OST",
        tag: "仿生人 · 纯音乐",
        file: "audio/Android.mp3",
        duration: "01:51",
        isInstrumental: true,
        motto: "科技造物与人类情感的边界。"
    }
];

function initOSTPlayer() {
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isLoopSingle = false;
    let audio = new Audio();
    audio.preload = "metadata";

    let audioCtx = null;
    let synthInterval = null;
    let isSynthMode = false;
    let synthStep = 0;

    const vinylDisc = document.getElementById('vinyl-disc');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const loopBtn = document.getElementById('loop-btn');
    const loopIcon = document.getElementById('loop-icon');
    const muteBtn = document.getElementById('mute-btn');
    const volumeIcon = document.getElementById('volume-icon');
    const volumeSlider = document.getElementById('volume-slider');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const currentTimeSpan = document.getElementById('current-time');
    const totalDurationSpan = document.getElementById('total-duration');
    const trackTitleEl = document.getElementById('current-track-title');
    const trackArtistEl = document.getElementById('current-track-artist');
    const trackTagEl = document.getElementById('current-track-tag');
    const playlistItemsContainer = document.getElementById('playlist-items');
    const playlistCountEl = document.getElementById('playlist-count');
    const lyricsContent = document.getElementById('lyrics-content');
    const lyricsWindow = document.getElementById('lyrics-window');
    const lyricsStatus = document.getElementById('lyrics-status');
    const audioSourceTip = document.getElementById('audio-source-tip');

    const quickPlayBtn = document.getElementById('quick-play-btn');
    const quickAudioTitle = document.getElementById('quick-audio-title');
    const quickAudioIcon = document.getElementById('quick-audio-icon');

    if (playlistCountEl) {
        playlistCountEl.textContent = EDEN_TRACKS.length;
    }

    function renderPlaylist() {
        if (!playlistItemsContainer) return;
        playlistItemsContainer.innerHTML = '';

        EDEN_TRACKS.forEach((track, idx) => {
            const item = document.createElement('div');
            item.className = `playlist-item ${idx === currentTrackIndex ? 'active' : ''}`;
            item.innerHTML = `
                <div class="item-left">
                    <span class="item-num">${String(idx + 1).padStart(2, '0')}</span>
                    <div class="item-info">
                        <span class="item-name">${escapeHtml(track.title)}</span>
                        <span class="item-sub">${escapeHtml(track.tag)}</span>
                    </div>
                </div>
                <div class="item-right">
                    <span>${track.duration}</span>
                </div>
            `;
            item.addEventListener('click', () => {
                selectTrack(idx);
                playTrack();
            });
            playlistItemsContainer.appendChild(item);
        });
    }

    function renderLyrics() {
        if (!lyricsContent) return;
        lyricsContent.innerHTML = '';
        const track = EDEN_TRACKS[currentTrackIndex];

        if (track.isInstrumental || !track.lyrics || track.lyrics.length === 0) {
            if (lyricsStatus) lyricsStatus.textContent = "✦ 原声配乐 · 静心聆听 ✦";
            lyricsContent.innerHTML = `
                <div class="pure-music-view">
                    <div class="pure-music-icon">♫</div>
                    <h4 class="pure-music-title">${escapeHtml(track.title)}</h4>
                    <span class="pure-music-badge">✦ ORIGINAL SOUNDTRACK ✦</span>
                    <p class="pure-music-desc">本曲为 天門 (Tenmon) 为《eden*》创作的原声纯音乐配乐。</p>
                    <div class="pure-music-quote">${escapeHtml(track.motto || "「愿你在此，直至世界的终焉。」")}</div>
                </div>
            `;
        } else {
            if (lyricsStatus) lyricsStatus.textContent = "点击任意行歌词可快速跳转";
            track.lyrics.forEach((line, idx) => {
                const lineEl = document.createElement('div');
                lineEl.className = `lyric-line ${idx === 0 ? 'active' : ''}`;
                lineEl.dataset.time = line.time;
                lineEl.innerHTML = `
                    <div class="lyric-jp">${escapeHtml(line.jp)}</div>
                    <div class="lyric-cn">${escapeHtml(line.cn)}</div>
                `;
                lineEl.addEventListener('click', () => {
                    seekTo(line.time);
                });
                lyricsContent.appendChild(lineEl);
            });
        }

        if (lyricsWindow) lyricsWindow.scrollTop = 0;
    }

    function selectTrack(index) {
        currentTrackIndex = (index + EDEN_TRACKS.length) % EDEN_TRACKS.length;
        const track = EDEN_TRACKS[currentTrackIndex];

        if (trackTitleEl) trackTitleEl.textContent = track.title;
        if (trackArtistEl) trackArtistEl.textContent = track.artist;
        if (trackTagEl) trackTagEl.textContent = track.tag;
        if (totalDurationSpan) totalDurationSpan.textContent = track.duration;
        if (quickAudioTitle) quickAudioTitle.textContent = track.title;

        audio.src = track.file;
        audio.currentTime = 0;
        progressBarFill.style.width = '0%';
        currentTimeSpan.textContent = '00:00';

        renderPlaylist();
        renderLyrics();
    }

    async function playTrack() {
        isPlaying = true;
        updateUIState(true);

        try {
            await audio.play();
            isSynthMode = false;
            if (audioSourceTip) {
                audioSourceTip.innerHTML = `<span>🎵 正在播放高保真原声: ${EDEN_TRACKS[currentTrackIndex].file}</span>`;
            }
        } catch (err) {
            isSynthMode = true;
            if (audioSourceTip) {
                audioSourceTip.innerHTML = `<span>✨ 启动 <strong>Web Audio 八音盒发生器</strong></span>`;
            }
            startSynthPlayback();
        }
    }

    function pauseTrack() {
        isPlaying = false;
        audio.pause();
        stopSynthPlayback();
        updateUIState(false);
    }

    function togglePlay() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }

    function updateUIState(playing) {
        if (vinylDisc) {
            if (playing) vinylDisc.classList.add('playing');
            else vinylDisc.classList.remove('playing');
        }
        if (playIcon) playIcon.textContent = playing ? '⏸' : '▶';
        if (quickPlayBtn) {
            if (playing) quickPlayBtn.classList.add('playing');
            else quickPlayBtn.classList.remove('playing');
        }
        if (quickAudioIcon) quickAudioIcon.textContent = playing ? '⏸' : '▶';
    }

    function updateLyrics(time) {
        const track = EDEN_TRACKS[currentTrackIndex];
        if (track.isInstrumental || !track.lyrics) return;

        const lines = lyricsContent.querySelectorAll('.lyric-line');
        if (!lines.length) return;

        let activeIdx = 0;
        const trackLyrics = track.lyrics;

        for (let i = 0; i < trackLyrics.length; i++) {
            if (time >= trackLyrics[i].time) {
                activeIdx = i;
            } else {
                break;
            }
        }

        lines.forEach((line, idx) => {
            if (idx === activeIdx) {
                if (!line.classList.contains('active')) {
                    line.classList.add('active');
                    const containerHeight = lyricsWindow.clientHeight;
                    const lineTop = line.offsetTop;
                    const lineHeight = line.clientHeight;
                    lyricsWindow.scrollTo({
                        top: lineTop - containerHeight / 2 + lineHeight / 2,
                        behavior: 'smooth'
                    });
                }
            } else {
                line.classList.remove('active');
            }
        });
    }

    function seekTo(seconds) {
        if (!isSynthMode && audio.duration) {
            audio.currentTime = seconds;
        } else {
            synthTimeSec = seconds;
        }
        updateLyrics(seconds);
    }

    let synthTimeSec = 0;
    audio.addEventListener('timeupdate', () => {
        if (!isSynthMode && audio.duration) {
            const current = audio.currentTime;
            const duration = audio.duration;
            const percent = (current / duration) * 100;
            progressBarFill.style.width = `${percent}%`;
            currentTimeSpan.textContent = formatTime(current);
            totalDurationSpan.textContent = formatTime(duration);
            updateLyrics(current);
        }
    });

    audio.addEventListener('ended', () => {
        if (isLoopSingle) {
            audio.currentTime = 0;
            audio.play();
        } else {
            selectTrack(currentTrackIndex + 1);
            playTrack();
        }
    });

    if (progressBarContainer) {
        progressBarContainer.addEventListener('click', (e) => {
            const rect = progressBarContainer.getBoundingClientRect();
            const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            if (!isSynthMode && audio.duration) {
                audio.currentTime = clickRatio * audio.duration;
            } else {
                synthTimeSec = clickRatio * parseDurationToSeconds(EDEN_TRACKS[currentTrackIndex].duration);
                progressBarFill.style.width = `${clickRatio * 100}%`;
                currentTimeSpan.textContent = formatTime(synthTimeSec);
                updateLyrics(synthTimeSec);
            }
        });
    }

    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
    if (quickPlayBtn) quickPlayBtn.addEventListener('click', togglePlay);
    if (prevBtn) prevBtn.addEventListener('click', () => { selectTrack(currentTrackIndex - 1); playTrack(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { selectTrack(currentTrackIndex + 1); playTrack(); });

    if (loopBtn) {
        loopBtn.addEventListener('click', () => {
            isLoopSingle = !isLoopSingle;
            loopBtn.classList.toggle('active', isLoopSingle);
            loopIcon.textContent = isLoopSingle ? '🔂' : '🔁';
            loopBtn.title = isLoopSingle ? '当前模式: 单曲循环' : '当前模式: 列表循环';
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            audio.volume = val;
            if (audioGainNode) audioGainNode.gain.setValueAtTime(val, audioCtx ? audioCtx.currentTime : 0);
            if (volumeIcon) volumeIcon.textContent = val === 0 ? '🔇' : (val < 0.5 ? '🔉' : '🔊');
        });
    }

    if (muteBtn) {
        let prevVolume = 0.8;
        muteBtn.addEventListener('click', () => {
            if (audio.volume > 0) {
                prevVolume = audio.volume;
                audio.volume = 0;
                if (volumeSlider) volumeSlider.value = 0;
                if (volumeIcon) volumeIcon.textContent = '🔇';
            } else {
                audio.volume = prevVolume || 0.8;
                if (volumeSlider) volumeSlider.value = audio.volume;
                if (volumeIcon) volumeIcon.textContent = '🔊';
            }
        });
    }

    /* Web Audio 八音盒发生器 */
    let audioGainNode = null;
    const synthMelody = [
        440.00, 523.25, 659.25, 880.00, 587.33, 659.25, 523.25, 440.00,
        392.00, 493.88, 587.33, 783.99, 659.25, 587.33, 493.88, 392.00,
        349.23, 440.00, 523.25, 698.46, 659.25, 523.25, 440.00, 329.63,
        329.63, 440.00, 493.88, 659.25, 493.88, 440.00, 392.00, 440.00
    ];

    function startSynthPlayback() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
            audioGainNode = audioCtx.createGain();
            audioGainNode.gain.value = volumeSlider ? parseFloat(volumeSlider.value) : 0.8;
            audioGainNode.connect(audioCtx.destination);
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        stopSynthPlayback();

        const totalSec = parseDurationToSeconds(EDEN_TRACKS[currentTrackIndex].duration);

        synthInterval = setInterval(() => {
            if (!isPlaying || !audioCtx) return;

            synthTimeSec += 0.6;
            if (synthTimeSec >= totalSec) {
                if (isLoopSingle) {
                    synthTimeSec = 0;
                } else {
                    selectTrack(currentTrackIndex + 1);
                    playTrack();
                    return;
                }
            }

            const percent = (synthTimeSec / totalSec) * 100;
            progressBarFill.style.width = `${percent}%`;
            currentTimeSpan.textContent = formatTime(synthTimeSec);
            updateLyrics(synthTimeSec);

            const freq = synthMelody[synthStep % synthMelody.length];
            playChimeNote(freq);
            if (synthStep % 4 === 0) playChimeNote(freq * 0.5);
            synthStep++;
        }, 600);
    }

    function stopSynthPlayback() {
        if (synthInterval) {
            clearInterval(synthInterval);
            synthInterval = null;
        }
    }

    function playChimeNote(freq) {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(audioGainNode || audioCtx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
    }

    selectTrack(0);
}

/* =========================================================
   4. 名台词轮播控制
   ========================================================= */
function initQuotesCarousel() {
    const slides = document.querySelectorAll('.quote-slide');
    const dotsContainer = document.getElementById('quote-dots');
    const prevBtn = document.getElementById('quote-prev');
    const nextBtn = document.getElementById('quote-next');

    if (!slides.length || !dotsContainer) return;

    let currentIndex = 0;
    let autoInterval = null;

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
   5. 星空信箱 (Letters to Sion)
   ========================================================= */
function initLettersToSion() {
    const form = document.getElementById('message-form');
    const nameInput = document.getElementById('sender-name');
    const contentInput = document.getElementById('sender-content');
    const charCounter = document.getElementById('char-count');
    const letterList = document.getElementById('letter-list');
    const letterCountSpan = document.getElementById('letter-count');
    const clearBtn = document.getElementById('clear-letters-btn');

    const defaultLetters = [
        {
            name: "榛名亮",
            content: "外面的世界很大，也很安静。蒲公英都盛开了，我会一直陪着你。",
            time: "2009-09-18"
        },
        {
            name: "观星者",
            content: "致敬 minori 留给这个世界的绝美物语。诗音，愿你在繁星之海永远自由。",
            time: "2024-05-20"
        },
        {
            name: "旅人",
            content: "《eden*》是我心中的白月光。愿每个渴望自由的灵魂都能找到属于自己的山丘与花海。",
            time: "2025-01-01"
        }
    ];

    let letters = JSON.parse(localStorage.getItem('sion_letters') || 'null');
    if (!letters || letters.length === 0) {
        letters = defaultLetters;
        localStorage.setItem('sion_letters', JSON.stringify(letters));
    }

    if (contentInput && charCounter) {
        contentInput.addEventListener('input', () => {
            charCounter.textContent = contentInput.value.length;
        });
    }

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

            if (typeof launchSpecialStar === 'function') {
                launchSpecialStar();
            }

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
   辅助工具函数
   ========================================================= */
function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function parseDurationToSeconds(durationStr) {
    const parts = (durationStr || '00:00').split(':');
    if (parts.length === 2) {
        return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 180;
}

function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
}
