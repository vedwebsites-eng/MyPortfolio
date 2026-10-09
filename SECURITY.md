# Security Policy

Thanks for taking the time to look at this project. Security reports are welcome and appreciated.

## Supported versions

Only the latest version on the `main` branch and the live site at [vedantbuilds.vercel.app](https://vedantbuilds.vercel.app) are supported. There are no older maintained releases.

| Version | Supported |
| --- | --- |
| `main` (latest) | Yes |
| Older commits | No |

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Use one of these private channels:

1. **GitHub private report (preferred):** go to the [Security tab](https://github.com/vedwebsites-eng/MyPortfolio/security/advisories/new) and choose "Report a vulnerability".
2. **Email:** veddoesai@proton.me with the subject `[SECURITY] MyPortfolio`.
   For sensitive details, you can encrypt with my PGP key. Fingerprint: `9B2F E74A C190 442D 81A3 E518 70B2 3C8F 61D9 4AA1`.

Please include:

- A short description of the issue and its impact
- Steps to reproduce, or a proof of concept
- The affected URL, file, or component
- Your browser or environment, if relevant
- How you would like to be credited, if at all

## What to expect

This is a personal project maintained by one student, so timelines are best effort:

- **Acknowledgement:** within about 3 days
- **Initial assessment:** within about 7 days
- **Fix or mitigation:** depends on severity; critical issues first
- **Disclosure:** I will tell you when it is fixed. Please give me reasonable time to fix before sharing details publicly.

## Scope

In scope:

- The live site and this repository's code
- The guestbook (Firebase Auth and Firestore) and `firestore.rules`
- The contact form and Gmail API integration
- The Express server (`server.ts`) and resume download route
- Secrets or credentials accidentally committed to the repository
- Cross-site scripting, injection, access control and authentication flaws

Out of scope:

- Denial of service, load testing, or automated scanner noise
- Spam or low-effort abuse of the guestbook without a security bypass
- Social engineering or phishing against me or visitors
- Physical attacks
- Vulnerabilities in third-party services (Vercel, Firebase, Google, GitHub). Please report those to the vendor.
- Missing best-practice headers with no demonstrated impact
- Firebase web config values in the repo. These are public identifiers by design; access is controlled by Firestore rules.

## Safe harbor

If you act in good faith, avoid accessing or changing other people's data, stay within scope, and report privately, I will not pursue action against you for your research. Please do not exfiltrate data, disrupt the service, or test against other visitors' accounts.

## Rewards

There is no bounty program. I can offer public credit and my sincere thanks.
