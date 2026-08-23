/**
 * =========================================================
 * Sion (シオン / 诗音) ✦ eden* 纪念站交互系统
 * Canvas 星空 · 19张 CG 全屏灯箱 · 右下角悬浮毛玻璃音乐播放器 (37 OST)
 * =========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initCanvasStarfield();
    initHeroTypewriter();
    initQuotesCarousel();
    initFloatingOSTPlayer();
    initCGLightbox();
    initGalleryToggle();
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
   3. 画廊展开 / 收起控制 (Gallery Show More)
   ========================================================= */
function initGalleryToggle() {
    const toggleBtn = document.getElementById('gallery-toggle-btn');
    const toggleBtnText = document.getElementById('toggle-btn-text');
    const extraItems = document.querySelectorAll('.extra-cg');

    if (!toggleBtn || !extraItems.length) return;

    let isExpanded = false;

    toggleBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        extraItems.forEach(item => {
            if (isExpanded) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        if (toggleBtnText) {
            toggleBtnText.textContent = isExpanded ? "✦ 收起部分 CG ✦" : "✦ 展开查看全部 19 张回忆 CG ✦";
        }
    });
}

/* =========================================================
   4. 《eden*》全 37 首 OST 悬浮毛玻璃音乐播放器系统
   ========================================================= */
