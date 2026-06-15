import { invitation } from '../config/invitation.js';

function getScriptUrl() {
  const url = invitation.googleScript?.url?.trim();
  return url || null;
}

export function isGoogleScriptConfigured() {
  return Boolean(getScriptUrl());
}

async function parseJsonResponse(res) {
  const data = await res.json();
  if (!data?.success) {
    throw new Error(data?.message || 'Request failed');
  }
  return data;
}

export async function fetchWishesFromGoogleScript() {
  const url = getScriptUrl();
  if (!url) return [];

  const endpoint = `${url}${url.includes('?') ? '&' : '?'}action=wishes`;
  const res = await fetch(endpoint, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load wishes');

  const data = await parseJsonResponse(res);
  return Array.isArray(data.wishes) ? data.wishes : [];
}

export async function submitWishToGoogleScript(name, message) {
  const url = getScriptUrl();
  if (!url) throw new Error('Google Script URL is not configured');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'wish', name, message }),
  });

  if (!res.ok) throw new Error('Failed to send wish');
  return parseJsonResponse(res);
}

export async function submitRsvpToGoogleScript({ name, guestCount, attendance }) {
  const url = getScriptUrl();
  if (!url) throw new Error('Google Script URL is not configured');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'rsvp',
      name,
      guestCount,
      attendance,
    }),
  });

  if (!res.ok) throw new Error('Failed to send RSVP');
  return parseJsonResponse(res);
}
