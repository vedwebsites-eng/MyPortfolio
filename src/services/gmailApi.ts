/**
 * Gmail REST API client helper for Vedant Sattegiri Patil's portfolio.
 * Interacts with https://gmail.googleapis.com/gmail/v1/users/me/*
 */

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  date?: string;
  labelIds?: string[];
}

export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  fromName?: string;
  cc?: string;
}

/**
 * Creates an RFC 2822 email payload and base64url encodes it.
 */
function createRawEmail(params: SendEmailParams): string {
  const { to, subject, body, fromName, cc } = params;
  
  const headers = [
    `To: ${to}`,
    ...(fromName ? [`From: "${fromName.replace(/"/g, '')}"`] : []),
    ...(cc && cc.trim() ? [`Cc: ${cc.trim()}`] : []),
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
  ];

  const email = `${headers.join('\r\n')}\r\n\r\n${body}`;

  // Base64URL encoding (URL-safe base64 without padding)
  return btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Fetches the authenticated user's Gmail profile
 */
export async function getGmailProfile(accessToken: string): Promise<GmailProfile> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail API Error (${response.status}): ${errText}`);
  }

  return response.json();
}

/**
 * Sends an email using Gmail API messages.send endpoint.
 * Note: User confirmation dialog MUST be confirmed before invoking this!
 */
export async function sendGmailMessage(
  accessToken: string,
  params: SendEmailParams
): Promise<{ id: string; threadId: string; labelIds?: string[] }> {
  const raw = createRawEmail(params);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to send email (${response.status}): ${errText}`);
  }

  return response.json();
}

/**
 * Creates a draft in the user's Gmail
 */
export async function createGmailDraft(
  accessToken: string,
  params: SendEmailParams
): Promise<{ id: string; message: { id: string; threadId: string } }> {
  const raw = createRawEmail(params);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      message: { raw },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create draft (${response.status}): ${errText}`);
  }

  return response.json();
}

/**
 * List recent messages in Gmail
 */
export async function listGmailMessages(
  accessToken: string,
  query: string = '',
  maxResults: number = 8
): Promise<GmailMessageSummary[]> {
  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.set('maxResults', maxResults.toString());
  if (query) {
    url.searchParams.set('q', query);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to list messages (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const messages: { id: string; threadId: string }[] = data.messages || [];

  // Fetch metadata details for the messages in parallel (up to 8)
  const detailed = await Promise.all(
    messages.slice(0, 8).map(async (msg) => {
      try {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
          }
        );

        if (!detailRes.ok) {
          return { id: msg.id, threadId: msg.threadId };
        }

        const detail = await detailRes.json();
        const headers = detail.payload?.headers || [];
        const subjectHeader = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'subject');
        const fromHeader = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'from');
        const dateHeader = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'date');

        return {
          id: msg.id,
          threadId: msg.threadId,
          snippet: detail.snippet,
          subject: subjectHeader?.value || '(No Subject)',
          from: fromHeader?.value || '(Unknown sender)',
          date: dateHeader?.value || '',
          labelIds: detail.labelIds || [],
        };
      } catch {
        return { id: msg.id, threadId: msg.threadId };
      }
    })
  );

  return detailed;
}
