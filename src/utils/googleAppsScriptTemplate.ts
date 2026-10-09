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
  try {
    autoSetupSheets();
  } catch (err) {
    Logger.log('setup error: ' + err.toString());
  }

  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';
  
  // API: ওয়েবসাইট থেকে নোটিশের তালিকা চাওয়া
  if (action === 'getNotices' || (e && e.parameter && e.parameter.format === 'json')) {
    var notices = getNoticesList();
    return ContentService
      .createTextOutput(JSON.stringify(notices))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // API: ওয়েবসাইট থেকে শিক্ষার্থী যুক্ত করার রিকোয়েস্ট
  if (action === 'addSubscriber') {
    var name = e.parameter.name || 'শিক্ষার্থী';
    var email = e.parameter.email || '';
    var studentId = e.parameter.studentId || '';
    var res = addSubscriberFromAdmin(name, email, studentId);
    return ContentService
      .createTextOutput(JSON.stringify(res))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ব্রাউজারে ড্যাশবোর্ড ওয়েব অ্যাপ ওপেন হবে
  return HtmlService
    .createHtmlOutput(getDashboardHtml())
    .setTitle('নোটিশ ড্যাশবোর্ড - রাষ্ট্রবিজ্ঞান বিভাগ (DCU)')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

// ২. স্বয়ংক্রিয়ভাবে শিট ও কলাম তৈরি (Auto Initialization)
function autoSetupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return;

  // Notices শিট তৈরি
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
    noticeSheet.setColumnWidth(3, 100);
    noticeSheet.setColumnWidth(4, 120);
    noticeSheet.setColumnWidth(5, 380);
    noticeSheet.setColumnWidth(6, 180);
  }

  // Subscribers শিট তৈরি
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
    subSheet.setColumnWidth(4, 120);
  }
}

// তারিখ ছোট করে সাজানোর ফাংশন (যেমন: 9 OCT, 10 OCT)
function formatShortDate(d) {
  if (!d) return '';
  var dateObj = (d instanceof Date) ? d : new Date(d);
  if (!isNaN(dateObj.getTime())) {
    var day = dateObj.getDate();
    var months = ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'];
    // standard months array
    var allMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return day + ' ' + allMonths[dateObj.getMonth()];
  }
  var str = String(d)
    .replace(/\\s*\\(.*?Standard Time.*?\\)/gi, '')
    .replace(/\\s*\\(.*?Bangladesh.*?\\)/gi, '')
    .replace(/\\s*GMT[+-]\\d{4}/gi, '')
    .trim();
  var match = str.match(/(\\d{1,2})\\s+([A-Za-z]{3,4})/);
  if (match) return match[1] + ' ' + match[2].toUpperCase();
  return str;
}

// ৩. বর্তমান নোটিশের তালিকা রিটার্ন করা
function getNoticesList() {
  try {
    autoSetupSheets();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return [];
    var sheet = ss.getSheetByName('Notices');
    if (!sheet) return [];
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) return [];

    var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
    var notices = [];

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var title = row[1] ? String(row[1]).trim() : '';
      if (title) {
        notices.push({
          rowIndex: Number(i + 2),
          id: String(row[0] || ('notice-' + (i + 1))),
          title: String(title),
          date: formatShortDate(row[2]),
          category: String(row[3] || 'সাধারণ নোটিশ'),
          content: String(row[4] || title),
          emailStatus: String(row[5] || '')
        });
      }
    }

    return notices.reverse();
  } catch (err) {
    Logger.log('getNoticesList error: ' + err.toString());
    return [];
  }
}

