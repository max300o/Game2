/**
 * ============================================================
 *  GAME ENGINE – The Fall of Angels (Ultimate Edition)
 *  با منو، تنظیمات، ۶ تم، افکت تایپ، ذخیره‌سازی پیشرفته
 * ============================================================
 */

'use strict';

// ─── متغیرهای سراسری ────────────────────────────────────────────
let currentLanguage = 'fa';
let currentTheme = 'noir';
let typingSpeed = 40;
let game = null;
let currentStory = typeof STORY_FA !== 'undefined' ? STORY_FA : STORY;

// لیست تم‌ها
const THEMES = ['noir', 'blood', 'retro', 'ice', 'silver', 'royal'];
let themeIndex = 0;

// ─── کلاس Game ──────────────────────────────────────────────────
class Game {
  constructor() {
    this.state = null;
    this.storyData = currentStory;
    this.isTyping = false;
    this.typingTimer = null;
  }

  // ── تنظیم تم ──────────────────────────────────────────────────
  setTheme(themeName) {
    document.body.classList.remove(...THEMES.map(t => `theme-${t}`));
    document.body.classList.add(`theme-${themeName}`);
    currentTheme = themeName;
    if (this.state) {
      this.state.theme = themeName;
      this._save();
    }
    // به‌روزرسانی دکمه‌های تنظیمات
    document.querySelectorAll('.setting-btn[data-theme]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeName);
    });
  }

  // ── تنظیم زبان ──────────────────────────────────────────────────
  setLanguage(lang) {
    currentLanguage = lang;
    currentStory = (lang === 'en') ? STORY_EN : STORY_FA;
    this.storyData = currentStory;
    this._updateUIStrings();
    // به‌روزرسانی دکمه‌های تنظیمات
    document.querySelectorAll('.setting-btn[data-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    if (this.state) {
      this.state.language = lang;
      this._save();
    }
    this.reset();
  }

  // ── به‌روزرسانی متن‌های UI ──────────────────────────────────
  _updateUIStrings() {
    const isEn = currentLanguage === 'en';
    document.getElementById('case-id').textContent = isEn ? 'CASE FILE #011' : 'پرونده #۰۱۱';
    document.getElementById('main-title').textContent = isEn ? 'The Fall of Angels' : 'سقوط فرشته‌ها';
    document.getElementById('subtitle').textContent = isEn ? '— A Noir Detective Story —' : '— داستانی کارآگاهی نوآر —';
    document.getElementById('status-text').textContent = isEn ? 'ACTIVE' : 'فعال';
    document.getElementById('lang-label').textContent = isEn ? 'Fa' : 'En';
    document.getElementById('menu-new-game').textContent = isEn ? 'New Game' : 'شروع بازی جدید';
    document.getElementById('menu-continue').textContent = isEn ? 'Continue' : 'ادامه بازی';
    document.getElementById('menu-settings').textContent = isEn ? 'Settings' : 'تنظیمات';
    document.querySelector('.logo-title').textContent = isEn ? 'The Fall of Angels' : 'سقوط فرشته‌ها';
    document.querySelector('.logo-sub').textContent = isEn ? '— Case File #011 —' : '— پرونده‌ی سقوط فرشته‌ها —';
  }

  // ── مقداردهی اولیه ────────────────────────────────────────────
  initGame() {
    const saved = this._load();
    if (saved) {
      this.state = saved;
      if (saved.theme) this.setTheme(saved.theme);
      if (saved.language) {
        currentLanguage = saved.language;
        currentStory = (saved.language === 'en') ? STORY_EN : STORY_FA;
        this.storyData = currentStory;
        this._updateUIStrings();
      }
    } else {
      this.state = this._getInitialState();
      this.setTheme('noir');
    }
    // نمایش منو اگر بازی جدیدی شروع نشده
    if (!this.state || !this.state.gameStarted) {
      this.showMenu();
    } else {
      this.hideMenu();
      this.renderScene(this.state.currentScene);
    }
  }

  // ── نمایش منو ──────────────────────────────────────────────────
  showMenu() {
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('game-header').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('game-footer').style.display = 'none';
  }

  // ── مخفی کردن منو ──────────────────────────────────────────────
  hideMenu() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-header').style.display = 'flex';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('game-footer').style.display = 'flex';
  }

  // ── شروع بازی جدید ────────────────────────────────────────────
  startNewGame() {
    this.state = this._getInitialState();
    this.state.gameStarted = true;
    this.storyData = currentStory;
    this.hideMenu();
    this.renderScene('intro');
    this._save();
  }

  // ── ادامه بازی ──────────────────────────────────────────────────
  continueGame() {
    const saved = this._load();
    if (saved && saved.gameStarted) {
      this.state = saved;
      this.storyData = currentStory;
      this.hideMenu();
      if (saved.theme) this.setTheme(saved.theme);
      this.renderScene(this.state.currentScene);
    } else {
      this.startNewGame();
    }
  }

  // ── ریست ──────────────────────────────────────────────────────
  reset() {
    this.state = this._getInitialState();
    this.state.gameStarted = true;
    this.storyData = currentStory;
    this.hideMenu();
    this.renderScene('intro');
    this._save();
  }

  // ── رندر صحنه ────────────────────────────────────────────────
  renderScene(sceneId) {
    const scene = this.storyData[sceneId];
    if (!scene) {
      console.error(`Scene not found: ${sceneId}`);
      return;
    }

    if (!this.state.history.includes(sceneId)) {
      this.state.history.push(sceneId);
    }
    this.state.currentScene = sceneId;
    this._save();

    if (scene.isEnding) {
      this.showEnding(scene);
      return;
    }

    const container = document.getElementById('game-container');
    if (!container) return;

    const narrativeText = scene.text.join('\n');

    const choicesHtml = scene.choices.length > 0
      ? scene.choices.map((choice, idx) =>
          `<button class="choice-btn" data-scene="${sceneId}" data-choice="${idx}">
            ${choice.label}
           </button>`
        ).join('')
      : '<p class="no-choices">[ پایان صحنه ]</p>';

    container.innerHTML = `
      <div class="scene" role="main">
        <pre class="narrative" id="narrative-text">${this._escapeHtml(narrativeText)}</pre>
        <div class="choices" id="choices-container" style="display:none;">${choicesHtml}</div>
      </div>
    `;

    // افکت تایپ
    this._typeWriter('narrative-text', () => {
      document.getElementById('choices-container').style.display = 'flex';
      this._attachChoiceListeners(sceneId);
    });

    container.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── افکت تایپ ──────────────────────────────────────────────────
  _typeWriter(elementId, callback) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    this.isTyping = true;
    let index = 0;
    const speed = 200 - typingSpeed; // 10 → 190ms, 100 → 100ms

    if (this.typingTimer) clearInterval(this.typingTimer);

    this.typingTimer = setInterval(() => {
      if (index < text.length) {
        el.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(this.typingTimer);
        this.isTyping = false;
        if (callback) callback();
      }
    }, Math.max(10, speed));
  }

  // ── اتصال رویدادهای انتخاب ──────────────────────────────────
  _attachChoiceListeners(sceneId) {
    document.querySelectorAll('.choice-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.isTyping) return;
        const choiceIdx = parseInt(btn.dataset.choice, 10);
        this.makeChoice(sceneId, choiceIdx);
      });
    });
  }

  // ── انتخاب ────────────────────────────────────────────────────
  makeChoice(sceneId, choiceIndex) {
    const scene = this.storyData[sceneId];
    if (!scene) return;

    const choice = scene.choices[choiceIndex];
    if (!choice) return;

    this.state.choicesMade[sceneId] = choiceIndex;

    if (choice.params) {
      for (const [param, delta] of Object.entries(choice.params)) {
        if (this.state.params.hasOwnProperty(param)) {
          this.state.params[param] += delta;
        }
      }
    }

    this._save();
    this.renderScene(choice.next);
  }

  // ── نمایش پایان ──────────────────────────────────────────────
  showEnding(scene) {
    const p = this.state.params;
    const profile = this._findProfile(p);
    const sceneText = scene.text.join('\n');

    const container = document.getElementById('game-container');
    if (!container) return;

    container.innerHTML = `
      <div class="scene ending">
        <pre class="narrative">${this._escapeHtml(sceneText)}</pre>
        <div class="profile-card">
          <div class="profile-title">━━━━━━━━━━━━━━━━━━━━━</div>
          <div class="profile-title">${currentLanguage === 'en' ? "William's Profile" : 'پروفایل ویلیام'}</div>
          <div class="profile-title">━━━━━━━━━━━━━━━━━━━━━</div>
          <div class="profile-label">${profile.label}</div>
          <div class="profile-text">${profile.text}</div>
        </div>
        <div class="choices">
          <button class="choice-btn restart-btn" id="restart-btn">${currentLanguage === 'en' ? 'Start Over' : 'شروع دوباره'}</button>
        </div>
      </div>
    `;

    document.getElementById('restart-btn')?.addEventListener('click', () => {
      this.reset();
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── یافتن پروفایل ────────────────────────────────────────────
  _findProfile(params) {
    for (const pr of PROFILES) {
      if (pr.condition(params)) return pr;
    }
    return PROFILES[PROFILES.length - 1];
  }

  // ── وضعیت اولیه ──────────────────────────────────────────────
  _getInitialState() {
    return {
      currentScene: 'intro',
      params: { justice: 0, empathy: 0, pragmatism: 0, doubt: 0, resolve: 0 },
      history: [],
      choicesMade: {},
      theme: 'noir',
      language: 'fa',
      gameStarted: false,
    };
  }

  // ── ذخیره ────────────────────────────────────────────────────
  _save() {
    try {
      localStorage.setItem('fallen_angels_save', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Save failed:', e);
    }
  }

  // ── بارگذاری ─────────────────────────────────────────────────
  _load() {
    try {
      const raw = localStorage.getItem('fallen_angels_save');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed.currentScene || !parsed.params) return null;
      return parsed;
    } catch (e) {
      console.warn('Load failed:', e);
      return null;
    }
  }

  // ── امن‌سازی HTML ────────────────────────────────────────────
  _escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// ─── توابع تغییر زبان و تم ─────────────────────────────────────

// تغییر زبان
function switchLanguage() {
  const btn = document.getElementById('lang-switch');
  btn.classList.add('switching');

  const newLang = currentLanguage === 'fa' ? 'en' : 'fa';
  if (game) {
    game.setLanguage(newLang);
  }

  setTimeout(() => {
    btn.classList.remove('switching');
  }, 600);
}

// تغییر تم (چرخشی)
function switchTheme() {
  themeIndex = (themeIndex + 1) % THEMES.length;
  const newTheme = THEMES[themeIndex];
  if (game) {
    game.setTheme(newTheme);
  } else {
    document.body.classList.remove(...THEMES.map(t => `theme-${t}`));
    document.body.classList.add(`theme-${newTheme}`);
  }
}

// ─── تنظیمات ─────────────────────────────────────────────────────
function toggleSettings() {
  const overlay = document.getElementById('settings-overlay');
  overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none';
}

function closeSettings() {
  document.getElementById('settings-overlay').style.display = 'none';
}

// ─── راه‌اندازی ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // نمونه بازی
  game = new Game();
  game.initGame();

  // دکمه‌های منو
  document.getElementById('menu-new-game')?.addEventListener('click', () => {
    game.startNewGame();
  });

  document.getElementById('menu-continue')?.addEventListener('click', () => {
    game.continueGame();
  });

  document.getElementById('menu-settings')?.addEventListener('click', toggleSettings);
  document.getElementById('settings-close')?.addEventListener('click', closeSettings);
  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    document.getElementById('main-menu').classList.toggle('hidden');
  });

  // دکمه‌های تنظیمات – زبان
  document.querySelectorAll('.setting-btn[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (game) game.setLanguage(lang);
    });
  });

  // دکمه‌های تنظیمات – تم
  document.querySelectorAll('.setting-btn[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      if (game) game.setTheme(theme);
    });
  });

  // سرعت تایپ
  const speedSlider = document.getElementById('typing-speed');
  const speedLabel = document.getElementById('typing-speed-label');
  if (speedSlider) {
    speedSlider.addEventListener('input', () => {
      typingSpeed = parseInt(speedSlider.value);
      speedLabel.textContent = typingSpeed;
    });
  }

  // دکمه‌های هدر
  document.getElementById('lang-switch')?.addEventListener('click', switchLanguage);
  document.getElementById('theme-switch')?.addEventListener('click', switchTheme);

  // کلیک بیرون از تنظیمات برای بستن
  document.getElementById('settings-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSettings();
  });

  // میانبر صفحه کلید
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSettings();
  });
});

// ─── متغیرهای سراسری ────────────────────────────────────────────
window.switchLanguage = switchLanguage;
window.switchTheme = switchTheme;
window.toggleSettings = toggleSettings;
window.game = game;
