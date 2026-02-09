const categories = (window.DATASET?.categories || []).map((entry) => ({
  ...entry,
  category: {
    ...entry.category,
    name: entry.category.name.replace(/\s*\n\s*/g, ' ').trim(),
  },
  contents: entry.contents.map((item) => ({
    ...item,
    title: item.title.replace(/\s*\n\s*/g, ' ').trim(),
    videoId: (item.mediaUrl.match(/embed\/([^?]+)/) || [])[1] || item.slug,
  })),
}));

const flatVideos = categories.flatMap((c) => c.contents.map((v) => ({ ...v, categorySlug: c.category.slug, categoryName: c.category.name, categoryIcon: c.category.iconUrl })));

const feed = document.getElementById('feed');
const playerPage = document.getElementById('playerPage');
const relatedList = document.getElementById('relatedList');
const miniPlayer = document.getElementById('miniPlayer');

let current = null;
let player = null;
let dragStartY = null;
let ticker = null;

function renderFeed() {
  feed.innerHTML = '';
  categories.forEach(({ category, contents }) => {
    const section = document.createElement('section');
    section.className = 'category';
    section.innerHTML = `<div class="category-header"><img src="${category.iconUrl}" alt="${category.name}"/><h2>${category.name}</h2></div>`;

    contents.forEach((video) => {
      const card = document.createElement('article');
      card.className = 'video-card';
      card.innerHTML = `
        <img src="${video.thumbnailUrl}" alt="${video.title}" />
        <div>
          <span class="badge">${category.name}</span>
          <h3>${video.title}</h3>
          <p>${video.mediaType}</p>
        </div>`;
      card.addEventListener('click', () => openVideo(video.slug));
      section.appendChild(card);
    });

    feed.appendChild(section);
  });
}

function findVideo(slug) {
  return flatVideos.find((v) => v.slug === slug);
}

function openVideo(slug) {
  const selected = findVideo(slug);
  if (!selected) return;
  current = selected;
  playerPage.classList.remove('hidden');
  miniPlayer.classList.add('hidden');

  if (player) {
    player.loadVideoById(selected.videoId);
    player.playVideo();
  }

  document.getElementById('miniThumb').src = selected.thumbnailUrl;
  document.getElementById('miniTitle').textContent = selected.title;
  renderRelated();
}

function renderRelated() {
  const related = flatVideos.filter((v) => v.categorySlug === current.categorySlug);
  relatedList.innerHTML = '';
  related.forEach((v) => {
    const li = document.createElement('li');
    li.className = v.slug === current.slug ? 'active' : '';
    li.textContent = v.title;
    li.addEventListener('click', () => openVideo(v.slug));
    relatedList.appendChild(li);
  });
}

function format(t) {
  const s = Math.floor(t || 0);
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const r = String(s % 60).padStart(2, '0');
  return `${m}:${r}`;
}

function startTicker() {
  clearInterval(ticker);
  ticker = setInterval(() => {
    if (!player || typeof player.getCurrentTime !== 'function') return;
    const now = player.getCurrentTime();
    const dur = player.getDuration();
    document.getElementById('currentTime').textContent = format(now);
    document.getElementById('duration').textContent = format(dur);
    if (dur > 0) document.getElementById('seekBar').value = String((now / dur) * 100);
  }, 300);
}

window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytPlayer', {
    height: '360',
    width: '640',
    videoId: flatVideos[0]?.videoId,
    playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1 },
    events: {
      onReady: () => startTicker(),
      onStateChange: () => {
        const playing = player.getPlayerState && player.getPlayerState() === YT.PlayerState.PLAYING;
        document.getElementById('togglePlay').textContent = playing ? 'Pause' : 'Play';
        document.getElementById('miniToggle').textContent = playing ? 'Pause' : 'Play';
      },
    },
  });
};

document.getElementById('togglePlay').addEventListener('click', () => {
  if (!player) return;
  if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
  else player.playVideo();
});

document.getElementById('rewindBtn').addEventListener('click', () => {
  if (!player) return;
  player.seekTo(Math.max(0, player.getCurrentTime() - 10), true);
});

document.getElementById('forwardBtn').addEventListener('click', () => {
  if (!player) return;
  player.seekTo(Math.min(player.getDuration(), player.getCurrentTime() + 10), true);
});

document.getElementById('seekBar').addEventListener('input', (e) => {
  if (!player) return;
  const pct = Number(e.target.value) / 100;
  player.seekTo(pct * player.getDuration(), true);
});

document.getElementById('backBtn').addEventListener('click', () => {
  playerPage.classList.add('hidden');
  miniPlayer.classList.remove('hidden');
});

document.getElementById('miniToggle').addEventListener('click', (e) => {
  e.stopPropagation();
  if (!player) return;
  if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
  else player.playVideo();
});

document.getElementById('miniClose').addEventListener('click', (e) => {
  e.stopPropagation();
  miniPlayer.classList.add('hidden');
  playerPage.classList.add('hidden');
  if (player) player.pauseVideo();
});

miniPlayer.addEventListener('click', () => {
  playerPage.classList.remove('hidden');
  miniPlayer.classList.add('hidden');
});

playerPage.addEventListener('pointerdown', (e) => { dragStartY = e.clientY; });
playerPage.addEventListener('pointerup', (e) => {
  if (dragStartY == null) return;
  if (e.clientY - dragStartY > 120) {
    playerPage.classList.add('hidden');
    miniPlayer.classList.remove('hidden');
  }
  dragStartY = null;
});

renderFeed();
