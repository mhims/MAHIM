// Google Apps Script source code template for Dhaka Central University (Political Science)
// Standalone Web App for Notices Management, Instant Email Dispatch, and Student Subscriber Sync.

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * ঢাকা সেন্ট্রাল ইউনিভার্সিটি - রাষ্ট্রবিজ্ঞান বিভাগ
 * নোটিশ ম্যানেজমেন্ট, পারসোনালাইজড ইমেইল ব্রডকাস্ট এবং ওয়েব অ্যাপ ড্যাশবোর্ড
 * Developed for: mahims.com/ps
 * =========================================================================
 */

// ১. ওয়েব অ্যাপ এন্ট্রি পয়েন্ট (doGet)
function doGet(e) {
  // নিশ্চিত করুন শিট স্বয়ংক্রিয়ভাবে প্রস্তুত আছে
  autoSetupSheets();

  // যদি API রিকোয়েস্ট হয় (যেমন: ওয়েবসাইট থেকে নোটিশ চাওয়া হয়)
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';
  
  if (action === 'getNotices' || (e && e.parameter && e.parameter.format === 'json')) {
    var notices = getNoticesList();
    return ContentService
      .createTextOutput(JSON.stringify(notices))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ওয়েবসাইট থেকে শিক্ষার্থী সাবস্ক্রাইব করার রিকোয়েস্ট
  if (action === 'addSubscriber') {
    var name = e.parameter.name || 'শিক্ষার্থী';
    var email = e.parameter.email || '';
    var studentId = e.parameter.studentId || '';
    var res = addSubscriberFromAdmin(name, email, studentId);
    return ContentService
      .createTextOutput(JSON.stringify(res))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // অন্যথায় সাধারণ ব্রাউজার ভিজিটরদের জন্য ওয়েব অ্যাপ ড্যাশবোর্ড ওপেন হবে
  return HtmlService
    .createHtmlOutput(getDashboardHtml())
    .setTitle('নোটিশ ড্যাশবোর্ড - রাষ্ট্রবিজ্ঞান বিভাগ (DCU)')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

// ২. স্বয়ংক্রিয়ভাবে শিট ও কলাম তৈরি (Auto Initialization)
function autoSetupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Notices শিট তৈরি ও ফরম্যাট
  var noticeSheet = ss.getSheetByName('Notices');
  if (!noticeSheet) {
    noticeSheet = ss.insertSheet('Notices');
    var noticeHeaders = [['ID', 'শিরোনাম', 'তারিখ', 'ক্যাটাগরি', 'বিস্তারিত বিবরণ', 'ইমেইল স্ট্যাটাস']];
    noticeSheet.getRange(1, 1, 1, 6).setValues(noticeHeaders);
    noticeSheet.getRange(1, 1, 1, 6)
      .setBackground('#111827')
      .setFontColor('#F59E0B')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    noticeSheet.setFrozenRows(1);
    noticeSheet.setColumnWidth(1, 120);
    noticeSheet.setColumnWidth(2, 260);
    noticeSheet.setColumnWidth(3, 130);
    noticeSheet.setColumnWidth(4, 110);
    noticeSheet.setColumnWidth(5, 380);
    noticeSheet.setColumnWidth(6, 180);
  }

  // Subscribers শিট তৈরি ও ফরম্যাট
  var subSheet = ss.getSheetByName('Subscribers');
  if (!subSheet) {
    subSheet = ss.insertSheet('Subscribers');
    var subHeaders = [['নাম', 'ইমেইল', 'রোল/আইডি', 'নিবন্ধনের তারিখ']];
    subSheet.getRange(1, 1, 1, 4).setValues(subHeaders);
    subSheet.getRange(1, 1, 1, 4)
      .setBackground('#0f172a')
      .setFontColor('#38bdf8')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    subSheet.setFrozenRows(1);
    subSheet.setColumnWidth(1, 180);
    subSheet.setColumnWidth(2, 250);
    subSheet.setColumnWidth(3, 120);
    subSheet.setColumnWidth(4, 140);
  }
}

// ৩. বর্তমান নোটিশের তালিকা রিটার্ন করা
function getNoticesList() {
  autoSetupSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Notices');
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  var notices = [];

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var title = row[1] ? String(row[1]).trim() : '';
    if (title) {
      notices.push({
        rowIndex: i + 2, // আসল শিটের রো নাম্বার (ডিলিট করার জন্য)
        id: row[0] || ('notice-' + (i + 1)),
        title: title,
        date: row[2] ? String(row[2]) : '',
        category: row[3] || 'সাধারণ',
        content: row[4] || title,
        emailStatus: row[5] || ''
      });
    }
  }

  // সর্বশেষ নোটিশ আগে দেখানো (Reverse order)
  return notices.reverse();
}

// ৪. ড্যাশবোর্ড থেকে নোটিশ প্রকাশ করা এবং পারসোনালাইজড ইমেইল পাঠানো
function publishNoticeAndSendEmails(form) {
  autoSetupSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var noticeSheet = ss.getSheetByName('Notices');
  var subSheet = ss.getSheetByName('Subscribers');

  var title = form.title ? form.title.trim() : '';
  var category = form.category || 'সাধারণ';
  var content = form.content ? form.content.trim() : '';
  
  if (!title) {
    throw new Error('দয়া করে নোটিশের শিরোনাম লিখুন!');
  }

  var now = new Date();
  var dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd MMM yyyy, hh:mm a');
  var noticeId = 'not-' + now.getTime();

  // ১. নোটিশ শিটে যুক্ত করুন
  var newRow = [noticeId, title, dateStr, category, content, 'ইমেইল প্রস্তুত হচ্ছে...'];
  noticeSheet.appendRow(newRow);
  var insertedRowIndex = noticeSheet.getLastRow();

  // ২. সাবস্ক্রাইবার তালিকা সংগ্রহ করুন
  var subLastRow = subSheet.getLastRow();
  var emailCount = 0;

  if (subLastRow > 1) {
    var subData = subSheet.getRange(2, 1, subLastRow - 1, 4).getValues();
    
    for (var i = 0; i < subData.length; i++) {
      var studentName = subData[i][0] ? String(subData[i][0]).trim() : 'শিক্ষার্থী';
      var studentEmail = subData[i][1] ? String(subData[i][1]).trim() : '';

      if (studentEmail && studentEmail.indexOf('@') > 0) {
        try {
          var htmlBody = generatePersonalizedNoticeEmail(studentName, title, category, content, dateStr);
          
          MailApp.sendEmail({
            to: studentEmail,
            subject: '🔔 [' + category + '] ' + title + ' — রাষ্ট্রবিজ্ঞান বিভাগ (DCU)',
            name: 'রাষ্ট্রবিজ্ঞান বিভাগ (DCU)',
            htmlBody: htmlBody
          });
          emailCount++;
        } catch (mailErr) {
          Logger.log('ইমেইল পাঠানো ব্যর্থ: ' + studentEmail + ' | ' + mailErr.toString());
        }
      }
    }
  }

  // স্ট্যাটাস আপডেট করুন
  var statusMsg = 'সফল (' + emailCount + ' জনকে প্রেরিত)';
  noticeSheet.getRange(insertedRowIndex, 6).setValue(statusMsg);

  return {
    success: true,
    sentCount: emailCount,
    date: dateStr
  };
}

// ৫. ড্যাশবোর্ড থেকেই নোটিশ মুছে ফেলা (Delete Notice)
function deleteNotice(rowIndex) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Notices');
  var lastRow = sheet.getLastRow();

  if (rowIndex >= 2 && rowIndex <= lastRow) {
    sheet.deleteRow(rowIndex);
    return { success: true, message: 'নোটিশ সফলভাবে মুছে ফেলা হয়েছে।' };
  } else {
    throw new Error('নোটিশটি খুঁজে পাওয়া যায়নি বা ইতিমধ্যে মুছে ফেলা হয়েছে।');
  }
}

