/**
 * =========================================================
 * Sion (シオン) ✦ eden* 纪念站交互系统
 * Canvas 星空 · 原声音乐播放器 (OST & 实时双语歌词) · 名言轮播 · 星空信箱
 * =========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initCanvasStarfield();
    initQuotesCarousel();
    initLettersToSion();
    initOSTPlayer();
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
   2. 《eden*》OST 原声留声机与实时双语歌词系统
   ========================================================= */
const EDEN_TRACKS = [
    {
        id: 1,
        title: "little explorer",
        artist: "原田ひとみ · 作曲: 天门",
        tag: "OP 主题曲 · 双语歌词",
        file: "audio/little_explorer.mp3",
        duration: "04:36",
        lyrics: [
            { time: 0, jp: "little explorer (Game Size / Full)", cn: "作词: 酒井伸和 / 作曲·编曲: 天门" },
            { time: 14, jp: "見上げた空 遠く光る星", cn: "仰望夜空 遥远闪烁的繁星" },
            { time: 21, jp: "誰かが呼ぶ 微かな声", cn: "那是谁在呼唤 微弱的低语" },
            { time: 28, jp: "閉ざされた世界を抜け出して", cn: "挣脱这片被封闭的世界" },
            { time: 35, jp: "風の吹く場所へと向かう", cn: "奔向微风吹拂的自由远方" },
            { time: 42, jp: "震える手を重ね合えば", cn: "当我们颤抖的双手紧紧相握" },
            { time: 49, jp: "恐れさえも消えていく", cn: "连内心的恐惧也化作了勇气" },
            { time: 56, jp: "どこまでも続くこの星の果てへ", cn: "前往这颗星球无尽绵延的尽头" },
            { time: 65, jp: "二人だけの旅が始まる", cn: "属于我们两个人的旅程 正式启程" },
            { time: 76, jp: "忘れないで 君と交わした約束", cn: "请不要忘记 那曾与你许下的誓约" },
            { time: 84, jp: "世界が終わるその時まで", cn: "直至这个世界走向终结的时刻" },
            { time: 92, jp: "君の笑顔を守り続けるから", cn: "我都会永远守护你温柔的笑容" },
            { time: 104, jp: "広がる青空 眩しい光の中へ", cn: "融入那片辽阔碧空与璀璨光芒之中" },
            { time: 118, jp: "ありがとう、私を見つけてくれて", cn: "谢谢你，在这颗星球上找到了我……" }
        ]
    },
    {
        id: 2,
        title: "two of us",
        artist: "岡田真澄 · 作曲: 天门",
        tag: "ED 片尾曲 · 双语歌词",
        file: "audio/two_of_us.mp3",
        duration: "05:12",
        lyrics: [
            { time: 0, jp: "two of us - 岡田真澄", cn: "《eden*》片尾主题曲 · 作曲: 天门" },
            { time: 18, jp: "静かな夜に 包まれて", cn: "被这片静谧祥和的夜色所环抱" },
            { time: 26, jp: "寄り添う影 二つだけ", cn: "相依相偎的身影 唯有彼此两人" },
            { time: 34, jp: "世界が終わりに近づいても", cn: "纵然世界正不可逆转地走向终焉" },
            { time: 42, jp: "あなたの笑顔があればいい", cn: "只要能看见你的微笑 就已经足够" },
            { time: 50, jp: "過ぎ去った日々は宝物", cn: "一同走过的岁月 是无价的珍宝" },
            { time: 58, jp: "瞳を閉じれば蘇る", cn: "每当轻闭双眸 回忆便再次鲜活苏醒" },
            { time: 66, jp: "ありがとう そばにいてくれて", cn: "谢谢你，一直温柔地陪伴在我的身旁" },
            { time: 75, jp: "この星で巡り会えた奇跡", cn: "能在这颗孤独星球上与你相遇的奇迹" },
            { time: 88, jp: "二人きりの世界で、永遠に眠る", cn: "在只有我们两个人的世界里，归于永恒的安宁" }
        ]
    },
    {
        id: 3,
        title: "eden (Main Theme)",
        artist: "天门 (Tenmon)",
        tag: "主旋律 · 钢琴与弦乐",
        file: "audio/eden.mp3",
        duration: "03:24",
        lyrics: [
            { time: 0, jp: "✦ 《eden*》主旋律 ✦", cn: "「世界即将走向终结。但是，我们曾在这里。」" },
            { time: 15, jp: "【钢琴独奏】静谧的 702 研究所", cn: "白发少女坐在玻璃牢笼前，静默仰望天空" },
            { time: 45, jp: "【弦乐升起】破晓时分的奔逃", cn: "牵起她的手，击碎所有阻碍" },
            { time: 80, jp: "【交响高潮】山丘与蒲公英花海", cn: "微风吹过两人的发梢，这是地球最后的浪漫" },
            { time: 130, jp: "【余音】愿你在此，直至世界的终焉", cn: "琴键缓缓沉寂，唯有繁星在夜空中永恒闪烁" }
        ]
    },
    {
        id: 4,
        title: "the morning dew",
        artist: "天门 (Tenmon)",
        tag: "晨光与红茶 · 日常 BGM",
        file: "audio/the_morning_dew.mp3",
        duration: "02:48",
        lyrics: [
            { time: 0, jp: "✦ the morning dew ✦", cn: "清晨山丘小屋里弥漫的红茶香气" },
            { time: 20, jp: "「亮，红茶好香啊。」", cn: "第一次品尝世俗的甘甜与温度" },
            { time: 50, jp: "简单的早餐、平静的对话", cn: "没有研究所的数据，只有属于两人的早晨" }
        ]
    },
    {
        id: 5,
        title: "feelings...",
        artist: "天门 (Tenmon)",
        tag: "心之羁绊 · 抒情 BGM",
        file: "audio/feelings.mp3",
        duration: "03:15",
        lyrics: [
            { time: 0, jp: "✦ feelings... ✦", cn: "两颗孤独灵魂在末日倒计时中的依偎" },
            { time: 25, jp: "「我是为了拯救人类而生的 Felix。」", cn: "「但对我来说，你只是 Sion。」" },
            { time: 60, jp: "微光流淌的夜幕之下", cn: "心跳与呼吸逐渐重合" }
        ]
    },
    {
        id: 6,
        title: "until the stars fall",
        artist: "天门 (Tenmon)",
        tag: "星落之夜 · 终曲 BGM",
        file: "audio/until_the_stars_fall.mp3",
        duration: "04:02",
        lyrics: [
            { time: 0, jp: "✦ until the stars fall ✦", cn: "直至繁星陨落的归途" },
            { time: 30, jp: "「亮……外面的世界，真的好美啊。」", cn: "最后的呼吸化作微风中的蒲公英" },
            { time: 70, jp: "怀抱中的安眠", cn: "在这个星球上，我们曾二人独存" },
            { time: 120, jp: "✦ They Were Only Two, On The Planet. ✦", cn: "—— 终幕" }
        ]
    }
];

