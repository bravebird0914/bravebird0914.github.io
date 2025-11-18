// ========================================
// エレガントなポートフォリオサイト用JavaScript
// ========================================

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
      behavior: 'smooth',
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

// パララックス効果
const initParallax = () => {
  const mainContent = document.querySelector('.main-content');
  
  if (!mainContent) return;
  
  mainContent.addEventListener('scroll', () => {
    const scrolled = mainContent.scrollTop;
    const items = document.querySelectorAll('.experience-item, .project-item, .publication-item');
    
    items.forEach((item, index) => {
      const speed = 0.05;
      const yPos = -(scrolled * speed * (index % 3));
      item.style.transform = `translateY(${yPos}px)`;
    });
  });
};

// スクロールアニメーションの観察
const observeScrollAnimations = () => {
  const animateElements = document.querySelectorAll('.experience-item, .project-item, .blog-item');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 50);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
};

// サイドバータイトルのキラキラ効果
const addSparkleEffect = () => {
  const title = document.querySelector('.sidebar-title');
  
  if (!title) return;
  
  title.addEventListener('mouseenter', () => {
    title.style.animation = 'sparkle 0.6s ease';
  });
  
  title.addEventListener('animationend', () => {
    title.style.animation = '';
  });
};

// カーソルに追従する微妙なエフェクト
const initCursorEffect = () => {
  let mouseX = 0;
  let mouseY = 0;
  let ballX = 0;
  let ballY = 0;
  let speed = 0.1;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animate() {
    let distX = mouseX - ballX;
    let distY = mouseY - ballY;
    
    ballX += distX * speed;
    ballY += distY * speed;
    
    // 微妙なカラー変更エフェクト
    const items = document.querySelectorAll('.experience-item, .project-item');
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(centerX - ballX, 2) + Math.pow(centerY - ballY, 2)
      );
      
      if (distance < 200) {
        const intensity = 1 - distance / 200;
        item.style.borderColor = `rgba(127, 255, 212, ${0.15 + intensity * 0.3})`;
      }
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
};

// ダークモード切り替え
const initDarkModeToggle = () => {
  const toggle = document.getElementById('dark-mode-toggle');
  const body = document.body;
  const moonIcon = toggle.querySelector('.moon-icon');
  const sunIcon = toggle.querySelector('.sun-icon');
  
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

// ページ読み込み時にハッシュがあれば該当セクションにスクロール
window.addEventListener('load', () => {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }
  
  // 初期化
  initDarkModeToggle();
  observeNavigation();
  observeScrollAnimations();
  addSparkleEffect();
  initCursorEffect();
  // initParallax(); // パララックスは少し重いので必要に応じて有効化
});

// 外部リンクを新しいタブで開く
document.querySelectorAll('a[href^="http"]').forEach(link => {
  if (!link.hostname.includes(window.location.hostname)) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
});

// スパークルアニメーション（CSS用）
const style = document.createElement('style');
style.textContent = `
  @keyframes sparkle {
    0%, 100% { filter: brightness(1) drop-shadow(0 0 0 transparent); }
    50% { filter: brightness(1.2) drop-shadow(0 0 8px rgba(127, 255, 212, 0.5)); }
  }
`;
document.head.appendChild(style);

// デバッグ用
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('✨ Elegant portfolio loaded');
}