// ৪. ড্যাশবোর্ড থেকে নোটিশ প্রকাশ করা এবং পারসোনালাইজড ইমেইল পাঠানো
function publishNoticeAndSendEmails(form) {
  try {
    autoSetupSheets();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: 'গুগল শিট পাওয়া যায়নি।' };
    var noticeSheet = ss.getSheetByName('Notices');
    var subSheet = ss.getSheetByName('Subscribers');

    var category = (form && form.category && form.category.trim()) ? form.category.trim() : 'সাধারণ নোটিশ';
    var rawTitle = (form && form.title) ? form.title.trim() : '';
    
    // শিরোনাম ফাঁকা রাখলে স্বয়ংক্রিয়ভাবে ক্যাটাগরিই হবে শিরোনাম
    var title = rawTitle;
    if (!title) {
      if (category === 'সাধারণ') {
        title = 'সাধারণ নোটিশ';
      } else if (category.indexOf('নোটিশ') !== -1 || category.indexOf('আপডেট') !== -1 || category.indexOf('ঘোষণা') !== -1) {
        title = category;
      } else {
        title = category + ' নোটিশ';
      }
    }

    var content = (form && form.content) ? form.content.trim() : '';
    if (!content) {
      return { success: false, message: 'দয়া করে নোটিশের বিস্তারিত বিবরণ লিখুন!' };
    }

    // সংক্ষেপিত তারিখ (যেমন: 9 OCT)
    var now = new Date();
    var allMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var shortDate = now.getDate() + ' ' + allMonths[now.getMonth()];
    var noticeId = 'not-' + now.getTime();

    // ১. নোটিশ শিটে যুক্ত করুন
    var newRow = [noticeId, title, shortDate, category, content, 'ইমেইল প্রস্তুত হচ্ছে...'];
    noticeSheet.appendRow(newRow);
    var insertedRowIndex = noticeSheet.getLastRow();

    // ২. সাবস্ক্রাইবার তালিকা সংগ্রহ ও ইমেইল প্রেরণ
    var subLastRow = subSheet.getLastRow();
    var emailCount = 0;

    if (subLastRow > 1) {
      var subData = subSheet.getRange(2, 1, subLastRow - 1, 4).getValues();
      
      for (var i = 0; i < subData.length; i++) {
        var studentName = subData[i][0] ? String(subData[i][0]).trim() : 'শিক্ষার্থী';
        var studentEmail = subData[i][1] ? String(subData[i][1]).trim() : '';

        if (studentEmail && studentEmail.indexOf('@') > 0) {
          try {
            var htmlBody = generatePersonalizedNoticeEmail(studentName, title, category, content, shortDate);
            
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
      title: title,
      date: shortDate,
      message: 'নোটিশ সফলভাবে প্রকাশিত হয়েছে (' + title + ') এবং ' + emailCount + ' জন শিক্ষার্থীর কাছে পৌঁছে গেছে!'
    };
  } catch (err) {
    Logger.log('publishNotice error: ' + err.toString());
    return { success: false, message: 'ত্রুটি: ' + err.toString() };
  }
}

// ৫. ড্যাশবোর্ড থেকেই নোটিশ মুছে ফেলা (Delete Notice)
function deleteNotice(rowIndex) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: 'গুগল শিট পাওয়া যায়নি।' };
    var sheet = ss.getSheetByName('Notices');
    if (!sheet) return { success: false, message: 'Notices শিট পাওয়া যায়নি।' };
    var lastRow = sheet.getLastRow();

    var targetRow = Number(rowIndex);
    if (targetRow >= 2 && targetRow <= lastRow) {
      sheet.deleteRow(targetRow);
      return { success: true, message: 'নোটিশটি সফলভাবে মুছে ফেলা হয়েছে।' };
    } else {
      return { success: false, message: 'নোটিশটি খুঁজে পাওয়া যায়নি বা ইতিমধ্যে মুছে ফেলা হয়েছে।' };
    }
  } catch (err) {
    Logger.log('deleteNotice error: ' + err.toString());
    return { success: false, message: 'ত্রুটি: ' + err.toString() };
  }
}

// ৬. ড্যাশবোর্ড থেকে নতুন শিক্ষার্থী/ইমেইল যোগ করা
function addSubscriberFromAdmin(name, email, roll) {
  try {
    autoSetupSheets();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: 'গুগল শিট পাওয়া যায়নি।' };
    var subSheet = ss.getSheetByName('Subscribers');
    if (!subSheet) return { success: false, message: 'Subscribers শিট পাওয়া যায়নি।' };

    var cleanName = name ? String(name).trim() : 'শিক্ষার্থী';
    var cleanEmail = email ? String(email).trim().toLowerCase() : '';
    var cleanRoll = roll ? String(roll).trim() : '-';

    if (!cleanEmail || cleanEmail.indexOf('@') <= 0) {
      return { success: false, message: 'সঠিক ইমেইল এড্রেস লিখুন!' };
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
    var allMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var shortDate = now.getDate() + ' ' + allMonths[now.getMonth()];
    subSheet.appendRow([cleanName, cleanEmail, cleanRoll, shortDate]);

    return { success: true, message: cleanName + ' (' + cleanEmail + ') সফলভাবে তালিকায় যোগ করা হয়েছে।' };
  } catch (err) {
    Logger.log('addSubscriber error: ' + err.toString());
    return { success: false, message: 'ত্রুটি: ' + err.toString() };
  }
}

