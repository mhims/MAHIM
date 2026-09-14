// Google Sheets Integration Helper using Google Apps Script Webhook

export interface SheetRowPayload {
  action: 'register_user' | 'contact_message' | 'newsletter';
  timestamp?: string;
  name?: string;
  email?: string;
  phone?: string;
  occupation?: string;
  role?: string;
  status?: string;
  subject?: string;
  message?: string;
  source?: string;
}

export async function sendToGoogleSheet(webhookUrl: string, payload: SheetRowPayload): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, message: 'Google Sheets Webhook URL কনফিগার করা নেই।' };
  }

  try {
    const dataToSend = {
      ...payload,
      timestamp: new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' }),
      source: 'mahims.com',
    };

    // Google Apps Script requires mode: 'no-cors' or standard JSON response
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(dataToSend),
      mode: 'no-cors',
    });

    return { success: true, message: 'সফলভাবে গুগল শিটে সিঙ্ক হয়েছে।' };
  } catch (error) {
    console.error('Failed to send to Google Sheet:', error);
    return { success: false, message: 'গুগল শিটে পাঠাতে সমস্যা হয়েছে।' };
  }
}

// Ready-to-copy Google Apps Script code for Mahim's Google Sheet
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * mahims.com - Unified Google Sheets Webhook Receiver
 * (Visitors Analytics, Users Database & Contact Messages)
 * 
 * কীভাবে সেটআপ করবেন:
 * ১. আপনার Google Drive থেকে একটি নতুন Google Sheet খুলুন (নাম দিতে পারেন: Mahims Analytics & Database)।
 * ২. মেনু থেকে Extensions > Apps Script-এ যান।
 * ৩. কোড এডিটরে থাকা আগের কোড মুছে এই সম্পূর্ণ কোডটি পেস্ট করুন এবং Save (Ctrl+S) করুন।
 * ৪. উপরে ডানে 'Deploy' > 'New deployment' ক্লিক করুন।
 * ৫. বাম পাশের গিয়ার আইকন থেকে 'Web app' বেছে নিন।
 * ৬. Description: Mahims Webhook
 * ৭. Execute as: 'Me' (আপনার নিজস্ব জিমেইল অ্যাকাউন্ট)
 * ৮. Who has access: 'Anyone' (যাতে ওয়েবসাইট থেকে স্বয়ংক্রিয়ভাবে ডাটা আসতে পারে)
 * ৯. 'Deploy' বাটনে ক্লিক করে Google Permission এক্সেপ্ট বা এলাউ করুন।
 * ১০. প্রাপ্ত 'Web app URL' কপি করে mahims.com এর এডমিন প্যানেলে (গুগল শিট ট্যাবে) পেস্ট করে সেভ করুন।
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var action = data.action || 'visitor_log';

    // 1. VISITOR TRACKING (লাইভ ভিজিটর ট্র্যাকিং)
    if (action === 'visitor_log') {
      var sheetName = 'Visitors';
      var vSheet = ss.getSheetByName(sheetName);

      if (!vSheet) {
        vSheet = ss.insertSheet(sheetName);
        vSheet.appendRow([
          'তারিখ ও সময় (Time)',
          'পেজ (Page)',
          'আইপি (IP)',
          'লোকেশন (Location)',
          'ডিভাইস (Device)',
          'অপারেটিং সিস্টেম (OS)',
          'ব্রাউজার (Browser)',
          'সাইটে থাকার সময় (Time Spent)',
          'কোথা থেকে এসেছে (Referrer)',
          'স্ক্রিন রেজুলেশন (Screen)',
          'সেশন আইডি (Session ID)'
        ]);

        var headerRange = vSheet.getRange(1, 1, 1, 11);
        headerRange.setFontWeight('bold')
                   .setBackground('#0f172a')
                   .setFontColor('#f8fafc')
                   .setHorizontalAlignment('center');
        vSheet.setFrozenRows(1);
        vSheet.setColumnWidth(1, 170); // Time
        vSheet.setColumnWidth(2, 210); // Page
        vSheet.setColumnWidth(3, 130); // IP
        vSheet.setColumnWidth(4, 160); // Location
        vSheet.setColumnWidth(5, 140); // Device
        vSheet.setColumnWidth(6, 120); // OS
        vSheet.setColumnWidth(7, 120); // Browser
        vSheet.setColumnWidth(8, 160); // Time Spent
        vSheet.setColumnWidth(9, 160); // Referrer
        vSheet.setColumnWidth(10, 110); // Screen
        vSheet.setColumnWidth(11, 180); // Session ID
      }

      var sessionId = String(data.sessionId || '');
      var lastRow = vSheet.getLastRow();
      var foundRow = -1;

      // Update Time Spent if this page session already exists
      if (sessionId && lastRow > 1) {
        var checkRows = Math.min(lastRow - 1, 300);
        var sessionIds = vSheet.getRange(lastRow - checkRows + 1, 11, checkRows, 1).getValues();
        for (var i = sessionIds.length - 1; i >= 0; i--) {
          if (String(sessionIds[i][0]) === sessionId) {
            foundRow = (lastRow - checkRows + 1) + i;
            break;
          }
        }
      }

      if (foundRow > 0) {
        vSheet.getRange(foundRow, 8).setValue(data.timeSpent || 'সক্রিয়...');
        if (data.ip && data.ip !== 'Unknown') vSheet.getRange(foundRow, 3).setValue(data.ip);
        if (data.location && data.location !== 'Unknown') vSheet.getRange(foundRow, 4).setValue(data.location);
      } else {
        vSheet.appendRow([
          data.timestamp || Utilities.formatDate(new Date(), 'Asia/Dhaka', 'dd/MM/yyyy, hh:mm:ss a'),
          data.page || '/',
          data.ip || 'Unknown',
          data.location || 'Unknown',
          data.device || 'Desktop',
          data.os || 'Windows',
          data.browser || 'Chrome',
          data.timeSpent || 'সক্রিয় রয়েছে...',
          data.referrer || 'সরাসরি (Direct)',
          data.screen || '',
          sessionId
        ]);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. CONTACT MESSAGES (যোগাযোগ ফর্মের মেসেজ)
    if (action === 'contact_message') {
      var msgSheet = ss.getSheetByName('Messages');
      if (!msgSheet) {
        msgSheet = ss.insertSheet('Messages');
        msgSheet.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message', 'Source']);
        msgSheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
      }
      msgSheet.appendRow([
        data.timestamp || new Date(),
        data.name || '',
        data.email || '',
        data.subject || '',
        data.message || '',
        data.source || 'mahims.com'
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. USER REGISTRATIONS (ইউজার রেজিস্ট্রেশন)
    if (action === 'register_user') {
      var userSheet = ss.getSheetByName('Users');
      if (!userSheet) {
        userSheet = ss.insertSheet('Users');
        userSheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Occupation', 'Role', 'Status', 'Source']);
        userSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
      }
      userSheet.appendRow([
        data.timestamp || new Date(),
        data.name || '',
        data.email || '',
        data.phone || '',
        data.occupation || '',
        data.role || 'user',
        data.status || 'pending',
        data.source || 'mahims.com'
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'unknown_action' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var param = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'get_visitors';

    // 1. MESSAGES SYNC
    if (param === 'get_messages' || param === 'messages') {
      var mSheet = ss.getSheetByName('Messages');
      var messages = [];
      if (mSheet && mSheet.getLastRow() > 1) {
        var mRows = mSheet.getLastRow() - 1;
        var mValues = mSheet.getRange(2, 1, mRows, 6).getValues();
        for (var m = mValues.length - 1; m >= 0; m--) {
          var mRow = mValues[m];
          if (mRow[0] || mRow[1]) {
            messages.push({
              timestamp: mRow[0],
              name: mRow[1],
              email: mRow[2],
              subject: mRow[3],
              message: mRow[4],
              source: mRow[5]
            });
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        count: messages.length,
        messages: messages
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. USERS SYNC
    if (param === 'get_users' || param === 'users') {
      var uSheet = ss.getSheetByName('Users');
      var users = [];
      if (uSheet && uSheet.getLastRow() > 1) {
        var uRows = uSheet.getLastRow() - 1;
        var uValues = uSheet.getRange(2, 1, uRows, 8).getValues();
        for (var u = uValues.length - 1; u >= 0; u--) {
          var uRow = uValues[u];
          if (uRow[0] || uRow[1]) {
            users.push({
              timestamp: uRow[0],
              name: uRow[1],
              email: uRow[2],
              phone: uRow[3],
              occupation: uRow[4],
              role: uRow[5],
              status: uRow[6],
              source: uRow[7]
            });
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        count: users.length,
        users: users
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. VISITORS SYNC (DEFAULT)
    var vSheet = ss.getSheetByName('Visitors');
    var visitors = [];
    if (vSheet && vSheet.getLastRow() > 1) {
      var numRows = vSheet.getLastRow() - 1;
      // Get up to last 500 visitors
      var fetchRows = Math.min(numRows, 500);
      var startRow = vSheet.getLastRow() - fetchRows + 1;
      var values = vSheet.getRange(startRow, 1, fetchRows, 11).getValues();

      for (var i = values.length - 1; i >= 0; i--) {
        var row = values[i];
        if (row[0] || row[1]) {
          visitors.push({
            timestamp: row[0],
            page: row[1] || '/',
            ip: row[2] || 'Unknown',
            location: row[3] || 'Unknown',
            device: row[4] || 'Desktop',
            os: row[5] || 'Windows',
            browser: row[6] || 'Chrome',
            timeSpent: row[7] || 'সক্রিয়...',
            referrer: row[8] || 'Direct',
            screen: row[9] || '',
            sessionId: row[10] || ''
          });
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      count: visitors.length,
      visitors: visitors
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString(),
      visitors: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
