import { createFileRoute, Link } from "@tanstack/react-router";
import { fallback, integer, minValue, number, object, pipe } from "valibot";
import { getForumThreadsFn } from "~/server/functions";
import type { ThreadLink } from "~/server/parser";

const ForumSearchSchema = object({
  page: fallback(pipe(number(), integer(), minValue(1)), 1),
});

export const Route = createFileRoute("/forum/$forumId")({
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: ({ params, deps }) =>
    getForumThreadsFn({ data: { forumId: params.forumId, page: deps.page } }),
  validateSearch: ForumSearchSchema,
  component: ForumPage,
});

function ForumPage() {
  const { threads, forumId, page } = Route.useLoaderData();
  const label =
    forumId === "2212"
      ? "English Patch Notes"
      : forumId === "2272"
        ? "Russian Patch Notes"
        : `Forum ${forumId}`;
  return (
    <div className="container">
      <h1>{label}</h1>
      {threads.length === 0 && <p>No threads found.</p>}
      <ul className="thread-list">
        {threads.map((t: ThreadLink) => (
          <li key={t.id}>
            <Link to="/thread/$threadId" params={{ threadId: t.id }}>
              {t.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {page > 1 && (
          <Link to="/forum/$forumId" params={{ forumId }} search={{ page: page - 1 }}>
            ← Previous
          </Link>
        )}
        <Link to="/forum/$forumId" params={{ forumId }} search={{ page: page + 1 }}>
          Next →
        </Link>
      </div>
    </div>
  );
}
