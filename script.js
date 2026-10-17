/* ==========================================================================
   Sion (シオン / 诗音) ✦ eden* 纪念站
   --------------------------------------------------------------------------
   No build step. No dependencies. Works from file:// and GitHub Pages.

   HOW TO REPLACE MEDIA
   --------------------
   1. Drop your images into ./images/ and your soundtrack into ./audio/.
   2. If your folders have different names, edit `paths` below once.
   3. Or edit any individual path in `assets` / `tracks`.
   4. The rest of the site resolves every media URL from this single object.
   ========================================================================== */

const SITE_CONFIG = {
  paths: {
    images: "./images/",
    audio: "./audio/"
  },

  assets: {
    hero: {
      portrait: "album_cover.webp",
      mobileSky: "cg/cg_09.webp"
    },
    room: {
      meet: "cg/chapter1_meet.webp",
      bed: "cg/cg_10.webp",
      sleep: "cg/cg_18.webp",
      archive: "cg/cg_01.webp"
    },
    thaw: {
      escape: "cg/chapter2_escape.webp"
    },
    dawn: {
      closeup: "cg/chapter2_closeup.webp",
      light: "cg/cg_04.webp"
    },
    summer: {
      garden: "cg/cg_02.webp",
      tea: "cg/cg_07.webp",
      cabin: "cg/cg_19.webp",
      tall: "cg/cg_16.webp",
      lake: "cg/cg_03.webp",
      sky: "cg/cg_05.webp",
      meadow: "cg/cg_13.webp",
      reach: "cg/cg_15.webp"
    },
    field: {
      wide: "cg/cg_08.webp",
      portrait: "cg/cg_17.webp"
    },
    finale: {
      dusk: "cg/cg_11.webp",
      sleep: "cg/sion_sleep_sunset.webp",
      night: "cg/cg_06.webp"
    },
    sound: {
      cover: "album_cover.webp",
      nightA: "cg/cg_12.webp",
      nightB: "cg/cg_14.webp",
      seal: "avatar.webp"
    }
  },

  album: {
    title: "Asterisk “eden*” ORIGINAL SOUNDTRACK",
    artist: "天門 / Tenmon"
  },

  /*
   * All 37 tracks from the audio folder.
   * The opening track is Sion; everything else follows the folder's
   * alphabetical order. This archive order is curated for the site,
   * not an official soundtrack numbering.
   */
  tracks: [
    { title: "Sion", file: "Sion.mp3" },
    { title: "Android", file: "Android.mp3" },
    { title: "Bird cage", file: "Bird_cage.mp3" },
    { title: "Bonds of knife and gun", file: "Bonds_of_knife_and_gun.mp3" },
    { title: "Burial man", file: "Burial_man.mp3" },
    { title: "Calm talking", file: "Calm_talking.mp3" },
    { title: "Can't leave you alone", file: "Cant_leave_you_alone.mp3" },
    { title: "Desire", file: "Desire.mp3" },
    { title: "Elica", file: "Elica.mp3" },
    { title: "Estranged", file: "Estranged.mp3" },
    { title: "Eternal sleep", file: "Eternal_sleep.mp3" },
    { title: "Felix", file: "Felix.mp3" },
    { title: "For you now", file: "For_you_now.mp3" },
    { title: "Geniality", file: "Geniality.mp3" },
    { title: "Instruction", file: "Instruction.mp3" },
    { title: "Last wish", file: "Last_wish.mp3" },
    { title: "Lavinia", file: "Lavinia.mp3" },
    { title: "lear earth", file: "lear_earth.mp3" },
    { title: "Liberating", file: "Liberating.mp3" },
    { title: "Lively girl", file: "Lively_girl.mp3" },
    { title: "Maya", file: "Maya.mp3" },
    { title: "Miracle", file: "Miracle.mp3" },
    { title: "Nostalgia feeling", file: "Nostalgia_feeling.mp3" },
    { title: "Other side of sadness", file: "Other_side_of_sadness.mp3" },
    { title: "Past desire", file: "Past_desire.mp3" },
    { title: "Presentiment", file: "Presentiment.mp3" },
    { title: "Rule", file: "Rule.mp3" },
    { title: "Separation", file: "Separation.mp3" },
    { title: "Silent night", file: "Silent_night.mp3" },
    { title: "Simply", file: "Simply.mp3" },
    { title: "Sleeping Beauty", file: "Sleeping_Beauty.mp3" },
    { title: "Solitude", file: "Solitude.mp3" },
    { title: "Time left", file: "Time_left.mp3" },
    { title: "To the new world", file: "To_the_new_world.mp3" },
    { title: "Unstable", file: "Unstable.mp3" },
    { title: "Yearning to the sky", file: "Yearning_to_the_sky.mp3" },
    { title: "You laugh under emptiness", file: "You_laugh_under_emptiness.mp3" }
  ],

  audio: {
    initial: "Sion.mp3",
    volume: 0.62,
    loop: "all"
  }
};

