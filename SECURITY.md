# Security Policy

> Public version of this policy: https://isaacadjei.me/security-policy

## Reporting a vulnerability

> [!WARNING]
> Do not open a public issue or pull request for a security problem.

Report it privately in one of two ways:

- Use GitHub's confidential vulnerability reporting (preferred): open this repository's **Security** tab and choose **Report a vulnerability**. You can also go straight to [the report form](https://github.com/zaccesss/isaacadjei.me/security/advisories/new). Only you and I can see the report and the fix can be tracked against it.
- Email **contact@isaacadjei.me** with the subject line `Security Disclosure`.

Any other public repository of mine takes confidential reports the same way, at `https://github.com/zaccesss/<repo>/security/advisories/new`.

Please include:

- A description of the problem
- Steps to reproduce it
- The impact you expect

You can expect an acknowledgement within 3 business days. The full response timeline is on the [public policy](https://isaacadjei.me/security-policy).

## Scope

- The live site at isaacadjei.me and its public API routes
- The code in this repository

## Out of scope

- Third party services such as Vercel or GitHub. Please report those to the provider.
- Findings in dependencies. These are tracked through dependency alerts.
- Automated scanner output with no demonstrated impact
