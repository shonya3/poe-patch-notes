import { createFileRoute, Link } from "@tanstack/react-router";
import { fallback, integer, minValue, number, object, pipe, picklist } from "valibot";
import { getForumThreadsFn } from "~/server/functions";
import type { ThreadLink } from "~/server/parser";
import styles from "./forum.$forumId.module.css";

const ForumSearchSchema = object({
  page: fallback(pipe(number(), integer(), minValue(1)), 1),
  lang: fallback(picklist(["en", "ru"]), "en"),
});

export const Route = createFileRoute("/forum/$forumId")({
  loaderDeps: ({ search: { page, lang } }) => ({ page, lang }),
  loader: ({ params, deps }) =>
    getForumThreadsFn({ data: { forumId: params.forumId, page: deps.page, lang: deps.lang } }),
  validateSearch: ForumSearchSchema,
  component: ForumPage,
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.forumName ?? "Forum"} — PoE Patch Notes` }],
  }),
});

function ForumPage() {
  const { threads, forumName, forumId, page, lang } = Route.useLoaderData();

  const label = forumName ?? `Forum ${forumId}`;
  return (
    <div className="container">
      <h1>{label}</h1>
      {threads.length === 0 && <p>No threads found.</p>}
      <ul className={styles.threadList}>
        {threads.map((t: ThreadLink) => (
          <li key={t.id}>
            <Link to="/thread/$threadId" params={{ threadId: t.id }} search={{ lang }}>
              {t.title}
            </Link>
            {t.createdAt && (
              <span className={styles.date}>
                {new Date(t.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        {page > 1 && (
          <Link to="/forum/$forumId" params={{ forumId }} search={{ page: page - 1, lang }}>
            ← Previous
          </Link>
        )}
        <Link to="/forum/$forumId" params={{ forumId }} search={{ page: page + 1, lang }}>
          Next →
        </Link>
      </div>
    </div>
  );
}
