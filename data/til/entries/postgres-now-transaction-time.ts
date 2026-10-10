import type { TILEntry } from "../index"

const _postgres_now_transaction_time: TILEntry = {
    id: "postgres-now-transaction-time",
    title: "PostgreSQL now() returns the same time for the whole transaction",
    date: "2026-10-11",
    category: "Database",
    published: true,
    body: "`now()` is the traditional name for `transaction_timestamp()`: it returns the time the current transaction started and never changes until it ends. Insert a batch of sensor readings in one transaction with `DEFAULT now()` and every row gets an identical timestamp. [`clock_timestamp()`](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT) returns the real current time, even within a single statement. For readings, the most honest fix is to stamp each one when it reaches the ingest service. `statement_timestamp()` sits in between: it moves on per statement but stays fixed within one.",
    detail: [
      {
        type: "code",
        lang: "sql",
        code: `BEGIN;
SELECT now(), clock_timestamp();
SELECT pg_sleep(2);
SELECT now(), clock_timestamp();
-- now() is unchanged, clock_timestamp() has moved on by two seconds
COMMIT;`,
        caption: "Run it in psql to watch the two functions drift apart",
      },
      {
        type: "note",
        text: "This is a feature, not a bug: every row written by one transaction can be grouped by the same moment. It only bites when the timestamp is meant to say when each row happened.",
      },
    ],
    tags: ["PostgreSQL", "SQL", "database", "time"],
    source: { label: "PostgreSQL docs: current date and time", url: "https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT" },
    project: { name: "PHAEMOS", url: "https://phaemos.com", slug: "phaemos" },
  }

export default _postgres_now_transaction_time
