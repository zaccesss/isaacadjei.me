import type { BlogPost } from "../index"

const _oauth_sign_in_pitfalls_microsoft: BlogPost = {
  slug: "oauth-sign-in-pitfalls-microsoft",
  title: "Sign-In Pitfalls: OAuth Email Verification and Why Microsoft Is Different",
  date: "2026-11-14",
  type: "blog",
  cover_image: "/images/blog/covers/oauth-sign-in-pitfalls-microsoft-shot.webp",
  cover_image_dark: "/images/blog/covers/oauth-sign-in-pitfalls-microsoft-shot-dark.webp",
  cover_alt: "Vitafolio Connected accounts settings: Google and GitHub are connected, Microsoft is not and has a Connect button",
  description:
    "Why the hard part of adding Google, GitHub and Microsoft sign-in is deciding when a provider's email address can be trusted to join an existing account and why Microsoft's never can.",
  tags: ["Security", "PHP", "Full-Stack", "Web", "Open Source"],
  projectSlug: "vitafolio",
  published: true,
  content: [
    {
      type: "p",
      text: "[Vitafolio](https://vitafolio.isaacadjei.me) lets people sign in with an email and password, a passkey or one of three providers: Google, GitHub and Microsoft. [PHAEMOS](https://phaemos.com), my predictive maintenance dashboard, gained Microsoft sign-in this autumn too. Wiring up the buttons with [Laravel Socialite](https://laravel.com/framework/docs/socialite) took an afternoon. Deciding what to do with the email address that comes back took far longer. It is where most of the real security risk sits.",
    },
    {
      type: "h2",
      text: "The tempting shortcut",
    },
    {
      type: "p",
      text: "Here is the flow almost everyone writes first. A person clicks Sign in with Microsoft. The provider sends back a profile with an email address. If an account with that email already exists, sign them into it. If not, create one. It feels friendly: people who signed up with a password can later use a provider without any extra steps.",
    },
    {
      type: "p",
      text: "The problem is the word 'exists'. That shortcut hands an existing account to anyone who can make a provider say the right email address. Whether that is safe depends entirely on whether the provider has actually verified that the person owns the address.",
    },
    {
      type: "h2",
      text: "What each provider promises",
    },
    {
      type: "table",
      headers: ["Provider", "What it says about the email", "Safe to join by email?"],
      rows: [
        ["Google", "Sends an explicit [email_verified](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims) claim", "Only when email_verified is true"],
        ["GitHub", "Only shares addresses the user has verified with GitHub", "Yes"],
        ["Microsoft (Entra ID)", "The email claim can be set by an organisation's administrator and is not guaranteed to be verified", "No"],
      ],
    },
    {
      type: "p",
      text: "Microsoft is different because of how work and school accounts work. Each organisation has its own tenant. An administrator of a tenant can set the email attribute on a user account. Nothing forces that address to belong to the user. Somebody could create a free tenant, add a user, set its email to your address and sign in to any app that trusts the email claim. Researchers publicised this class of attack in 2023 under the name [nOAuth](https://www.descope.com/blog/post/noauth). [Microsoft's own guidance](https://web.archive.org/web/20250126044251/https://learn.microsoft.com/en-us/entra/identity-platform/migrate-off-email-claim-authorization) says not to use the email claim to decide who someone is.",
    },
    {
      type: "callout",
      tone: "warning",
      text: "The stable identifier for a Microsoft account is the combination of the object ID (oid) and tenant ID (tid) or the sub claim, as listed in Microsoft's [ID token claims reference](https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference). Use that to recognise a returning user. Never use the email claim to authorise anything.",
    },
    {
      type: "h2",
      text: "How Vitafolio decides",
    },
    {
      type: "p",
      text: "Every linked provider account is stored with the provider's own stable ID. A returning user is always found by that ID, never by email. Email only matters the first time someone uses a provider. Even then it only counts if the provider vouches for it.",
    },
    {
      type: "code",
      lang: "php",
      text: `/**
 * google says outright whether the address is verified. github only hands over an
 * address it has verified. microsoft gives no such promise, so it is never trusted
 */
private function emailVerified(string $provider, ProviderUser $remote): bool
{
    if (! config("vitafolio.social.$provider.trusts_email")) {
        return false;
    }
    $raw = $remote->getRaw();

    return match ($provider) {
        'google' => filter_var($raw['email_verified'] ?? false, FILTER_VALIDATE_BOOLEAN),
        'github' => true,
        default => false,
    };
}`,
    },
    {
      type: "diagram",
      code: `flowchart TD
    A["Provider callback"] --> B{"Provider ID already linked?"}
    B -- "yes" --> S["Sign in to that account"]
    B -- "no" --> C{"Account with this email exists?"}
    C -- "no" --> N["Create a new account"]
    C -- "yes" --> D{"Provider verified the email?"}
    D -- "no, including every Microsoft sign-in" --> R["Refuse: sign in with your password,<br/>then connect the provider"]
    D -- "yes" --> L["Link the provider and sign in"]`,
      caption: "A provider only joins an existing account when it has verified the address.",
    },
    {
      type: "p",
      text: "When a Microsoft sign-in hits an existing email, the person sees a clear message: an account with this email already exists, so sign in with your password and connect Microsoft from the account page. Once signed in, connecting is safe, because the person has already proved who they are.",
    },
    {
      type: "clip",
      src: "/videos/projects/vitafolio/profile.mp4",
      poster: "/videos/projects/vitafolio/profile.webp",
      alt: "A photo is chosen, zoomed and dragged into the circle, then uploaded. The handle changes and Connected accounts shows Google and GitHub connected with Microsoft ready to connect",
      caption: "The account page: Google and GitHub connected and Microsoft ready to connect once the person has signed in.",
    },
    {
      type: "h2",
      text: "The reverse attack: pre-registering an account",
    },
    {
      type: "p",
      text: "There is a mirror image of the problem. Suppose an attacker signs up with a password using your email address but never verifies it. Later you click Sign in with Google, which does verify the email. Google's verification is enough to link to that account. Without care, the attacker's password still works and they share your account.",
    },
    {
      type: "p",
      text: "Vitafolio handles this by treating a verified provider as proof of ownership. If the existing account was never verified, every other way in is stripped before linking: the password is replaced with a random value, passkeys, two-factor settings and other linked providers are removed and every session is ended. The person who just proved they own the address is the only one who can get in.",
    },
    {
      type: "h2",
      text: "Other details that matter",
    },
    {
      type: "ul",
      items: [
        "[State parameter](https://datatracker.ietf.org/doc/html/rfc6749#section-10.12): Socialite sends a random state value with the redirect and checks it on the way back, which stops an attacker logging a victim into the attacker's account. A cancelled consent screen or an expired state lands in the same friendly 'did not finish' message.",
        "Two-factor still applies. Someone with two-factor authentication enabled still answers their challenge after a provider sign-in.",
        "Suspended accounts are refused on every route: password, passkey and provider.",
        "An account always keeps at least one way in, so the last provider cannot be disconnected unless a password or passkey exists.",
        "Every connect and disconnect sends a security notice by email and goes into an audit log.",
        "Sign-in buttons only appear for providers whose keys are configured, so a local copy without keys just shows the password form.",
      ],
    },
    {
      type: "h3",
      text: "Making Microsoft look trustworthy too",
    },
    {
      type: "p",
      text: "One last Microsoft detail is cosmetic but matters for trust. By default the consent screen marks an app as unverified. [Publisher verification](https://learn.microsoft.com/en-us/entra/identity-platform/publisher-verification-overview) links the app registration to a verified domain through a small JSON file at /.well-known/microsoft-identity-association.json, after which the consent screen names the site as the publisher.",
    },
    {
      type: "h2",
      text: "What I would tell anyone adding social sign-in",
    },
    {
      type: "ol",
      items: [
        "Recognise returning users by the provider's stable ID, never by email.",
        "Only join an existing account by email when the provider explicitly guarantees verification.",
        "For Microsoft work and school accounts, assume the email is unverified.",
        "Think about the unverified pre-registered account, not only the malicious provider.",
        "Keep two-factor, suspensions and audit logging working across every sign-in method.",
      ],
    },
    {
      type: "p",
      text: "OAuth makes the sign-in itself easy. The security lives in the few lines that decide whose account the result belongs to. More on how Vitafolio handles accounts is on the [Vitafolio project page](/projects/vitafolio) and in the [Vitafolio documentation](https://vitafolio.isaacadjei.me/docs).",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "Microsoft: migrate away from using email claims for user identification or authorisation (archived)", url: "https://web.archive.org/web/20250126044251/https://learn.microsoft.com/en-us/entra/identity-platform/migrate-off-email-claim-authorization" },
        { text: "Descope: nOAuth, how Microsoft OAuth misconfiguration can lead to full account takeover", url: "https://www.descope.com/blog/post/noauth" },
        { text: "OpenID Connect Core 1.0, including the email_verified claim", url: "https://openid.net/specs/openid-connect-core-1_0.html" },
        { text: "RFC 6749: the OAuth 2.0 authorisation framework", url: "https://datatracker.ietf.org/doc/html/rfc6749" },
        { text: "Laravel Socialite documentation", url: "https://laravel.com/framework/docs/socialite" },
        { text: "Microsoft Learn: publisher verification", url: "https://learn.microsoft.com/en-us/entra/identity-platform/publisher-verification-overview" },
        { text: "Socialite Providers: Microsoft", url: "https://socialiteproviders.com/Microsoft/" },
      ],
    },
  ],
}

export default _oauth_sign_in_pitfalls_microsoft