const EDEN_TRACKS = [
    { id: 1, title: "Sion", artist: "天門 · Asterisk OST", tag: "✦ Sion 诗音主题曲 · 纯音乐", file: "audio/Sion.mp3", duration: "02:43" },
    { id: 2, title: "Felix", artist: "天門 · Asterisk OST", tag: "菲利克斯 · 纯音乐", file: "audio/Felix.mp3", duration: "02:37" },
    { id: 3, title: "Sleeping Beauty", artist: "天門 · Asterisk OST", tag: "睡美人 · 纯音乐", file: "audio/Sleeping_Beauty.mp3", duration: "01:49" },
    { id: 4, title: "Bird cage", artist: "天門 · Asterisk OST", tag: "鸟笼 · 纯音乐", file: "audio/Bird_cage.mp3", duration: "02:20" },
    { id: 5, title: "To the new world", artist: "天門 · Asterisk OST", tag: "迈向新世界 · 纯音乐", file: "audio/To_the_new_world.mp3", duration: "02:34" },
    { id: 6, title: "Silent night", artist: "天門 · Asterisk OST", tag: "静谧之夜 · 纯音乐", file: "audio/Silent_night.mp3", duration: "02:14" },
    { id: 7, title: "Last wish", artist: "天門 · Asterisk OST", tag: "最后的愿望 · 纯音乐", file: "audio/Last_wish.mp3", duration: "04:24" },
    { id: 8, title: "Separation", artist: "天門 · Asterisk OST", tag: "诀别 · 纯音乐", file: "audio/Separation.mp3", duration: "05:01" },
    { id: 9, title: "Time left", artist: "天門 · Asterisk OST", tag: "余下的时光 · 纯音乐", file: "audio/Time_left.mp3", duration: "03:05" },
    { id: 10, title: "Yearning to the sky", artist: "天門 · Asterisk OST", tag: "向往苍穹 · 纯音乐", file: "audio/Yearning_to_the_sky.mp3", duration: "02:15" },
    { id: 11, title: "Elica", artist: "天門 · Asterisk OST", tag: "艾丽卡 · 纯音乐", file: "audio/Elica.mp3", duration: "02:32" },
    { id: 12, title: "Lavinia", artist: "天門 · Asterisk OST", tag: "拉薇妮亚 · 纯音乐", file: "audio/Lavinia.mp3", duration: "01:35" },
    { id: 13, title: "Maya", artist: "天門 · Asterisk OST", tag: "玛雅 · 纯音乐", file: "audio/Maya.mp3", duration: "03:19" },
    { id: 14, title: "Lively girl", artist: "天門 · Asterisk OST", tag: "活泼的少女 · 纯音乐", file: "audio/Lively_girl.mp3", duration: "02:45" },
    { id: 15, title: "Miracle", artist: "天門 · Asterisk OST", tag: "奇迹 · 纯音乐", file: "audio/Miracle.mp3", duration: "03:39" },
    { id: 16, title: "Eternal sleep", artist: "天門 · Asterisk OST", tag: "永眠 · 纯音乐", file: "audio/Eternal_sleep.mp3", duration: "02:30" },
    { id: 17, title: "Solitude", artist: "天門 · Asterisk OST", tag: "孤独 · 纯音乐", file: "audio/Solitude.mp3", duration: "02:26" },
    { id: 18, title: "lear earth", artist: "天門 · Asterisk OST", tag: "澄澈大地 · 纯音乐", file: "audio/lear_earth.mp3", duration: "05:04" },
    { id: 19, title: "Bonds of knife and gun", artist: "天門 · Asterisk OST", tag: "刀枪的羁绊 · 纯音乐", file: "audio/Bonds_of_knife_and_gun.mp3", duration: "03:39" },
    { id: 20, title: "Burial man", artist: "天門 · Asterisk OST", tag: "送葬之人 · 纯音乐", file: "audio/Burial_man.mp3", duration: "02:37" },
    { id: 21, title: "Calm talking", artist: "天門 · Asterisk OST", tag: "平静的交谈 · 纯音乐", file: "audio/Calm_talking.mp3", duration: "02:15" },
    { id: 22, title: "Can't leave you alone", artist: "天門 · Asterisk OST", tag: "无法丢下你一人 · 纯音乐", file: "audio/Cant_leave_you_alone.mp3", duration: "03:50" },
    { id: 23, title: "Desire", artist: "天門 · Asterisk OST", tag: "渴望 · 纯音乐", file: "audio/Desire.mp3", duration: "02:32" },
    { id: 24, title: "Estranged", artist: "天門 · Asterisk OST", tag: "隔阂 · 纯音乐", file: "audio/Estranged.mp3", duration: "01:52" },
    { id: 25, title: "For you now", artist: "天門 · Asterisk OST", tag: "献给此刻的你 · 纯音乐", file: "audio/For_you_now.mp3", duration: "01:59" },
    { id: 26, title: "Geniality", artist: "天門 · Asterisk OST", tag: "温情 · 纯音乐", file: "audio/Geniality.mp3", duration: "02:37" },
    { id: 27, title: "Instruction", artist: "天門 · Asterisk OST", tag: "指示 · 纯音乐", file: "audio/Instruction.mp3", duration: "01:40" },
    { id: 28, title: "Liberating", artist: "天門 · Asterisk OST", tag: "解放 · 纯音乐", file: "audio/Liberating.mp3", duration: "02:41" },
    { id: 29, title: "Nostalgia feeling", artist: "天門 · Asterisk OST", tag: "乡愁与怀念 · 纯音乐", file: "audio/Nostalgia_feeling.mp3", duration: "02:42" },
    { id: 30, title: "Other side of sadness", artist: "天門 · Asterisk OST", tag: "悲伤的彼岸 · 纯音乐", file: "audio/Other_side_of_sadness.mp3", duration: "02:07" },
    { id: 31, title: "Past desire", artist: "天門 · Asterisk OST", tag: "往昔之愿 · 纯音乐", file: "audio/Past_desire.mp3", duration: "01:26" },
    { id: 32, title: "Presentiment", artist: "天門 · Asterisk OST", tag: "预感 · 纯音乐", file: "audio/Presentiment.mp3", duration: "02:25" },
    { id: 33, title: "Rule", artist: "天門 · Asterisk OST", tag: "规则 · 纯音乐", file: "audio/Rule.mp3", duration: "02:08" },
    { id: 34, title: "Simply", artist: "天門 · Asterisk OST", tag: "纯粹 · 纯音乐", file: "audio/Simply.mp3", duration: "02:42" },
    { id: 35, title: "Unstable", artist: "天門 · Asterisk OST", tag: "动摇 · 纯音乐", file: "audio/Unstable.mp3", duration: "01:55" },
    { id: 36, title: "You laugh under emptiness", artist: "天門 · Asterisk OST", tag: "空虚下的笑颜 · 纯音乐", file: "audio/You_laugh_under_emptiness.mp3", duration: "03:52" },
    { id: 37, title: "Android", artist: "天門 · Asterisk OST", tag: "仿生人 · 纯音乐", file: "audio/Android.mp3", duration: "01:51" }
];