(() => {
  "use strict";

  /* ───────────────────────────── small helpers ───────────────────────────── */

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const pad = (value) => String(value).padStart(2, "0");
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  let reducedMotion = motionQuery.matches;

  const STORAGE_KEY = "eden-sion-memorial-v1";
  const themeColors = {
    void: "#05080e",
    frost: "#08131c",
    dawn: "#0a141b",
    noon: "#0a1a26",
    gold: "#171318",
    dusk: "#110b0e",
    night: "#03070d"
  };

  const safe = (label, fn) => {
    try {
      return fn();
    } catch (error) {
      console.error(`[eden*] ${label} failed:`, error);
      return null;
    }
  };

  const resolveImage = (path) => {
    if (!path) return "";
    if (/^(?:https?:)?\/\//.test(path) || /^(?:data:|blob:)/.test(path)) return path;
    return `${SITE_CONFIG.paths.images.replace(/\/?$/, "/")}${path.replace(/^\//, "")}`;
  };

  const resolveAudio = (path) => {
    if (!path) return "";
    if (/^(?:https?:)?\/\//.test(path) || /^(?:data:|blob:)/.test(path)) return path;
    return `${SITE_CONFIG.paths.audio.replace(/\/?$/, "/")}${path.replace(/^\//, "")}`;
  };

  const getAsset = (path) =>
    path.split(".").reduce((node, key) => (node && node[key] !== undefined ? node[key] : null), SITE_CONFIG.assets);

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    const total = Math.floor(seconds);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${pad(mins)}:${pad(secs)}`;
  };

  const readStoredState = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  };

  const saveStoredState = (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      /* localStorage may be disabled on file://. Silence is intentional. */
    }
  };

  /* ───────────────────────────── asset hydration ─────────────────────────── */

  function hydrateAssets() {
    $$("[data-asset]").forEach((element) => {
      const assetPath = getAsset(element.dataset.asset);
      if (!assetPath) {
        element.dataset.assetMissing = "true";
        return;
      }
      const src = resolveImage(assetPath);
      if (element.tagName === "IMG") {
        element.addEventListener(
          "error",
          () => {
            element.classList.add("is-missing");
            const parent = element.closest(
              "figure, .turntable, .sound-dock__disc, .archive__now, .hero__figure, .epilogue__seal"
            );
            if (parent) parent.classList.add("is-media-missing");
          },
          { once: true }
        );
        element.src = src;
      }
    });
  }

  /* ───────────────────────────── preloader ───────────────────────────────── */

  function hidePreloader() {
    const preloader = $("#preloader");
    document.documentElement.classList.add("is-loaded");
    if (preloader) {
      preloader.classList.add("is-hidden");
      window.setTimeout(() => {
        preloader.hidden = true;
      }, 950);
    }
  }

  function waitForHeroImage() {
    const image = $('[data-asset="hero.portrait"]');
    if (!image) return Promise.resolve();
    if (image.complete && image.naturalWidth > 0) {
      return typeof image.decode === "function" ? image.decode().catch(() => undefined) : Promise.resolve();
    }
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      image.addEventListener("load", finish, { once: true });
      image.addEventListener("error", finish, { once: true });
      window.setTimeout(finish, 1700);
    });
  }

  async function runPreloader() {
    const minimumTime = wait(680);
    const fonts = document.fonts && document.fonts.ready
      ? Promise.race([document.fonts.ready.catch(() => undefined), wait(450)])
      : Promise.resolve();

    await Promise.all([minimumTime, waitForHeroImage(), fonts]);
    hidePreloader();
  }

  /* ───────────────────────────── reveal choreography ─────────────────────── */

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          rootMargin: "0px 0px -9% 0px",
          threshold: 0.08
        }
      )
    : null;

  function prepareReveals() {
    if (reducedMotion) return;

    $$("[data-reveal]").forEach((element) => {
      element.classList.add("will-reveal");
    });

    $$(".hero [data-reveal]").forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index * 70, 520)}ms`;
    });

    $$(".bento, .room__archive-grid, .dawn__notes").forEach((group) => {
      $$(":scope > [data-reveal]", group).forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index * 55, 300)}ms`;
      });
    });
  }

  function startReveals() {
    if (reducedMotion) return;
    if (!revealObserver) {
      $$(".will-reveal").forEach((element) => element.classList.add("is-visible"));
      return;
    }
    $$(".will-reveal").forEach((element) => revealObserver.observe(element));

    /* A quiet failsafe for background tabs and unusually busy renderers. */
    window.setTimeout(() => {
      $$(".hero .will-reveal").forEach((element) => element.classList.add("is-visible"));
    }, 1400);
  }

  /* ───────────────────────────── ambient world ───────────────────────────── */

  function createAmbientWorld() {
    const starCanvas = $("#star-canvas");
    const dustCanvas = $("#dust-canvas");
    if (!starCanvas || !dustCanvas) return null;

    const starContext = starCanvas.getContext("2d", { alpha: true });
    const dustContext = dustCanvas.getContext("2d", { alpha: true });
    if (!starContext || !dustContext) return null;

    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      stars: [],
      dust: [],
      shootingStars: [],
      starOpacity: 1,
      starsTarget: 1,
      phase: document.body.dataset.phase || "void",
      pointer: { x: -1000, y: -1000, active: false, time: 0 },
      gust: 0,
      lastTimestamp: 0,
      frameId: 0,
      running: false,
      nextMeteor: performance.now() + 7500
    };

    const starLevels = {
      void: 1,
      frost: 0.42,
      dawn: 0.25,
      noon: 0.11,
      gold: 0.2,
      dusk: 0.44,
      night: 1
    };

    const density = () => {
      const areaFactor = clamp((window.innerWidth * window.innerHeight) / (1440 * 900), 0.55, 1.4);
      return {
        stars: Math.round((window.innerWidth < 760 ? 72 : 152) * areaFactor),
        dust: Math.round((window.innerWidth < 760 ? 18 : 40) * areaFactor)
      };
    };

    function makeStar() {
      const warm = Math.random() > 0.72;
      return {
        x: Math.random(),
        y: Math.random(),
        radius: 0.35 + Math.random() * 1.3,
        depth: 0.25 + Math.random() * 0.75,
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.9,
        warm
      };
    }

    function makeDust() {
      return {
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        vx: 4 + Math.random() * 12,
        vy: 2 + Math.random() * 7,
        size: 4 + Math.random() * 9,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.22,
        alpha: 0.13 + Math.random() * 0.28,
        depth: 0.35 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2
      };
    }

    function resetScenes() {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);

      [starCanvas, dustCanvas].forEach((canvas) => {
        canvas.width = Math.round(state.width * state.dpr);
        canvas.height = Math.round(state.height * state.dpr);
        canvas.style.width = `${state.width}px`;
        canvas.style.height = `${state.height}px`;
        const context = canvas === starCanvas ? starContext : dustContext;
        context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      });

      const counts = density();
      state.stars = Array.from({ length: counts.stars }, makeStar);
      state.dust = Array.from({ length: counts.dust }, makeDust);
      state.shootingStars = [];
      state.nextMeteor = performance.now() + 6000 + Math.random() * 8000;
    }

    function resize() {
      resetScenes();
      if (reducedMotion) drawStatic();
    }

    function cycleStarOpacity() {
      const target = starLevels[state.phase] !== undefined ? starLevels[state.phase] : 0.8;
      state.starsTarget = target;
      state.starOpacity += (target - state.starOpacity) * 0.035;
    }

    function triggerMeteor(options = {}) {
      if (!state.width || !state.height) return;
      const startX = state.width * (0.18 + Math.random() * 0.6);
      const startY = state.height * (0.06 + Math.random() * 0.32);
      const speed = 430 + Math.random() * 320;
      state.shootingStars.push({
        x: startX,
        y: startY,
        vx: speed * 0.88,
        vy: speed * 0.48,
        life: 0,
        maxLife: options.warm ? 1.7 : 1.1 + Math.random() * 0.6,
        length: options.warm ? 230 : 100 + Math.random() * 170,
        warm: Boolean(options.warm)
      });
    }

    function drawStars(time) {
      starContext.clearRect(0, 0, state.width, state.height);
      const scroll = window.scrollY || 0;
      const shouldShow = state.starOpacity > 0.035;

      if (shouldShow) {
        for (const star of state.stars) {
          const parallax = (scroll * 0.012 * star.depth) % state.height;
          let y = (star.y * state.height - parallax + state.height) % state.height;
          const drift = Math.sin(time * 0.00008 * star.speed + star.phase) * 2.2;
          const x = (star.x * state.width + drift + state.width) % state.width;
          const twinkle = 0.54 + 0.46 * Math.sin(time * 0.0012 * star.speed + star.phase);
          const alpha = clamp(twinkle * state.starOpacity * (star.warm ? 0.9 : 0.7), 0, 1);
          if (alpha < 0.025) continue;

          starContext.globalAlpha = alpha;
          starContext.fillStyle = star.warm ? "#ead5b0" : "#dcebf1";
          starContext.beginPath();
          starContext.arc(x, y, star.radius, 0, Math.PI * 2);
          starContext.fill();

          if (star.radius > 1.25) {
            starContext.globalAlpha = alpha * 0.22;
            starContext.strokeStyle = star.warm ? "#e6c796" : "#d8edf2";
            starContext.lineWidth = 0.45;
            starContext.beginPath();
            starContext.moveTo(x - star.radius * 3.4, y);
            starContext.lineTo(x + star.radius * 3.4, y);
            starContext.moveTo(x, y - star.radius * 3.4);
            starContext.lineTo(x, y + star.radius * 3.4);
            starContext.stroke();
          }
        }
        starContext.globalAlpha = 1;
      }

      /* shooting stars */
      if (!reducedMotion) {
        if (
          time > state.nextMeteor &&
          shouldShow &&
          ["void", "night", "dusk", "frost"].includes(state.phase)
        ) {
          triggerMeteor();
          state.nextMeteor = time + 9000 + Math.random() * 17000;
        }

        for (let i = state.shootingStars.length - 1; i >= 0; i -= 1) {
          const meteor = state.shootingStars[i];
          meteor.life += 1 / 60;
          meteor.x += meteor.vx / 60;
          meteor.y += meteor.vy / 60;
          const progress = clamp(meteor.life / meteor.maxLife, 0, 1);
          const alpha = Math.sin(progress * Math.PI) * (meteor.warm ? 0.9 : 0.55);
          const tailLength = meteor.length * (0.7 + Math.sin(progress * Math.PI) * 0.4);
          const tailX = meteor.x - (meteor.vx / Math.hypot(meteor.vx, meteor.vy)) * tailLength;
          const tailY = meteor.y - (meteor.vy / Math.hypot(meteor.vx, meteor.vy)) * tailLength;
          const gradient = starContext.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
          gradient.addColorStop(0, meteor.warm ? `rgba(255, 229, 184, ${alpha})` : `rgba(223, 240, 247, ${alpha})`);
          gradient.addColorStop(0.35, meteor.warm ? `rgba(231, 197, 147, ${alpha * 0.3})` : `rgba(201, 229, 241, ${alpha * 0.22})`);
          gradient.addColorStop(1, "rgba(220, 240, 248, 0)");
          starContext.globalCompositeOperation = "lighter";
          starContext.strokeStyle = gradient;
          starContext.lineWidth = meteor.warm ? 1.5 : 0.8;
          starContext.beginPath();
          starContext.moveTo(meteor.x, meteor.y);
          starContext.lineTo(tailX, tailY);
          starContext.stroke();
          starContext.fillStyle = meteor.warm ? "#ffe3b3" : "#e8f6fa";
          starContext.beginPath();
          starContext.arc(meteor.x, meteor.y, meteor.warm ? 1.7 : 1, 0, Math.PI * 2);
          starContext.fill();
          starContext.globalCompositeOperation = "source-over";

          if (progress >= 1) state.shootingStars.splice(i, 1);
        }
      }
    }

    function drawDust(delta) {
      if (!state.dust.length) return;
      dustContext.clearRect(0, 0, state.width, state.height);
      dustContext.globalCompositeOperation = "lighter";
      const time = performance.now();
      const windWave = Math.sin(time * 0.00024) * 7;
      const gustAcceleration = state.gust * 620;
      state.gust = Math.max(0, state.gust - delta * 0.68);

      for (const particle of state.dust) {
        particle.x += (particle.vx + windWave + gustAcceleration * particle.depth) * delta;
        particle.y += (particle.vy + Math.sin(time * 0.0005 + particle.phase) * 4) * delta;
        particle.rotation += particle.spin * delta;

        if (state.pointer.active) {
          const dx = particle.x - state.pointer.x;
          const dy = particle.y - state.pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < 135) {
            const force = (1 - distance / 135) * 38;
            particle.x += (dx / distance) * force;
            particle.y += (dy / distance) * force;
          }
        }

        if (particle.x > state.width + 40) particle.x = -30;
        if (particle.x < -40) particle.x = state.width + 30;
        if (particle.y > state.height + 40) particle.y = -30;
        if (particle.y < -40) particle.y = state.height + 30;

        const alpha = particle.alpha * (0.76 + Math.sin(time * 0.0008 + particle.phase) * 0.24);
        const scale = particle.depth;
        dustContext.save();
        dustContext.translate(particle.x, particle.y);
        dustContext.rotate(particle.rotation);
        dustContext.globalAlpha = alpha;
        dustContext.strokeStyle = state.phase === "gold" || state.phase === "dusk" ? "#f3d8a8" : "#e6f1ee";
        dustContext.fillStyle = "rgba(255, 247, 227, 0.8)";
        dustContext.lineWidth = 0.55 * scale;

        for (let i = 0; i < 6; i += 1) {
          const angle = (Math.PI * 2 * i) / 6;
          dustContext.beginPath();
          dustContext.moveTo(0, 0);
          dustContext.quadraticCurveTo(
            Math.cos(angle) * particle.size * scale * 0.5,
            Math.sin(angle) * particle.size * scale * 0.5,
            Math.cos(angle) * particle.size * scale,
            Math.sin(angle) * particle.size * scale
          );
          dustContext.stroke();
        }
        dustContext.beginPath();
        dustContext.arc(0, 0, 0.85 * scale, 0, Math.PI * 2);
        dustContext.fill();
        dustContext.restore();
      }
      dustContext.globalCompositeOperation = "source-over";
    }

    function drawStatic() {
      const timestamp = performance.now();
      drawStars(timestamp);
      dustContext.clearRect(0, 0, state.width, state.height);
    }

    function frame(timestamp) {
      if (!state.running) return;
      if (document.hidden || reducedMotion) {
        state.running = false;
        return;
      }
      const delta = state.lastTimestamp
        ? clamp((timestamp - state.lastTimestamp) / 1000, 0.001, 0.05)
        : 0.016;
      state.lastTimestamp = timestamp;
      state.phase = document.body.dataset.phase || state.phase;
      cycleStarOpacity();
      drawStars(timestamp);
      drawDust(delta);
      state.frameId = window.requestAnimationFrame(frame);
    }

    function start() {
      if (reducedMotion) {
        drawStatic();
        return;
      }
      if (state.running) return;
      state.running = true;
      state.lastTimestamp = 0;
      state.frameId = window.requestAnimationFrame(frame);
    }

    function stop() {
      state.running = false;
      window.cancelAnimationFrame(state.frameId);
    }

    function handleResize() {
      window.clearTimeout(handleResize.timer);
      handleResize.timer = window.setTimeout(() => {
        resize();
        if (!state.running && !document.hidden && !reducedMotion) start();
      }, 120);
    }

    function handlePointer(event) {
      if (event.pointerType === "touch") {
        state.pointer.active = false;
        return;
      }
      state.pointer.x = event.clientX;
      state.pointer.y = event.clientY;
      state.pointer.active = true;
      state.pointer.time = performance.now();
    }

    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerleave", () => {
      state.pointer.active = false;
    });
    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stop();
      } else if (!reducedMotion) {
        state.lastTimestamp = 0;
        start();
      }
    });
    motionQuery.addEventListener?.("change", (event) => {
      reducedMotion = event.matches;
      if (reducedMotion) {
        stop();
        drawStatic();
        dustContext.clearRect(0, 0, state.width, state.height);
      } else {
        resetScenes();
        start();
      }
    });

    resetScenes();
    start();

    return {
      gust() {
        state.gust = 1;
        const prefersLess = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!prefersLess) {
          for (const particle of state.dust) {
            particle.vx += 36 + Math.random() * 46;
            particle.vy -= Math.random() * 15;
          }
        }
      },
      shootStar(warm = true) {
        triggerMeteor({ warm });
      },
      stop,
      start,
      setPhase(phase) {
        state.phase = phase;
      }
    };
  }

  /* ───────────────────────────── scroll direction ────────────────────────── */

  function createScrollDirector(ambient) {
    const header = $("#site-header");
    const progressBar = $("#scroll-progress-bar");
    const navLinks = $$("[data-section-link]");
    const phaseSections = $$("main [data-phase]");
    const chapterSections = $$("main [data-chapter]");
    const parallaxElements = $$("[data-parallax]");
    const thawSection = $(".thaw");
    const themeMeta = $('meta[name="theme-color"]');
    let queued = false;
    let lastActive = "";
    let lastPhase = "";

    const updateParallax = () => {
      if (reducedMotion || window.innerWidth <= 1000) {
        parallaxElements.forEach((element) => element.style.setProperty("--parallax-y", "0px"));
        return;
      }
      parallaxElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -250 || rect.top > window.innerHeight + 250) return;
        const speed = Number.parseFloat(element.dataset.speed) || 0.05;
        const distance = rect.top + rect.height / 2 - window.innerHeight / 2;
        const offset = clamp(distance * speed * -2.4, -44, 44);
        element.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
      });
    };

    const updateThaw = () => {
      if (!thawSection) return;
      if (reducedMotion) {
        thawSection.style.setProperty("--thaw", "1");
        return;
      }
      const rect = thawSection.getBoundingClientRect();
      // Skip the write while the section is far away: --thaw feeds a full-screen
      // backdrop blur, and recomputing it every frame for an off-screen node is
      // pure style recalc.
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const travel = Math.max(1, thawSection.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / travel, 0, 1);
      thawSection.style.setProperty("--thaw", progress.toFixed(4));
    };

    const updateActiveStates = () => {
      const midline = window.innerHeight * 0.5;

      let activeChapter = "prologue";
      for (const section of chapterSections) {
        if (section.getBoundingClientRect().top <= midline) {
          activeChapter = section.dataset.chapter || activeChapter;
        }
      }

      let phase = "void";
      for (const section of phaseSections) {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.56) {
          phase = section.dataset.phase || phase;
        }
      }

      const activeNavKey = activeChapter === "prologue" ? "top" : activeChapter;
      if (activeNavKey !== lastActive) {
        lastActive = activeNavKey;
        navLinks.forEach((link) => {
          const active = link.dataset.sectionLink === activeNavKey;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }

      if (phase !== lastPhase) {
        lastPhase = phase;
        document.body.dataset.phase = phase;
        if (themeMeta) themeMeta.setAttribute("content", themeColors[phase] || themeColors.void);
        if (ambient) ambient.setPhase(phase);
      }
    };

    const update = () => {
      queued = false;
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = clamp(scrollTop / scrollable, 0, 1);

      if (header) header.classList.toggle("is-scrolled", scrollTop > 28);
      if (progressBar) progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;

      updateActiveStates();
      updateParallax();
      updateThaw();
    };

    const queueUpdate = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", () => {
      queueUpdate();
      window.setTimeout(queueUpdate, 240);
    }, { passive: true });
    window.addEventListener("load", queueUpdate);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) queueUpdate();
    });
    motionQuery.addEventListener?.("change", () => {
      reducedMotion = motionQuery.matches;
      queueUpdate();
    });

    queueUpdate();
    window.setTimeout(queueUpdate, 120);
    window.setTimeout(queueUpdate, 800);

    return { update: queueUpdate };
  }

  /* ───────────────────────────── gentle custom cursor ────────────────────── */

  function createCursorHalo() {
    const ring = $("#cursor-ring");
    if (!ring) return;
    if (reducedMotion || !finePointerQuery.matches) return;

    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;
    let rafId = 0;
    let visible = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - currentX) > 0.15 || Math.abs(targetY - currentY) > 0.15) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const move = (event) => {
      if (event.pointerType === "touch") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        currentX = targetX;
        currentY = targetY;
        ring.classList.add("is-visible");
      }
      if (!rafId) rafId = window.requestAnimationFrame(tick);
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener(
      "pointerover",
      (event) => {
        const interactive = event.target.closest("a, button, input, summary, [role='button']");
        ring.classList.toggle("is-hover", Boolean(interactive));
      },
      { passive: true }
    );
    document.addEventListener("pointerdown", () => ring.classList.add("is-down"), { passive: true });
    document.addEventListener("pointerup", () => ring.classList.remove("is-down"), { passive: true });
    document.addEventListener("mouseleave", () => {
      ring.classList.remove("is-visible");
      visible = false;
    });
    window.addEventListener("blur", () => {
      ring.classList.remove("is-visible");
      visible = false;
    });
  }

  /* ───────────────────────────── hero tilt ───────────────────────────────── */

  function createHeroTilt() {
    const hero = $(".hero");
    const figure = $("[data-tilt]");
    if (!hero || !figure || reducedMotion || !finePointerQuery.matches) return;

    hero.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType === "touch") return;
        const rect = figure.getBoundingClientRect();
        if (!rect.width) return;
        const nx = clamp((event.clientX - (rect.left + rect.width / 2)) / rect.width, -1.2, 1.2);
        const ny = clamp((event.clientY - (rect.top + rect.height / 2)) / rect.height, -1.2, 1.2);
        figure.style.setProperty("--tilt-x", `${(-ny * 2.8).toFixed(2)}deg`);
        figure.style.setProperty("--tilt-y", `${(nx * 3.8).toFixed(2)}deg`);
      },
      { passive: true }
    );

    hero.addEventListener("pointerleave", () => {
      figure.style.setProperty("--tilt-x", "0deg");
      figure.style.setProperty("--tilt-y", "0deg");
    });
  }

  /* ───────────────────────────── navigation ─────────────────────────────── */

  function createNavigation() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return;
        const target = document.getElementById(hash.slice(1));
        if (!target) return;

        event.preventDefault();
        const header = $("#site-header");
        const offset = target.id === "top" ? 0 : (header ? header.offsetHeight + 2 : 0);
        const top = target.id === "top"
          ? 0
          : Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
        window.scrollTo({
          top,
          behavior: reducedMotion ? "auto" : "smooth"
        });
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", hash);
        }
      });
    });
  }

  /* ───────────────────────────── audio chapel ────────────────────────────── */

  function createAudioPlayer(ambient) {
    const audio = $("#site-audio");
    if (!audio) return null;

    const tracks = Array.isArray(SITE_CONFIG.tracks) ? SITE_CONFIG.tracks.filter((track) => track && track.file) : [];
    const trackList = $("[data-track-list]");
    const archive = $("#sound-archive");
    const statusNodes = $$("[data-audio-status]");
    const titleNodes = $$("[data-audio-title]");
    const numberNodes = $$("[data-audio-number]");
    const seekNodes = $$("[data-audio-seek]");
    const volumeNodes = $$("[data-audio-volume]");
    const muteNodes = $$("[data-audio-mute]");
    const loopNodes = $$("[data-audio-loop]");
    const toggleNodes = $$("[data-audio-toggle]");
    const openNodes = $$("[data-audio-open]");
    const closeNode = $("[data-archive-close]");
    const dock = $("[data-sound-dock]");
    const dockProgress = $("[data-dock-progress]");
    const dockCollapse = $("[data-dock-collapse]");
    const playerShell = $(".player");

    const saved = readStoredState();
    const allowedLoops = ["all", "one", "off"];
    const state = {
      index: 0,
      loop: allowedLoops.includes(saved.loop) ? saved.loop : (SITE_CONFIG.audio.loop || "all"),
      volume: Number.isFinite(saved.volume) ? clamp(saved.volume, 0, 1) : clamp(SITE_CONFIG.audio.volume ?? 0.62, 0, 1),
      muted: Boolean(saved.muted),
      lastVolume: 0.62,
      isSeeking: false,
      archiveOpen: false,
      trigger: null
    };

    if (tracks.length === 0) {
      statusNodes.forEach((node) => {
        node.textContent = "尚未在 SITE_CONFIG.tracks 中配置曲目。";
      });
      $$("[data-audio-toggle], [data-audio-prev], [data-audio-next], [data-audio-open], [data-play-track]").forEach((button) => {
        button.disabled = true;
      });
      return null;
    }

    const initialSavedIndex = tracks.findIndex((track) => track.file === saved.track);
    const configuredInitial = tracks.findIndex((track) => track.file === SITE_CONFIG.audio.initial);
    state.index = initialSavedIndex >= 0 ? initialSavedIndex : Math.max(0, configuredInitial);
    state.lastVolume = state.volume || 0.62;

    const currentTrack = () => tracks[state.index];

    function setStatus(message) {
      statusNodes.forEach((node) => {
        node.textContent = message || "";
      });
    }

    function setRangeFill(input, percent) {
      input.style.setProperty("--fill", `${clamp(percent, 0, 100).toFixed(2)}%`);
    }

    function syncPlayState() {
      const playing = !audio.paused && !audio.ended;
      document.body.classList.toggle("is-audio-playing", playing);
      if (dock) dock.classList.toggle("is-playing", playing);
      const label = playing ? "暂停" : "播放";
      toggleNodes.forEach((node) => {
        node.setAttribute("aria-label", `${label}：${currentTrack().title}`);
      });
      if (playerShell) playerShell.classList.toggle("has-error", Boolean(audio.error));
    }

    function syncTrackUI() {
      const track = currentTrack();
      titleNodes.forEach((node) => {
        node.textContent = track.title;
      });
      numberNodes.forEach((node) => {
        node.textContent = `${pad(state.index + 1)} / ${tracks.length}`;
      });
      $$("[data-track-index]").forEach((button) => {
        const active = Number(button.dataset.trackIndex) === state.index;
        if (active) button.setAttribute("aria-current", "true");
        else button.removeAttribute("aria-current");
      });
      if (archive && archive.open) scrollCurrentTrackIntoView();
      syncPlayState();
      updateMediaSession();
    }

    function syncProgressUI() {
      const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
      const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      const percent = duration ? (current / duration) * 100 : 0;

      seekNodes.forEach((input) => {
        input.disabled = !duration;
        input.max = duration ? String(duration) : "0";
        if (!state.isSeeking) input.value = String(current);
        setRangeFill(input, percent);
      });
      $$("[data-audio-current]").forEach((node) => {
        node.textContent = formatTime(current);
      });
      $$("[data-audio-duration]").forEach((node) => {
        node.textContent = formatTime(duration);
      });
      if (dockProgress) {
        dockProgress.style.transform = `scaleX(${percent / 100})`;
      }
      if (audio.error) {
        if (playerShell) playerShell.classList.add("has-error");
      }
    }

    function syncVolumeUI() {
      volumeNodes.forEach((input) => {
        input.value = String(state.volume);
        setRangeFill(input, state.volume * 100);
      });
      muteNodes.forEach((button) => {
        button.setAttribute("aria-pressed", String(state.muted));
        button.setAttribute("aria-label", state.muted ? "取消静音" : "静音");
        const use = $("use", button);
        if (use) use.setAttribute("href", state.muted ? "#icon-mute" : "#icon-volume");
      });
    }

    function syncLoopUI() {
      const labels = {
        all: "列表循环",
        one: "单曲循环",
        off: "不循环"
      };
      const marks = {
        all: "ALL",
        one: "ONE",
        off: "OFF"
      };
      loopNodes.forEach((button) => {
        button.dataset.loopMode = state.loop;
        button.setAttribute("aria-label", `循环模式：${labels[state.loop]}。点击切换`);
        const mark = $(".loop-button__mark", button);
        if (mark) mark.textContent = marks[state.loop];
      });
    }

    function persistState() {
      saveStoredState({
        track: currentTrack().file,
        loop: state.loop,
        volume: state.volume,
        muted: state.muted
      });
    }

    function updateMediaSession() {
      if (!("mediaSession" in navigator)) return;
      try {
        if ("MediaMetadata" in window) {
          const metadata = {
            title: currentTrack().title,
            artist: SITE_CONFIG.album.artist,
            album: SITE_CONFIG.album.title
          };
          /* file:// URLs are not valid MediaImage sources in Chromium. */
          if (/^https?:$/.test(window.location.protocol)) {
            metadata.artwork = [
              {
                src: resolveImage(SITE_CONFIG.assets.sound.cover),
                sizes: "1024x1024",
                type: "image/webp"
              }
            ];
          }
          navigator.mediaSession.metadata = new MediaMetadata(metadata);
        }
        navigator.mediaSession.setActionHandler("play", () => audio.play().catch(handlePlayError));
        navigator.mediaSession.setActionHandler("pause", () => audio.pause());
        navigator.mediaSession.setActionHandler("previoustrack", () => changeTrack(-1, true));
        navigator.mediaSession.setActionHandler("nexttrack", () => changeTrack(1, true));
      } catch (error) {
        /* Media Session is an enhancement only. */
      }
    }

    function handlePlayError(error) {
      syncPlayState();
      if (error && error.name === "AbortError") return;
      setStatus("无法开始播放。请检查音频文件与浏览器权限。");
    }

    function loadTrack(index, { autoplay = false, showError = true } = {}) {
      if (!tracks.length) return;
      state.index = (index + tracks.length) % tracks.length;
      setStatus("");
      audio.pause();
      if (playerShell) playerShell.classList.remove("has-error");
      audio.src = resolveAudio(currentTrack().file);
      audio.load();
      syncTrackUI();
      syncProgressUI();
      if (autoplay) {
        audio.play().catch((error) => {
          if (showError) handlePlayError(error);
        });
      }
      persistState();
    }

    function changeTrack(direction, autoplay = true) {
      loadTrack(state.index + direction, { autoplay });
    }

    function togglePlayback() {
      if (audio.paused) {
        audio.play().catch(handlePlayError);
      } else {
        audio.pause();
      }
    }

    function renderTrackList() {
      if (!trackList) return;
      const fragment = document.createDocumentFragment();
      tracks.forEach((track, index) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "track-button";
        button.dataset.trackIndex = String(index);
        button.setAttribute("aria-label", `播放 ${track.title}`);
        button.innerHTML = `
          <span class="track-button__num">${pad(index + 1)}</span>
          <span class="track-button__title"></span>
          <span class="track-button__bars" aria-hidden="true"><i></i><i></i><i></i></span>
        `;
        $(".track-button__title", button).textContent = track.title;
        button.addEventListener("click", () => {
          if (index === state.index) {
            togglePlayback();
          } else {
            loadTrack(index, { autoplay: true });
          }
        });
        item.appendChild(button);
        fragment.appendChild(item);
      });
      trackList.replaceChildren(fragment);
    }

    function scrollCurrentTrackIntoView() {
      if (!trackList) return;
      const active = $(`[data-track-index="${state.index}"]`, trackList);
      if (!active) return;
      const activeRect = active.getBoundingClientRect();
      const listRect = trackList.getBoundingClientRect();
      const relativeTop = activeRect.top - listRect.top + trackList.scrollTop;
      const target = relativeTop - trackList.clientHeight / 2 + activeRect.height / 2;
      trackList.scrollTo({ top: Math.max(0, target), behavior: reducedMotion ? "auto" : "smooth" });
    }

    function openArchive(trigger) {
      if (!archive) return;
      if (archive.open) return;
      state.archiveOpen = true;
      state.trigger = trigger || document.activeElement;
      if (typeof archive.showModal === "function") archive.showModal();
      else archive.setAttribute("open", "");
      document.body.classList.add("is-locked", "is-modal-open");
      window.setTimeout(scrollCurrentTrackIntoView, 120);
    }

    function closeArchive() {
      if (!archive) return;
      if (typeof archive.close === "function" && archive.open) archive.close();
      else archive.removeAttribute("open");
      document.body.classList.remove("is-locked", "is-modal-open");
      if (state.trigger && typeof state.trigger.focus === "function") {
        window.setTimeout(() => state.trigger.focus({ preventScroll: true }), 20);
      }
      state.archiveOpen = false;
    }

    renderTrackList();
    audio.volume = state.volume;
    audio.muted = state.muted;
    audio.src = resolveAudio(currentTrack().file);
    audio.load();
    syncTrackUI();
    syncProgressUI();
    syncVolumeUI();
    syncLoopUI();

    openNodes.forEach((button) => {
      button.setAttribute("aria-haspopup", "dialog");
      button.setAttribute("aria-controls", "sound-archive");
      button.addEventListener("click", () => openArchive(button));
    });
    if (closeNode) closeNode.addEventListener("click", closeArchive);
    if (archive) {
      archive.addEventListener("click", (event) => {
        if (event.target === archive) closeArchive();
      });
      archive.addEventListener("close", () => {
        document.body.classList.remove("is-locked", "is-modal-open");
        if (state.trigger && typeof state.trigger.focus === "function") {
          window.setTimeout(() => state.trigger.focus({ preventScroll: true }), 20);
        }
        state.archiveOpen = false;
      });
    }

    seekNodes.forEach((input) => {
      const beginSeeking = () => {
        state.isSeeking = true;
      };
      const endSeeking = () => {
        if (!state.isSeeking) return;
        state.isSeeking = false;
        if (Number.isFinite(audio.duration)) {
          audio.currentTime = clamp(Number(input.value), 0, audio.duration);
        }
        syncProgressUI();
      };
      input.addEventListener("pointerdown", beginSeeking);
      input.addEventListener("input", () => {
        if (Number.isFinite(audio.duration)) {
          const value = clamp(Number(input.value), 0, audio.duration);
          audio.currentTime = value;
          const percent = audio.duration ? (value / audio.duration) * 100 : 0;
          seekNodes.forEach((seek) => setRangeFill(seek, percent));
          $$("[data-audio-current]").forEach((node) => {
            node.textContent = formatTime(value);
          });
        }
      });
      input.addEventListener("change", endSeeking);
      input.addEventListener("pointerup", endSeeking);
      input.addEventListener("keyup", (event) => {
        if (["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(event.key)) endSeeking();
      });
    });

    volumeNodes.forEach((input) => {
      input.addEventListener("input", () => {
        state.volume = clamp(Number(input.value), 0, 1);
        state.muted = false;
        if (state.volume > 0) state.lastVolume = state.volume;
        audio.volume = state.volume;
        audio.muted = false;
        syncVolumeUI();
        syncPlayState();
        persistState();
      });
    });

    muteNodes.forEach((button) => {
      button.addEventListener("click", () => {
        state.muted = !state.muted;
        if (!state.muted && state.volume === 0) {
          state.volume = state.lastVolume || 0.4;
          audio.volume = state.volume;
        }
        audio.muted = state.muted;
        syncVolumeUI();
        persistState();
      });
    });

    loopNodes.forEach((button) => {
      button.addEventListener("click", () => {
        const order = ["all", "one", "off"];
        state.loop = order[(order.indexOf(state.loop) + 1) % order.length];
        syncLoopUI();
        persistState();
      });
    });

    toggleNodes.forEach((button) => {
      button.addEventListener("click", togglePlayback);
    });

    $$("[data-audio-prev]").forEach((button) => {
      button.addEventListener("click", () => changeTrack(-1, true));
    });
    $$("[data-audio-next]").forEach((button) => {
      button.addEventListener("click", () => changeTrack(1, true));
    });

    const initialPlayButton = $("[data-play-initial]");
    if (initialPlayButton) {
      initialPlayButton.addEventListener("click", () => {
        const defaultIndex = Math.max(0, configuredInitial);
        if (state.index !== defaultIndex) {
          loadTrack(defaultIndex, { autoplay: true });
        } else {
          audio.play().catch(handlePlayError);
        }
      });
    }

    $$("[data-play-track]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = tracks.findIndex((track) => track.file === button.dataset.playTrack);
        if (index < 0) {
          setStatus("没有找到这首曲目。");
          return;
        }
        loadTrack(index, { autoplay: true });
      });
    });

    if (dockCollapse && dock) {
      let userToggledDock = false;
      let autoCollapsedDock = false;

      const setDockCollapsed = (collapsed, manual = false) => {
        dock.classList.toggle("is-collapsed", collapsed);
        dockCollapse.setAttribute("aria-label", collapsed ? "展开播放器" : "收起播放器");
        if (manual) userToggledDock = true;
      };

      dockCollapse.addEventListener("click", () => {
        setDockCollapsed(!dock.classList.contains("is-collapsed"), true);
      });

      /* The hero opens with the full capsule; once the story begins,
         it retracts to a small vinyl button so it never sits on the prose. */
      const maybeCompactDock = () => {
        if (userToggledDock || autoCollapsedDock) return;
        if (window.scrollY > window.innerHeight * 0.82) {
          autoCollapsedDock = true;
          setDockCollapsed(true);
        }
      };
      window.addEventListener("scroll", maybeCompactDock, { passive: true });
      maybeCompactDock();
    }

    audio.addEventListener("play", () => {
      setStatus("");
      syncPlayState();
    });
    audio.addEventListener("pause", syncPlayState);
    audio.addEventListener("loadedmetadata", () => {
      syncProgressUI();
    });
    audio.addEventListener("durationchange", syncProgressUI);
    audio.addEventListener("timeupdate", syncProgressUI);
    audio.addEventListener("ended", () => {
      if (state.loop === "one") {
        audio.currentTime = 0;
        audio.play().catch(handlePlayError);
        return;
      }
      if (state.loop === "all") {
        changeTrack(1, true);
        return;
      }
      syncPlayState();
      syncProgressUI();
    });
    audio.addEventListener("error", () => {
      if (!audio.getAttribute("src")) return;
      if (playerShell) playerShell.classList.add("has-error");
      setStatus(`音源未能载入：${currentTrack().file}。请检查素材路径。`);
      syncPlayState();
    });

    return {
      openArchive,
      closeArchive,
      player: audio
    };
  }

  /* ───────────────────────────── the final theater ───────────────────────── */

  /*
   * 終幕对白：引自《eden*》原作最终场景的中文译文，仅用于本站的非商业纪念。
   * scene 0 = 黄昏山丘 / scene 1 = 沉睡前 / scene 2 = 星夜。
   * 逐句推进，点击画面、空格或回车均可翻页。
   */
  const finaleLines = [
    { scene: 0, speaker: "亮", speakerJp: "リョウ", text: "已经快晚上了。风都有点冷了……" },
    { scene: 0, speaker: "诗音", speakerJp: "シオン", text: "我想稍微在这里再呆一会……" },
    {
      scene: 0,
      speaker: "亮",
      speakerJp: "リョウ",
      text: "啊，可以哦。如果困了的话睡觉也没关系哦，我会好好的把你背回家的"
    },
    { scene: 0, speaker: "诗音", speakerJp: "シオン", text: "谢谢。不过，已经没那个必要了……" },
    { scene: 0, speaker: "亮", speakerJp: "リョウ", text: "……怎么了？" },
    {
      scene: 0,
      speaker: "旁白",
      speakerJp: "語り",
      text: "想走着回去吗。但是，那种体力不允许吧。",
      narration: true
    },
    {
      scene: 0,
      speaker: "诗音",
      speakerJp: "シオン",
      text: "我已经，差不多必须要走了……马上……要睡了……深深的……睡……"
    },
    { scene: 0, speaker: "亮", speakerJp: "リョウ", text: "是……吗……" },
    {
      scene: 1,
      speaker: "旁白",
      speakerJp: "語り",
      text: "就算不听下去，我也明白了诗音说的意思。她，明白了。自己的事情，她比任何人都清楚的明白。",
      narration: true
    },
    { scene: 1, speaker: "诗音", speakerJp: "シオン", text: "对不起……要把亮……一个人丢下……" },
    {
      scene: 1,
      speaker: "亮",
      speakerJp: "リョウ",
      text: "我绝对会遵守……和你的约定。因为我正是为此……留在这里……"
    },
    {
      scene: 1,
      speaker: "旁白",
      speakerJp: "語り",
      text: "诗音微弱地微笑着，从口袋里取出装有戒指的小盒子。",
      narration: true
    },
    { scene: 1, speaker: "亮", speakerJp: "リョウ", text: "你一直带着吗" },
    { scene: 1, speaker: "诗音", speakerJp: "シオン", text: "嗯，总有……这种预感……" },
    { scene: 1, speaker: "亮", speakerJp: "リョウ", text: "这也一起……？" },
    {
      scene: 1,
      speaker: "旁白",
      speakerJp: "語り",
      text: "诗音沉默地点头，递出小盒子。我点着头收下。",
      narration: true
    },
    { scene: 1, speaker: "诗音", speakerJp: "シオン", text: "谢谢你，亮……真的，谢谢你……" },
    {
      scene: 1,
      speaker: "旁白",
      speakerJp: "語り",
      text: "又是“对不起”和“谢谢”一类的。但是，我想听的不是这个。我想看的，不是这种悲伤的笑容……",
      narration: true
    },
    { scene: 1, speaker: "诗音", speakerJp: "シオン", text: "啊……已经……不能再这样说话了……" },
    {
      scene: 1,
      speaker: "亮",
      speakerJp: "リョウ",
      text: "什么都可以……说吧。让我……多听一点你的声音……"
    },
    {
      scene: 1,
      speaker: "诗音",
      speakerJp: "シオン",
      text: "嗯……亮……我也……我也想……和亮多说……不想做梦……只要和亮在一起……就算谁都不在，只要有亮……"
    },
    {
      scene: 1,
      speaker: "旁白",
      speakerJp: "語り",
      text: "她的泪水无法停住。什么都做不到 —— 除了拭去她的泪水，什么都做不到。",
      narration: true
    },
    { scene: 1, speaker: "诗音", speakerJp: "シオン", text: "我讨厌……这种最后……" },
    { scene: 1, speaker: "亮", speakerJp: "リョウ", text: "我在这里，诗音不是也还在这里吗" },
    { scene: 1, speaker: "诗音", speakerJp: "シオン", text: "永远……在亮的身边……" },
    {
      scene: 1,
      speaker: "旁白",
      speakerJp: "語り",
      text: "丝丝细语随风消散，毫无踪迹。在夕阳下，万物即将消失……",
      narration: true
    },
    {
      scene: 1,
      speaker: "诗音",
      speakerJp: "シオン",
      text: "煎鸡蛋，做不出来了……对不起……我的任性……对不起……不能陪伴你到最后……对不起……"
    },
    { scene: 1, speaker: "亮", speakerJp: "リョウ", text: "可以了。可以了，诗音……" },
    {
      scene: 1,
      speaker: "旁白",
      speakerJp: "語り",
      text: "每次听到这种颤抖的声音，就觉得心里有什么在崩溃。从她身上消失的生命之光，同时也在一点点进入我的心里。就算如此，我还是对她微笑。",
      narration: true
    },
    { scene: 1, speaker: "亮", speakerJp: "リョウ", text: "我会陪着你的，永远，在诗音身边" },
    {
      scene: 1,
      speaker: "诗音",
      speakerJp: "シオン",
      text: "嗯……我也……我的心，绝对不会离开亮。永远，在亮身边……"
    },
    { scene: 1, speaker: "亮", speakerJp: "リョウ", text: "嗯……" },
    {
      scene: 1,
      speaker: "旁白",
      speakerJp: "語り",
      text: "是啊，已经没有任何需要道歉的事情了。因为在这个乐园里，我们单独两人的时间 —— 会永远继续。",
      narration: true
    },
    {
      scene: 1,
      speaker: "诗音",
      speakerJp: "シオン",
      text: "如果……如果，能再一次醒来的话……两人……一起……"
    }
  ];

  /* 终幕钟点：随对白从 18:47 缓慢走向 19:58。 */
  finaleLines.forEach((line, index) => {
    if (line.time) return;
    const last = finaleLines.length - 1;
    const minutes = 18 * 60 + 47 + (last ? Math.round((71 * index) / last) : 0);
    line.time = `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  });

  function createFinale() {
    const theater = $("[data-theater]");
    if (!theater) return;

    const startPanel = $("[data-theater-start]");
    const beginButton = $("[data-theater-begin]");
    const playPanel = $("[data-theater-play]");
    const hud = $("[data-theater-hud]");
    const hudTime = $(".theater__hud-time");
    const sceneIndexLabel = $("[data-scene-index]");
    const speaker = $("[data-speaker]");
    const speakerJp = $("[data-speaker-jp]");
    const counter = $("[data-dialogue-counter]");
    const typed = $("[data-typed-text]");
    const lineLive = $("[data-line-live]");
    const lineTranslation = $("[data-line-jp]");
    const textWrap = $(".dialogue__text");
    const dotsWrap = $("[data-dialogue-dots]");
    const nextButton = $("[data-theater-next]");
    const nextLabel = $("[data-next-label]");
    const autoButton = $("[data-theater-auto]");
    const endPanel = $("[data-theater-end]");
    const replayButton = $("[data-theater-replay]");
    const dialogue = $(".dialogue");
    const scenes = $$(".theater__scene", theater);
    const sceneNames = ["THE LAST SUNSET", "BEFORE SLEEP", "UNDER THE STARS"];

    if (!startPanel || !beginButton || !playPanel || !typed || !nextButton) return;

    const state = {
      started: false,
      index: 0,
      charIndex: 0,
      typing: false,
      lineComplete: false,
      auto: false,
      completed: false,
      typeTimer: 0,
      autoTimer: 0,
      focusTimer: 0
    };

    if (dotsWrap) {
      finaleLines.forEach((line, index) => {
        const dot = document.createElement("i");
        dot.dataset.dotIndex = String(index);
        dot.className = index === 0 ? "is-current" : "";
        dotsWrap.appendChild(dot);
      });
    }

    const preloadScenes = () => {
      scenes.forEach((scene) => {
        const image = $("img", scene);
        if (image) image.loading = "eager";
      });
    };

    if ("IntersectionObserver" in window) {
      const preloadObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            preloadScenes();
            preloadObserver.disconnect();
          }
        },
        { rootMargin: "1100px 0px" }
      );
      preloadObserver.observe(theater);
    } else {
      preloadScenes();
    }

    const updateDots = () => {
      if (!dotsWrap) return;
      $$("[data-dot-index]", dotsWrap).forEach((dot) => {
        const index = Number(dot.dataset.dotIndex);
        dot.classList.toggle("is-current", index === state.index);
        dot.classList.toggle("is-done", index < state.index);
      });
    };

    const updateScenes = (sceneId) => {
      scenes.forEach((scene) => {
        scene.classList.toggle("is-visible", Number(scene.dataset.scene) === sceneId);
      });
      if (sceneIndexLabel) {
        sceneIndexLabel.textContent = `SCENE ${pad(sceneId + 1)} / ${pad(scenes.length)}`;
      }
      if (hudTime) {
        hudTime.textContent = `${sceneNames[sceneId] || "THE LAST SUNSET"} — ${finaleLines[state.index].time}`;
      }
    };

    const clearTypeTimer = () => {
      window.clearTimeout(state.typeTimer);
      state.typeTimer = 0;
    };

    const clearAutoTimer = () => {
      window.clearTimeout(state.autoTimer);
      state.autoTimer = 0;
    };

    const scheduleAuto = () => {
      clearAutoTimer();
      if (!state.auto || state.completed || !state.lineComplete) return;
      const line = finaleLines[state.index];
      const hold = 2200 + Math.min(2800, Array.from(line.text).length * 34);
      state.autoTimer = window.setTimeout(() => {
        if (!state.auto || !state.started) return;
        advance();
      }, hold);
    };

    const setComplete = () => {
      const line = finaleLines[state.index];
      clearTypeTimer();
      state.typing = false;
      state.lineComplete = true;
      typed.textContent = line.text;
      lineLive.textContent = line.text;
      textWrap.classList.add("is-complete");
      nextLabel.textContent = state.index >= finaleLines.length - 1 ? "落幕" : "下一句";
      scheduleAuto();
    };

    const typeLine = () => {
      const line = finaleLines[state.index];
      const characters = Array.from(line.text);
      state.charIndex = 0;
      state.typing = true;
      state.lineComplete = false;
      typed.textContent = "";
      lineLive.textContent = "";
      textWrap.classList.remove("is-complete");
      nextLabel.textContent = "显示全句";

      if (reducedMotion) {
        setComplete();
        return;
      }

      const step = () => {
        if (!state.typing) return;
        if (state.charIndex >= characters.length) {
          setComplete();
          return;
        }
        const character = characters[state.charIndex];
        typed.textContent += character;
        state.charIndex += 1;
        let delay = 29;
        if ("，、；：".includes(character)) delay = 130;
        else if ("。！？…".includes(character)) delay = 260;
        else if (character === "—") delay = 180;
        state.typeTimer = window.setTimeout(step, delay);
      };

      state.typeTimer = window.setTimeout(step, 180);
    };

    const setSceneForLine = () => {
      const line = finaleLines[state.index];
      updateScenes(line.scene);
    };

    const renderLine = () => {
      clearTypeTimer();
      clearAutoTimer();
      const line = finaleLines[state.index];
      state.lineComplete = false;
      state.typing = false;
      speaker.textContent = line.speaker;
      if (speakerJp) speakerJp.textContent = line.speakerJp;
      if (lineTranslation) lineTranslation.textContent = line.jp || "";
      counter.textContent = `${pad(state.index + 1)} — ${pad(finaleLines.length)}`;
      textWrap.classList.toggle("is-narration", Boolean(line.narration));
      updateDots();
      setSceneForLine();
      typeLine();
    };

    const finishFinale = () => {
      if (state.completed) return;
      clearTypeTimer();
      clearAutoTimer();
      state.typing = false;
      state.lineComplete = true;
      state.completed = true;
      nextLabel.textContent = "落幕";
      playPanel.classList.add("is-finished");
      updateScenes(2);
      if (hud && sceneIndexLabel) sceneIndexLabel.textContent = "THE END";
      endPanel.hidden = false;
      window.requestAnimationFrame(() => {
        endPanel.classList.add("is-visible");
        endPanel.tabIndex = -1;
        endPanel.focus({ preventScroll: true });
      });
      window.setTimeout(() => {
        playPanel.hidden = true;
        playPanel.classList.remove("is-finished");
      }, 700);
    };

    const advance = () => {
      if (!state.started) return;
      if (state.completed) return;
      if (state.typing) {
        setComplete();
        return;
      }
      if (state.index < finaleLines.length - 1) {
        state.index += 1;
        renderLine();
        return;
      }
      finishFinale();
    };

    const start = () => {
      if (state.started && !state.completed) return;
      preloadScenes();
      state.started = true;
      state.completed = false;
      state.index = 0;
      state.auto = false;
      autoButton.setAttribute("aria-pressed", "false");
      state.lineComplete = false;
      theater.classList.add("is-started");
      beginButton.disabled = true;
      startPanel.setAttribute("aria-hidden", "true");
      if (hud) hud.hidden = false;
      playPanel.hidden = false;
      playPanel.classList.remove("is-finished");
      endPanel.hidden = true;
      endPanel.classList.remove("is-visible");
      document.body.classList.add("is-theater-active");
      renderLine();
      window.clearTimeout(state.focusTimer);
      state.focusTimer = window.setTimeout(() => {
        nextButton.focus({ preventScroll: true });
      }, 450);
    };

    const replay = () => {
      clearTypeTimer();
      clearAutoTimer();
      theater.classList.add("is-started");
      beginButton.disabled = true;
      startPanel.setAttribute("aria-hidden", "true");
      if (hud) hud.hidden = false;
      playPanel.hidden = false;
      playPanel.classList.remove("is-finished");
      endPanel.classList.remove("is-visible");
      endPanel.hidden = true;
      state.started = true;
      state.completed = false;
      state.index = 0;
      state.auto = false;
      state.lineComplete = false;
      autoButton.setAttribute("aria-pressed", "false");
      document.body.classList.add("is-theater-active");
      renderLine();
      window.setTimeout(() => nextButton.focus({ preventScroll: true }), 250);
    };

    beginButton.addEventListener("click", start);
    nextButton.addEventListener("click", advance);
    replayButton.addEventListener("click", replay);
    autoButton.addEventListener("click", () => {
      state.auto = !state.auto;
      autoButton.setAttribute("aria-pressed", String(state.auto));
      if (state.auto && state.lineComplete) scheduleAuto();
      else clearAutoTimer();
    });

    if (dialogue) {
      dialogue.addEventListener("click", (event) => {
        if (event.target.closest("button, a, input")) return;
        if (!state.started || state.completed) return;
        advance();
      });
    }

    theater.addEventListener("keydown", (event) => {
      const interactive = event.target.closest("button, a, input");
      if (interactive) return;
      if (event.key === " " || event.key === "Enter" || event.key === "ArrowRight") {
        event.preventDefault();
        advance();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearAutoTimer();
      } else if (state.auto && state.lineComplete && !state.completed) {
        scheduleAuto();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!state.started || state.completed) return;
      if (!document.body.classList.contains("is-theater-active")) return;
      if (document.body.classList.contains("is-locked")) return;
      if (document.activeElement && document.activeElement.closest("button, a, input, dialog")) return;
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        advance();
      }
    });

    if ("IntersectionObserver" in window) {
      const stageObserver = new IntersectionObserver(
        (entries) => {
          if (!state.started) return;
          const entry = entries[0];
          document.body.classList.toggle("is-theater-active", entry.isIntersecting);
        },
        { threshold: 0.22 }
      );
      stageObserver.observe(theater);
    }
  }

  /* ───────────────────────────── field & epilogue wishes ─────────────────── */

  function createSmallRituals(ambient) {
    const windButton = $("[data-wind]");
    if (windButton) {
      let resetTimer = 0;
      const caption = $(".wind-button__text", windButton);
      const originalText = caption ? caption.firstChild?.textContent : "";
      windButton.addEventListener("click", () => {
        if (ambient) ambient.gust();
        windButton.classList.remove("is-gusting");
        void windButton.offsetWidth;
        windButton.classList.add("is-gusting");
        if (caption && caption.firstChild && caption.firstChild.nodeType === Node.TEXT_NODE) {
          caption.firstChild.textContent = "风起了";
          window.clearTimeout(resetTimer);
          resetTimer = window.setTimeout(() => {
            if (caption.firstChild) caption.firstChild.textContent = originalText;
          }, 1500);
        }
      });
    }

    const lightButton = $("[data-leave-light]");
    const lightStatus = $("[data-light-status]");
    if (lightButton) {
      lightButton.addEventListener("click", () => {
        lightButton.classList.remove("is-lit");
        void lightButton.offsetWidth;
        lightButton.classList.add("is-lit");
        if (ambient) ambient.shootStar(true);
        if (lightStatus) {
          lightStatus.textContent = "一束光，已经抵达星海。";
        }
      });
    }
  }

  /* ───────────────────────────── boot ────────────────────────────────────── */

  function init() {
    hydrateAssets();
    prepareReveals();

    let ambient = null;
    safe("ambient", () => {
      ambient = createAmbientWorld();
    });

    let player = null;
    safe("audio player", () => {
      player = createAudioPlayer(ambient);
    });

    safe("scroll director", () => {
      createScrollDirector(ambient);
    });
    safe("cursor halo", createCursorHalo);
    safe("hero tilt", createHeroTilt);
    safe("navigation", createNavigation);
    safe("finale", createFinale);
    safe("small rituals", () => createSmallRituals(ambient));

    runPreloader()
      .catch(() => {
        hidePreloader();
      })
      .finally(() => {
        startReveals();
        window.setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 250);
      });

    if (player && player.player) {
      player.player.addEventListener("loadeddata", () => {
        window.dispatchEvent(new Event("resize"));
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
