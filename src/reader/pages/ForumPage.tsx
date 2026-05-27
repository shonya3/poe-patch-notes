import type { ThreadLink } from "../parser";

export function ForumPage({
  id,
  threads,
  page,
}: {
  id: string;
  threads: ThreadLink[];
  page: string;
}) {
  const label =
    id === "2212" ? "English Patch Notes" : id === "2272" ? "Russian Patch Notes" : `Forum ${id}`;
  return (
    <div class="container">
      <h1>{label}</h1>
      {threads.length === 0 && <p>No threads found.</p>}
      <ul class="thread-list">
        {threads.map((t) => (
          <li>
            <a href={`/thread/${t.id}`}>{t.title}</a>
          </li>
        ))}
      </ul>
      <div class="pagination">
        {Number(page) > 1 && <a href={`/forum/${id}?page=${Number(page) - 1}`}>← Previous</a>}
        <a href={`/forum/${id}?page=${Number(page) + 1}`}>Next →</a>
      </div>
    </div>
  );
}