// ৬. ড্যাশবোর্ড থেকে নতুন শিক্ষার্থী/ইমেইল যোগ করা
function addSubscriberFromAdmin(name, email, roll) {
  autoSetupSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var subSheet = ss.getSheetByName('Subscribers');

  var cleanName = name ? name.trim() : 'শিক্ষার্থী';
  var cleanEmail = email ? email.trim().toLowerCase() : '';
  var cleanRoll = roll ? roll.trim() : '-';

  if (!cleanEmail || cleanEmail.indexOf('@') <= 0) {
    throw new Error('সঠিক ইমেইল এড্রেস লিখুন!');
  }

  // ইতিমধ্যে আছে কিনা চেক করুন
  var lastRow = subSheet.getLastRow();
  if (lastRow > 1) {
    var existingEmails = subSheet.getRange(2, 2, lastRow - 1, 1).getValues();
    for (var i = 0; i < existingEmails.length; i++) {
      if (String(existingEmails[i][0]).trim().toLowerCase() === cleanEmail) {
        return { success: false, message: 'এই ইমেইলটি ইতিমধ্যে তালিকায় যুক্ত রয়েছে।' };
      }
    }
  }

  var now = new Date();
  var dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd-MM-yyyy');
  subSheet.appendRow([cleanName, cleanEmail, cleanRoll, dateStr]);

  return { success: true, message: cleanName + ' (' + cleanEmail + ') সফলভাবে যোগ করা হয়েছে।' };
}