// ৭. ড্যাশবোর্ড পরিসংখ্যান
function getDashboardStats() {
  try {
    autoSetupSheets();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { noticesCount: 0, subscribersCount: 0 };
    var noticeSheet = ss.getSheetByName('Notices');
    var subSheet = ss.getSheetByName('Subscribers');

    var noticeCount = 0;
    if (noticeSheet) {
      var nLast = noticeSheet.getLastRow();
      if (nLast > 1) noticeCount = nLast - 1;
    }

    var subCount = 0;
    if (subSheet) {
      var sLast = subSheet.getLastRow();
      if (sLast > 1) subCount = sLast - 1;
    }

    return {
      noticesCount: Number(noticeCount),
      subscribersCount: Number(subCount)
    };
  } catch (err) {
    Logger.log('getDashboardStats error: ' + err.toString());
    return { noticesCount: 0, subscribersCount: 0 };
  }
}

// ৮. প্রিমিয়াম পারসোনালাইজড এইচটিএমএল ইমেইল টেমপ্লেট
function generatePersonalizedNoticeEmail(studentName, title, category, content, dateStr) {
  var badgeColor = '#b45309';
  var badgeBg = '#fef3c7';
  var badgeBorder = '#fde68a';

  if (category === 'জরুরি' || category.indexOf('জরুরি') !== -1) {
    badgeColor = '#b91c1c';
    badgeBg = '#fee2e2';
    badgeBorder = '#fca5a5';
  } else if (category === 'পরীক্ষা' || category.indexOf('পরীক্ষা') !== -1) {
    badgeColor = '#6d28d9';
    badgeBg = '#ede9fe';
    badgeBorder = '#ddd6fe';
  } else if (category === 'ক্লাস' || category.indexOf('ক্লাস') !== -1) {
    badgeColor = '#047857';
    badgeBg = '#d1fae5';
    badgeBorder = '#a7f3d0';
  }

  return '<!DOCTYPE html>' +
  '<html lang="bn"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
  '<body style="margin:0;padding:0;background-color:#fafaf9;background-image:radial-gradient(#f97316 0.85px, transparent 0.85px);background-size:22px 22px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">' +
  '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafaf9;background-image:radial-gradient(#f97316 0.85px, transparent 0.85px);background-size:22px 22px;padding:28px 12px;">' +
  '<tr><td align="center">' +
  '  <table width="100%" style="max-width:580px;background-color:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.06);border:1px solid #e7e5e4;">' +
  '    <!-- Top Amber Strip -->' +
  '    <tr>' +
  '      <td style="height:4px;background-color:#f59e0b;padding:0;line-height:1px;font-size:1px;">&nbsp;</td>' +
  '    </tr>' +
  '    <!-- Authentic Department Header -->' +
  '    <tr>' +
  '      <td style="background-color:#ffffff;padding:24px 20px 18px 20px;text-align:center;border-bottom:1px solid #f4f4f5;">' +
  '        <div style="display:inline-block;padding:3px 12px;background-color:#fef3c7;border:1px solid #fde68a;border-radius:20px;color:#92400e;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">' +
  '          ঢাকা সেন্ট্রাল ইউনিভার্সিটি' +
  '        </div>' +
  '        <div style="color:#0f172a;font-size:20px;font-weight:800;letter-spacing:-0.2px;margin:2px 0;">' +
  '          রাষ্ট্রবিজ্ঞান বিভাগ' +
  '        </div>' +
  '        <div style="color:#64748b;font-size:12px;margin-top:4px;font-weight:500;">' +
  '          অফিশিয়াল ক্লাস ও ডিপার্টমেন্ট নোটিশ বোর্ড • সেশন ২০২৪-২৫' +
  '        </div>' +
  '      </td>' +
  '    </tr>' +
  '    <!-- Notice Main Body -->' +
  '    <tr>' +
  '      <td style="padding:26px 22px;">' +
  '        <!-- Correct Salam -->' +
  '        <div style="font-size:16px;color:#1e293b;font-weight:700;margin-bottom:12px;line-height:1.4;">' +
  '          আসসালামু আলাইকুম ' + studentName + ',' +
  '        </div>' +
  '        <!-- Category Badge -->' +
  '        <div style="margin-bottom:12px;">' +
  '          <span style="display:inline-block;padding:4px 12px;background-color:' + badgeBg + ';color:' + badgeColor + ';border:1px solid ' + badgeBorder + ';border-radius:16px;font-size:11px;font-weight:700;">' +
  '            🏷️ ' + category +
  '          </span>' +
  '        </div>' +
  '        <!-- Title -->' +
  '        <h2 style="font-size:18px;color:#0f172a;margin:0 0 14px 0;line-height:1.4;font-weight:800;">' +
  '          ' + title +
  '        </h2>' +
  '        <!-- Content Block -->' +
  '        <div style="background-color:#fafaf9;border:1px solid #f5f5f4;border-left:4px solid #f59e0b;padding:16px 18px;border-radius:10px;font-size:14px;color:#334155;line-height:1.7;margin-bottom:20px;white-space:pre-wrap;">' +
  '          ' + content +
  '        </div>' +
  '        <!-- Timestamp -->' +
  '        <div style="font-size:12px;color:#64748b;margin-bottom:22px;">' +
  '          🗓️ প্রকাশের সময়: ' + dateStr +
  '        </div>' +
  '        <!-- CTA Button -->' +
  '        <div style="text-align:center;margin-top:12px;margin-bottom:6px;">' +
  '          <a href="https://mahims.com/ps" target="_blank" style="display:inline-block;padding:12px 28px;background-color:#f59e0b;color:#18181b;font-weight:800;font-size:13px;text-decoration:none;border-radius:10px;box-shadow:0 3px 12px rgba(245,158,11,0.25);">' +
  '            🌐 ওয়েবসাইটে বিস্তারিত দেখুন' +
  '          </a>' +
  '        </div>' +
  '      </td>' +
  '    </tr>' +
  '    <!-- Footer -->' +
  '    <tr>' +
  '      <td style="background-color:#fbfbfa;padding:18px 20px;text-align:center;border-top:1px solid #f4f4f5;font-size:12px;color:#64748b;">' +
  '        <div style="font-weight:600;color:#334155;">প্রেরক: সিআর / রাষ্ট্রবিজ্ঞান বিভাগ, ঢাকা সেন্ট্রাল ইউনিভার্সিটি</div>' +
  '        <div style="margin-top:5px;font-size:11px;color:#94a3b8;">' +
  '          পোর্টাল লিঙ্ক: <a href="https://mahims.com/ps" style="color:#d97706;font-weight:600;text-decoration:none;">mahims.com/ps</a>' +
  '        </div>' +
  '      </td>' +
  '    </tr>' +
  '  </table>' +
  '</td></tr></table></body></html>';
}

