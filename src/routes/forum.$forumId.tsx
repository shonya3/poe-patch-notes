import { createFileRoute } from "@tanstack/react-router";
import { getForumThreadsFn } from "~/server/functions";
import type { ThreadLink } from "~/server/parser";

export const Route = createFileRoute("/forum/$forumId")({
  loader: async ({ params }) => {
    return getForumThreadsFn({ data: { forumId: params.forumId, page: "1" } });
  },
  component: ForumPage,
});

function ForumPage() {
  const { threads, forumId, page } = Route.useLoaderData();
  const label =
    forumId === "2212" ? "English Patch Notes" : forumId === "2272" ? "Russian Patch Notes" : `Forum ${forumId}`;
  return (
    <div className="container">
      <h1>{label}</h1>
      {threads.length === 0 && <p>No threads found.</p>}
      <ul className="thread-list">
        {threads.map((t: ThreadLink) => (
          <li key={t.id}>
            <a href={`/thread/${t.id}`}>{t.title}</a>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {Number(page) > 1 && <a href={`/forum/${forumId}?page=${Number(page) - 1}`}>← Previous</a>}
        <a href={`/forum/${forumId}?page=${Number(page) + 1}`}>Next →</a>
      </div>
    </div>
  );
}