function initOSTPlayer() {
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isLoopSingle = false;
    let audio = new Audio();
    audio.preload = "metadata";

    // Web Audio 合成器后备
    let audioCtx = null;
    let synthInterval = null;
    let isSynthMode = false;
    let synthStep = 0;

    // DOM 元素
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
    const lyricsContent = document.getElementById('lyrics-content');
    const lyricsWindow = document.getElementById('lyrics-window');
    const audioSourceTip = document.getElementById('audio-source-tip');

    // 导航栏快捷按钮
    const quickPlayBtn = document.getElementById('quick-play-btn');
    const quickAudioTitle = document.getElementById('quick-audio-title');
    const quickAudioIcon = document.getElementById('quick-audio-icon');

    // 渲染曲目列表
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

    // 渲染当前歌词
    function renderLyrics() {
        if (!lyricsContent) return;
        lyricsContent.innerHTML = '';
        const track = EDEN_TRACKS[currentTrackIndex];

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

        if (lyricsWindow) lyricsWindow.scrollTop = 0;
    }

    // 选择指定歌曲
    function selectTrack(index) {
        currentTrackIndex = (index + EDEN_TRACKS.length) % EDEN_TRACKS.length;
        const track = EDEN_TRACKS[currentTrackIndex];

        if (trackTitleEl) trackTitleEl.textContent = track.title;
        if (trackArtistEl) trackArtistEl.textContent = track.artist;
        if (trackTagEl) trackTagEl.textContent = track.tag;
        if (totalDurationSpan) totalDurationSpan.textContent = track.duration;
        if (quickAudioTitle) quickAudioTitle.textContent = track.title;

        // 设置音频源
        audio.src = track.file;
        audio.currentTime = 0;
        progressBarFill.style.width = '0%';
        currentTimeSpan.textContent = '00:00';

        renderPlaylist();
        renderLyrics();
    }

    // 播放音乐
    async function playTrack() {
        isPlaying = true;
        updateUIState(true);

        try {
            await audio.play();
            isSynthMode = false;
            if (audioSourceTip) {
                audioSourceTip.innerHTML = `<span>🎵 正在播放本地音频: ${EDEN_TRACKS[currentTrackIndex].file}</span>`;
            }
        } catch (err) {
            // 本地未放置 MP3 文件时，自动启用 Web Audio 空灵合成器
            isSynthMode = true;
            if (audioSourceTip) {
                audioSourceTip.innerHTML = `<span>✨ 未检测到 MP3 文件，已智能启动 <strong>Web Audio 八音盒发生器</strong>（若要听原曲，将 mp3 放入 <code>audio/</code> 目录即可）</span>`;
            }
            startSynthPlayback();
        }
    }

    // 暂停音乐
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

    // 歌词滚动同步
    function updateLyrics(time) {
        const lines = lyricsContent.querySelectorAll('.lyric-line');
        if (!lines.length) return;

        let activeIdx = 0;
        const trackLyrics = EDEN_TRACKS[currentTrackIndex].lyrics;

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
                    // 平滑滚动居中
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

    // 跳转进度
    function seekTo(seconds) {
        if (!isSynthMode && audio.duration) {
            audio.currentTime = seconds;
        } else {
            synthTimeSec = seconds;
        }
        updateLyrics(seconds);
    }

    // 时间进度更新
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

    // 进度条点击拖动
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

    // 控制按钮监听
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

    // 音量调节
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

    /* =========================================================
       Web Audio 八音盒实时音符发生器 (Fallback Engine)
       ========================================================= */
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

            // 发生一个音符
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

    // 初始化渲染
    selectTrack(0);
}

/* =========================================================
   3. 名台词轮播控制
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
   4. 星空信箱 (Letters to Sion)
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
            content: "致敬 minori 留给这个世界的绝美物语。Sion，愿你在繁星之海永远自由。",
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
