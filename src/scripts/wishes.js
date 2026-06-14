import { invitation } from '../config/invitation.js';

const STORAGE_KEY = 'wedding-wishes';

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeWish(entry) {
  if (!entry?.name || !entry?.message) return null;
  return {
    id: entry.id || createId(),
    name: String(entry.name).trim(),
    message: String(entry.message).trim(),
    createdAt: entry.createdAt || new Date().toISOString(),
  };
}

function readLocalWishes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeWish).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function writeLocalWishes(wishes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
}

async function fetchSharedWishes() {
  const url = invitation.wishes?.sharedUrl;
  if (!url) return [];

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.wishes;
    return Array.isArray(list) ? list.map(normalizeWish).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function mergeWishes(...groups) {
  const seen = new Set();
  const merged = [];

  for (const group of groups) {
    for (const wish of group) {
      const key = wish.id || `${wish.name}|${wish.message}|${wish.createdAt}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(wish);
    }
  }

  return merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderWishesList(wishes) {
  const list = document.getElementById('wishes-list');
  const count = document.getElementById('wishes-count');
  const empty = document.getElementById('wishes-empty');
  if (!list) return;

  list.innerHTML = wishes
    .map(
      (wish) => `
      <article class="wish-item" data-wish-id="${escapeHtml(wish.id)}">
        <header class="wish-item-header">
          <strong class="wish-item-name">${escapeHtml(wish.name)}</strong>
          <time class="wish-item-date" datetime="${escapeHtml(wish.createdAt)}">${escapeHtml(formatDate(wish.createdAt))}</time>
        </header>
        <p class="wish-item-message">${escapeHtml(wish.message)}</p>
      </article>
    `
    )
    .join('');

  if (count) {
    count.textContent = String(wishes.length);
    count.hidden = wishes.length === 0;
  }

  if (empty) {
    empty.hidden = wishes.length > 0;
  }
}

export async function loadAllWishes() {
  const seed = (invitation.wishes?.seed || []).map(normalizeWish).filter(Boolean);
  const shared = await fetchSharedWishes();
  const local = readLocalWishes();
  return mergeWishes(seed, shared, local);
}

export async function initWishes() {
  const wishes = await loadAllWishes();
  renderWishesList(wishes);
  return wishes;
}

export async function addWish(name, message) {
  const wish = normalizeWish({
    id: createId(),
    name,
    message,
    createdAt: new Date().toISOString(),
  });

  if (!wish) return null;

  const local = readLocalWishes();
  local.unshift(wish);
  writeLocalWishes(local);

  const all = await loadAllWishes();
  renderWishesList(all);
  return wish;
}
