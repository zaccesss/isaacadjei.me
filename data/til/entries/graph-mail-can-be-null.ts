import type { TILEntry } from "../index"

const _graph_mail_can_be_null: TILEntry = {
    id: "graph-mail-can-be-null",
    title: "Microsoft Graph's mail property can be null, so fall back to userPrincipalName",
    date: "2026-11-17",
    category: "Security",
    published: true,
    body: "On a [Microsoft Graph user](https://learn.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0), `mail` is the SMTP address and can be empty, for example on an account with no mailbox, so sign-in code that reads it blindly ends up with null. `userPrincipalName` is always set because it is required when a user is created. Its domain must also be one of the tenant's verified domains, which makes it the better fallback for a display address. Neither belongs as the account key: an administrator can change both. Match accounts on the user's `id` together with the tenant id instead.",
    detail: [
      {
        type: "code",
        lang: "php",
        code: `$user = Http::withToken($accessToken)
    ->get('https://graph.microsoft.com/v1.0/me', [
        '$select' => 'id,displayName,mail,userPrincipalName',
    ])
    ->json();

$displayEmail = $user['mail'] ?? $user['userPrincipalName'];
$accountKey = $tenantId.':'.$user['id'];   // stable, unlike either address`,
        caption: "An address for showing, an id for matching",
      },
      {
        type: "note",
        text: "This is also why linking a Microsoft sign-in to an existing account by email is risky. A work or school tenant controls its own directory, so an address there is not proof that the person owns the same address anywhere else.",
      },
    ],
    tags: ["Microsoft Graph", "OAuth", "authentication", "security"],
    source: { label: "Microsoft Graph: user resource type", url: "https://learn.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0" },
    project: { name: "Vitafolio", url: "https://vitafolio.isaacadjei.me", slug: "vitafolio" },
    series: "Signing in with OAuth",
    seriesPart: 2,
  }

export default _graph_mail_can_be_null
