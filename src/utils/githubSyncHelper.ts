/**
 * GitHub Direct Push & Code Replacement Utility
 * Allows pushing file updates directly to GitHub via Personal Access Token (PAT)
 * or 1-click copying/downloading TypeScript source files for manual replacement.
 */

export interface GitHubPushConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

const GITHUB_CONFIG_STORAGE_KEY = 'mahims_github_sync_config_v1';

export function getStoredGitHubConfig(): GitHubPushConfig {
  if (typeof window === 'undefined') {
    return { owner: 'mahim2005', repo: 'mahims', branch: 'main', token: '' };
  }
  try {
    const raw = localStorage.getItem(GITHUB_CONFIG_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return { owner: 'mahim2005', repo: 'mahims', branch: 'main', token: '' };
}

export function saveStoredGitHubConfig(config: GitHubPushConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GITHUB_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

/**
 * Pushes a single file to GitHub via GitHub API
 */
export async function pushFileToGitHub(
  filePath: string,
  content: string,
  commitMessage: string,
  config: GitHubPushConfig
): Promise<{ success: boolean; message: string }> {
  if (!config.token.trim()) {
    return { success: false, message: 'গিটহাব পার্সোনাল অ্যাক্সেস টোকেন (PAT) প্রদান করুন।' };
  }
  if (!config.owner.trim() || !config.repo.trim()) {
    return { success: false, message: 'গিটহাব ইউজারনেম (Owner) ও রিপোজিটরি নাম দিন।' };
  }

  const cleanBranch = config.branch.trim() || 'main';
  const url = `https://api.github.com/repos/${config.owner.trim()}/${config.repo.trim()}/contents/${filePath}`;

  try {
    // 1. Get existing file sha if it exists
    let sha: string | undefined = undefined;
    try {
      const getRes = await fetch(`${url}?ref=${cleanBranch}`, {
        headers: {
          Authorization: `Bearer ${config.token.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
      }
    } catch {
      // File might not exist yet, which is fine
    }

    // 2. Base64 encode UTF-8 content
    const utf8Bytes = new TextEncoder().encode(content);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    const base64Content = btoa(binary);

    // 3. PUT commit to GitHub
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${config.token.trim()}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        branch: cleanBranch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (putRes.ok) {
      return { success: true, message: `সফলভাবে গিটহাবে পুশ হয়েছে: ${filePath}` };
    } else {
      const errJson = await putRes.json().catch(() => ({}));
      return {
        success: false,
        message: `গিটহাব পুশ ব্যর্থ হয়েছে (${putRes.status}): ${errJson.message || 'অননুমোদিত অ্যাক্সেস বা পারমিশন নেই'}`,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `নেটওয়ার্ক ত্রুটি: ${msg}` };
  }
}

/**
 * Download a string as a file in browser
 */
export function downloadFileAsText(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