// ৯. স্ট্যান্ডঅ্যালোন ওয়েব অ্যাপ ড্যাশবোর্ড ইন্টারফেস (Light Theme Default + Orange Dot Background + Mobile Friendly)
function getDashboardHtml() {
  return '<!DOCTYPE html>' +
  '<html lang="bn">' +
  '<head>' +
  '  <meta charset="UTF-8">' +
  '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
  '  <title>নোটিশ ড্যাশবোর্ড - রাষ্ট্রবিজ্ঞান বিভাগ</title>' +
  '  <script src="https://cdn.tailwindcss.com"></script>' +
  '  <link rel="preconnect" href="https://fonts.googleapis.com">' +
  '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">' +
  '  <style>' +
  '    body { font-family: "Hind Siliguri", sans-serif; }' +
  '    .dot-pattern {' +
  '      position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.35;' +
  '      background-image: radial-gradient(#f97316 0.8px, transparent 0.8px);' +
  '      background-size: 24px 24px;' +
  '    }' +
  '  </style>' +
  '</head>' +
  '<body class="bg-[#fafaf9] text-zinc-900 min-h-screen pb-14 font-sans relative">' +
  '  <!-- Orange Dot Background -->' +
  '  <div class="dot-pattern"></div>' +

  '  <!-- HEADER -->' +
  '  <header class="bg-white/95 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-30 shadow-xs">' +
  '    <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">' +
  '      <div>' +
  '        <div class="text-[10px] text-amber-600 font-bold uppercase tracking-wider">ঢাকা সেন্ট্রাল ইউনিভার্সিটি</div>' +
  '        <h1 class="text-sm sm:text-base font-extrabold text-zinc-900">রাষ্ট্রবিজ্ঞান বিভাগ • নোটিশ পোর্টাল</h1>' +
  '      </div>' +
  '      <a href="https://mahims.com/ps" target="_blank" class="text-xs bg-amber-500/15 border border-amber-500/30 text-amber-900 px-3 py-1.5 rounded-xl hover:bg-amber-500 hover:text-black font-bold transition">' +
  '        🌐 সাইট দেখুন' +
  '      </a>' +
  '    </div>' +
  '  </header>' +

  '  <!-- MAIN CONTENT -->' +
  '  <main class="relative z-10 max-w-3xl mx-auto px-4 mt-5 space-y-4">' +
  
  '    <!-- Stats Bar -->' +
  '    <div class="grid grid-cols-2 gap-3" id="statsBar">' +
  '      <div class="bg-white border border-amber-500/20 p-3.5 rounded-2xl shadow-xs">' +
  '        <span class="text-xs text-zinc-500 block font-medium">মোট প্রকাশিত নোটিশ</span>' +
  '        <span class="text-xl font-extrabold text-amber-600" id="statNoticeCount">...</span>' +
  '      </div>' +
  '      <div class="bg-white border border-sky-500/20 p-3.5 rounded-2xl shadow-xs">' +
  '        <span class="text-xs text-zinc-500 block font-medium">নিবন্ধিত শিক্ষার্থী</span>' +
  '        <span class="text-xl font-extrabold text-sky-600" id="statSubCount">...</span>' +
  '      </div>' +
  '    </div>' +

  '    <!-- Tab Navigation Pills -->' +
  '    <div class="flex items-center gap-1.5 p-1 bg-zinc-200/70 rounded-2xl border border-zinc-200 overflow-x-auto text-xs font-bold">' +
  '      <button id="tabBtn1" onclick="switchTab(\'publish\')" class="flex-1 min-w-[110px] py-2.5 px-3 rounded-xl bg-amber-500 text-black shadow-xs transition text-center cursor-pointer">' +
  '        📢 নোটিশ তৈরি' +
  '      </button>' +
  '      <button id="tabBtn2" onclick="switchTab(\'list\')" class="flex-1 min-w-[110px] py-2.5 px-3 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition text-center cursor-pointer">' +
  '        📋 নোটিশ তালিকা' +
  '      </button>' +
  '      <button id="tabBtn3" onclick="switchTab(\'subscriber\')" class="flex-1 min-w-[110px] py-2.5 px-3 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition text-center cursor-pointer">' +
  '        👥 শিক্ষার্থী যোগ' +
  '      </button>' +
  '    </div>' +

  '    <!-- Notification Alert Box -->' +
  '    <div id="alertBox" class="hidden p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs"></div>' +

  '    <!-- TAB 1: PUBLISH NOTICE (Title Optional) -->' +
  '    <section id="tabPublish" class="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">' +
  '      <div class="border-b border-zinc-100 pb-3">' +
  '        <h2 class="text-sm sm:text-base font-bold text-zinc-900 flex items-center gap-2">' +
  '          <span>নতুন নোটিশ তৈরি ও সবার ইমেইলে প্রেরণ</span>' +
  '        </h2>' +
  '        <p class="text-xs text-zinc-500 mt-1 leading-relaxed">' +
  '          শিরোনাম ফাঁকা রাখলে নির্বাচিত ক্যাটাগরিই নোটিশের শিরোনাম হিসেবে যুক্ত হবে এবং সকল শিক্ষার্থীর ইমেইলে পারসোনালাইজড মেসেজ চলে যাবে।' +
  '        </p>' +
  '      </div>' +

  '      <form id="noticeForm" onsubmit="submitNotice(event)" class="space-y-4">' +
  '        <div>' +
  '          <label class="block text-xs font-semibold text-zinc-700 mb-1.5">' +
  '            ক্যাটাগরি নির্বাচন করুন <span class="text-amber-500">*</span>' +
  '          </label>' +
  '          <select id="nCategory" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none">' +
  '            <option value="সাধারণ নোটিশ">সাধারণ নোটিশ</option>' +
  '            <option value="জরুরি ঘোষণা">জরুরি ঘোষণা</option>' +
  '            <option value="ক্লাস আপডেট">ক্লাস আপডেট</option>' +
  '            <option value="পরীক্ষা সংক্রান্ত">পরীক্ষা সংক্রান্ত</option>' +
  '            <option value="অ্যাসাইনমেন্ট ও প্রেজেন্টেশন">অ্যাসাইনমেন্ট ও প্রেজেন্টেশন</option>' +
  '            <option value="ছুটির নোটিশ">ছুটির নোটিশ</option>' +
  '          </select>' +
  '        </div>' +

  '        <div>' +
  '          <div class="flex items-center justify-between mb-1.5">' +
  '            <label class="block text-xs font-semibold text-zinc-700">নোটিশের শিরোনাম</label>' +
  '            <span class="text-[11px] text-amber-700 font-semibold">ঐচ্ছিক (ফাঁকা রাখলে ক্যাটাগরিই শিরোনাম হবে)</span>' +
  '          </div>' +
  '          <input id="nTitle" type="text" placeholder="ঐচ্ছিক (যেমন: আগামী রবিবার ক্লাসের সময়সূচী পরিবর্তন)" class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none">' +
  '        </div>' +

  '        <div>' +
  '          <label class="block text-xs font-semibold text-zinc-700 mb-1.5">বিস্তারিত বিবরণ <span class="text-amber-500">*</span></label>' +
  '          <textarea id="nContent" rows="4" required placeholder="নোটিশের সম্পূর্ণ বিবরণ এখানে লিখুন..." class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none"></textarea>' +
  '        </div>' +

  '        <div class="pt-1">' +
  '          <button type="submit" id="btnPublish" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer">' +
  '            <span>🚀 নোটিশ প্রকাশ ও সবার ইমেইলে পাঠান</span>' +
  '          </button>' +
  '        </div>' +
  '      </form>' +
  '    </section>' +

  '    <!-- TAB 2: NOTICE LIST & DELETE -->' +
  '    <section id="tabList" class="hidden space-y-3">' +
  '      <div class="flex items-center justify-between">' +
  '        <h2 class="text-sm font-bold text-zinc-900">সকল নোটিশ ও ডিলিট অপশন</h2>' +
  '        <button onclick="loadNotices()" type="button" class="text-xs text-amber-700 hover:underline font-bold cursor-pointer">🔄 রিফ্রেশ করুন</button>' +
  '      </div>' +
  '      <div id="noticeListContainer" class="space-y-3">' +
  '        <div class="p-8 text-center text-xs text-zinc-500">নোটিশ লোড হচ্ছে...</div>' +
  '      </div>' +
  '    </section>' +

  '    <!-- TAB 3: ADD SUBSCRIBER -->' +
  '    <section id="tabSubscriber" class="hidden bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">' +
  '      <div class="border-b border-zinc-100 pb-3">' +
  '        <h2 class="text-sm sm:text-base font-bold text-zinc-900">নতুন শিক্ষার্থী / ইমেইল যোগ করুন</h2>' +
  '        <p class="text-xs text-zinc-500 mt-1 leading-relaxed">' +
  '          এখানে নাম ও ইমেইল যুক্ত করলেই তারা পরবর্তী সব নোটিশ স্বয়ংক্রিয়ভাবে ইমেইলে পাবে।' +
  '        </p>' +
  '      </div>' +

  '      <!-- Security Notice regarding deletion -->' +
  '      <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs leading-relaxed">' +
  '        🔒 <strong>নিরাপত্তা বার্তা:</strong> শিক্ষার্থীদের ডাটাবেজ সুরক্ষিত রাখতে ইমেইল মুছে ফেলার ব্যবস্থা শুধুমাত্র মূল গুগল শিটে রাখা হয়েছে। কোনো ইমেইল ডিলিট করতে চাইলে সরাসরি গুগল শিটে গিয়ে রো ডিলিট করুন।' +
  '      </div>' +

  '      <form id="subForm" onsubmit="submitSubscriber(event)" class="space-y-3.5">' +
  '        <div>' +
  '          <label class="block text-xs font-semibold text-zinc-700 mb-1">শিক্ষার্থীর নাম *</label>' +
  '          <input id="sName" type="text" required placeholder="যেমন: সাকিব হাসান" class="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none">' +
  '        </div>' +

  '        <div>' +
  '          <label class="block text-xs font-semibold text-zinc-700 mb-1">ইমেইল এড্রেস *</label>' +
  '          <input id="sEmail" type="email" required placeholder="example@gmail.com" class="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none">' +
  '        </div>' +

  '        <div>' +
  '          <label class="block text-xs font-semibold text-zinc-700 mb-1">রোল / স্টুডেন্ট আইডি (ঐচ্ছিক)</label>' +
  '          <input id="sRoll" type="text" placeholder="যেমন: 105" class="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none">' +
  '        </div>' +

  '        <button type="submit" id="btnSub" class="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition cursor-pointer">' +
  '          ➕ শিক্ষার্থী যুক্ত করুন' +
  '        </button>' +
  '      </form>' +
  '    </section>' +

  '  </main>' +

  '  <script>' +
  '    window.ALL_NOTICES = [];' +
  '    ' +
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
  '      ' +
  '      var inactiveClass = "flex-1 min-w-[110px] py-2.5 px-3 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition text-center cursor-pointer";' +
  '      b1.className = inactiveClass;' +
  '      b2.className = inactiveClass;' +
  '      b3.className = inactiveClass;' +
  '      ' +
  '      if (tab === "publish") {' +
  '        t1.classList.remove("hidden");' +
  '        b1.className = "flex-1 min-w-[110px] py-2.5 px-3 rounded-xl bg-amber-500 text-black shadow-xs transition text-center cursor-pointer";' +
  '      } else if (tab === "list") {' +
  '        t2.classList.remove("hidden");' +
  '        b2.className = "flex-1 min-w-[110px] py-2.5 px-3 rounded-xl bg-amber-500 text-black shadow-xs transition text-center cursor-pointer";' +
  '        loadNotices();' +
  '      } else if (tab === "subscriber") {' +
  '        t3.classList.remove("hidden");' +
  '        b3.className = "flex-1 min-w-[110px] py-2.5 px-3 rounded-xl bg-sky-500 text-white shadow-xs transition text-center cursor-pointer";' +
  '      }' +
  '    }' +
  '    ' +
  '    function showAlert(msg, isError) {' +
  '      var a = document.getElementById("alertBox");' +
  '      if (!a) return;' +
  '      a.className = "p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs " + (isError ? "bg-rose-50 border border-rose-200 text-rose-800" : "bg-emerald-50 border border-emerald-200 text-emerald-800");' +
  '      a.innerHTML = "<span>" + msg + "</span><button onclick=\'this.parentElement.classList.add(\\"hidden\\")\' class=\'text-zinc-400 hover:text-zinc-700 font-bold ml-2\'>✕</button>";' +
  '      a.classList.remove("hidden");' +
  '      window.scrollTo({ top: 0, behavior: "smooth" });' +
  '    }' +
  '    ' +
  '    function refreshStats() {' +
  '      google.script.run' +
  '        .withSuccessHandler(function(stats) {' +
  '          var nEl = document.getElementById("statNoticeCount");' +
  '          var sEl = document.getElementById("statSubCount");' +
  '          if (nEl) nEl.innerText = (stats && stats.noticesCount !== undefined ? stats.noticesCount : 0) + "টি";' +
  '          if (sEl) sEl.innerText = (stats && stats.subscribersCount !== undefined ? stats.subscribersCount : 0) + " জন";' +
  '        })' +
  '        .withFailureHandler(function(err) {' +
  '          console.log("Stats fetch err:", err);' +
  '        })' +
  '        .getDashboardStats();' +
  '    }' +
  '    ' +
  '    function submitNotice(e) {' +
  '      if (e && e.preventDefault) e.preventDefault();' +
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
  '          if (res && res.success) {' +
  '            document.getElementById("nTitle").value = "";' +
  '            document.getElementById("nContent").value = "";' +
  '            showAlert(res.message, false);' +
  '            refreshStats();' +
  '          } else {' +
  '            showAlert((res && res.message) ? res.message : "সমস্যা হয়েছে।", true);' +
  '          }' +
  '        })' +
  '        .withFailureHandler(function(err) {' +
  '          btn.disabled = false;' +
  '          btn.innerHTML = "<span>🚀 নোটিশ প্রকাশ ও সবার ইমেইলে পাঠান</span>";' +
  '          showAlert("❌ সমস্যা হয়েছে: " + (err.message || err), true);' +
  '        })' +
  '        .publishNoticeAndSendEmails(form);' +
  '    }' +
  '    ' +
  '    function loadNotices() {' +
  '      var container = document.getElementById("noticeListContainer");' +
  '      container.innerHTML = "<div class=\'p-8 text-center text-xs text-zinc-500\'>লোড হচ্ছে...</div>";' +
  '      ' +
  '      google.script.run' +
  '        .withSuccessHandler(function(notices) {' +
  '          window.ALL_NOTICES = notices || [];' +
  '          if (!notices || notices.length === 0) {' +
  '            container.innerHTML = "<div class=\'bg-white border border-zinc-200 p-8 rounded-2xl text-center text-xs text-zinc-500\'>বর্তমানে কোনো নোটিশ নেই। নতুন নোটিশ প্রকাশ করুন।</div>";' +
  '            return;' +
  '          }' +
  '          var html = "";' +
  '          for (var i = 0; i < notices.length; i++) {' +
  '            var n = notices[i];' +
  '            html += "<div class=\'bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs mb-3\'>" +' +
  '                    "  <div class=\'space-y-1\'>" +' +
  '                    "    <div class=\'flex items-center gap-2\'>" +' +
  '                    "      <span class=\'px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-800 font-bold text-[11px]\'>" + n.category + "</span>" +' +
  '                    "      <span class=\'text-[11px] text-zinc-500 font-semibold\'>🗓️ " + n.date + "</span>" +' +
  '                    "    </div>" +' +
  '                    "    <h3 class=\'text-sm font-bold text-zinc-900\'>" + n.title + "</h3>" +' +
  '                    "    <p class=\'text-xs text-zinc-600 line-clamp-2\'>" + n.content + "</p>" +' +
  '                    "  </div>" +' +
  '                    "  <div class=\'shrink-0 text-right\'>" +' +
  '                    "    <button type=\'button\' onclick=\'deleteNoticeByIndex(" + i + ")\' class=\'px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 text-xs font-bold transition cursor-pointer\'>" +' +
  '                    "      🗑️ ডিলিট করুন" +' +
  '                    "    </button>" +' +
  '                    "  </div>" +' +
  '                    "</div>";' +
  '          }' +
  '          container.innerHTML = html;' +
  '        })' +
  '        .withFailureHandler(function(err) {' +
  '          container.innerHTML = "<div class=\'p-8 text-center text-xs text-rose-500\'>লোড করতে সমস্যা: " + (err.message || err) + "</div>";' +
  '        })' +
  '        .getNoticesList();' +
  '    }' +
  '    ' +
  '    function deleteNoticeByIndex(idx) {' +
  '      var n = window.ALL_NOTICES[idx];' +
  '      if (!n) return;' +
  '      if (confirm("আপনি কি নিশ্চিত এই নোটিশটি মুছে ফেলতে চান?\\n\\n" + n.title)) {' +
  '        google.script.run' +
  '          .withSuccessHandler(function(res) {' +
  '            showAlert(res.message, !res.success);' +
  '            loadNotices();' +
  '            refreshStats();' +
  '          })' +
  '          .withFailureHandler(function(err) {' +
  '            showAlert("মুছে ফেলা সম্ভব হয়নি: " + (err.message || err), true);' +
  '          })' +
  '          .deleteNotice(n.rowIndex);' +
  '      }' +
  '    }' +
  '    ' +
  '    function submitSubscriber(e) {' +
  '      if (e && e.preventDefault) e.preventDefault();' +
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
  '          showAlert("❌ সমস্যা: " + (err.message || err), true);' +
  '        })' +
  '        .addSubscriberFromAdmin(name, email, roll);' +
  '    }' +
  '    ' +
  '    // Startup Execution' +
  '    window.onload = function() {' +
  '      refreshStats();' +
  '    };' +
  '  </script>' +
  '</body>' +
  '</html>';
}
`;
