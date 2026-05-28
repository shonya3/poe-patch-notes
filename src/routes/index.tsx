import { createFileRoute, Link } from "@tanstack/react-router";
import { PATCH_NOTES_0_5_EN_THREAD_ID, PATCH_NOTES_0_5_RU_THREAD_ID } from "~/consts";

export const Route = createFileRoute("/")({
  component: Home,
});

const subforums = [
  { id: "2212", name: "English Patch Notes" },
  { id: "2272", name: "Russian Patch Notes" },
];

function Home() {
  return (
    <div className="container">
      <div className="featured">
        <Link
          to="/thread/$threadId"
          params={{ threadId: PATCH_NOTES_0_5_EN_THREAD_ID }}
          className="featured-link"
        >
          <span className="featured-label">0.5.0 Patch Notes — EN</span>
          <span className="featured-title">
            Content Update 0.5.0 — Path of Exile 2: Return of the Ancients
          </span>
          <span className="featured-arrow">→</span>
        </Link>
        <Link
          to="/thread/$threadId"
          params={{ threadId: PATCH_NOTES_0_5_RU_THREAD_ID }}
          className="featured-link"
        >
          <span className="featured-label">0.5.0 Patch Notes — RU</span>
          <span className="featured-title">
            Обновление 0.5.0 — Path of Exile 2: Возвращение Древних
          </span>
          <span className="featured-arrow">→</span>
        </Link>
      </div>
      <h2 className="forums-heading">Forums</h2>
      <div className="forum-cards">
        {subforums.map((sf) => (
          <Link
            key={sf.id}
            to="/forum/$forumId"
            search={{ page: 1 }}
            params={{ forumId: sf.id }}
            className="forum-card"
          >
            <span className="forum-card-title">{sf.name}</span>
            <span className="forum-card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