// ৭. ড্যাশবোর্ড পরিসংখ্যান
function getDashboardStats() {
  autoSetupSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var noticeSheet = ss.getSheetByName('Notices');
  var subSheet = ss.getSheetByName('Subscribers');

  var noticeCount = Math.max(0, noticeSheet.getLastRow() - 1);
  var subCount = Math.max(0, subSheet.getLastRow() - 1);

  return {
    noticesCount: noticeCount,
    subscribersCount: subCount
  };
}

// ৮. প্রিমিয়াম পারসোনালাইজড এইচটিএমএল ইমেইল টেমপ্লেট
function generatePersonalizedNoticeEmail(studentName, title, category, content, dateStr) {
  var badgeColor = '#d97706';
  var badgeBg = '#fef3c7';
  if (category === 'জরুরি') {
    badgeColor = '#dc2626';
    badgeBg = '#fee2e2';
  } else if (category === 'পরীক্ষা') {
    badgeColor = '#7c3aed';
    badgeBg = '#ede9fe';
  } else if (category === 'ক্লাস') {
    badgeColor = '#059669';
    badgeBg = '#d1fae5';
  }

  return '<!DOCTYPE html>' +
  '<html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;">' +
  '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:25px 12px;">' +
  '<tr><td align="center">' +
  '  <table width="100%" style="max-width:580px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">' +
  '    <tr>' +
  '      <td style="background:linear-gradient(135deg,#090d16 0%,#182234 100%);padding:28px 24px;text-align:center;border-bottom:3px solid #f59e0b;">' +
  '        <div style="color:#f59e0b;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">ঢাকা সেন্ট্রাল ইউনিভার্সিটি</div>' +
  '        <div style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:0.3px;">রাষ্ট্রবিজ্ঞান বিভাগ</div>' +
  '        <div style="color:#94a3b8;font-size:12px;margin-top:4px;">অফিশিয়াল ক্লাস ও ডিপার্টমেন্ট নোটিশ বোর্ড</div>' +
  '      </td>' +
  '    </tr>' +
  '    <tr>' +
  '      <td style="padding:28px 24px;">' +
  '        <div style="font-size:16px;color:#1e293b;font-weight:700;margin-bottom:12px;">' +
  '          সালামু আলাইকুম ' + studentName + ',' +
  '        </div>' +
  '        <div style="display:inline-block;padding:4px 12px;background-color:' + badgeBg + ';color:' + badgeColor + ';border-radius:20px;font-size:11px;font-weight:700;margin-bottom:12px;">' +
  '          ' + category + ' নোটিশ' +
  '        </div>' +
  '        <h2 style="font-size:18px;color:#0f172a;margin:0 0 14px 0;line-height:1.4;font-weight:800;">' +
  '          ' + title +
  '        </h2>' +
  '        <div style="background-color:#f8fafc;border-left:4px solid #f59e0b;padding:16px;border-radius:8px;font-size:14px;color:#334155;line-height:1.65;margin-bottom:20px;white-space:pre-wrap;">' +
  '          ' + content +
  '        </div>' +
  '        <div style="font-size:12px;color:#64748b;margin-bottom:24px;">' +
  '          🗓️ প্রকাশের সময়: ' + dateStr +
  '        </div>' +
  '        <div style="text-align:center;margin-top:10px;">' +
  '          <a href="https://mahims.com/ps" style="display:inline-block;padding:12px 28px;background-color:#f59e0b;color:#000000;font-weight:700;font-size:13px;text-decoration:none;border-radius:10px;box-shadow:0 4px 12px rgba(245,158,11,0.25);">' +
  '            🌐 ওয়েবসাইটে বিস্তারিত দেখুন' +
  '          </a>' +
  '        </div>' +
  '      </td>' +
  '    </tr>' +
  '    <tr>' +
  '      <td style="background-color:#f8fafc;padding:20px 24px;text-align:center;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">' +
  '        <div style="font-weight:600;color:#334155;">প্রেরক: সিআর / রাষ্ট্রবিজ্ঞান বিভাগ, ঢাকা সেন্ট্রাল ইউনিভার্সিটি</div>' +
  '        <div style="margin-top:6px;font-size:11px;color:#94a3b8;">' +
  '          ওয়েবসাইট: <a href="https://mahims.com/ps" style="color:#d97706;text-decoration:none;">mahims.com/ps</a>' +
  '        </div>' +
  '      </td>' +
  '    </tr>' +
  '  </table>' +
  '</td></tr></table></body></html>';
}