function initFloatingOSTPlayer() {
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isLoopSingle = false;
    let isPanelOpen = false;

    let audio = new Audio();
    audio.preload = "metadata";

    // DOM Elements
    const floatingPanel = document.getElementById('floating-panel');
    const floatingCapsule = document.getElementById('floating-capsule');
    const minimizeBtn = document.getElementById('floating-minimize-btn');
    const capsuleExpandBtn = document.getElementById('capsule-expand-btn');
    const navTogglePlayerBtn = document.getElementById('nav-toggle-player-btn');
    const heroListenBtn = document.getElementById('hero-listen-btn');
    const quickPlayBtn = document.getElementById('quick-play-btn');

    // Controls in Panel
    const floatingTitle = document.getElementById('floating-title');
    const floatingArtist = document.getElementById('floating-artist');
    const floatingTag = document.getElementById('floating-tag');
    const floatingVinyl = document.getElementById('floating-vinyl');
    const floatingPlayBtn = document.getElementById('floating-play-btn');
    const floatingPlayIcon = document.getElementById('floating-play-icon');
    const floatingPrevBtn = document.getElementById('floating-prev-btn');
    const floatingNextBtn = document.getElementById('floating-next-btn');
    const floatingLoopBtn = document.getElementById('floating-loop-btn');
    const floatingLoopIcon = document.getElementById('floating-loop-icon');
    const floatingVolumeSlider = document.getElementById('floating-volume-slider');
    const floatingVolumeIcon = document.getElementById('floating-volume-icon');
    const floatingProgressBar = document.getElementById('floating-progress-bar');
    const floatingProgressFill = document.getElementById('floating-progress-fill');
    const floatingCurrentTime = document.getElementById('floating-current-time');
    const floatingTotalDuration = document.getElementById('floating-total-duration');
    const floatingPlaylist = document.getElementById('floating-playlist');

    // Controls in Capsule & Navbar
    const capsuleVinyl = document.getElementById('capsule-vinyl');
    const capsuleTitle = document.getElementById('capsule-title');
    const capsulePlayBtn = document.getElementById('capsule-play-btn');
    const quickAudioTitle = document.getElementById('quick-audio-title');
    const quickAudioIcon = document.getElementById('quick-audio-icon');

    function renderPlaylist() {
        if (!floatingPlaylist) return;
        floatingPlaylist.innerHTML = '';

        EDEN_TRACKS.forEach((track, idx) => {
            const item = document.createElement('div');
            item.className = `floating-playlist-item ${idx === currentTrackIndex ? 'active' : ''}`;
            item.innerHTML = `
                <div class="floating-item-left">
                    <span class="floating-item-num">${String(idx + 1).padStart(2, '0')}</span>
                    <span class="floating-item-title">${escapeHtml(track.title)}</span>
                </div>
                <span class="floating-item-duration">${track.duration}</span>
            `;
            item.addEventListener('click', () => {
                selectTrack(idx);
                playTrack();
            });
            floatingPlaylist.appendChild(item);
        });
    }

    function selectTrack(index) {
        currentTrackIndex = (index + EDEN_TRACKS.length) % EDEN_TRACKS.length;
        const track = EDEN_TRACKS[currentTrackIndex];

        if (floatingTitle) floatingTitle.textContent = track.title;
        if (floatingArtist) floatingArtist.textContent = track.artist;
        if (floatingTag) floatingTag.textContent = track.tag;
        if (floatingTotalDuration) floatingTotalDuration.textContent = track.duration;

        if (capsuleTitle) capsuleTitle.textContent = track.title;
        if (quickAudioTitle) quickAudioTitle.textContent = track.title;

        audio.src = track.file;
        audio.currentTime = 0;
        if (floatingProgressFill) floatingProgressFill.style.width = '0%';
        if (floatingCurrentTime) floatingCurrentTime.textContent = '00:00';

        renderPlaylist();
    }

    async function playTrack() {
        isPlaying = true;
        updatePlayStateUI(true);
        try {
            await audio.play();
        } catch (err) {
            console.warn("Audio play prevented:", err);
        }
    }

    function pauseTrack() {
        isPlaying = false;
        audio.pause();
        updatePlayStateUI(false);
    }

    function togglePlay() {
        if (isPlaying) pauseTrack();
        else playTrack();
    }

    function updatePlayStateUI(playing) {
        if (floatingVinyl) {
            if (playing) floatingVinyl.classList.add('playing');
            else floatingVinyl.classList.remove('playing');
        }
        if (capsuleVinyl) {
            if (playing) capsuleVinyl.classList.add('playing');
            else capsuleVinyl.classList.remove('playing');
        }
        if (floatingPlayIcon) floatingPlayIcon.textContent = playing ? '⏸' : '▶';
        if (capsulePlayBtn) capsulePlayBtn.textContent = playing ? '⏸' : '▶';

        if (quickPlayBtn) {
            if (playing) quickPlayBtn.classList.add('playing');
            else quickPlayBtn.classList.remove('playing');
        }
        if (quickAudioIcon) quickAudioIcon.textContent = playing ? '⏸' : '▶';
    }

    function openPanel() {
        isPanelOpen = true;
        if (floatingPanel) floatingPanel.classList.add('active');
        if (floatingCapsule) floatingCapsule.style.display = 'none';
    }

    function closePanel() {
        isPanelOpen = false;
        if (floatingPanel) floatingPanel.classList.remove('active');
        if (floatingCapsule) floatingCapsule.style.display = 'flex';
    }

    function togglePanel() {
        if (isPanelOpen) closePanel();
        else openPanel();
    }

    // Audio events
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const current = audio.currentTime;
            const duration = audio.duration;
            const percent = (current / duration) * 100;
            if (floatingProgressFill) floatingProgressFill.style.width = `${percent}%`;
            if (floatingCurrentTime) floatingCurrentTime.textContent = formatTime(current);
            if (floatingTotalDuration) floatingTotalDuration.textContent = formatTime(duration);
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

    // Seek in progress bar
    if (floatingProgressBar) {
        floatingProgressBar.addEventListener('click', (e) => {
            const rect = floatingProgressBar.getBoundingClientRect();
            const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            if (audio.duration) {
                audio.currentTime = clickRatio * audio.duration;
            }
        });
    }

    // Bind Controls
    if (floatingPlayBtn) floatingPlayBtn.addEventListener('click', togglePlay);
    if (capsulePlayBtn) capsulePlayBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
    if (quickPlayBtn) quickPlayBtn.addEventListener('click', () => { togglePlay(); openPanel(); });

    if (floatingPrevBtn) floatingPrevBtn.addEventListener('click', () => { selectTrack(currentTrackIndex - 1); playTrack(); });
    if (floatingNextBtn) floatingNextBtn.addEventListener('click', () => { selectTrack(currentTrackIndex + 1); playTrack(); });

    if (minimizeBtn) minimizeBtn.addEventListener('click', closePanel);
    if (floatingCapsule) floatingCapsule.addEventListener('click', openPanel);
    if (capsuleExpandBtn) capsuleExpandBtn.addEventListener('click', (e) => { e.stopPropagation(); openPanel(); });

    if (navTogglePlayerBtn) navTogglePlayerBtn.addEventListener('click', () => { openPanel(); playTrack(); });
    if (heroListenBtn) heroListenBtn.addEventListener('click', () => { openPanel(); playTrack(); });

    if (floatingLoopBtn) {
        floatingLoopBtn.addEventListener('click', () => {
            isLoopSingle = !isLoopSingle;
            floatingLoopBtn.classList.toggle('active', isLoopSingle);
            floatingLoopIcon.textContent = isLoopSingle ? '🔂' : '🔁';
        });
    }

    if (floatingVolumeSlider) {
        floatingVolumeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            audio.volume = val;
            if (floatingVolumeIcon) floatingVolumeIcon.textContent = val === 0 ? '🔇' : (val < 0.5 ? '🔉' : '🔊');
        });
    }

    selectTrack(0);
}

