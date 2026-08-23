/**
 * =========================================================
 * Sion (シオン) ✦ eden* 纪念站交互系统
 * Canvas 星空 · Asterisk "eden*" 全 37 首 OST 留声机 · 双语歌词 · 星空信箱
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
   2. 《eden*》全 37 首 OST 原声留声机与实时双语歌词系统
   ========================================================= */
const EDEN_TRACKS = [
    {
        id: 1,
        title: "Sion",
        artist: "天門 · Asterisk OST",
        tag: "✦ Sion 少女主题曲",
        file: "audio/Sion.mp3",
        duration: "02:43",
        lyrics: [
            { time: 0, jp: "✦ Sion (シオン / 紫苑) ✦", cn: "《eden*》女主角专属主题曲 · 作曲: 天門" },
            { time: 10, jp: "白銀の髪と、紅い瞳の少女", cn: "银白色的长发，与清澈澄净的赤红双眸" },
            { time: 24, jp: "702研究所の静寂の中で", cn: "在 702 研究所永无止境的静寂之中" },
            { time: 42, jp: "「亮……外の世界を見てみたい」", cn: "「亮……我好想亲眼看看外面的世界啊」" },
            { time: 65, jp: "温室のガラスを越えて、広がる青空へ", cn: "跨越玻璃温室的牢笼，奔向辽阔自由的蔚蓝天空" },
            { time: 95, jp: "この星でただ二人きりの、最後の恋物語", cn: "在这颗星球上唯有彼此两人的、最后的恋爱物语" },
            { time: 130, jp: "「私を見つけてくれて、ありがとう」", cn: "「谢谢你，找到了我……」" }
        ]
    },
    {
        id: 2,
        title: "Felix",
        artist: "天門 · Asterisk OST",
        tag: "菲利克斯 · 救世之宿命",
        file: "audio/Felix.mp3",
        duration: "02:37",
        lyrics: [
            { time: 0, jp: "✦ Felix (フィリックス) ✦", cn: "救世新人类 · 背负全人类文明的宿命" },
            { time: 20, jp: "数式と宇宙の方舟を導く、孤独な叡智", cn: "推导无数算式与方舟蓝图的孤高智慧" },
            { time: 55, jp: "神と崇められ、鳥籠に閉じ込められた少女", cn: "被世人奉若神明，却被囚禁在鸟笼之中的少女" }
        ]
    },
    {
        id: 3,
        title: "Sleeping Beauty",
        artist: "天門 · Asterisk OST",
        tag: "睡美人 · 纯白温室",
        file: "audio/Sleeping_Beauty.mp3",
        duration: "01:49",
        lyrics: [
            { time: 0, jp: "✦ Sleeping Beauty (睡美人) ✦", cn: "在研究所温室中静静沉睡的白衣少女" },
            { time: 25, jp: "守衛の足音が、静寂の扉を開く", cn: "年轻守卫的脚步声，悄然叩响了命运的门扉" }
        ]
    },
    {
        id: 4,
        title: "Bird cage",
        artist: "天門 · Asterisk OST",
        tag: "鸟笼 · 孤寂与渴望",
        file: "audio/Bird_cage.mp3",
        duration: "02:20",
        lyrics: [
            { time: 0, jp: "✦ Bird cage (鸟笼) ✦", cn: "即使拥有全知全能的智慧，却无法踏足真正的泥土" },
            { time: 30, jp: "想要触碰窗外拂过的微风", cn: "想要感受阳光洒落在手心的温度" }
        ]
    },
    {
        id: 5,
        title: "To the new world",
        artist: "天門 · Asterisk OST",
        tag: "迈向新世界 · 破晓启程",
        file: "audio/To_the_new_world.mp3",
        duration: "02:34",
        lyrics: [
            { time: 0, jp: "✦ To the new world ✦", cn: "击碎防卫线，牵起少女的手冲向外面的世界" },
            { time: 35, jp: "全人类撤离后的无人星球，属于两个人的世界", cn: "清晨的第一缕阳光洒在山丘与旷野" }
        ]
    },
    {
        id: 6,
        title: "Silent night",
        artist: "天門 · Asterisk OST",
        tag: "静谧之夜 · 星空下的陪伴",
        file: "audio/Silent_night.mp3",
        duration: "02:14",
        lyrics: [
            { time: 0, jp: "✦ Silent night (静谧之夜) ✦", cn: "海边山丘的小木屋，漫天璀璨的繁星" },
            { time: 30, jp: "壁炉前的红茶香气，平静而幸福的日常", cn: "两颗孤独的心灵在此刻紧紧依偎" }
        ]
    },
    {
        id: 7,
        title: "Last wish",
        artist: "天門 · Asterisk OST",
        tag: "最后的愿望 · 誓约",
        file: "audio/Last_wish.mp3",
        duration: "04:24",
        lyrics: [
            { time: 0, jp: "✦ Last wish (最后的愿望) ✦", cn: "「不需要拯救世界，我只想和你在一起」" },
            { time: 40, jp: "即使生命即将走向倒计时，依然充满感激", cn: "因为在这个星球上，我们曾二人独存" }
        ]
    },
    {
        id: 8,
        title: "Separation",
        artist: "天門 · Asterisk OST",
        tag: "诀别 · 繁星落幕",
        file: "audio/Separation.mp3",
        duration: "05:01",
        lyrics: [
            { time: 0, jp: "✦ Separation (诀别) ✦", cn: "在铺满蒲公英的山丘上，迎向终焉之刻" },
            { time: 60, jp: "「亮……谢谢你，让我看到了如此美丽的世界」", cn: "少女安详地合上双眼，化作守望这颗星球的风" }
        ]
    },
    {
        id: 9,
        title: "Time left",
        artist: "天門 · Asterisk OST",
        tag: "余下的时光",
        file: "audio/Time_left.mp3",
        duration: "03:05",
        lyrics: [
            { time: 0, jp: "✦ Time left ✦", cn: "末日倒计时中的每一分每一秒，都是不可替代的珍宝" }
        ]
    },
    {
        id: 10,
        title: "Yearning to the sky",
        artist: "天門 · Asterisk OST",
        tag: "向往苍穹",
        file: "audio/Yearning_to_the_sky.mp3",
        duration: "02:15",
        lyrics: [
            { time: 0, jp: "✦ Yearning to the sky ✦", cn: "仰望星空，方舟远去，留在母星上的执着爱意" }
        ]
    },
    {
        id: 11,
        title: "Elica",
        artist: "天門 · Asterisk OST",
        tag: "艾丽卡角色曲",
        file: "audio/Elica.mp3",
        duration: "02:32",
        lyrics: [{ time: 0, jp: "✦ Elica (エリカ) ✦", cn: "温柔守护着 Sion 的姊妹与战友" }]
    },
    {
        id: 12,
        title: "Lavinia",
        artist: "天門 · Asterisk OST",
        tag: "拉薇妮亚角色曲",
        file: "audio/Lavinia.mp3",
        duration: "01:35",
        lyrics: [{ time: 0, jp: "✦ Lavinia (ラヴィニア) ✦", cn: "军方守卫与职责的交织" }]
    },
    {
        id: 13,
        title: "Maya",
        artist: "天門 · Asterisk OST",
        tag: "玛雅角色曲",
        file: "audio/Maya.mp3",
        duration: "03:19",
        lyrics: [{ time: 0, jp: "✦ Maya (真夜) ✦", cn: "冷静干练的军官，亦有内心的动摇与悲悯" }]
    },
    {
        id: 14,
        title: "Lively girl",
        artist: "天門 · Asterisk OST",
        tag: "活泼的少女",
        file: "audio/Lively_girl.mp3",
        duration: "02:45",
        lyrics: [{ time: 0, jp: "✦ Lively girl ✦", cn: "充满欢笑与生机的瞬间" }]
    },
    {
        id: 15,
        title: "Miracle",
        artist: "天門 · Asterisk OST",
        tag: "奇迹",
        file: "audio/Miracle.mp3",
        duration: "03:39",
        lyrics: [{ time: 0, jp: "✦ Miracle ✦", cn: "在这颗即将毁灭的星球上，我们相遇即是最大的奇迹" }]
    },
    {
        id: 16,
        title: "Eternal sleep",
        artist: "天門 · Asterisk OST",
        tag: "永眠",
        file: "audio/Eternal_sleep.mp3",
        duration: "02:30",
        lyrics: [{ time: 0, jp: "✦ Eternal sleep ✦", cn: "永恒的安眠，化作星辰守望着无垠的夜空" }]
    },
    {
        id: 17,
        title: "Solitude",
        artist: "天門 · Asterisk OST",
        tag: "孤独",
        file: "audio/Solitude.mp3",
        duration: "02:26",
        lyrics: [{ time: 0, jp: "✦ Solitude ✦", cn: "在冰冷世界里的沉思与回响" }]
    },
    {
        id: 18,
        title: "lear earth",
        artist: "天門 · Asterisk OST",
        tag: "澄澈大地",
        file: "audio/lear_earth.mp3",
        duration: "05:04",
        lyrics: [{ time: 0, jp: "✦ Clear Earth ✦", cn: "洗尽铅华的地球，唯美壮阔的自然原野" }]
    },
    {
        id: 19,
        title: "Bonds of knife and gun",
        artist: "天門 · Asterisk OST",
        tag: "刀枪的羁绊",
        file: "audio/Bonds_of_knife_and_gun.mp3",
        duration: "03:39",
        lyrics: [{ time: 0, jp: "✦ Bonds of knife and gun ✦", cn: "军人意志与守护挚爱的誓言" }]
    },
    {
        id: 20,
        title: "Burial man",
        artist: "天門 · Asterisk OST",
        tag: "送葬之人",
        file: "audio/Burial_man.mp3",
        duration: "02:37",
        lyrics: [{ time: 0, jp: "✦ Burial man ✦", cn: "为旧时代文明送葬的孤独守墓者" }]
    },
    {
        id: 21,
        title: "Calm talking",
        artist: "天門 · Asterisk OST",
        tag: "平静的交谈",
        file: "audio/Calm_talking.mp3",
        duration: "02:15",
        lyrics: [{ time: 0, jp: "✦ Calm talking ✦", cn: "午后阳光下的温柔对话" }]
    },
    {
        id: 22,
        title: "Can't leave you alone",
        artist: "天門 · Asterisk OST",
        tag: "无法丢下你一人",
        file: "audio/Cant_leave_you_alone.mp3",
        duration: "03:50",
        lyrics: [{ time: 0, jp: "✦ Can't leave you alone ✦", cn: "「我不会丢下你一人的，Sion」" }]
    },
    {
        id: 23,
        title: "Desire",
        artist: "天門 · Asterisk OST",
        tag: "渴望",
        file: "audio/Desire.mp3",
        duration: "02:32",
        lyrics: [{ time: 0, jp: "✦ Desire ✦", cn: "对自由与真实的炽热渴望" }]
    },
    {
        id: 24,
        title: "Estranged",
        artist: "天門 · Asterisk OST",
        tag: "隔阂",
        file: "audio/Estranged.mp3",
        duration: "01:52",
        lyrics: [{ time: 0, jp: "✦ Estranged ✦", cn: "人与人之间的距离与误解" }]
    },
    {
        id: 25,
        title: "For you now",
        artist: "天門 · Asterisk OST",
        tag: "献给此刻的你",
        file: "audio/For_you_now.mp3",
        duration: "01:59",
        lyrics: [{ time: 0, jp: "✦ For you now ✦", cn: "愿将一切温柔献给此时此刻的你" }]
    },
    {
        id: 26,
        title: "Geniality",
        artist: "天門 · Asterisk OST",
        tag: "温情",
        file: "audio/Geniality.mp3",
        duration: "02:37",
        lyrics: [{ time: 0, jp: "✦ Geniality ✦", cn: "如春风般抚慰心灵的温情" }]
    },
    {
        id: 27,
        title: "Instruction",
        artist: "天門 · Asterisk OST",
        tag: "指示",
        file: "audio/Instruction.mp3",
        duration: "01:40",
        lyrics: [{ time: 0, jp: "✦ Instruction ✦", cn: "军令如山与内心良知的博弈" }]
    },
    {
        id: 28,
        title: "Liberating",
        artist: "天門 · Asterisk OST",
        tag: "解放",
        file: "audio/Liberating.mp3",
        duration: "02:41",
        lyrics: [{ time: 0, jp: "✦ Liberating ✦", cn: "打破桎梏，迈出追求自由的第一步" }]
    },
    {
        id: 29,
        title: "Nostalgia feeling",
        artist: "天門 · Asterisk OST",
        tag: "乡愁与怀念",
        file: "audio/Nostalgia_feeling.mp3",
        duration: "02:42",
        lyrics: [{ time: 0, jp: "✦ Nostalgia feeling ✦", cn: "记忆深处泛起的淡淡怀念" }]
    },
    {
        id: 30,
        title: "Other side of sadness",
        artist: "天門 · Asterisk OST",
        tag: "悲伤的彼岸",
        file: "audio/Other_side_of_sadness.mp3",
        duration: "02:07",
        lyrics: [{ time: 0, jp: "✦ Other side of sadness ✦", cn: "穿越悲伤之后所见到的希望之光" }]
    },
    {
        id: 31,
        title: "Past desire",
        artist: "天門 · Asterisk OST",
        tag: "往昔之愿",
        file: "audio/Past_desire.mp3",
        duration: "01:26",
        lyrics: [{ time: 0, jp: "✦ Past desire ✦", cn: "童年与过往记忆里的微小愿景" }]
    },
    {
        id: 32,
        title: "Presentiment",
        artist: "天門 · Asterisk OST",
        tag: "预感",
        file: "audio/Presentiment.mp3",
        duration: "02:25",
        lyrics: [{ time: 0, jp: "✦ Presentiment ✦", cn: "命运齿轮悄然转动的预感" }]
    },
    {
        id: 33,
        title: "Rule",
        artist: "天門 · Asterisk OST",
        tag: "规则",
        file: "audio/Rule.mp3",
        duration: "02:08",
        lyrics: [{ time: 0, jp: "✦ Rule ✦", cn: "军规与秩序的压迫感" }]
    },
    {
        id: 34,
        title: "Simply",
        artist: "天門 · Asterisk OST",
        tag: "纯粹",
        file: "audio/Simply.mp3",
        duration: "02:42",
        lyrics: [{ time: 0, jp: "✦ Simply ✦", cn: "最纯粹的心愿，往往最难能可贵" }]
    },
    {
        id: 35,
        title: "Unstable",
        artist: "天門 · Asterisk OST",
        tag: "动摇",
        file: "audio/Unstable.mp3",
        duration: "01:55",
        lyrics: [{ time: 0, jp: "✦ Unstable ✦", cn: "末日崩塌前夕的动荡与抉择" }]
    },
    {
        id: 36,
        title: "You laugh under emptiness",
        artist: "天門 · Asterisk OST",
        tag: "空虚下的笑颜",
        file: "audio/You_laugh_under_emptiness.mp3",
        duration: "03:52",
        lyrics: [{ time: 0, jp: "✦ You laugh under emptiness ✦", cn: "荒芜世界的苍穹下，你那令人心碎的纯真笑容" }]
    },
    {
        id: 37,
        title: "Android",
        artist: "天門 · Asterisk OST",
        tag: "仿生人",
        file: "audio/Android.mp3",
        duration: "01:51",
        lyrics: [{ time: 0, jp: "✦ Android ✦", cn: "科技造物与人类情感的边界" }]
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
                audioSourceTip.innerHTML = `<span>🎵 正在播放高品质音频: ${EDEN_TRACKS[currentTrackIndex].file}</span>`;
            }
        } catch (err) {
            isSynthMode = true;
            if (audioSourceTip) {
                audioSourceTip.innerHTML = `<span>✨ 智能启动 <strong>Web Audio 八音盒发生器</strong>（若要听原曲，将 mp3 放入 <code>audio/</code> 目录即可）</span>`;
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
