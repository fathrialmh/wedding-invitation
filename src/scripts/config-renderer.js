import { invitation } from '../config/invitation.js';

function get(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

function setCssVars() {
  const a = invitation.assets;
  const root = document.documentElement;
  root.style.setProperty('--page-bg', `url(${a.pageBg})`);
  root.style.setProperty('--cover-bg', `url(${a.coverBg})`);
  root.style.setProperty('--ayat-bg', `url(${a.ayatBg})`);
  root.style.setProperty('--profile-bg', `url(${a.profileBg})`);
  root.style.setProperty('--save-date-bg', `url(${a.saveDateBg})`);
  root.style.setProperty('--event-bg', `url(${a.eventBg})`);
  root.style.setProperty('--wishes-bg', `url(${a.wishesBg})`);
  root.style.setProperty('--closing-bg', `url(${a.closingBg})`);
  root.style.setProperty('--sidebar-bg', `url(${a.sidebarBg})`);
}

function bindText() {
  document.querySelectorAll('[data-bind]').forEach((el) => {
    const val = get(invitation, el.dataset.bind);
    if (val !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.innerHTML = String(val).replace(/\n/g, '<br>');
      }
    }
  });
}

function bindImages() {
  document.querySelectorAll('[data-src]').forEach((el) => {
    const val = get(invitation, el.dataset.src);
    if (val) el.src = val;
  });
}

function bindLinks() {
  document.querySelectorAll('[data-href]').forEach((el) => {
    const val = get(invitation, el.dataset.href);
    if (val) {
      el.href = val;
      if (el.dataset.external) el.target = '_blank';
    }
  });
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.innerHTML = invitation.gallery.images
    .map(
      (img, i) => `
    <a href="/assets/images/${img}" data-pswp-width="1200" data-pswp-height="1800" data-index="${i}">
      <img src="/assets/images/${img}" alt="Gallery ${i + 1}" loading="lazy" />
    </a>`
    )
    .join('');
}

function renderStoryCarousel() {
  const wrap = document.getElementById('story-carousel');
  if (!wrap) return;
  wrap.innerHTML = invitation.story.carouselImages
    .map(
      (img) => `
    <div class="swiper-slide">
      <img src="/assets/images/${img}" alt="" loading="lazy" />
    </div>`
    )
    .join('');
}

function renderStoryChapters() {
  const wrap = document.getElementById('story-chapters');
  if (!wrap) return;
  wrap.innerHTML = invitation.story.chapters
    .map(
      (ch) => `
    <div class="story-chapter elementor-invisible" data-animation="fadeInUp">
      <h3>${ch.title}</h3>
      <p>${ch.text}</p>
    </div>`
    )
    .join('');
}

function renderBanks() {
  const wrap = document.getElementById('gift-banks');
  if (!wrap) return;
  wrap.innerHTML = invitation.gift.banks
    .map(
      (b, i) => `
    <div class="card-info" style="transition-delay: ${0.1 + i * 0.3}s">
      <div class="bank-name">${b.bank}</div>
      <div class="bank-row">
        <span class="bank-number" data-copy-text="${b.number}">${b.number}</span>
        <button class="btn-copy" data-copy="${b.number}" aria-label="Copy"><i class="fa-regular fa-copy"></i></button>
      </div>
      <div class="bank-holder">${b.name}</div>
    </div>`
    )
    .join('');
}

function renderRsvpOptions() {
  const select = document.getElementById('rsvp-guests');
  if (!select) return;
  select.innerHTML = invitation.rsvp.guestCounts
    .map((n) => `<option value="${n}">${n}</option>`)
    .join('');

  const radios = document.getElementById('rsvp-attendance');
  if (!radios) return;
  radios.innerHTML = invitation.rsvp.attendanceOptions
    .map(
      (opt, i) => `
    <label>
      <input type="radio" name="attendance" value="${opt}" ${i === 0 ? 'required' : ''} />
      ${opt}
    </label>`
    )
    .join('');
}

export function initConfigRenderer() {
  document.title = invitation.meta.title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = invitation.meta.description;

  setCssVars();
  bindText();
  bindImages();
  bindLinks();
  renderGallery();
  renderStoryCarousel();
  renderStoryChapters();
  renderBanks();
  renderRsvpOptions();

  const guestEl = document.querySelector('[data-fill-param="to"]');
  if (guestEl && !guestEl.textContent.trim()) {
    guestEl.textContent = invitation.defaultGuestName;
  }
}

export { invitation };
