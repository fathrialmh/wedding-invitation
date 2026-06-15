/**
 * Wedding Invitation — Google Apps Script
 *
 * Setup:
 * 1. Create a new Google Sheet
 * 2. Extensions → Apps Script → paste this file → Save
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into src/config/invitation.js → googleScript.url
 */

function doGet(e) {
  const action = e?.parameter?.action;

  if (action === 'wishes') {
    return jsonResponse({ success: true, wishes: getWishes() });
  }

  return jsonResponse({ success: false, message: 'Unknown action' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'wish') {
      appendWish(data.name, data.message);
      return jsonResponse({ success: true });
    }

    if (data.action === 'rsvp') {
      appendRsvp(data.name, data.guestCount, data.attendance);
      return jsonResponse({ success: true });
    }

    return jsonResponse({ success: false, message: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ success: false, message: String(err.message || err) });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function appendWish(name, message) {
  if (!name || !message) {
    throw new Error('Name and message are required');
  }

  const sheet = getOrCreateSheet('Wishes', ['Timestamp', 'Name', 'Message', 'ID']);
  const id = Utilities.getUuid();
  const timestamp = new Date().toISOString();

  sheet.appendRow([timestamp, String(name).trim(), String(message).trim(), id]);
}

function appendRsvp(name, guestCount, attendance) {
  if (!name || attendance === undefined || attendance === null || attendance === '') {
    throw new Error('Name and attendance are required');
  }

  const sheet = getOrCreateSheet('RSVP', ['Timestamp', 'Name', 'Guest Count', 'Attendance']);
  const timestamp = new Date().toISOString();

  sheet.appendRow([
    timestamp,
    String(name).trim(),
    Number(guestCount) || 0,
    String(attendance).trim(),
  ]);
}

function getWishes() {
  const sheet = getOrCreateSheet('Wishes', ['Timestamp', 'Name', 'Message', 'ID']);
  const rows = sheet.getDataRange().getValues();

  if (rows.length <= 1) return [];

  return rows
    .slice(1)
    .reverse()
    .map(function (row) {
      const timestamp = row[0];
      return {
        id: String(row[3] || ''),
        name: String(row[1] || ''),
        message: String(row[2] || ''),
        createdAt:
          timestamp instanceof Date
            ? timestamp.toISOString()
            : String(timestamp || new Date().toISOString()),
      };
    })
    .filter(function (wish) {
      return wish.name && wish.message;
    });
}