// ৯. স্ট্যান্ডঅ্যালোন ওয়েব অ্যাপ ড্যাশবোর্ড ইন্টারফেস (HTML + Tailwind)
function getDashboardHtml() {
  return '<!DOCTYPE html>' +
  '<html lang="bn">' +
  '<head>' +
  '  <meta charset="UTF-8">' +
  '  <title>নোটিশ ড্যাশবোর্ড - রাষ্ট্রবিজ্ঞান বিভাগ</title>' +
  '  <script src="https://cdn.tailwindcss.com"></script>' +
  '  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">' +
  '  <style>body { font-family: "Hind Siliguri", sans-serif; }</style>' +
  '</head>' +
  '<body class="bg-slate-900 text-slate-100 min-h-screen pb-12">' +
  '  <header class="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 shadow-md">' +
  '    <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">' +
  '      <div>' +
  '        <div class="text-[10px] text-amber-500 font-bold uppercase tracking-wider">ঢাকা সেন্ট্রাল ইউনিভার্সিটি</div>' +
  '        <h1 class="text-base sm:text-lg font-extrabold text-white">রাষ্ট্রবিজ্ঞান বিভাগ • নোটিশ পোর্টাল</h1>' +
  '      </div>' +
  '      <a href="https://mahims.com/ps" target="_blank" class="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-500 hover:text-black font-semibold transition">' +
  '        🌐 ওয়েবসাইট দেখুন' +
  '      </a>' +
  '    </div>' +
  '  </header>' +

  '  <main class="max-w-4xl mx-auto px-4 mt-6 space-y-6">' +
  
  '    <!-- Stats Bar -->' +
  '    <div class="grid grid-cols-2 gap-3" id="statsBar">' +
  '      <div class="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl">' +
  '        <span class="text-xs text-slate-400 block">মোট প্রকাশিত নোটিশ</span>' +
  '        <span class="text-xl font-bold text-amber-400" id="statNoticeCount">...</span>' +
  '      </div>' +
  '      <div class="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl">' +
  '        <span class="text-xs text-slate-400 block">নিবন্ধিত শিক্ষার্থী</span>' +
  '        <span class="text-xl font-bold text-sky-400" id="statSubCount">...</span>' +
  '      </div>' +
  '    </div>' +

  '    <!-- Tabs -->' +
  '    <div class="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-bold">' +
  '      <button id="tabBtn1" onclick="switchTab(\'publish\')" class="px-4 py-2 rounded-xl bg-amber-500 text-black shadow transition">' +
  '        📢 নোটিশ প্রকাশ ও ইমেইল' +
  '      </button>' +
  '      <button id="tabBtn2" onclick="switchTab(\'list\')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">' +
  '        📋 নোটিশের তালিকা ও মুছে ফেলা' +
  '      </button>' +
  '      <button id="tabBtn3" onclick="switchTab(\'subscriber\')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">' +
  '        👥 শিক্ষার্থী / ইমেইল যোগ' +
  '      </button>' +
  '    </div>' +

  '    <!-- Notification Alert Box -->' +
  '    <div id="alertBox" class="hidden p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between"></div>' +

  '    <!-- TAB 1: PUBLISH NOTICE -->' +
  '    <section id="tabPublish" class="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">' +
  '      <div class="border-b border-slate-700 pb-3">' +
  '        <h2 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">' +
  '          <span>নতুন নোটিশ তৈরি ও সবার ইমেইলে প্রেরণ</span>' +
  '        </h2>' +
  '        <p class="text-xs text-slate-400 mt-1">' +
  '          এখানে নোটিশ লিখে সেভ করলেই স্বয়ংক্রিয়ভাবে গুগল শিটে যোগ হবে এবং সকল শিক্ষার্থীর ইমেইলে পারসোনালাইজড মেসেজ চলে যাবে।' +
  '        </p>' +
  '      </div>' +

  '      <form id="noticeForm" onsubmit="submitNotice(event)" class="space-y-4">' +
  '        <div>' +
  '          <label class="block text-xs font-semibold text-slate-300 mb-1">নোটিশের শিরোনাম *</label>' +
  '          <input id="nTitle" type="text" required placeholder="যেমন: আগামী রবিবার ক্লাসের সময়সূচী পরিবর্তন" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 outline-none">' +
  '        </div>' +

  '        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
  '          <div>' +
  '            <label class="block text-xs font-semibold text-slate-300 mb-1">ক্যাটাগরি</label>' +
  '            <select id="nCategory" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 outline-none">' +
  '              <option value="সাধারণ">সাধারণ নোটিশ</option>' +
  '              <option value="জরুরি">জরুরি ঘোষণা</option>' +
  '              <option value="ক্লাস">ক্লাস আপডেট</option>' +
  '              <option value="পরীক্ষা">পরীক্ষা সংক্রান্ত</option>' +
  '              <option value="ছুটি">ছুটির নোটিশ</option>' +
  '            </select>' +
  '          </div>' +
  '        </div>' +

  '        <div>' +
  '          <label class="block text-xs font-semibold text-slate-300 mb-1">বিস্তারিত বিবরণ *</label>' +
  '          <textarea id="nContent" rows="4" required placeholder="নোটিশের সম্পূর্ণ বিবরণ এখানে লিখুন..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 outline-none"></textarea>' +
  '        </div>' +

  '        <div class="pt-2">' +
  '          <button type="submit" id="btnPublish" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer">' +
  '            <span>🚀 নোটিশ প্রকাশ ও সবার ইমেইলে পাঠান</span>' +
  '          </button>' +
  '        </div>' +
  '      </form>' +
  '    </section>' +

  '    <!-- TAB 2: NOTICE LIST & DELETE -->' +
  '    <section id="tabList" class="hidden space-y-4">' +
  '      <div class="flex items-center justify-between">' +
  '        <h2 class="text-sm font-bold text-white">সকল নোটিশ ও ডিলিট অপশন</h2>' +
  '        <button onclick="loadNotices()" class="text-xs text-amber-400 hover:underline">🔄 রিফ্রেশ</button>' +
  '      </div>' +
  '      <div id="noticeListContainer" class="space-y-3">' +
  '        <div class="p-8 text-center text-xs text-slate-400">নোটিশ লোড হচ্ছে...</div>' +
  '      </div>' +
  '    </section>' +

  '    <!-- TAB 3: ADD SUBSCRIBER -->' +
  '    <section id="tabSubscriber" class="hidden bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">' +
  '      <div class="border-b border-slate-700 pb-3">' +
  '        <h2 class="text-sm sm:text-base font-bold text-white">নতুন শিক্ষার্থী / ইমেইল যোগ করুন</h2>' +
  '        <p class="text-xs text-slate-400 mt-1">' +
  '          যেকোনো নতুন শিক্ষার্থীর নাম ও ইমেইল এখানে যোগ করলেই তারা পরবর্তী সব নোটিশ স্বয়ংক্রিয়ভাবে পাবে।' +
  '        </p>' +
  '      </div>' +

  '      <!-- Security Notice regarding deletion -->' +
  '      <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed">' +
  '        🔒 <strong>গুরুত্বপূর্ণ সুরক্ষা নিয়ম:</strong> শিক্ষার্থীদের ডাটাবেজ সুরক্ষিত রাখতে ইমেইল ডিলিট করার ব্যবস্থা শুধুমাত্র গুগল শিটের ভিতরে রাখা হয়েছে। ইমেইল ডিলিট করতে হলে সরাসরি গুগল শিটে গিয়ে রো ডিলিট করুন।' +
  '      </div>' +

  '      <form id="subForm" onsubmit="submitSubscriber(event)" class="space-y-3.5">' +
  '        <div>' +
  '          <label class="block text-xs font-semibold text-slate-300 mb-1">শিক্ষার্থীর নাম *</label>' +
  '          <input id="sName" type="text" required placeholder="যেমন: সাকিব হাসান" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 outline-none">' +
  '        </div>' +

  '        <div>' +
  '          <label class="block text-xs font-semibold text-slate-300 mb-1">ইমেইল এড্রেস *</label>' +
  '          <input id="sEmail" type="email" required placeholder="example@gmail.com" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 outline-none">' +
  '        </div>' +

  '        <div>' +
  '          <label class="block text-xs font-semibold text-slate-300 mb-1">রোল / স্টুডেন্ট আইডি (ঐচ্ছিক)</label>' +
  '          <input id="sRoll" type="text" placeholder="যেমন: 105" class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 outline-none">' +
  '        </div>' +

  '        <button type="submit" id="btnSub" class="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs transition cursor-pointer">' +
  '          ➕ শিক্ষার্থী যুক্ত করুন' +
  '        </button>' +
  '      </form>' +
  '    </section>' +

  '  </main>' +

  '  <script>' +
  '    function switchTab(tab) {' +
  '      var t1 = document.getElementById("tabPublish");' +
  '      var t2 = document.getElementById("tabList");' +
  '      var t3 = document.getElementById("tabSubscriber");' +
  '      var b1 = document.getElementById("tabBtn1");' +
  '      var b2 = document.getElementById("tabBtn2");' +
  '      var b3 = document.getElementById("tabBtn3");' +
  '      ' +
  '      t1.classList.add("hidden");' +
  '      t2.classList.add("hidden");' +
  '      t3.classList.add("hidden");' +
  '      b1.className = "px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition";' +
  '      b2.className = "px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition";' +
  '      b3.className = "px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition";' +
  '      ' +
  '      if (tab === "publish") {' +
  '        t1.classList.remove("hidden");' +
  '        b1.className = "px-4 py-2 rounded-xl bg-amber-500 text-black shadow transition";' +
  '      } else if (tab === "list") {' +
  '        t2.classList.remove("hidden");' +
  '        b2.className = "px-4 py-2 rounded-xl bg-amber-500 text-black shadow transition";' +
  '        loadNotices();' +
  '      } else if (tab === "subscriber") {' +
  '        t3.classList.remove("hidden");' +
  '        b3.className = "px-4 py-2 rounded-xl bg-sky-400 text-black shadow transition";' +
  '      }' +
  '    }' +

  '    function showAlert(msg, isError) {' +
  '      var a = document.getElementById("alertBox");' +
  '      a.className = "p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between " + (isError ? "bg-rose-950/60 border border-rose-800 text-rose-300" : "bg-emerald-950/60 border border-emerald-800 text-emerald-300");' +
  '      a.innerHTML = "<span>" + msg + "</span><button onclick=\'this.parentElement.classList.add(\\"hidden\\")\' class=\'text-slate-400 hover:text-white\'>✕</button>";' +
  '      a.classList.remove("hidden");' +
  '      window.scrollTo({ top: 0, behavior: "smooth" });' +
  '    }' +

  '    function refreshStats() {' +
  '      google.script.run.withSuccessHandler(function(stats) {' +
  '        document.getElementById("statNoticeCount").innerText = stats.noticesCount + "টি";' +
  '        document.getElementById("statSubCount").innerText = stats.subscribersCount + " জন";' +
  '      }).getDashboardStats();' +
  '    }' +

  '    function submitNotice(e) {' +
  '      e.preventDefault();' +
  '      var btn = document.getElementById("btnPublish");' +
  '      btn.disabled = true;' +
  '      btn.innerText = "⏳ সংরক্ষণ ও ইমেইল পাঠানো হচ্ছে...";' +
  '      ' +
  '      var form = {' +
  '        title: document.getElementById("nTitle").value,' +
  '        category: document.getElementById("nCategory").value,' +
  '        content: document.getElementById("nContent").value' +
  '      };' +
  '      ' +
  '      google.script.run' +
  '        .withSuccessHandler(function(res) {' +
  '          btn.disabled = false;' +
  '          btn.innerHTML = "<span>🚀 নোটিশ প্রকাশ ও সবার ইমেইলে পাঠান</span>";' +
  '          document.getElementById("nTitle").value = "";' +
  '          document.getElementById("nContent").value = "";' +
  '          showAlert("✅ নোটিশ সফলভাবে প্রকাশিত হয়েছে এবং " + res.sentCount + " জন শিক্ষার্থীর ইমেইলে পৌঁছে গেছে!", false);' +
  '          refreshStats();' +
  '        })' +
  '        .withFailureHandler(function(err) {' +
  '          btn.disabled = false;' +
  '          btn.innerHTML = "<span>🚀 নোটিশ প্রকাশ ও সবার ইমেইলে পাঠান</span>";' +
  '          showAlert("❌ সমস্যা হয়েছে: " + err.message, true);' +
  '        })' +
  '        .publishNoticeAndSendEmails(form);' +
  '    }' +

  '    function loadNotices() {' +
  '      var container = document.getElementById("noticeListContainer");' +
  '      container.innerHTML = "<div class=\'p-8 text-center text-xs text-slate-400\'>লোড হচ্ছে...</div>";' +
  '      ' +
  '      google.script.run.withSuccessHandler(function(notices) {' +
  '        if (!notices || notices.length === 0) {' +
  '          container.innerHTML = "<div class=\'bg-slate-800/60 p-8 rounded-2xl text-center text-xs text-slate-400\'>বর্তমানে কোনো নোটিশ নেই। নতুন নোটিশ প্রকাশ করুন।</div>";' +
  '          return;' +
  '        }' +
  '        ' +
  '        var html = "";' +
  '        for (var i = 0; i < notices.length; i++) {' +
  '          var n = notices[i];' +
  '          html += "<div class=\'bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3\'>" +' +
  '                  "  <div class=\'space-y-1\'>" +' +
  '                  "    <div class=\'flex items-center gap-2\'>" +' +
  '                  "      <span class=\'px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]\'>" + n.category + "</span>" +' +
  '                  "      <span class=\'text-[10px] text-slate-400\'>🗓️ " + n.date + "</span>" +' +
  '                  "    </div>" +' +
  '                  "    <h3 class=\'text-sm font-bold text-white\'>" + n.title + "</h3>" +' +
  '                  "    <p class=\'text-xs text-slate-300 line-clamp-2\'>" + n.content + "</p>" +' +
  '                  "  </div>" +' +
  '                  "  <div class=\'shrink-0 text-right\'>" +' +
  '                  "    <button onclick=\'confirmDeleteNotice(" + n.rowIndex + ", \\"" + escape(n.title) + "\\")\' class=\'px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold transition\'>" +' +
  '                  "      🗑️ মুছে ফেলুন" +' +
  '                  "    </button>" +' +
  '                  "  </div>" +' +
  '                  "</div>";' +
  '        }' +
  '        container.innerHTML = html;' +
  '      }).getNoticesList();' +
  '    }' +

  '    function confirmDeleteNotice(rowIndex, encodedTitle) {' +
  '      var title = unescape(encodedTitle);' +
  '      if (confirm("আপনি কি নিশ্চিত এই নোটিশটি মুছে ফেলতে চান?\\n\\n" + title)) {' +
  '        google.script.run' +
  '          .withSuccessHandler(function(res) {' +
  '            showAlert(res.message, false);' +
  '            loadNotices();' +
  '            refreshStats();' +
  '          })' +
  '          .withFailureHandler(function(err) {' +
  '            showAlert("মুছে ফেলা সম্ভব হয়নি: " + err.message, true);' +
  '          })' +
  '          .deleteNotice(rowIndex);' +
  '      }' +
  '    }' +

  '    function submitSubscriber(e) {' +
  '      e.preventDefault();' +
  '      var btn = document.getElementById("btnSub");' +
  '      btn.disabled = true;' +
  '      btn.innerText = "যোগ হচ্ছে...";' +
  '      ' +
  '      var name = document.getElementById("sName").value;' +
  '      var email = document.getElementById("sEmail").value;' +
  '      var roll = document.getElementById("sRoll").value;' +
  '      ' +
  '      google.script.run' +
  '        .withSuccessHandler(function(res) {' +
  '          btn.disabled = false;' +
  '          btn.innerText = "➕ শিক্ষার্থী যুক্ত করুন";' +
  '          if (res.success) {' +
  '            document.getElementById("sName").value = "";' +
  '            document.getElementById("sEmail").value = "";' +
  '            document.getElementById("sRoll").value = "";' +
  '            showAlert("✅ " + res.message, false);' +
  '            refreshStats();' +
  '          } else {' +
  '            showAlert("⚠️ " + res.message, true);' +
  '          }' +
  '        })' +
  '        .withFailureHandler(function(err) {' +
  '          btn.disabled = false;' +
  '          btn.innerText = "➕ শিক্ষার্থী যুক্ত করুন";' +
  '          showAlert("❌ সমস্যা: " + err.message, true);' +
  '        })' +
  '        .addSubscriberFromAdmin(name, email, roll);' +
  '    }' +

  '    window.onload = function() {' +
  '      refreshStats();' +
  '    };' +
  '  </script>' +
  '</body>' +
  '</html>';
}
`;
