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
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `
/**
 * mahims.com - Google Sheets Webhook Receiver
 * কীভাবে সেটআপ করবেন:
 * ১. আপনার Google Drive থেকে একটি নতুন Google Sheet খুলুন (নাম দিন: Mahims Data)।
 * ২. মেনু থেকে Extensions > Apps Script-এ যান।
 * ৩. নিচের পুরো কোডটি পেস্ট করুন এবং Save করুন।
 * ৪. উপরে ডানে 'Deploy' > 'New deployment' ক্লিক করুন।
 * ৫. Select type > 'Web app' বেছে নিন।
 * ৬. Execute as: 'Me', Who has access: 'Anyone' সিলেক্ট করে Deploy দিন।
 * ৭. প্রাপ্ত Web App URL কপি করে mahims.com এর এডমিন প্যানেলে বসিয়ে দিন।
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var targetSheetName = data.action === 'contact_message' ? 'Messages' : 'Users';
    var targetSheet = sheet.getSheetByName(targetSheetName);

    if (!targetSheet) {
      targetSheet = sheet.insertSheet(targetSheetName);
      if (targetSheetName === 'Users') {
        targetSheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Occupation', 'Role', 'Status', 'Source']);
      } else {
        targetSheet.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message', 'Source']);
      }
      targetSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#f1f5f9');
    }

    if (data.action === 'contact_message') {
      targetSheet.appendRow([
        data.timestamp || new Date(),
        data.name || '',
        data.email || '',
        data.subject || '',
        data.message || '',
        data.source || 'mahims.com'
      ]);
    } else {
      targetSheet.appendRow([
        data.timestamp || new Date(),
        data.name || '',
        data.email || '',
        data.phone || '',
        data.occupation || '',
        data.role || 'user',
        data.status || 'pending',
        data.source || 'mahims.com'
      ]);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
