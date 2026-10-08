import type { BlogPost } from "../index"

const _moving_a_production_database_to_tidb: BlogPost = {
  slug: "moving-a-production-database-to-tidb",
  title: "Moving a Production Database When the Free Host Shuts Down",
  date: "2026-10-08",
  type: "report",
  cover_image: "/images/blog/covers/moving-a-production-database-to-tidb-shot.webp",
  cover_image_dark: "/images/blog/covers/moving-a-production-database-to-tidb-shot-dark.webp",
  description:
    "Vitafolio went down one evening because its free MySQL plan powered the database off for inactivity. This is how I diagnosed it, moved every table to TiDB Cloud the same night and checked nothing was lost.",
  tags: ["MySQL", "PHP", "Backend", "Full-Stack", "Maintenance"],
  projectSlug: "vitafolio",
  published: true,
  content: [
    {
      type: "p",
      text: "On the evening of 6 October my uptime monitor told me that [Vitafolio](https://vitafolio.isaacadjei.me), my CV platform, was returning 502 errors. The site had been fine that afternoon. Nothing had been deployed. Within a few minutes the error tracker had two new issues: first a refused database connection from the health check, then a failure to resolve the database's hostname at all. The site was down for roughly 90 minutes. By the end of the night it was running on a different database provider with every row accounted for. This is what happened and what I would do the same way again.",
    },
    {
      type: "h2",
      text: "Reading the symptoms in order",
    },
    {
      type: "p",
      text: "The order of the errors told the story. A refused connection means something answered at that address but would not talk. A hostname that no longer resolves means the address itself has gone. Together they pointed away from my code and towards the database service. The hosting platform added the last clue: the container was exiting with status 1 and restarting in a loop.",
    },
    {
      type: "p",
      text: "That loop was my own design working as intended. Vitafolio's start script caches its configuration, runs any new migrations and only then starts the web server. A failed migration stops the start, so a broken release never serves traffic. With no database to migrate against, every start failed. That is the right behaviour, but it means a database outage shows up as a crashing container rather than a polite error page.",
    },
    {
      type: "diagram",
      code: "sequenceDiagram\n  participant M as Uptime monitor\n  participant A as App container\n  participant D as Free MySQL service\n  D->>D: powered off after inactivity\n  M->>A: GET /up\n  A->>D: connect\n  D-->>A: refused, then hostname gone\n  A-->>M: 502\n  A->>A: restart, migration check fails, exit 1",
      caption: "How an idle database turned into a crash loop.",
    },
    {
      type: "h2",
      text: "The cause: free plans have conditions",
    },
    {
      type: "p",
      text: "The database ran on a free managed MySQL plan. Free services on that plan are powered off after a period of inactivity that is not publicly defined. My health check pinged the site every few minutes, but that clearly did not count as enough activity to keep the database awake. Once it was off, its hostname stopped resolving and every request that touched the database failed.",
    },
    {
      type: "callout",
      tone: "warning",
      text: "Read the small print on any free tier you put in production. Sleep after inactivity, storage caps and connection limits are normal and reasonable for a free plan. They only become a problem when you find out about them from an outage.",
    },
    {
      type: "h2",
      text: "Two fixes: one for tonight and one for good",
    },
    {
      type: "p",
      text: "The immediate fix was to power the service back on in the provider's console and redeploy. Within minutes the health check and the home page returned 200. That restored the site, but it fixed nothing. The same thing would happen again the next quiet evening.",
    },
    {
      type: "p",
      text: "For the permanent fix I compared two options: the provider's cheapest paid tier or a different free host that does not sleep. I chose [TiDB Cloud Starter](https://www.pingcap.com/tidb-cloud-starter/) in Frankfurt. It is free at my scale, it never powers off when idle and it speaks the MySQL protocol, so [Laravel](https://laravel.com) connects to it with the ordinary MySQL driver. No application code had to change. Only the connection settings did.",
    },
    {
      type: "h2",
      text: "Moving the data",
    },
    {
      type: "p",
      text: "Vitafolio has 20 tables: accounts, CVs, documents, projects, tags, view counts, endorsements, sessions and so on. The plan was simple and I wrote it in the issue before touching anything:",
    },
    {
      type: "ol",
      items: [
        "Create the TiDB cluster in the same region as the app.",
        "Copy the schema and every row of every table across.",
        "Compare row counts table by table between the old and new databases.",
        "Point the app's database settings at TiDB and redeploy.",
        "Check sign-in, a profile save and a CV page on the live site.",
        "Keep the old database powered on for a few days as a fallback before retiring it.",
      ],
    },
    {
      type: "p",
      text: "The row count check is the step people skip and it is the one that lets you sleep. One trap here: the row counts in `information_schema.TABLES` are estimates for InnoDB tables, so they can differ between two identical databases. An exact `COUNT(*)` per table on both sides is the reliable comparison. A small loop like this does it:",
    },
    {
      type: "code",
      lang: "bash",
      text: `# exact row counts for every table, run once against each database
for t in $(mysql --defaults-file=old.cnf -N -e "SHOW TABLES" vitafolio); do
  echo "$t $(mysql --defaults-file=old.cnf -N -e "SELECT COUNT(*) FROM \\\`$t\\\`" vitafolio)"
done > old-counts.txt
# repeat with new.cnf into new-counts.txt, then
diff old-counts.txt new-counts.txt && echo "every table matches"`,
    },
    {
      type: "p",
      text: "Credentials live in option files passed with `--defaults-file`, never on the command line, so they do not end up in shell history or a process list. For Vitafolio every one of the 20 tables matched.",
    },
    {
      type: "h3",
      text: "TLS without uploading a certificate",
    },
    {
      type: "p",
      text: "The old host used a private certificate authority, so its CA certificate had to be uploaded to the app as a secret file. TiDB Cloud's certificate is signed by a publicly trusted authority, which means the container's own CA bundle at `/etc/ssl/certs/ca-certificates.crt` is enough. Pointing `MYSQL_ATTR_SSL_CA` at that path kept the connection encrypted and verified with one less secret to manage.",
    },
    {
      type: "h3",
      text: "Compatibility I checked rather than assumed",
    },
    {
      type: "p",
      text: "MySQL compatible does not mean identical, so I read [TiDB's compatibility notes](https://docs.pingcap.com/tidb/stable/mysql-compatibility) before switching. The features Vitafolio relies on (ordinary tables, indexes, foreign keys, JSON columns and transactions) are all supported. It also helped that every Vitafolio table already had a primary key, a rule I had followed from the start so the schema would run on hosts that require one.",
    },
    {
      type: "h2",
      text: "After the move",
    },
    {
      type: "p",
      text: "Once the app was pointed at TiDB and redeployed, the health check, home page, sitemap and login page all returned 200 and new sessions were being written to the new database. I then updated everything that described the old setup: the README's architecture flowchart, the deployment guide, the secret rotation table and the [privacy policy's](https://vitafolio.isaacadjei.me/privacy) list of where personal data is stored. That last one is easy to forget and it is a legal statement, so it has to be accurate on the day the data moves.",
    },
    {
      type: "h2",
      text: "What I took away",
    },
    {
      type: "ul",
      items: [
        "A health check that touches the database is worth having. It turned a silent failure into an alert within minutes.",
        "Fail-fast start-up is good, but know what it looks like from outside when a dependency disappears.",
        "Write the migration plan in the issue first. Under pressure a checklist is better than memory.",
        "Verify with exact counts, not estimates.",
        "Keep the old system as a fallback for a few days instead of deleting it in the same breath.",
        "Update the documentation and the privacy policy as part of the fix, not afterwards.",
      ],
    },
    {
      type: "p",
      text: "The outage was short, nobody lost any data and the site is on a database that will not fall asleep. I would rather have learned about free-tier sleep from a blog post than from my phone at ten at night, which is why I wrote this one. The rest of the platform is on the [Vitafolio project page](/projects/vitafolio).",
    },
    {
      type: "h2",
      text: "Further reading",
    },
    {
      type: "ol-links",
      items: [
        { text: "TiDB Cloud documentation", url: "https://docs.pingcap.com/tidbcloud/" },
        { text: "TiDB: MySQL compatibility", url: "https://docs.pingcap.com/tidb/stable/mysql-compatibility" },
        { text: "Laravel 13 documentation: databases", url: "https://laravel.com/framework/docs/13.x/database" },
        { text: "TiDB Cloud: choosing a cluster plan", url: "https://docs.pingcap.com/tidbcloud/select-cluster-tier/" },
        { text: "Vitafolio documentation", url: "https://vitafolio.isaacadjei.me/docs" },
        { text: "Vitafolio changelog", url: "https://vitafolio.isaacadjei.me/changelog" },
      ],
    },
  ],
}

export default _moving_a_production_database_to_tidb
