// ========================================
// ブログ記事自動読み込みスクリプト
// ========================================

/**
 * posts.jsonから記事一覧を取得してカード表示
 */
async function loadBlogPosts() {
  try {
    // posts.jsonを取得
    const response = await fetch('/blog/posts.json');
    if (!response.ok) {
      console.warn('posts.jsonが見つかりません');
      return;
    }
    
    const posts = await response.json();
    
    // メインページのブログセクション
    const mainBlogGrid = document.querySelector('#blog .blog-grid');
    if (mainBlogGrid) {
      renderBlogCards(posts.slice(0, 3), mainBlogGrid, 'blog/'); // 最新3件のみ
    }
    
    // ブログ一覧ページ
    const blogListGrid = document.querySelector('#blog-list .blog-grid');
    if (blogListGrid) {
      renderBlogCards(posts, blogListGrid, ''); // 全件表示
    }
    
  } catch (error) {
    console.error('記事の読み込みに失敗しました:', error);
  }
}

/**
 * ブログカードをレンダリング
 * @param {Array} posts - 記事データの配列
 * @param {HTMLElement} container - 挿入先のコンテナ
 * @param {string} pathPrefix - パスのプレフィックス（メインページ用）
 */
function renderBlogCards(posts, container, pathPrefix = '') {
  // 既存の記事カード（準備中以外）をクリア
  const existingCards = container.querySelectorAll('.blog-card:not(.blog-card-coming-soon)');
  existingCards.forEach(card => card.remove());
  
  // 準備中カードを取得（あれば最後に移動）
  const comingSoonCard = container.querySelector('.blog-card-coming-soon');
  
  // 新しいカードを作成
  posts.forEach(post => {
    const card = createBlogCard(post, pathPrefix);
    
    // 準備中カードの前に挿入
    if (comingSoonCard) {
      container.insertBefore(card, comingSoonCard);
    } else {
      container.appendChild(card);
    }
  });
}

/**
 * ブログカード要素を作成
 * @param {Object} post - 記事データ
 * @param {string} pathPrefix - パスのプレフィックス
 * @returns {HTMLElement} カード要素
 */
function createBlogCard(post, pathPrefix = '') {
  const card = document.createElement('div');
  card.className = 'blog-card';
  
  // 日付をフォーマット（YYYY-MM-DD → YYYY.MM.DD）
  const formattedDate = post.date.replace(/-/g, '.');
  
  card.innerHTML = `
    <div class="blog-card-meta">
      <span class="blog-card-date">${formattedDate}</span>
      <span class="blog-card-category">${post.category}</span>
    </div>
    <h3 class="blog-card-title">
      <a href="${pathPrefix}${post.file}">${post.title}</a>
    </h3>
    <p class="blog-card-excerpt">
      ${post.excerpt}
    </p>
    <a href="${pathPrefix}${post.file}" class="blog-card-link">
      <span>Read More</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </a>
  `;
  
  return card;
}

// ページ読み込み時に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadBlogPosts);
} else {
  loadBlogPosts();
}

