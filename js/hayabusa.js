// ========================================
// hayabusa ページ用JavaScript
// ========================================

console.log('🚀 hayabusa.js loaded');

// 日付と曜日の表示
function updateCurrentDate() {
  console.log('📅 updateCurrentDate called');
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[now.getDay()];

  const dateYear = document.querySelector('.date-year');
  const dateMonthDay = document.querySelector('.date-month-day');
  const dateWeekday = document.querySelector('.date-weekday');

  console.log('Date elements:', { dateYear, dateMonthDay, dateWeekday });

  if (dateYear) {
    dateYear.textContent = year;
    console.log('✅ Year updated:', year);
  } else {
    console.log('❌ .date-year element not found');
  }
  
  if (dateMonthDay) {
    dateMonthDay.textContent = `${month}.${day}`;
    console.log('✅ Month-Day updated:', `${month}.${day}`);
  } else {
    console.log('❌ .date-month-day element not found');
  }
  
  if (dateWeekday) {
    dateWeekday.textContent = weekday;
    console.log('✅ Weekday updated:', weekday);
  } else {
    console.log('❌ .date-weekday element not found');
  }
}

// ダークモード切り替え
const initDarkModeToggle = () => {
  console.log('🌙 initDarkModeToggle called');
  const toggle = document.getElementById('dark-mode-toggle');
  console.log('Toggle element:', toggle);
  if (!toggle) {
    console.log('❌ dark-mode-toggle element not found');
    return;
  }
  
  const body = document.body;
  const moonIcon = toggle.querySelector('.moon-icon');
  const sunIcon = toggle.querySelector('.sun-icon');
  
  if (!moonIcon || !sunIcon) return;
  
  // アイコン切り替え関数
  const updateIcon = (isDark) => {
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

// スムーススクロール
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href) return;
      
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
};

// スクロール時のナビゲーション背景変更
const initNavScroll = () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.style.background = 'rgba(10, 14, 39, 0.95)';
      nav.style.borderBottomColor = 'rgba(127, 255, 212, 0.2)';
    } else {
      nav.style.background = 'rgba(10, 14, 39, 0.8)';
      nav.style.borderBottomColor = 'rgba(127, 255, 212, 0.1)';
    }
  });
};

// ダークモード時のナビゲーション背景調整
const updateNavForDarkMode = () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  
  const observer = new MutationObserver(() => {
    if (document.body.classList.contains('dark-mode')) {
      nav.style.background = 'rgba(10, 14, 39, 0.95)';
      nav.style.borderBottomColor = 'rgba(127, 255, 212, 0.2)';
    } else {
      nav.style.background = 'rgba(10, 14, 39, 0.8)';
      nav.style.borderBottomColor = 'rgba(127, 255, 212, 0.1)';
    }
  });
  
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
};

// ページ読み込み時の初期化
console.log('📄 Document readyState:', document.readyState);
if (document.readyState === 'loading') {
  console.log('⏳ Waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded fired');
    updateCurrentDate();
    initDarkModeToggle();
    initSmoothScroll();
    initNavScroll();
    updateNavForDarkMode();
    initMobileMenu();
  });
} else {
  console.log('✅ DOM already loaded');
  updateCurrentDate();
  initDarkModeToggle();
  initSmoothScroll();
  initNavScroll();
  updateNavForDarkMode();
  initMobileMenu();
}

// 日付が変わったら更新（午前0時に更新）
setTimeout(() => {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const timeUntilMidnight = tomorrow - now;
  setTimeout(() => {
    updateCurrentDate();
    // その後は24時間ごとに更新
    setInterval(updateCurrentDate, 24 * 60 * 60 * 1000);
  }, timeUntilMidnight);
}, 100);

// ハンバーガーメニューの制御
const initMobileMenu = () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!navToggle || !navLinks) return;
  
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
  });
  
  // メニューリンクをクリックしたら閉じる
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
    });
  });
  
  // 画面外をクリックしたら閉じる
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
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

// ページ読み込み時の初期化（更新）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    updateCurrentDate();
    initDarkModeToggle();
    initSmoothScroll();
    initNavScroll();
    updateNavForDarkMode();
    initMobileMenu();
  });
} else {
  updateCurrentDate();
  initDarkModeToggle();
  initSmoothScroll();
  initNavScroll();
  updateNavForDarkMode();
  initMobileMenu();
}

