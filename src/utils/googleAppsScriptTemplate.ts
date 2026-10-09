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
    Logger.log('Setup error: ' + err.toString());
  }

  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';
  
  // API: ওয়েবসাইট থেকে নোটিশের তালিকা চাওয়া
  if (action === 'getNotices' || (e && e.parameter && e.parameter.format === 'json')) {
    var notices = getNoticesList();
    return ContentService
      .createTextOutput(JSON.stringify(notices))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // API: ওয়েবসাইট থেকে শিক্ষার্থী সাবস্ক্রাইব করার রিকোয়েস্ট
  if (action === 'addSubscriber') {
    var name = e.parameter.name || 'শিক্ষার্থী';
    var email = e.parameter.email || '';
    var studentId = e.parameter.studentId || '';
    var res = addSubscriberFromAdmin(name, email, studentId);
    return ContentService
      .createTextOutput(JSON.stringify(res))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ব্রাউজার ভিজিটরদের জন্য সম্পূর্ণ স্বয়ংসম্পূর্ণ ওয়েব অ্যাপ ড্যাশবোর্ড
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
      .setBackground('#18181b')
      .setFontColor('#f59e0b')
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

// তারিখ ছোট করে ফরম্যাট করা (যেমন: 9 OCT, 10 OCT)
function formatShortDate(d) {
  if (!d) return '';
  var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  if (d instanceof Date) {
    return d.getDate() + ' ' + months[d.getMonth()];
  }
  var parsed = new Date(d);
  if (!isNaN(parsed.getTime())) {
    return parsed.getDate() + ' ' + months[parsed.getMonth()];
  }
  var s = String(d).trim();
  var m = s.match(/([0-9]{1,2})\\s+([A-Za-z]{3})/);
  if (m) return m[1] + ' ' + m[2].toUpperCase();
  return s.replace(/\\s*\\(.*?Standard Time.*?\\)/gi, '')
          .replace(/\\s*\\(.*?Bangladesh.*?\\)/gi, '')
          .replace(/\\s*GMT[+-]\\d{4}/gi, '')
          .trim();
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
          rowIndex: i + 2,
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
    
    // শিরোনাম ফাঁকা রাখলে নির্বাচিত ক্যাটাগরিই হবে নোটিশের শিরোনাম
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
    var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var shortDate = now.getDate() + ' ' + months[now.getMonth()];
    var noticeId = 'not-' + now.getTime();

    // ওয়েবসাইট সরাসরি পারমালিংক স্লাগ (যেমন: 09-10-2026, একই দিনে একাধিক হলে 09-10-2026-2)
    var dayStr = ('0' + now.getDate()).slice(-2);
    var monthStr = ('0' + (now.getMonth() + 1)).slice(-2);
    var yearStr = now.getFullYear();
    var baseDateSlug = dayStr + '-' + monthStr + '-' + yearStr;

    var countToday = 0;
    var nLastRow = noticeSheet.getLastRow();
    if (nLastRow > 1) {
      var prevDates = noticeSheet.getRange(2, 3, nLastRow - 1, 1).getValues();
      for (var dIdx = 0; dIdx < prevDates.length; dIdx++) {
        var prevD = String(prevDates[dIdx][0]).trim();
        if (prevD.indexOf(shortDate) !== -1 || prevD.indexOf(baseDateSlug) !== -1) {
          countToday++;
        }
      }
    }

    var noticeSlug = countToday === 0 ? baseDateSlug : (baseDateSlug + '-' + (countToday + 1));
    var noticeUrl = 'https://mahims.com/ps/notices/' + noticeSlug;

    // ১. নোটিশ শিটে যুক্ত করুন
    var newRow = [noticeId, title, shortDate, category, content, 'ইমেইল প্রস্তুত হচ্ছে...'];
    noticeSheet.appendRow(newRow);
    var insertedRowIndex = noticeSheet.getLastRow();

    // ২. সাবস্ক্রাইবার তালিকা সংগ্রহ ও পারসোনালাইজড ইমেইল প্রেরণ
    var subLastRow = subSheet.getLastRow();
    var emailCount = 0;

    if (subLastRow > 1) {
      var subData = subSheet.getRange(2, 1, subLastRow - 1, 4).getValues();
      
      for (var i = 0; i < subData.length; i++) {
        var studentName = subData[i][0] ? String(subData[i][0]).trim() : 'শিক্ষার্থী';
        var studentEmail = subData[i][1] ? String(subData[i][1]).trim() : '';

        if (studentEmail && studentEmail.indexOf('@') > 0) {
          try {
            var htmlBody = generatePersonalizedNoticeEmail(studentName, title, category, content, shortDate, noticeUrl);
            
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

// ৫. ড্যাশবোর্ড থেকেই নোটিশ মুছে ফেলা (Delete Notice by ID or Row)
function deleteNotice(idOrRow) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return { success: false, message: 'গুগল শিট পাওয়া যায়নি।' };
    var sheet = ss.getSheetByName('Notices');
    if (!sheet) return { success: false, message: 'Notices শিট পাওয়া যায়নি।' };
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { success: false, message: 'কোনো নোটিশ নেই।' };

    var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
    var targetRow = -1;

    for (var i = 0; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(idOrRow).trim()) {
        targetRow = i + 2;
        break;
      }
    }

    if (targetRow === -1 && !isNaN(Number(idOrRow))) {
      var num = Number(idOrRow);
      if (num >= 2 && num <= lastRow) {
        targetRow = num;
      }
    }

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
    var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var shortDate = now.getDate() + ' ' + months[now.getMonth()];
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
function generatePersonalizedNoticeEmail(studentName, title, category, content, dateStr, noticeUrl) {
  var directLink = noticeUrl || 'https://mahims.com/ps';
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
  '    <tr>' +
  '      <td style="height:4px;background-color:#f59e0b;padding:0;line-height:1px;font-size:1px;">&nbsp;</td>' +
  '    </tr>' +
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
  '    <tr>' +
  '      <td style="padding:26px 22px;">' +
  '        <div style="font-size:16px;color:#1e293b;font-weight:700;margin-bottom:12px;line-height:1.4;">' +
  '          আসসালামু আলাইকুম ' + studentName + ',' +
  '        </div>' +
  '        <div style="margin-bottom:12px;">' +
  '          <span style="display:inline-block;padding:4px 12px;background-color:' + badgeBg + ';color:' + badgeColor + ';border:1px solid ' + badgeBorder + ';border-radius:16px;font-size:11px;font-weight:700;">' +
  '            🏷️ ' + category +
  '          </span>' +
  '        </div>' +
  '        <h2 style="font-size:18px;color:#0f172a;margin:0 0 14px 0;line-height:1.4;font-weight:800;">' +
  '          ' + title +
  '        </h2>' +
  '        <div style="background-color:#fafaf9;border:1px solid #f5f5f4;border-left:4px solid #f59e0b;padding:16px 18px;border-radius:10px;font-size:14px;color:#334155;line-height:1.7;margin-bottom:20px;white-space:pre-wrap;">' +
  '          ' + content +
  '        </div>' +
  '        <div style="font-size:12px;color:#64748b;margin-bottom:22px;">' +
  '          🗓️ প্রকাশের সময়: ' + dateStr +
  '        </div>' +
  '        <div style="text-align:center;margin-top:14px;margin-bottom:6px;">' +
  '          <a href="' + directLink + '" target="_blank" style="display:inline-block;padding:12px 28px;background-color:#f59e0b;color:#18181b;font-weight:800;font-size:13px;text-decoration:none;border-radius:10px;box-shadow:0 3px 12px rgba(245,158,11,0.25);">' +
  '            🌐 নোটিশটি ওয়েবসাইটে দেখুন' +
  '          </a>' +
  '        </div>' +
  '        <div style="text-align:center;margin-top:6px;font-size:11px;color:#78716c;">' +
  '          সরাসরি লিঙ্ক: <a href="' + directLink + '" target="_blank" style="color:#d97706;font-weight:600;word-break:break-all;">' + directLink + '</a>' +
  '        </div>' +
  '      </td>' +
  '    </tr>' +
  '    <tr>' +
  '      <td style="background-color:#fbfbfa;padding:18px 20px;text-align:center;border-top:1px solid #f4f4f5;font-size:12px;color:#64748b;">' +
  '        <div style="font-weight:600;color:#334155;">প্রেরক: সিআর / রাষ্ট্রবিজ্ঞান বিভাগ, ঢাকা সেন্ট্রাল ইউনিভার্সিটি</div>' +
  '        <div style="margin-top:5px;font-size:11px;color:#94a3b8;">' +
  '          বিভাগীয় মূল পোর্টাল: <a href="https://mahims.com/ps" style="color:#d97706;font-weight:600;text-decoration:none;">mahims.com/ps</a>' +
  '        </div>' +
  '      </td>' +
  '    </tr>' +
  '  </table>' +
  '</td></tr></table></body></html>';
}

// ৯. স্ট্যান্ডঅ্যালোন ওয়েব অ্যাপ ড্যাশবোর্ড ইন্টারফেস (১০০% সেলফ-কনটেইন্ড CSS, প্রি-রেন্ডারড ডাটা ও এরর-প্রুফ বাটন)
function getDashboardHtml() {
  // সার্ভার সাইডে সরাসরি ডাটা ফেচ করুন যাতে লোডিং বিলম্ব বা ফাঁকা স্ক্রিন না থাকে
  autoSetupSheets();
  var stats = getDashboardStats();
  var notices = getNoticesList();

  var nCnt = stats ? stats.noticesCount : 0;
  var sCnt = stats ? stats.subscribersCount : 0;

  // সার্ভার থেকেই নোটিশ তালিকা তৈরি করুন
  var noticesListMarkup = '';
  if (!notices || notices.length === 0) {
    noticesListMarkup = '<div class="empty-state">বর্তমানে কোনো নোটিশ প্রকাশ করা হয়নি। নতুন নোটিশ তৈরি করুন।</div>';
  } else {
    for (var i = 0; i < notices.length; i++) {
      var n = notices[i];
      var safeId = String(n.id || ('not-' + i)).replace(/"/g, '&quot;');
      var safeTitle = String(n.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      var safeCategory = String(n.category || 'সাধারণ নোটিশ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      var safeDate = String(n.date || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      var safeContent = String(n.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      var jsTitle = safeTitle.replace(/\\\\/g, '\\\\\\\\').replace(/\'/g, "\\\\'");

      noticesListMarkup += '<div class="notice-card" id="card-' + safeId + '">' +
        '<div class="notice-header-row">' +
        '  <span class="badge">' + safeCategory + '</span>' +
        '  <span class="date-tag">🗓️ ' + safeDate + '</span>' +
        '</div>' +
        '<h3 class="notice-card-title">' + safeTitle + '</h3>' +
        '<div class="notice-card-content">' + safeContent + '</div>' +
        '<div class="notice-footer-row">' +
        '  <span class="status-tag">' + (n.emailStatus || 'সংরক্ষিত') + '</span>' +
        '  <button type="button" class="btn-delete" onclick="handleDeleteNotice(\'' + safeId + '\', \'' + jsTitle + '\')">🗑️ ডিলিট</button>' +
        '</div>' +
        '</div>';
    }
  }

  return '<!DOCTYPE html>' +
  '<html lang="bn">' +
  '<head>' +
  '  <meta charset="UTF-8">' +
  '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
  '  <title>নোটিশ ড্যাশবোর্ড - রাষ্ট্রবিজ্ঞান বিভাগ</title>' +
  '  <link rel="preconnect" href="https://fonts.googleapis.com">' +
  '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">' +
  '  <style>' +
  '    * { box-sizing: border-box; margin: 0; padding: 0; font-family: "Hind Siliguri", -apple-system, BlinkMacSystemFont, sans-serif; }' +
  '    body {' +
  '      background-color: #fafaf9;' +
  '      color: #18181b;' +
  '      min-height: 100vh;' +
  '      padding-bottom: 50px;' +
  '      position: relative;' +
  '    }' +
  '    .dot-pattern {' +
  '      position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.35;' +
  '      background-image: radial-gradient(#f97316 0.85px, transparent 0.85px);' +
  '      background-size: 24px 24px;' +
  '    }' +
  '    .app-header {' +
  '      background: rgba(255, 255, 255, 0.95);' +
  '      backdrop-filter: blur(10px);' +
  '      border-bottom: 1px solid #e7e5e4;' +
  '      position: sticky; top: 0; z-index: 30;' +
  '      padding: 12px 16px;' +
  '    }' +
  '    .header-inner {' +
  '      max-width: 680px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px;' +
  '    }' +
  '    .brand-sub { font-size: 10px; color: #d97706; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }' +
  '    .brand-title { font-size: 15px; font-weight: 800; color: #18181b; }' +
  '    .site-btn {' +
  '      font-size: 12px; font-weight: 700; text-decoration: none;' +
  '      background: #fef3c7; border: 1px solid #fde68a; color: #92400e;' +
  '      padding: 6px 14px; border-radius: 12px; transition: all 0.2s;' +
  '    }' +
  '    .site-btn:hover { background: #f59e0b; color: #000; }' +
  '    .main-wrap { position: relative; z-index: 10; max-width: 680px; margin: 18px auto 0 auto; padding: 0 16px; }' +
  '    ' +
  '    /* Stats */' +
  '    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }' +
  '    .stat-card {' +
  '      background: #ffffff; border: 1px solid #e7e5e4; border-radius: 16px; padding: 14px 16px;' +
  '      box-shadow: 0 1px 3px rgba(0,0,0,0.03);' +
  '    }' +
  '    .stat-card.amber { border-color: rgba(245, 158, 11, 0.3); }' +
  '    .stat-card.sky { border-color: rgba(14, 165, 233, 0.3); }' +
  '    .stat-label { font-size: 11px; color: #71717a; font-weight: 600; display: block; margin-bottom: 2px; }' +
  '    .stat-val { font-size: 22px; font-weight: 800; }' +
  '    .stat-card.amber .stat-val { color: #d97706; }' +
  '    .stat-card.sky .stat-val { color: #0284c7; }' +
  '    ' +
  '    /* Tabs */' +
  '    .tab-nav {' +
  '      display: flex; gap: 6px; background: #e4e4e7; padding: 4px; border-radius: 16px; margin-bottom: 16px;' +
  '      overflow-x: auto;' +
  '    }' +
  '    .tab-btn {' +
  '      flex: 1; min-width: 100px; padding: 10px 12px; border: none; border-radius: 12px; background: transparent;' +
  '      color: #52525b; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;' +
  '      text-align: center; white-space: nowrap;' +
  '    }' +
  '    .tab-btn.active {' +
  '      background: #f59e0b; color: #18181b; box-shadow: 0 2px 6px rgba(245, 158, 11, 0.25);' +
  '    }' +
  '    .tab-btn:hover:not(.active) { background: #d4d4d8; color: #18181b; }' +
  '    ' +
  '    /* Alert */' +
  '    .alert-banner {' +
  '      display: none; padding: 12px 16px; border-radius: 14px; font-size: 12px; font-weight: 600; margin-bottom: 16px;' +
  '      align-items: center; justify-content: space-between;' +
  '    }' +
  '    .alert-banner.success { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; display: flex; }' +
  '    .alert-banner.error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; display: flex; }' +
  '    .alert-close { background: none; border: none; font-size: 14px; font-weight: bold; cursor: pointer; color: inherit; padding-left: 10px; }' +
  '    ' +
  '    /* Cards / Forms */' +
  '    .panel-card {' +
  '      background: #ffffff; border: 1px solid #e7e5e4; border-radius: 20px; padding: 20px;' +
  '      box-shadow: 0 2px 8px rgba(0,0,0,0.03);' +
  '    }' +
  '    .panel-header { border-bottom: 1px solid #f4f4f5; padding-bottom: 12px; margin-bottom: 16px; }' +
  '    .panel-title { font-size: 15px; font-weight: 800; color: #18181b; }' +
  '    .panel-desc { font-size: 12px; color: #71717a; margin-top: 3px; line-height: 1.5; }' +
  '    ' +
  '    .form-group { margin-bottom: 14px; }' +
  '    .form-label { display: block; font-size: 12px; font-weight: 700; color: #3f3f46; margin-bottom: 6px; }' +
  '    .form-hint { font-size: 11px; color: #d97706; font-weight: 600; margin-left: 6px; }' +
  '    .form-input, .form-select, .form-textarea {' +
  '      width: 100%; padding: 10px 14px; border: 1.5px solid #e4e4e7; border-radius: 12px;' +
  '      background: #fcfcfb; color: #18181b; font-size: 13px; font-family: inherit; outline: none; transition: all 0.2s;' +
  '    }' +
  '    .form-input:focus, .form-select:focus, .form-textarea:focus {' +
  '      border-color: #f59e0b; background: #ffffff; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);' +
  '    }' +
  '    .btn-submit {' +
  '      width: 100%; padding: 13px 20px; border: none; border-radius: 14px; background: #f59e0b;' +
  '      color: #18181b; font-size: 13px; font-weight: 800; cursor: pointer; transition: all 0.2s;' +
  '      display: flex; align-items: center; justify-content: center; gap: 8px;' +
  '      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);' +
  '    }' +
  '    .btn-submit:hover { background: #d97706; }' +
  '    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }' +
  '    .btn-submit.sky { background: #0284c7; color: #ffffff; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25); }' +
  '    .btn-submit.sky:hover { background: #0369a1; }' +
  '    ' +
  '    /* Notice List */' +
  '    .notice-card {' +
  '      background: #ffffff; border: 1px solid #e7e5e4; border-radius: 16px; padding: 16px;' +
  '      margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);' +
  '    }' +
  '    .notice-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }' +
  '    .badge {' +
  '      display: inline-block; padding: 3px 10px; background: #fef3c7; border: 1px solid #fde68a;' +
  '      color: #92400e; font-size: 11px; font-weight: 700; border-radius: 8px;' +
  '    }' +
  '    .date-tag { font-size: 11px; color: #71717a; font-weight: 600; }' +
  '    .notice-card-title { font-size: 14px; font-weight: 800; color: #18181b; margin: 4px 0 6px 0; }' +
  '    .notice-card-content { font-size: 12px; color: #52525b; line-height: 1.6; white-space: pre-wrap; margin-bottom: 12px; }' +
  '    .notice-footer-row { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f4f4f5; padding-top: 10px; }' +
  '    .status-tag { font-size: 11px; color: #10b981; font-weight: 600; }' +
  '    .btn-delete {' +
  '      padding: 5px 12px; border: 1px solid #fca5a5; background: #fef2f2; color: #b91c1c;' +
  '      border-radius: 10px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s;' +
  '    }' +
  '    .btn-delete:hover { background: #ef4444; color: #ffffff; }' +
  '    .empty-state { text-align: center; padding: 36px 16px; color: #71717a; font-size: 13px; background: #ffffff; border-radius: 16px; border: 1px solid #e7e5e4; }' +
  '    .info-box {' +
  '      background: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 12px 14px;' +
  '      color: #92400e; font-size: 12px; line-height: 1.6; margin-bottom: 16px;' +
  '    }' +
  '  </style>' +
  '</head>' +
  '<body>' +
  '  <div class="dot-pattern"></div>' +

  '  <!-- HEADER -->' +
  '  <header class="app-header">' +
  '    <div class="header-inner">' +
  '      <div>' +
  '        <div class="brand-sub">ঢাকা সেন্ট্রাল ইউনিভার্সিটি</div>' +
  '        <h1 class="brand-title">রাষ্ট্রবিজ্ঞান বিভাগ • নোটিশ পোর্টাল</h1>' +
  '      </div>' +
  '      <a href="https://mahims.com/ps" target="_blank" class="site-btn">🌐 সাইট দেখুন</a>' +
  '    </div>' +
  '  </header>' +

  '  <!-- MAIN CONTENT -->' +
  '  <main class="main-wrap">' +

  '    <!-- Stats Grid -->' +
  '    <div class="stats-grid">' +
  '      <div class="stat-card amber">' +
  '        <span class="stat-label">মোট প্রকাশিত নোটিশ</span>' +
  '        <span class="stat-val" id="statNoticeCount">' + nCnt + 'টি</span>' +
  '      </div>' +
  '      <div class="stat-card sky">' +
  '        <span class="stat-label">নিবন্ধিত শিক্ষার্থী</span>' +
  '        <span class="stat-val" id="statSubCount">' + sCnt + ' জন</span>' +
  '      </div>' +
  '    </div>' +

  '    <!-- Tab Navigation -->' +
  '    <div class="tab-nav">' +
  '      <button id="tabBtn1" type="button" class="tab-btn active" onclick="switchTab(\'publish\')">📢 নোটিশ তৈরি</button>' +
  '      <button id="tabBtn2" type="button" class="tab-btn" onclick="switchTab(\'list\')">📋 নোটিশ তালিকা</button>' +
  '      <button id="tabBtn3" type="button" class="tab-btn" onclick="switchTab(\'subscriber\')">👥 শিক্ষার্থী যোগ</button>' +
  '    </div>' +

  '    <!-- Alert Banner -->' +
  '    <div id="alertBox" class="alert-banner">' +
  '      <span id="alertMsg"></span>' +
  '      <button type="button" class="alert-close" onclick="hideAlert()">✕</button>' +
  '    </div>' +

  '    <!-- PANEL 1: PUBLISH NOTICE -->' +
  '    <section id="tabPublish" class="panel-card" style="display: block;">' +
  '      <div class="panel-header">' +
  '        <h2 class="panel-title">নতুন নোটিশ তৈরি ও সবার ইমেইলে প্রেরণ</h2>' +
  '        <p class="panel-desc">শিরোনাম ফাঁকা রাখলে নির্বাচিত ক্যাটাগরিই নোটিশের শিরোনাম হিসেবে যুক্ত হবে এবং সকল শিক্ষার্থীর ইমেইলে পারসোনালাইজড বার্তা পৌঁছে যাবে।</p>' +
  '      </div>' +

  '      <form id="noticeForm" onsubmit="submitNotice(event)">' +
  '        <div class="form-group">' +
  '          <label class="form-label">ক্যাটাগরি নির্বাচন করুন *</label>' +
  '          <select id="nCategory" class="form-select">' +
  '            <option value="সাধারণ নোটিশ">সাধারণ নোটিশ</option>' +
  '            <option value="জরুরি ঘোষণা">জরুরি ঘোষণা</option>' +
  '            <option value="ক্লাস আপডেট">ক্লাস আপডেট</option>' +
  '            <option value="পরীক্ষা সংক্রান্ত">পরীক্ষা সংক্রান্ত</option>' +
  '            <option value="অ্যাসাইনমেন্ট ও প্রেজেন্টেশন">অ্যাসাইনমেন্ট ও প্রেজেন্টেশন</option>' +
  '            <option value="ছুটির নোটিশ">ছুটির নোটিশ</option>' +
  '          </select>' +
  '        </div>' +

  '        <div class="form-group">' +
  '          <label class="form-label">নোটিশের শিরোনাম <span class="form-hint">(ঐচ্ছিক — ফাঁকা রাখলে ক্যাটাগরিই শিরোনাম হবে)</span></label>' +
  '          <input id="nTitle" type="text" placeholder="ঐচ্ছিক (যেমন: আগামী রবিবার ক্লাসের সময়সূচী পরিবর্তন)" class="form-input">' +
  '        </div>' +

  '        <div class="form-group">' +
  '          <label class="form-label">বিস্তারিত বিবরণ *</label>' +
  '          <textarea id="nContent" rows="5" required placeholder="নোটিশের সম্পূর্ণ বিবরণ এখানে লিখুন..." class="form-textarea"></textarea>' +
  '        </div>' +

  '        <button type="submit" id="btnPublish" class="btn-submit">' +
  '          🚀 নোটিশ প্রকাশ ও সবার ইমেইলে পাঠান' +
  '        </button>' +
  '      </form>' +
  '    </section>' +

  '    <!-- PANEL 2: NOTICE LIST -->' +
  '    <section id="tabList" class="panel-card" style="display: none;">' +
  '      <div class="panel-header" style="display: flex; align-items: center; justify-content: space-between;">' +
  '        <div>' +
  '          <h2 class="panel-title">সকল নোটিশ ও ডিলিট অপশন</h2>' +
  '          <p class="panel-desc">যে কোনো নোটিশের পাশের লাল ডিলিট বোতাম চেপে সরাসরি শিট থেকে নোটিশ মুছে ফেলুন।</p>' +
  '        </div>' +
  '      </div>' +
  '      <div id="noticesContainer">' +
  '        ' + noticesListMarkup +
  '      </div>' +
  '    </section>' +

  '    <!-- PANEL 3: ADD SUBSCRIBER -->' +
  '    <section id="tabSubscriber" class="panel-card" style="display: none;">' +
  '      <div class="panel-header">' +
  '        <h2 class="panel-title">নতুন শিক্ষার্থী / ইমেইল যোগ করুন</h2>' +
  '        <p class="panel-desc">এখানে নাম ও ইমেইল যুক্ত করলেই তারা পরবর্তী সব নোটিশ স্বয়ংক্রিয়ভাবে ইমেইলে পাবে।</p>' +
  '      </div>' +

  '      <div class="info-box">' +
  '        🔒 <strong>নিরাপত্তা বার্তা:</strong> শিক্ষার্থীদের ডাটাবেজ সুরক্ষিত রাখতে ইমেইল মুছে ফেলার ব্যবস্থা শুধুমাত্র মূল গুগল শিটে রাখা হয়েছে। কোনো ইমেইল ডিলিট করতে চাইলে সরাসরি গুগল শিটে গিয়ে রো ডিলিট করুন।' +
  '      </div>' +

  '      <form id="subForm" onsubmit="submitSubscriber(event)">' +
  '        <div class="form-group">' +
  '          <label class="form-label">শিক্ষার্থীর নাম *</label>' +
  '          <input id="sName" type="text" required placeholder="যেমন: সাকিব হাসান" class="form-input">' +
  '        </div>' +

  '        <div class="form-group">' +
  '          <label class="form-label">ইমেইল এড্রেস *</label>' +
  '          <input id="sEmail" type="email" required placeholder="example@gmail.com" class="form-input">' +
  '        </div>' +

  '        <div class="form-group">' +
  '          <label class="form-label">রোল / স্টুডেন্ট আইডি (ঐচ্ছিক)</label>' +
  '          <input id="sRoll" type="text" placeholder="যেমন: 105" class="form-input">' +
  '        </div>' +

  '        <button type="submit" id="btnSub" class="btn-submit sky">' +
  '          ➕ শিক্ষার্থী যুক্ত করুন' +
  '        </button>' +
  '      </form>' +
  '    </section>' +

  '  </main>' +

  '  <script>' +
  '    function switchTab(tabId) {' +
  '      var panels = ["tabPublish", "tabList", "tabSubscriber"];' +
  '      var btns = ["tabBtn1", "tabBtn2", "tabBtn3"];' +
  '      ' +
  '      for (var i = 0; i < panels.length; i++) {' +
  '        var p = document.getElementById(panels[i]);' +
  '        var b = document.getElementById(btns[i]);' +
  '        if (p) p.style.display = "none";' +
  '        if (b) b.className = "tab-btn";' +
  '      }' +
  '      ' +
  '      if (tabId === "publish") {' +
  '        var p1 = document.getElementById("tabPublish");' +
  '        var b1 = document.getElementById("tabBtn1");' +
  '        if (p1) p1.style.display = "block";' +
  '        if (b1) b1.className = "tab-btn active";' +
  '      } else if (tabId === "list") {' +
  '        var p2 = document.getElementById("tabList");' +
  '        var b2 = document.getElementById("tabBtn2");' +
  '        if (p2) p2.style.display = "block";' +
  '        if (b2) b2.className = "tab-btn active";' +
  '      } else if (tabId === "subscriber") {' +
  '        var p3 = document.getElementById("tabSubscriber");' +
  '        var b3 = document.getElementById("tabBtn3");' +
  '        if (p3) p3.style.display = "block";' +
  '        if (b3) b3.className = "tab-btn active";' +
  '      }' +
  '    }' +
  '    ' +
  '    function showAlert(msg, isError) {' +
  '      var box = document.getElementById("alertBox");' +
  '      var msgEl = document.getElementById("alertMsg");' +
  '      if (!box || !msgEl) return;' +
  '      msgEl.innerText = msg;' +
  '      box.className = "alert-banner " + (isError ? "error" : "success");' +
  '      window.scrollTo({ top: 0, behavior: "smooth" });' +
  '    }' +
  '    ' +
  '    function hideAlert() {' +
  '      var box = document.getElementById("alertBox");' +
  '      if (box) box.className = "alert-banner";' +
  '    }' +
  '    ' +
  '    function submitNotice(e) {' +
  '      if (e && e.preventDefault) e.preventDefault();' +
  '      var btn = document.getElementById("btnPublish");' +
  '      var cat = document.getElementById("nCategory") ? document.getElementById("nCategory").value : "সাধারণ নোটিশ";' +
  '      var title = document.getElementById("nTitle") ? document.getElementById("nTitle").value : "";' +
  '      var content = document.getElementById("nContent") ? document.getElementById("nContent").value : "";' +
  '      ' +
  '      if (!content.trim()) {' +
  '        showAlert("দয়া করে নোটিশের বিস্তারিত বিবরণ লিখুন!", true);' +
  '        return;' +
  '      }' +
  '      ' +
  '      if (btn) {' +
  '        btn.disabled = true;' +
  '        btn.innerText = "⏳ নোটিশ সংরক্ষণ ও ইমেইল পাঠানো হচ্ছে...";' +
  '      }' +
  '      ' +
  '      if (typeof google === "undefined" || !google.script || !google.script.run) {' +
  '        showAlert("গুগল স্ক্রিপ্ট রানটাইম লোড হয়নি। পৃষ্ঠাটি পুনরায় রিফ্রেশ করুন।", true);' +
  '        if (btn) { btn.disabled = false; btn.innerText = "🚀 নোটিশ প্রকাশ ও সবার ইমেইলে পাঠান"; }' +
  '        return;' +
  '      }' +
  '      ' +
  '      google.script.run' +
  '        .withSuccessHandler(function(res) {' +
  '          if (btn) {' +
  '            btn.disabled = false;' +
  '            btn.innerText = "🚀 নোটিশ প্রকাশ ও সবার ইমেইলে পাঠান";' +
  '          }' +
  '          if (res && res.success) {' +
  '            if (document.getElementById("nTitle")) document.getElementById("nTitle").value = "";' +
  '            if (document.getElementById("nContent")) document.getElementById("nContent").value = "";' +
  '            showAlert(res.message, false);' +
  '            var countEl = document.getElementById("statNoticeCount");' +
  '            if (countEl) {' +
  '              var curr = parseInt(countEl.innerText) || 0;' +
  '              countEl.innerText = (curr + 1) + "টি";' +
  '            }' +
  '          } else {' +
  '            showAlert((res && res.message) ? res.message : "সমস্যা হয়েছে।", true);' +
  '          }' +
  '        })' +
  '        .withFailureHandler(function(err) {' +
  '          if (btn) {' +
  '            btn.disabled = false;' +
  '            btn.innerText = "🚀 নোটিশ প্রকাশ ও সবার ইমেইলে পাঠান";' +
  '          }' +
  '          showAlert("ত্রুটি: " + (err.message || err), true);' +
  '        })' +
  '        .publishNoticeAndSendEmails({ category: cat, title: title, content: content });' +
  '    }' +
  '    ' +
  '    function handleDeleteNotice(id, title) {' +
  '      var ok = confirm("আপনি কি নিশ্চিত এই নোটিশটি মুছে ফেলতে চান: \\n\\n" + title);' +
  '      if (!ok) return;' +
  '      ' +
  '      var card = document.getElementById("card-" + id);' +
  '      if (card) {' +
  '        card.style.opacity = "0.3";' +
  '        card.style.pointerEvents = "none";' +
  '      }' +
  '      ' +
  '      if (typeof google === "undefined" || !google.script || !google.script.run) {' +
  '        showAlert("গুগল স্ক্রিপ্ট রানটাইম লোড হয়নি। পৃষ্ঠাটি রিফ্রেশ করুন।", true);' +
  '        if (card) { card.style.opacity = "1"; card.style.pointerEvents = "auto"; }' +
  '        return;' +
  '      }' +
  '      ' +
  '      google.script.run' +
  '        .withSuccessHandler(function(res) {' +
  '          if (res && res.success) {' +
  '            showAlert(res.message, false);' +
  '            if (card) { card.remove(); }' +
  '            var countEl = document.getElementById("statNoticeCount");' +
  '            if (countEl) {' +
  '              var curr = parseInt(countEl.innerText) || 1;' +
  '              countEl.innerText = Math.max(0, curr - 1) + "টি";' +
  '            }' +
  '          } else {' +
  '            if (card) { card.style.opacity = "1"; card.style.pointerEvents = "auto"; }' +
  '            showAlert((res && res.message) ? res.message : "মুছে ফেলা যায়নি।", true);' +
  '          }' +
  '        })' +
  '        .withFailureHandler(function(err) {' +
  '          if (card) { card.style.opacity = "1"; card.style.pointerEvents = "auto"; }' +
  '          showAlert("ত্রুটি: " + (err.message || err), true);' +
  '        })' +
  '        .deleteNotice(id);' +
  '    }' +
  '    ' +
  '    function submitSubscriber(e) {' +
  '      if (e && e.preventDefault) e.preventDefault();' +
  '      var btn = document.getElementById("btnSub");' +
  '      var name = document.getElementById("sName") ? document.getElementById("sName").value : "";' +
  '      var email = document.getElementById("sEmail") ? document.getElementById("sEmail").value : "";' +
  '      var roll = document.getElementById("sRoll") ? document.getElementById("sRoll").value : "";' +
  '      ' +
  '      if (btn) {' +
  '        btn.disabled = true;' +
  '        btn.innerText = "⏳ যুক্ত হচ্ছে...";' +
  '      }' +
  '      ' +
  '      if (typeof google === "undefined" || !google.script || !google.script.run) {' +
  '        showAlert("গুগল স্ক্রিপ্ট রানটাইম লোড হয়নি।", true);' +
  '        if (btn) { btn.disabled = false; btn.innerText = "➕ শিক্ষার্থী যুক্ত করুন"; }' +
  '        return;' +
  '      }' +
  '      ' +
  '      google.script.run' +
  '        .withSuccessHandler(function(res) {' +
  '          if (btn) {' +
  '            btn.disabled = false;' +
  '            btn.innerText = "➕ শিক্ষার্থী যুক্ত করুন";' +
  '          }' +
  '          if (res && res.success) {' +
  '            if (document.getElementById("sName")) document.getElementById("sName").value = "";' +
  '            if (document.getElementById("sEmail")) document.getElementById("sEmail").value = "";' +
  '            if (document.getElementById("sRoll")) document.getElementById("sRoll").value = "";' +
  '            showAlert(res.message, false);' +
  '            var subEl = document.getElementById("statSubCount");' +
  '            if (subEl) {' +
  '              var curr = parseInt(subEl.innerText) || 0;' +
  '              subEl.innerText = (curr + 1) + " জন";' +
  '            }' +
  '          } else {' +
  '            showAlert(res.message || "যুক্ত করা যায়নি", true);' +
  '          }' +
  '        })' +
  '        .withFailureHandler(function(err) {' +
  '          if (btn) {' +
  '            btn.disabled = false;' +
  '            btn.innerText = "➕ শিক্ষার্থী যুক্ত করুন";' +
  '          }' +
  '          showAlert("ত্রুটি: " + (err.message || err), true);' +
  '        })' +
  '        .addSubscriberFromAdmin(name, email, roll);' +
  '    }' +
  '  </script>' +
  '</body>' +
  '</html>';
}
`;
