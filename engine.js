// ============================================================
//  موتور بازی تعاملی «سقوط فرشته‌ها»
//  با سیستم ۵ پارامتر شخصیتی + تحلیل کامل + سیو/لود
// ============================================================

const GameEngine = {
    state: {
        currentScene: 'start',
        stats: {
            decisiveness: 50,
            analytical: 50,
            empathy: 50,
            courage: 50,
            pragmatism: 50
        },
        history: [],
        gameOver: false
    },

    // ---- مقداردهی اولیه (با چک کردن سیو) ----
    init() {
        const saved = this.loadGame();
        if (saved) {
            this.state = saved;
            this.render();
            return;
        }
        this.state = {
            currentScene: 'start',
            stats: {
                decisiveness: 50,
                analytical: 50,
                empathy: 50,
                courage: 50,
                pragmatism: 50
            },
            history: [],
            gameOver: false
        };
        this.saveGame();
        this.render();
    },

    // ---- ذخیره‌سازی ----
    saveGame() {
        try {
            localStorage.setItem('fall_of_angels_save', JSON.stringify(this.state));
        } catch (e) {
            console.warn('سیو کردن انجام نشد:', e);
        }
    },

    // ---- بارگذاری ----
    loadGame() {
        try {
            const data = localStorage.getItem('fall_of_angels_save');
            if (data) return JSON.parse(data);
        } catch (e) {
            console.warn('بارگذاری انجام نشد:', e);
        }
        return null;
    },

    // ---- پاک کردن سیو ----
    clearSave() {
        localStorage.removeItem('fall_of_angels_save');
        this.init();
    },

    // ---- اعمال تأثیر انتخاب بر پارامترها ----
    applyEffects(effects) {
        if (!effects) return;
        for (const [key, value] of Object.entries(effects)) {
            if (this.state.stats.hasOwnProperty(key)) {
                this.state.stats[key] = Math.min(100, Math.max(0, this.state.stats[key] + value));
            }
        }
    },

    // ---- رفتن به صحنه‌ی بعدی (با سیو خودکار) ----
    goToScene(sceneId) {
        if (this.state.gameOver) return;
        const scene = window.getScene(sceneId);
        if (!scene) {
            console.error(`صحنه‌ی "${sceneId}" پیدا نشد!`);
            return;
        }
        this.state.currentScene = sceneId;
        this.state.history.push(sceneId);
        this.saveGame();
        this.render();
    },

    // ---- انتخاب گزینه (با سیو خودکار) ----
    makeChoice(choice) {
        if (this.state.gameOver) return;
        if (choice.effects) this.applyEffects(choice.effects);
        if (choice.next) {
            this.goToScene(choice.next);
        } else {
            this.state.gameOver = true;
            this.saveGame();
            this.renderResult();
        }
    },

    // ---- دریافت عنوان پارامتر ----
    getStatLabel(key) {
        const map = {
            'decisiveness': '⚡ قاطعیت',
            'analytical': '🔍 تحلیلی‌گری',
            'empathy': '❤️ همدلی',
            'courage': '🛡️ جسارت',
            'pragmatism': '⚙️ عمل‌گرایی'
        };
        return map[key] || key;
    },

    // ============================================================
    //  تحلیل کامل شخصیتی در پایان بازی
    // ============================================================

    getFullPersonalityReport() {
        const s = this.state.stats;
        const type = this.getPersonalityType(s);
        
        return {
            title: this.getTitle(type, s),
            type: type,
            dominant: this.getDominantTrait(s),
            stats: s,
            analysis: this.getAnalysis(s),
            strengths: this.getStrengths(s),
            weaknesses: this.getWeaknesses(s),
            similarCharacters: this.getSimilarCharacters(type),
            advice: this.getAdvice(type),
            summary: this.getSummary(type, s)
        };
    },

    // ---- تشخیص تیپ شخصیتی ----
    getPersonalityType(s) {
        const d = s.decisiveness, a = s.analytical, e = s.empathy, c = s.courage, p = s.pragmatism;
        if (d >= 70 && c >= 65 && a >= 60) return 'COMMANDER';
        if (a >= 70 && p >= 65 && d >= 55) return 'STRATEGIST';
        if (e >= 70 && a >= 60 && d >= 50) return 'DIPLOMAT';
        if (c >= 70 && p >= 60 && d >= 55) return 'GUARDIAN';
        if (a >= 70 && e >= 60) return 'THINKER';
        if (e >= 70 && c >= 60) return 'EMPATH';
        if (d >= 60 && p >= 60) return 'PRAGMATIST';
        if (a >= 60 && c >= 55) return 'INVESTIGATOR';
        return 'BALANCED';
    },

    // ---- عنوان شخصیتی ----
    getTitle(type, s) {
        const titles = {
            'COMMANDER': '⚔️ فرمانده · رهبر متولد شده',
            'STRATEGIST': '♟️ استراتژیست · مغز پشت صحنه',
            'DIPLOMAT': '🤝 دیپلمات · پل‌ساز میان آدم‌ها',
            'GUARDIAN': '🛡️ محافظ · سپر بی‌باک',
            'THINKER': '🧠 متفکر · چشم‌های نافذ',
            'EMPATH': '💞 همدل · قلب بزرگ',
            'PRAGMATIST': '🔧 عمل‌گرا · اهل کار و نتیجه',
            'INVESTIGATOR': '🔍 محقق · جستجوگر حقیقت',
            'BALANCED': '⚖️ متعادل · همه‌چیز به اندازه'
        };
        return titles[type] || '🕵️ کارآگاه تنها';
    },

    // ---- تحلیل هر پارامتر ----
    getAnalysis(s) {
        const map = {
            decisiveness: { label: 'قاطعیت', high: 'شما تصمیم‌گیرنده‌ای سریع و قاطع هستید. در بحران‌ها، دیگران به شما تکیه می‌کنند.', low: 'گاهی عجله می‌کنید و ممکن است جزئیات را نادیده بگیرید.' },
            analytical: { label: 'تحلیلی‌گری', high: 'چشم‌های تیزبینی دارید. الگوها و جزئیات را زودتر از دیگران می‌بینید.', low: 'گاهی بیش از حد تحلیل می‌کنید و تصمیم‌گیری را به تأخیر می‌اندازید.' },
            empathy: { label: 'همدلی', high: 'احساسات دیگران برای شما مهم است. می‌توانید خود را جای دیگران بگذارید.', low: 'احساسات ممکن است گاهی شما را از واقعیت دور کند.' },
            courage: { label: 'جسارت', high: 'از خطر نمی‌ترسید. در مواجهه با تهدید، ثابت‌قدم می‌مانید.', low: 'گاهی ریسک‌های غیرضروری می‌کنید که می‌توانستید از آنها دوری کنید.' },
            pragmatism: { label: 'عمل‌گرایی', high: 'اهل عمل هستید. به جای حرف زدن، کار می‌کنید و راه‌حل پیدا می‌کنید.', low: 'ممکن است گاهی به جنبه‌های انسانی و احساسی موضوع بی‌توجه باشید.' }
        };
        const result = {};
        for (const [key, data] of Object.entries(map)) {
            const val = s[key];
            result[key] = {
                label: data.label,
                value: val,
                level: val >= 70 ? 'high' : val <= 30 ? 'low' : 'medium',
                description: val >= 70 ? data.high : val <= 30 ? data.low : `${data.label} شما در حد متعادل است. بسته به موقعیت، می‌توانید انعطاف نشان دهید.`
            };
        }
        return result;
    },

    // ---- صفت غالب ----
    getDominantTrait(s) {
        const map = { decisiveness: 'قاطعیت', analytical: 'تحلیلی‌گری', empathy: 'همدلی', courage: 'جسارت', pragmatism: 'عمل‌گرایی' };
        let maxKey = 'decisiveness';
        for (const key of Object.keys(s)) {
            if (s[key] > s[maxKey]) maxKey = key;
        }
        return map[maxKey] || 'متعادل';
    },

    // ---- نقاط قوت ----
    getStrengths(s) {
        const result = [];
        if (s.decisiveness >= 60) result.push('💪 تصمیم‌گیری سریع در بحران‌ها');
        if (s.analytical >= 60) result.push('🧩 توانایی تشخیص الگوها و جزئیات');
        if (s.empathy >= 60) result.push('❤️ درک عمیق احساسات دیگران');
        if (s.courage >= 60) result.push('🦁 شجاعت در مواجهه با خطر');
        if (s.pragmatism >= 60) result.push('🔨 یافتن راه‌حل‌های عملی و سریع');
        if (result.length === 0) result.push('⚖️ تعادل و انعطاف‌پذیری در موقعیت‌ها');
        return result;
    },

    // ---- نقاط ضعف ----
    getWeaknesses(s) {
        const result = [];
        if (s.decisiveness <= 40) result.push('⏳ تردید در تصمیم‌گیری‌های مهم');
        if (s.analytical <= 40) result.push('🎯 نادیده گرفتن جزئیات ظریف');
        if (s.empathy <= 40) result.push('❄️ بی‌توجهی به احساسات دیگران');
        if (s.courage <= 40) result.push('😰 اجتناب از ریسک‌های لازم');
        if (s.pragmatism <= 40) result.push('☁️ غرق شدن در ایده‌ها بدون عمل');
        if (result.length === 0) result.push('⚠️ گاهی بیش از حد به خودتان مطمئن هستید');
        return result;
    },

    // ---- شخصیت‌های مشابه ----
    getSimilarCharacters(type) {
        const map = {
            'COMMANDER': ['نلی (Peaky Blinders)', 'هایزنبرگ (Breaking Bad)', 'ارین یگر (Attack on Titan)'],
            'STRATEGIST': ['شِرلاک هولمز', 'لایت یاگامی (Death Note)', 'تایوین لنستر (Game of Thrones)'],
            'DIPLOMAT': ['نِد استارک (Game of Thrones)', 'سِروان (The Crown)', 'دکتر مارتین لوتر کینگ'],
            'GUARDIAN': ['کاپیتان آمریکا', 'ساموآل جکسون (Pulp Fiction)', 'جک باور (24)'],
            'THINKER': ['تایسون (The Mentalist)', 'دکتر هاوس', 'بروس وین (بتمن)'],
            'EMPATH': ['فارست گامپ', 'سم گمگی (Lord of the Rings)', 'دکتر رید (Criminal Minds)'],
            'PRAGMATIST': ['تونی استارک (آیرون من)', 'رِی (The Walking Dead)', 'اُپی وان کِنوبی'],
            'INVESTIGATOR': ['کارآگاه در True Detective', 'لوتر (Luther)', 'سیلویو (The Wire)'],
            'BALANCED': ['لئوناردو دیکاپریو در Inception', 'جیمز باند', 'آرتور مورگان (RDR2)']
        };
        return map[type] || ['شخصیت‌های پیچیده و چندلایه'];
    },

    // ---- توصیه‌های عملی ----
    getAdvice(type) {
        const map = {
            'COMMANDER': '👑 قدرت خود را با فروتنی همراه کنید. گاهی بهترین فرمان، گوش‌دادن است.',
            'STRATEGIST': '🧠 برنامه‌هایتان را گاهی با دیگران به اشتراک بگذارید. تنها بودن، شما را از دیدن زاویه‌های جدید بازمی‌دارد.',
            'DIPLOMAT': '❤️ از همدلی خود برای ساختن پل استفاده کنید، نه برای فرار از واقعیت.',
            'GUARDIAN': '🛡️ محافظت از دیگران ارزشمند است، اما خودتان را نیز فراموش نکنید.',
            'THINKER': '📚 دانش را با عمل ترکیب کنید. بهترین نظریه‌ها در دنیای واقعی آزمایش می‌شوند.',
            'EMPATH': '💞 گاهی مرزهای همدلی را مشخص کنید تا خودتان را نبازید.',
            'PRAGMATIST': '🔧 در کنار عمل‌گرایی، گاهی به رویاها و احساسات هم فرصت دهید.',
            'INVESTIGATOR': '🔍 حقیقت همیشه در داده‌ها نیست. گاهی سکوت و شهود، بیشتر از هزاران عدد به شما می‌گویند.',
            'BALANCED': '⚖️ تعادل شما نقطه‌ی قوت شماست. از آن برای انطباق با موقعیت‌های مختلف استفاده کنید.'
        };
        return map[type] || 'به مسیر خود ادامه دهید. هر انتخابی، شما را به نسخه‌ی بهتری از خودتان تبدیل کرده است.';
    },

    // ---- جمع‌بندی نهایی ----
    getSummary(type, s) {
        const map = {
            'COMMANDER': 'شما متولد شده‌اید تا رهبری کنید. قدرت شما در تصمیم‌گیری‌های سریع و شجاعت‌تان است. دنیا به افرادی مثل شما نیاز دارد تا در بحران‌ها ثابت‌قدم بمانند.',
            'STRATEGIST': 'ذهن شما مثل یک شطرنج‌باز عمل می‌کند. چند قدم جلوتر را می‌بینید و از جزئیات برای ساختن کل استفاده می‌کنید.',
            'DIPLOMAT': 'شما پلی هستید بین آدم‌ها. همدلی شما، شما را به یک شنونده‌ی عالی و یک میانجی‌گر ماهر تبدیل کرده است.',
            'GUARDIAN': 'شما سپر دیگران هستید. جسارت و عمل‌گرایی شما، شما را به یک محافظ واقعی تبدیل کرده است.',
            'THINKER': 'شما به عمق چیزها نفوذ می‌کنید. تحلیل شما، شما را به یک متفکر استثنایی تبدیل کرده است.',
            'EMPATH': 'شما با قلب خود دنیا را می‌بینید. همدلی شما، شما را به یک انسان فوق‌العاده تبدیل کرده است.',
            'PRAGMATIST': 'شما اهل عمل هستید. از ایده‌ها فراتر می‌روید و به دنبال راه‌حل‌های واقعی می‌گردید.',
            'INVESTIGATOR': 'شما تشنه‌ی حقیقت هستید. کنجکاوی و دقت شما، شما را به یک جستجوگر عالی تبدیل کرده است.',
            'BALANCED': 'شما در میان افراط‌ها تعادل را حفظ می‌کنید. انعطاف‌پذیری شما، بزرگترین نقطه‌ی قوت‌تان است.'
        };
        return map[type] || 'شما یک شخصیت منحصربه‌فرد با ترکیبی از صفات مختلف هستید. هر انتخابی که کردید، شما را به سمت نسخه‌ی بهتری از خودتان هدایت کرده است.';
    },

    // ============================================================
    //  رندر صحنه و نتیجه (با دکمه‌های سیو)
    // ============================================================

    render() {
        const scene = window.getScene(this.state.currentScene);
        if (!scene) {
            console.error(`صحنه‌ی "${this.state.currentScene}" پیدا نشد!`);
            return;
        }

        document.getElementById('scene-title').textContent = scene.title || '🕵️ صحنه';
        document.getElementById('scene-text').textContent = scene.text || '...';

        const choicesEl = document.getElementById('choices-container');
        choicesEl.innerHTML = '';
        if (scene.choices && scene.choices.length > 0) {
            scene.choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';

                const label = document.createElement('span');
                label.textContent = choice.text;

                const effectTag = document.createElement('span');
                effectTag.className = 'effect-tag';
                if (choice.effects) {
                    const parts = Object.entries(choice.effects).map(([k, v]) => {
                        const sign = v > 0 ? '+' : '';
                        return `${sign}${v} ${this.getStatLabel(k).split(' ')[0]}`;
                    });
                    effectTag.textContent = parts.join(' · ');
                } else {
                    effectTag.textContent = '—';
                }

                btn.appendChild(label);
                btn.appendChild(effectTag);
                btn.addEventListener('click', () => this.makeChoice(choice));
                choicesEl.appendChild(btn);
            });
        }

        // نمایش آمار
        const statsEl = document.getElementById('stats-container');
        statsEl.innerHTML = '';
        for (const [key, value] of Object.entries(this.state.stats)) {
            const item = document.createElement('div');
            item.className = 'stat-item';
            item.innerHTML = `
                ${this.getStatLabel(key)}
                <span style="color:#6a6a6a;font-size:12px;">${Math.round(value)}%</span>
                <div class="stat-bar"><div class="stat-fill ${key}" style="width:${value}%;"></div></div>
            `;
            statsEl.appendChild(item);
        }

        // ---- دکمه‌های سیو ----
        const saveContainer = document.getElementById('save-container');
        if (saveContainer) {
            saveContainer.innerHTML = `
                <button id="save-btn" class="save-btn">💾 ذخیره بازی</button>
                <button id="clear-save-btn" class="clear-btn">🗑️ پاک کردن سیو</button>
            `;
            document.getElementById('save-btn').addEventListener('click', () => {
                this.saveGame();
                alert('✅ بازی ذخیره شد!');
            });
            document.getElementById('clear-save-btn').addEventListener('click', () => {
                if (confirm('آیا مطمئنی می‌خوای سیو رو پاک کنی؟')) {
                    this.clearSave();
                    alert('🗑️ سیو پاک شد.');
                }
            });
        }

        document.getElementById('restart-btn').style.display = 'block';
        document.getElementById('result-container').style.display = 'none';
    },

    renderResult() {
        const report = this.getFullPersonalityReport();

        document.getElementById('scene-title').textContent = '🏆 پایان بازی · شخصیت شما';
        document.getElementById('scene-text').innerHTML = '';
        document.getElementById('choices-container').innerHTML = '';
        document.getElementById('stats-container').innerHTML = '';

        const resultDiv = document.getElementById('result-container');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h2 style="color:#d4cdc0;font-size:24px;text-align:center;margin-bottom:12px;">${report.title}</h2>
            <p style="text-align:center;color:#9a8a7a;font-size:14px;">تیپ غالب: ${report.dominant}</p>

            <div style="margin:20px 0;padding:16px;background:#0f0f0f;border-radius:10px;border:1px solid #1f1f1f;">
                ${Object.values(report.analysis).map(a => `
                    <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1a1a1a;font-size:14px;">
                        <span>${a.label}</span>
                        <span style="color:${a.level === 'high' ? '#8b6b5a' : a.level === 'low' ? '#5a6a7a' : '#7a7a6a'};">${a.value}%</span>
                    </div>
                `).join('')}
            </div>

            <div style="margin:12px 0;">
                <p style="color:#c4b5a5;font-size:15px;line-height:2;"><strong>📖 تحلیل:</strong></p>
                ${Object.values(report.analysis).map(a => `
                    <p style="color:#9a8a7a;font-size:14px;line-height:1.8;margin:6px 0;">• ${a.description}</p>
                `).join('')}
            </div>

            <div style="margin:12px 0;display:flex;flex-wrap:wrap;gap:8px;">
                ${report.strengths.map(s => `<span style="background:#1a1a1a;padding:4px 12px;border-radius:20px;border:1px solid #2a3a3a;font-size:13px;color:#b4a594;">${s}</span>`).join('')}
            </div>
            <div style="margin:12px 0;display:flex;flex-wrap:wrap;gap:8px;">
                ${report.weaknesses.map(w => `<span style="background:#1a1a1a;padding:4px 12px;border-radius:20px;border:1px solid #3a2a2a;font-size:13px;color:#8a7a6a;">${w}</span>`).join('')}
            </div>

            <div style="margin:12px 0;padding:12px;background:#0f0f0f;border-radius:8px;border:1px solid #1f1f1f;">
                <p style="color:#b4a594;font-size:14px;"><strong>🎭 شخصیت‌های مشابه:</strong></p>
                <p style="color:#8a7a6a;font-size:14px;">${report.similarCharacters.join(' · ')}</p>
            </div>

            <div style="margin:12px 0;padding:12px;background:#1a1a1a;border-radius:8px;border-right:3px solid #6a5a4a;">
                <p style="color:#c4b5a5;font-size:15px;"><strong>💡 توصیه:</strong> ${report.advice}</p>
            </div>

            <div style="margin:16px 0;padding:16px;background:#0f0f0f;border-radius:10px;border:1px solid #2a2a2a;">
                <p style="color:#d4cdc0;font-size:15px;line-height:2;text-align:center;">${report.summary}</p>
            </div>
        `;

        // ---- دکمه‌های سیو در نتیجه ----
        const saveContainer = document.getElementById('save-container');
        if (saveContainer) {
            saveContainer.innerHTML = `
                <button id="save-btn" class="save-btn">💾 ذخیره بازی</button>
                <button id="clear-save-btn" class="clear-btn">🗑️ پاک کردن سیو</button>
            `;
            document.getElementById('save-btn').addEventListener('click', () => {
                this.saveGame();
                alert('✅ بازی ذخیره شد!');
            });
            document.getElementById('clear-save-btn').addEventListener('click', () => {
                if (confirm('آیا مطمئنی می‌خوای سیو رو پاک کنی؟')) {
                    this.clearSave();
                    alert('🗑️ سیو پاک شد.');
                }
            });
        }

        document.getElementById('restart-btn').style.display = 'block';
    }
};

// ---- شروع بازی ----
document.addEventListener('DOMContentLoaded', () => {
    GameEngine.init();
    document.getElementById('restart-btn').addEventListener('click', () => GameEngine.init());
});