/* =========================================================
   5. 名台词轮播控制
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
   6. 首屏双行打字机交互系统 (Hero Typewriter)
   ========================================================= */
function initHeroTypewriter() {
    const line1El = document.getElementById('hero-line-1');
    const line2El = document.getElementById('hero-line-2');
    const titleEl = document.getElementById('hero-title');
    const cursorEl = document.getElementById('hero-cursor');

    if (!line1El || !line2El || !titleEl) return;

    const phrases = [
        {
            isChinese: false,
            line1: "eden* —",
            line2: "They Were Only Two, On The Planet."
        },
        {
            isChinese: true,
            line1: "“ 晚安，诗音。 ”",
            line2: "“ 晚安，中二社。 ”"
        }
    ];

    let currentPhraseIdx = 0;
    let isDeleting = false;
    let activeLine = 1;
    let charIdx = 0;

    const TYPE_SPEED = 70;
    const DELETE_SPEED = 35;
    const PAUSE_TIME = 3500;
    const BLANK_PAUSE = 400;

    function tick() {
        const phrase = phrases[currentPhraseIdx];
        if (phrase.isChinese) {
            titleEl.classList.add('is-chinese');
        } else {
            titleEl.classList.remove('is-chinese');
        }

        if (!isDeleting) {
            // Typing mode
            if (activeLine === 1) {
                if (charIdx < phrase.line1.length) {
                    charIdx++;
                    line1El.textContent = phrase.line1.substring(0, charIdx);
                    if (cursorEl) line1El.appendChild(cursorEl);
                    setTimeout(tick, TYPE_SPEED);
                } else {
                    activeLine = 2;
                    charIdx = 0;
                    setTimeout(tick, 120);
                }
            } else {
                if (charIdx < phrase.line2.length) {
                    charIdx++;
                    line2El.textContent = phrase.line2.substring(0, charIdx);
                    if (cursorEl) line2El.appendChild(cursorEl);
                    setTimeout(tick, TYPE_SPEED);
                } else {
                    setTimeout(() => {
                        isDeleting = true;
                        setTimeout(tick, DELETE_SPEED);
                    }, PAUSE_TIME);
                }
            }
        } else {
            // Deleting mode
            if (activeLine === 2) {
                if (charIdx > 0) {
                    charIdx--;
                    line2El.textContent = phrase.line2.substring(0, charIdx);
                    if (cursorEl) line2El.appendChild(cursorEl);
                    setTimeout(tick, DELETE_SPEED);
                } else {
                    activeLine = 1;
                    charIdx = phrase.line1.length;
                    setTimeout(tick, DELETE_SPEED);
                }
            } else {
                if (charIdx > 0) {
                    charIdx--;
                    line1El.textContent = phrase.line1.substring(0, charIdx);
                    if (cursorEl) line1El.appendChild(cursorEl);
                    setTimeout(tick, DELETE_SPEED);
                } else {
                    isDeleting = false;
                    currentPhraseIdx = (currentPhraseIdx + 1) % phrases.length;
                    activeLine = 1;
                    charIdx = 0;
                    setTimeout(tick, BLANK_PAUSE);
                }
            }
        }
    }

    line1El.textContent = "";
    line2El.textContent = "";
    tick();
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

function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
}
