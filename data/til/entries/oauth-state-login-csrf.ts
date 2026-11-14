import type { TILEntry } from "../index"

const _oauth_state_login_csrf: TILEntry = {
    id: "oauth-state-login-csrf",
    title: "The OAuth state parameter stops login CSRF",
    date: "2026-11-14",
    category: "Security",
    published: true,
    body: "Without `state`, an attacker can start a sign-in with their own account, stop at the callback and trick a victim's browser into finishing it, which quietly logs the victim into the attacker's account. [RFC 6749 section 10.12](https://www.rfc-editor.org/rfc/rfc6749.html#section-10.12) says the client must implement CSRF protection on its redirect URI, usually a random value tied to the user's session that goes out as `state` and is checked on return. [Laravel Socialite](https://laravel.com/framework/docs/12.x/socialite) does this for you unless you call `stateless()`. Vitafolio's Google and Microsoft sign-in never call it.",
    detail: [
      {
        type: "code",
        lang: "php",
        code: `// before redirecting to the provider
$state = Str::random(40);
session(['oauth_state' => $state]);

// in the callback
$expected = session()->pull('oauth_state');
abort_unless(is_string($expected) && hash_equals($expected, (string) request('state')), 403);`,
        caption: "What Socialite does behind the scenes: one random value, used once",
      },
      {
        type: "note",
        text: "Treat `stateless()` as a deliberate choice for APIs that have no session, never as a fix for a confusing state mismatch error. That error usually means the session cookie did not survive the round trip.",
      },
    ],
    tags: ["OAuth", "security", "Laravel", "authentication"],
    source: { label: "RFC 6749: The OAuth 2.0 Authorization Framework", url: "https://www.rfc-editor.org/rfc/rfc6749.html#section-10.12" },
    project: { name: "Vitafolio", url: "https://vitafolio.isaacadjei.me", slug: "vitafolio" },
    series: "Signing in with OAuth",
    seriesPart: 1,
  }

export default _oauth_state_login_csrf
