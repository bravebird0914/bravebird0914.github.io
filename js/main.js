// ========================================
// エレガントなポートフォリオサイト用JavaScript
// ========================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 日付と曜日の表示
function updateCurrentDate() {
  const now = new Date();
  const timeZone = 'Asia/Tokyo';
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  });

  const parts = formatter.formatToParts(now);
  const values = {};
  for (const p of parts) {
    if (p.type !== 'literal') values[p.type] = p.value;
  }

  const year = values.year;
  const month = values.month;
  const day = values.day;
  const weekday = values.weekday;

  const dateYear = document.querySelector('.date-year');
  const dateMonthDay = document.querySelector('.date-month-day');
  const dateWeekday = document.querySelector('.date-weekday');
  const footerText = document.getElementById('site-footer-text');

  if (dateYear) {
    dateYear.textContent = year;
  }
  
  if (dateMonthDay) {
    dateMonthDay.textContent = `${month}.${day}`;
  }
  
  if (dateWeekday) {
    dateWeekday.textContent = weekday;
  }

  if (footerText) {
    footerText.textContent = `${year}.${month}.${day} bravebird. All rights reserved.`;
  }
}

// 日本時間のアナログ時計
function updateAnalogClock() {
  const clock = document.getElementById('analog-clock');
  if (!clock) return;

  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });
  const values = {};
  for (const part of formatter.formatToParts(new Date())) {
    if (part.type !== 'literal') values[part.type] = Number(part.value);
  }

  const hour = values.hour % 12;
  const minute = values.minute;
  const second = values.second;
  const hourHand = clock.querySelector('.clock-hour');
  const minuteHand = clock.querySelector('.clock-minute');
  const secondHand = clock.querySelector('.clock-second');

  if (hourHand) hourHand.style.transform = `rotate(${hour * 30 + minute * 0.5}deg)`;
  if (minuteHand) minuteHand.style.transform = `rotate(${minute * 6 + second * 0.1}deg)`;
  if (secondHand) secondHand.style.transform = `rotate(${second * 6}deg)`;
  clock.setAttribute(
    'aria-label',
    `日本時間 ${String(values.hour).padStart(2, '0')}時${String(minute).padStart(2, '0')}分${String(second).padStart(2, '0')}秒`
  );
}

function startAnalogClock() {
  updateAnalogClock();
  setInterval(updateAnalogClock, 1000);
}

// ページ読み込み完了後に日付を更新
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
if (isDev) console.log('🚀 main.js loaded');

// DOMが完全に読み込まれてから実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (isDev) console.log('✅ DOMContentLoaded fired');
    updateCurrentDate();
    startTokyoDailyUpdate();
    startAnalogClock();
  });
} else {
  if (isDev) console.log('✅ DOM already loaded');
  updateCurrentDate();
  startTokyoDailyUpdate();
  startAnalogClock();
}

// 日付が変わったら更新（東京時刻の午前0時）
function startTokyoDailyUpdate() {
  const scheduleNext = () => {
    const now = new Date();
    const timeZone = 'Asia/Tokyo';
    const ymd = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now); // YYYY-MM-DD

    const todayTokyoMidnight = new Date(`${ymd}T00:00:00+09:00`);
    const nextTokyoMidnight = new Date(todayTokyoMidnight.getTime() + 24 * 60 * 60 * 1000);
    const delay = Math.max(1000, nextTokyoMidnight.getTime() - now.getTime() + 250);

    setTimeout(() => {
      updateCurrentDate();
      scheduleNext();
    }, delay);
  };

  scheduleNext();

  // スリープ復帰等で日付がずれても、表示に戻ったタイミングで補正
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateCurrentDate();
  });
}

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // 空のハッシュや無効なハッシュの場合はスキップ
    if (href === '#' || !href) return;
    
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });

    // URLを更新
    history.pushState(null, '', href);
  });
});

// アクティブなナビゲーション項目を強調表示
const observeNavigation = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  
  // 初期状態：最初のセクション（About）をアクティブに設定
  if (navLinks.length > 0) {
    navLinks[0].classList.add('active');
  }
  
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => observer.observe(section));
};

// ダークモード切り替え
const initDarkModeToggle = () => {
  const toggle = document.getElementById('dark-mode-toggle');
  const body = document.body;
  const moonIcon = toggle.querySelector('.moon-icon');
  const sunIcon = toggle.querySelector('.sun-icon');
  
  // アイコン切り替え関数
  const updateIcon = (isDark) => {
    toggle.setAttribute('aria-pressed', String(isDark));
    if (isDark) {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    } else {
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    }
  };
  
  // ローカルストレージから設定を読み込み
  const savedMode = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 初期状態を設定
  if (savedMode === 'dark' || (!savedMode && prefersDark)) {
    body.classList.add('dark-mode');
    updateIcon(true);
  } else {
    updateIcon(false);
  }
  
  // クリックイベント
  toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    
    updateIcon(isDark);
    localStorage.setItem('darkMode', isDark ? 'dark' : 'light');
  });
  
  // システムの設定変更を監視
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('darkMode')) {
      if (e.matches) {
        body.classList.add('dark-mode');
        updateIcon(true);
      } else {
        body.classList.remove('dark-mode');
        updateIcon(false);
      }
    }
  });
};

// ページ読み込み時にハッシュがあれば該当セクションにスクロール
window.addEventListener('load', () => {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }
  
  // 初期化
  initDarkModeToggle();
  observeNavigation();
  initSidebarToggle();
});

// モバイル用ナビゲーショントグル
const initSidebarToggle = () => {
  const btn = document.querySelector('.sidebar-toggle-btn');
  const nav = document.getElementById('sidebar-nav-body');
  if (!btn || !nav) return;

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  btn.addEventListener('click', () => {
    if (!isMobile()) return;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (!isMobile()) return;
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });
  });

  // リサイズで PC 幅になったらナビを強制表示・状態リセット
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });
};

// 外部リンクを新しいタブで開く
document.querySelectorAll('a[href^="http"]').forEach(link => {
  if (!link.hostname.includes(window.location.hostname)) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
});

// デバッグ用
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('✨ Elegant portfolio loaded');
}
